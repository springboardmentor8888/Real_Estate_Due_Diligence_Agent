package com.realestate.agent.service.impl;

import com.realestate.agent.dto.DueDiligenceReportRequest;
import com.realestate.agent.dto.DueDiligenceReportResponse;
import com.realestate.agent.dto.PropertyDocumentRequest;
import com.realestate.agent.dto.PropertyDocumentResponse;
import com.realestate.agent.entity.DueDiligenceReport;
import com.realestate.agent.entity.PropertyDocument;
import com.realestate.agent.entity.Property;
import com.realestate.agent.entity.User;
import com.realestate.agent.exception.ResourceNotFoundException;
import com.realestate.agent.mapper.ReportMapper;
import com.realestate.agent.repository.DueDiligenceReportRepository;
import com.realestate.agent.repository.PropertyDocumentRepository;
import com.realestate.agent.repository.PropertyRepository;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.service.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.realestate.agent.dto.RiskAssessmentResponse;
import com.realestate.agent.dto.ComparablePropertyAnalysisResponse;
import com.realestate.agent.dto.PropertyValuationResponse;
import java.math.BigDecimal;

import com.realestate.agent.service.RiskService;
import com.realestate.agent.service.ComparablePropertyService;
import com.realestate.agent.service.PropertyValuationService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final DueDiligenceReportRepository reportRepository;
    private final PropertyDocumentRepository documentRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ReportMapper reportMapper;
    private final RiskService riskService;

    private final ComparablePropertyService comparablePropertyService;

    private final PropertyValuationService propertyValuationService;

    public ReportServiceImpl(
            DueDiligenceReportRepository reportRepository,
            PropertyDocumentRepository documentRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            ReportMapper reportMapper,
            RiskService riskService,
            ComparablePropertyService comparablePropertyService,
            PropertyValuationService propertyValuationService
    ) {
        this.reportRepository = reportRepository;
        this.documentRepository = documentRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.reportMapper = reportMapper;
        this.riskService = riskService;
        this.comparablePropertyService = comparablePropertyService;
        this.propertyValuationService = propertyValuationService;
    }

    // REPORT CRUD
    @Override
    @Transactional
    public DueDiligenceReportResponse generateReport(DueDiligenceReportRequest request, String userEmail) {

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Property not found with ID: " + request.getPropertyId()));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + userEmail));

        // -----------------------------
        // Existing modules integration
        // -----------------------------

        List<RiskAssessmentResponse> risks =
                riskService.getRiskAssessmentsByProperty(property.getPropertyId());

        ComparablePropertyAnalysisResponse comparableAnalysis =
                comparablePropertyService.analyzeComparableProperty(property.getPropertyId());

        PropertyValuationResponse valuation =
                propertyValuationService.generateValuation(property.getPropertyId());

        // -----------------------------
        // Calculate average risk score
        // -----------------------------

        double averageRisk = 0.0;

        if (!risks.isEmpty()) {

            averageRisk = risks.stream()
                    .map(RiskAssessmentResponse::getRiskScore)
                    .mapToDouble(BigDecimal::doubleValue)
                    .average()
                    .orElse(0.0);
        }

        // -----------------------------
        // Build Executive Summary
        // -----------------------------

        String executiveSummary =
                "Property Name: " + property.getPropertyName()
                        + "\nEstimated Market Value: ₹" + valuation.getEstimatedMarketValue()
                        + "\nComparable Properties: " + comparableAnalysis.getTotalComparableProperties()
                        + "\nAverage Risk Score: " + String.format("%.2f", averageRisk)
                        + "\nValuation Status: " + valuation.getValuationStatus()
                        + "\nRecommendation: " + valuation.getRecommendation();

        // -----------------------------
        // Save Report
        // -----------------------------

        DueDiligenceReport report = reportMapper.toReportEntity(request);

        report.setProperty(property);
        report.setGeneratedBy(user);

        report.setExecutiveSummary(executiveSummary);

        report.setOverallRiskScore(BigDecimal.valueOf(averageRisk));

        report.setReportStatus("GENERATED");

        DueDiligenceReport savedReport =
                reportRepository.save(report);

        return reportMapper.toReportResponse(savedReport);
    }

    @Override
    @Transactional(readOnly = true)
    public DueDiligenceReportResponse getReportById(Long id) {
        DueDiligenceReport report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + id));
        return reportMapper.toReportResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DueDiligenceReportResponse> getReportsByProperty(Long propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new ResourceNotFoundException("Property not found with ID: " + propertyId);
        }
        return reportRepository.findByPropertyPropertyId(propertyId).stream()
                .map(reportMapper::toReportResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DueDiligenceReportResponse updateReport(Long id, DueDiligenceReportRequest request) {
        DueDiligenceReport report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + id));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + request.getPropertyId()));

        reportMapper.updateReportFromRequest(request, report);
        report.setProperty(property);

        return reportMapper.toReportResponse(reportRepository.save(report));
    }

    @Override
    @Transactional
    public void deleteReport(Long id) {
        DueDiligenceReport report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + id));
        reportRepository.delete(report);
    }

    // PROPERTY DOCUMENT CRUD
    @Override
    @Transactional
    public PropertyDocumentResponse uploadDocument(PropertyDocumentRequest request, String userEmail) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + request.getPropertyId()));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        DueDiligenceReport report = null;
        if (request.getReportId() != null) {
            report = reportRepository.findById(request.getReportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + request.getReportId()));
        }

        PropertyDocument doc = reportMapper.toDocumentEntity(request);
        doc.setProperty(property);
        doc.setReport(report);
        doc.setUploadedBy(user);

        return reportMapper.toDocumentResponse(documentRepository.save(doc));
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyDocumentResponse getDocumentById(Long id) {
        PropertyDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
        return reportMapper.toDocumentResponse(doc);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyDocumentResponse> getDocumentsByProperty(Long propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new ResourceNotFoundException("Property not found with ID: " + propertyId);
        }
        return documentRepository.findByPropertyPropertyId(propertyId).stream()
                .map(reportMapper::toDocumentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyDocumentResponse> getDocumentsByReport(Long reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new ResourceNotFoundException("Report not found with ID: " + reportId);
        }
        return documentRepository.findByReportReportId(reportId).stream()
                .map(reportMapper::toDocumentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PropertyDocumentResponse updateDocument(Long id, PropertyDocumentRequest request) {
        PropertyDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with ID: " + request.getPropertyId()));

        DueDiligenceReport report = null;
        if (request.getReportId() != null) {
            report = reportRepository.findById(request.getReportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Report not found with ID: " + request.getReportId()));
        }

        reportMapper.updateDocumentFromRequest(request, doc);
        doc.setProperty(property);
        doc.setReport(report);

        return reportMapper.toDocumentResponse(documentRepository.save(doc));
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        PropertyDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
        documentRepository.delete(doc);
    }
}
