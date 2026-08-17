package com.infosys.realestate.service;

import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.RiskAssessment;

public interface RiskAssessmentService {
    RiskAssessment assessRisk(Property property, String publicData);
}
