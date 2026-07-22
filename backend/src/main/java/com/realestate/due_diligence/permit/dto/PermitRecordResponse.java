package com.realestate.due_diligence.permit.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermitRecordResponse {

    private Long id;

    private Long propertyId;

    private String permitNumber;

    private String permitType;

    private String status;

    private LocalDate issueDate;
}