package com.realestate.due_diligence.financialinstitution.service;


import com.realestate.due_diligence.financialinstitution.dto.FinancialInstitutionDashboardResponse;
import com.realestate.due_diligence.financialinstitution.dto.PropertyAssessmentResponse;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.service.PropertyService;
import com.realestate.due_diligence.riskassessment.dto.RiskAssessmentResponse;
import com.realestate.due_diligence.riskassessment.service.RiskAssessmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinancialInstitutionServiceImpl
        implements FinancialInstitutionService {

    private final PropertyService propertyService;
    private final RiskAssessmentService riskAssessmentService;

    @Override
    public FinancialInstitutionDashboardResponse getDashboard() {

        List<PropertyResponse> properties =
                propertyService.getAllProperties();

        if (properties == null) {
            properties = new ArrayList<>();
        }

        int highRisk = 0;
        int underReview = 0;
        int otherRisk = 0;

        List<PropertyAssessmentResponse> assessments =
                new ArrayList<>();

        for (PropertyResponse property : properties) {

            if (property == null || property.getId() == null) {
                continue;
            }

            RiskAssessmentResponse risk = null;

            try {
                risk = riskAssessmentService.assessRisk(property.getId());
            } catch (Exception ignored) {
            }

            int score = risk != null && risk.getRiskScore() != null
                    ? risk.getRiskScore()
                    : 0;

            String riskLevel = risk != null && risk.getOverallRisk() != null
                    ? risk.getOverallRisk()
                    : "NOT ASSESSED";

            String status;

            if ("HIGH".equalsIgnoreCase(riskLevel)) {
                highRisk++;
                status = "Requires Review";
            } else if ("MEDIUM".equalsIgnoreCase(riskLevel)) {
                underReview++;
                status = "Under Review";
            } else {
                otherRisk++;
                status = "Not Reviewed";
            }

            PropertyAssessmentResponse assessment =
                    new PropertyAssessmentResponse();

            assessment.setPropertyId(property.getId());
            assessment.setProperty(property.getAddress());

            assessment.setLocation(
                    property.getCity() != null
                            ? property.getCity()
                            : "Not available"
            );

            assessment.setRiskScore(score);
            assessment.setRiskLevel(riskLevel);
            assessment.setStatus(status);

            assessments.add(assessment);
        }

        FinancialInstitutionDashboardResponse response =
                new FinancialInstitutionDashboardResponse();

        response.setPropertiesEvaluated(properties.size());
        response.setUnderReview(underReview);
        response.setHighRiskProperties(highRisk);
        response.setReportsReviewed(0);

        response.setRecentAssessments(assessments);

        response.setHighRisk(highRisk);
        response.setUnderReviewRisk(underReview);
        response.setOtherRisk(otherRisk);

        return response;
    }
}
