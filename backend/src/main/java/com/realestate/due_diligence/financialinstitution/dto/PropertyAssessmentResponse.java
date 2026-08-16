package com.realestate.due_diligence.financialinstitution.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyAssessmentResponse {

    private Long propertyId;
    private String property;
    private String location;
    private Integer riskScore;
    private String riskLevel;
    private String status;
}
