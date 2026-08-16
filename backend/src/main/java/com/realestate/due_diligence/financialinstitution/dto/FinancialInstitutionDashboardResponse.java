package com.realestate.due_diligence.financialinstitution.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FinancialInstitutionDashboardResponse {

    private int propertiesEvaluated;
    private int underReview;
    private int highRiskProperties;
    private int reportsReviewed;

    private List<PropertyAssessmentResponse> recentAssessments;

    private int highRisk;
    private int underReviewRisk;
    private int otherRisk;
}
