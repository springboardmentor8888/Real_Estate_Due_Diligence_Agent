package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.PublicRecordsReportResponse;
import com.infosys.realestate.dto.ReportHistoryDTO;
import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.RiskAssessment;
import com.infosys.realestate.entity.User;
import com.infosys.realestate.exception.ResourceNotFoundException;
import com.infosys.realestate.repository.DueDiligenceReportRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.UserRepository;
import com.infosys.realestate.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PropertyDueDiligenceServiceImpl implements PropertyDueDiligenceService {

    @Autowired private PropertyRepository propertyRepository;
    @Autowired private AddressValidationService addressValidationService;
    @Autowired private PublicDataAggregationService publicDataAggregationService;
    @Autowired private RiskAssessmentService riskAssessmentService;
    @Autowired private ReportGenerationService reportGenerationService;
    @Autowired private NotificationService notificationService;
    @Autowired private DueDiligenceReportRepository reportRepository;
    @Autowired private PublicRecordsService publicRecordsService;
    @Autowired private UserRepository userRepository;

    @Override
    public DueDiligenceReport processDueDiligence(Long propertyId) {
        long startMs = System.currentTimeMillis();

        // 1. Fetch property
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        // 2. Address Validation
        addressValidationService.validateAddress(property);

        // Resolve the calling user from the security context
        User requestedBy = resolveCurrentUser();

        // Create initial report entity
        DueDiligenceReport report = new DueDiligenceReport();
        report.setProperty(property);
        report.setStatus("IN_PROGRESS");
        report.setRequestedBy(requestedBy);
        report = reportRepository.save(report);

        try {
            // 3. Public Data Collection
            String publicData = publicDataAggregationService.collectPublicData(property);

            // 4. Risk Assessment
            RiskAssessment riskAssessment = riskAssessmentService.assessRisk(property, publicData);

            // 5. Generate Report
            String reportUrl = reportGenerationService.generateReport(report, riskAssessment, publicData);

            // Update report with completion info
            report.setStatus("COMPLETED");
            report.setReportUrl(reportUrl);
            report.setCompletedAt(LocalDateTime.now());
            report.setDurationMs(System.currentTimeMillis() - startMs);
            report = reportRepository.save(report);

            // 6. Notify
            notificationService.sendReportNotification(report);

        } catch (Exception e) {
            report.setStatus("FAILED");
            report.setCompletedAt(LocalDateTime.now());
            report.setDurationMs(System.currentTimeMillis() - startMs);
            report.setErrorMessage(e.getMessage());
            report = reportRepository.save(report);
            notificationService.sendReportNotification(report);
            throw new RuntimeException("Due diligence process failed: " + e.getMessage());
        }

        return report;
    }

    @Override
    public byte[] exportReportPdf(Long propertyId) {
        PublicRecordsReportResponse data = publicRecordsService.getCombinedPublicRecordsReport(propertyId);
        return reportGenerationService.generatePdfReport(data);
    }

    @Override
    public byte[] exportReportExcel(Long propertyId) {
        PublicRecordsReportResponse data = publicRecordsService.getCombinedPublicRecordsReport(propertyId);
        return reportGenerationService.generateExcelReport(data);
    }

    @Override
    public Page<ReportHistoryDTO> getAllReportHistory(Pageable pageable) {
        return reportRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toHistoryDTO);
    }

    @Override
    public Page<ReportHistoryDTO> getMyReportHistory(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return reportRepository
                .findByRequestedByUserIdOrderByCreatedAtDesc(user.getUserId(), pageable)
                .map(this::toHistoryDTO);
    }

    @Override
    public ReportHistoryDTO getReportById(Long reportId) {
        DueDiligenceReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));
        return toHistoryDTO(report);
    }

    // ---- helpers --------------------------------------------------------

    private User resolveCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) return null;
            String email = auth.getName();
            return userRepository.findByEmail(email).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private ReportHistoryDTO toHistoryDTO(DueDiligenceReport r) {
        ReportHistoryDTO dto = new ReportHistoryDTO();
        dto.setId(r.getId());
        dto.setStatus(r.getStatus());
        dto.setReportUrl(r.getReportUrl());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setCompletedAt(r.getCompletedAt());
        dto.setDurationMs(r.getDurationMs());
        dto.setErrorMessage(r.getErrorMessage());

        if (r.getProperty() != null) {
            dto.setPropertyId(r.getProperty().getPropertyId());
            dto.setPropertyAddress(r.getProperty().getAddress());
            dto.setPropertyCity(r.getProperty().getCity());
            dto.setPropertyState(r.getProperty().getState());
        }
        if (r.getRequestedBy() != null) {
            dto.setRequestedByEmail(r.getRequestedBy().getEmail());
            dto.setRequestedByName(r.getRequestedBy().getName());
        }
        return dto;
    }
}
