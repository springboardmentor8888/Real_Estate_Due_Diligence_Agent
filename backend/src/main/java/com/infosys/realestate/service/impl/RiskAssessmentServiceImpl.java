package com.infosys.realestate.service.impl;

import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.RiskAssessment;
import com.infosys.realestate.repository.RiskAssessmentRepository;
import com.infosys.realestate.service.RiskAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RiskAssessmentServiceImpl implements RiskAssessmentService {

    @Autowired
    private RiskAssessmentRepository riskAssessmentRepository;

    @Override
    public RiskAssessment assessRisk(Property property, String publicData) {
        RiskAssessment assessment = new RiskAssessment();
        assessment.setProperty(property);
        
        // Simulated risk logic
        assessment.setRiskLevel("LOW");
        assessment.setRiskScore(15);
        assessment.setComments("Basic risk assessment completed. No major issues found.");
        
        return riskAssessmentRepository.save(assessment);
    }
}
