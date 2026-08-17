package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.ComparablePropertyDTO;
import com.infosys.realestate.dto.PropertyAnalysisSummaryDTO;
import com.infosys.realestate.dto.RiskAssessmentDTO;
import com.infosys.realestate.dto.ValuationDTO;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.service.ComparablePropertyService;
import com.infosys.realestate.service.PropertyAnalysisService;
import com.infosys.realestate.service.RiskAssessmentService;
import com.infosys.realestate.service.ValuationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PropertyAnalysisServiceImpl implements PropertyAnalysisService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private ComparablePropertyService comparablePropertyService;

    @Autowired
    private ValuationService valuationService;

    @Autowired
    private RiskAssessmentService riskAssessmentService;

    @Override
    @Transactional
    public PropertyAnalysisSummaryDTO getPropertyAnalysisSummary(Long propertyId) {
        Property property = getOrCreateProperty(propertyId);
        Long actualId = property.getPropertyId();

        ValuationDTO valuation = valuationService.getLatestValuation(actualId);
        RiskAssessmentDTO risk = riskAssessmentService.getLatestRiskAssessment(actualId);
        List<ComparablePropertyDTO> comps = comparablePropertyService.getComparableProperties(actualId);

        PropertyAnalysisSummaryDTO summary = new PropertyAnalysisSummaryDTO();
        summary.setPropertyId(property.getPropertyId());
        summary.setPropertyName(property.getPropertyName());
        summary.setAddress(property.getAddress());
        summary.setCity(property.getCity());
        summary.setState(property.getState());
        summary.setZipCode(property.getZipCode());
        summary.setPropertyType(property.getPropertyType());

        summary.setCurrentValuation(valuation);
        summary.setLatestRiskAssessment(risk);
        summary.setComparableProperties(comps);

        return summary;
    }

    @Override
    @Transactional
    public PropertyAnalysisSummaryDTO runFullPropertyAnalysis(Long propertyId) {
        Property property = getOrCreateProperty(propertyId);
        Long actualId = property.getPropertyId();

        // Trigger fresh generation across all 3 analysis domains
        comparablePropertyService.generateComparableProperties(actualId);
        valuationService.calculatePropertyValuation(actualId);
        riskAssessmentService.performComprehensiveRiskAssessment(actualId);

        return getPropertyAnalysisSummary(actualId);
    }

    private Property getOrCreateProperty(Long propertyId) {
        return propertyRepository.findById(propertyId)
                .orElseGet(() -> propertyRepository.findAll().stream().findFirst()
                        .orElseGet(() -> {
                            Property p = new Property();
                            p.setPropertyName("Luxury Villa");
                            p.setAddress("12 Anna Nagar East");
                            p.setCity("Chennai");
                            p.setState("Tamil Nadu");
                            p.setZipCode("600040");
                            p.setPropertyType("Residential");
                            return propertyRepository.save(p);
                        }));
    }
}
