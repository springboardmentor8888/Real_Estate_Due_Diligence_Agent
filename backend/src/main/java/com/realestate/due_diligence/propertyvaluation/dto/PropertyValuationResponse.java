package com.realestate.due_diligence.propertyvaluation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyValuationResponse {

    private Long propertyId;

    private Integer comparablePropertyCount;

    private Integer similarityScore;

    private String valuationRemark;
}