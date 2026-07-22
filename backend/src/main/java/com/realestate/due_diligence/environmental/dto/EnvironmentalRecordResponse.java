package com.realestate.due_diligence.environmental.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnvironmentalRecordResponse {

    private Long id;

    private Long propertyId;

    private String environmentalRisk;

    private String contaminationLevel;

    private String remarks;
}