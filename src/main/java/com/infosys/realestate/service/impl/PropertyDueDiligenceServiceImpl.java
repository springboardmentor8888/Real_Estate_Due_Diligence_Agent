package com.infosys.realestate.service.impl;

import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.RiskAssessment;
import com.infosys.realestate.exception.ResourceNotFoundException;
import com.infosys.realestate.repository.DueDiligenceReportRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PropertyDueDiligenceServiceImpl implements PropertyDueDiligenceService {

    @Autowired
    private PropertyRepository propertyRepository;
    
    @Autowired
    private AddressValidationService addressValidationService;
    
    @Autowired
    private PublicDataAggregationService publicDataAggregationService;
    
    @Autowired
    private RiskAssessmentService riskAssessmentService;
    
    @Autowired
    private ReportGenerationService reportGenerationService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private DueDiligenceReportRepository reportRepository;

    @Override
    public DueDiligenceReport processDueDiligence(Long propertyId) {
        // 1. Property Request (Fetch property)
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
                
        // 2. Address Validation
        addressValidationService.validateAddress(property);
        
        // Create initial report entity
        DueDiligenceReport report = new DueDiligenceReport();
        report.setProperty(property);
        report.setStatus("IN_PROGRESS");
        report = reportRepository.save(report);
        
        try {
            // 3. Property Search / Public Data Collection
            String publicData = publicDataAggregationService.collectPublicData(property);
            
            // 4. Risk Assessment
            RiskAssessment riskAssessment = riskAssessmentService.assessRisk(property, publicData);
            
            // 5. Generate Due Diligence Report
            String reportUrl = reportGenerationService.generateReport(report, riskAssessment, publicData);
            
            // Update report status
            report.setStatus("COMPLETED");
            report.setReportUrl(reportUrl);
            report = reportRepository.save(report);
            
            // 6. Return Response / Notify
            notificationService.sendReportNotification(report);
            
        } catch (Exception e) {
            report.setStatus("FAILED");
            reportRepository.save(report);
            throw new RuntimeException("Due diligence process failed: " + e.getMessage());
        }
        
        return report;
    }
}
