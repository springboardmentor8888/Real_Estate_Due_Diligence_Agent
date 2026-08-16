package com.realestate.due_diligence.legalreviewer.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class LegalReviewHistoryResponse {

    private Long propertyId;
    private String address;
    private String reviewStatus;
    private LocalDate reviewDate;
}