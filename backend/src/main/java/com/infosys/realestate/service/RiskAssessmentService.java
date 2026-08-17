package com.infosys.realestate.service;

import com.infosys.realestate.dto.RiskAssessmentDTO;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.RiskAssessment;

import java.util.List;

public interface RiskAssessmentService {
    RiskAssessment assessRisk(Property property, String publicData);
    RiskAssessmentDTO getLatestRiskAssessment(Long propertyId);
    RiskAssessmentDTO performComprehensiveRiskAssessment(Long propertyId);
    List<RiskAssessmentDTO> getRiskAssessmentHistory(Long propertyId);
}
