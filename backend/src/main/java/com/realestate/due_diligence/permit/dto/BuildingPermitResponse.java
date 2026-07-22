package com.realestate.due_diligence.permit.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BuildingPermitResponse {

    private Long id;

    private String permitNumber;

    private String permitType;

    private LocalDate issueDate;

    private String status;
}