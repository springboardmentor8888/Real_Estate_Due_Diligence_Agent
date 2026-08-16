package com.realestate.due_diligence.legalreviewer.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LegalReviewPropertyResponse {

    private Long propertyId;
    private String address;
    private String city;
    private String state;

    private Integer riskScore;
    private String overallRisk;

    private String reviewStatus;
}