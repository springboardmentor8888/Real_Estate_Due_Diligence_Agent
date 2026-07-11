package com.realestate.due_diligence.propertyhistory.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PropertyHistoryResponse {

    private Long id;

    private String eventType;

    private LocalDate eventDate;

    private String description;
}