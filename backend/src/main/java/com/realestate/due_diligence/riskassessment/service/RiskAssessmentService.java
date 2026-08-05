package com.realestate.due_diligence.riskassessment.service;

import com.realestate.due_diligence.riskassessment.dto.RiskAssessmentResponse;

public interface RiskAssessmentService {

    RiskAssessmentResponse assessRisk(Long propertyId);

}