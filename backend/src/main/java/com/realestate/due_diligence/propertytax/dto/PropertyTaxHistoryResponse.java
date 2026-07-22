package com.realestate.due_diligence.propertytax.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyTaxHistoryResponse {

    private Long id;

    private Integer taxYear;

    private Double taxAmount;

    private String paymentStatus;
}