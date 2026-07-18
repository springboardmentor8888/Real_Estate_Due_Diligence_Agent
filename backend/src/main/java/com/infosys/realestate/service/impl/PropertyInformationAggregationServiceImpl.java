package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.PropertyInformationResponse;
import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.RiskAssessment;
import com.infosys.realestate.exception.ResourceNotFoundException;
import com.infosys.realestate.repository.DueDiligenceReportRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.RiskAssessmentRepository;
import com.infosys.realestate.service.PropertyInformationAggregationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyInformationAggregationServiceImpl implements PropertyInformationAggregationService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private DueDiligenceReportRepository dueDiligenceReportRepository;

    @Autowired
    private RiskAssessmentRepository riskAssessmentRepository;

    @Override
    public PropertyInformationResponse getAggregatedPropertyInformation(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        PropertyInformationResponse response = new PropertyInformationResponse();
        response.setPropertyId(property.getPropertyId());
        response.setPropertyName(property.getPropertyName());
        response.setAddress(property.getAddress());
        response.setCity(property.getCity());
        response.setState(property.getState());
        response.setZipCode(property.getZipCode());
        response.setPropertyType(property.getPropertyType());
        response.setCreatedDate(property.getCreatedAt());

        if (property.getCreatedBy() != null) {
            response.setOwnerName(property.getCreatedBy().getName()); // User's name as owner for now
        }

        // Fetch latest Due Diligence Status
        List<DueDiligenceReport> reports = dueDiligenceReportRepository.findByPropertyPropertyId(propertyId);
        if (reports != null && !reports.isEmpty()) {
            DueDiligenceReport latestReport = reports.get(reports.size() - 1);
            response.setDueDiligenceStatus(latestReport.getStatus());
        } else {
            response.setDueDiligenceStatus("NOT_STARTED");
        }

        // Fetch latest Risk Assessment
        List<RiskAssessment> risks = riskAssessmentRepository.findByPropertyPropertyId(propertyId);
        if (risks != null && !risks.isEmpty()) {
            RiskAssessment latestRisk = risks.get(risks.size() - 1);
            response.setRiskLevel(latestRisk.getRiskLevel());
            response.setRiskScore(latestRisk.getRiskScore());
        }

        return response;
    }
}
