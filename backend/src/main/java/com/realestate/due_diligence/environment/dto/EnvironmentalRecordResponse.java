package com.realestate.due_diligence.environment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnvironmentalRecordResponse {

    private Long id;

    private String recordType;

    private String riskLevel;

    private String description;
}