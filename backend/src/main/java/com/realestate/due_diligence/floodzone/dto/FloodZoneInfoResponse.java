package com.realestate.due_diligence.floodzone.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FloodZoneInfoResponse {

    private Long id;

    private String floodZoneCode;

    private String floodRiskLevel;

    private Boolean floodInsuranceRequired;
}