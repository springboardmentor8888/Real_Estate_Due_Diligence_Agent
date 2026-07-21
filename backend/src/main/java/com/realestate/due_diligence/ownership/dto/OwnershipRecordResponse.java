package com.realestate.due_diligence.ownership.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class OwnershipRecordResponse {

    private Long id;

    private String ownerName;

    private LocalDate purchaseDate;

    private Double purchasePrice;
}