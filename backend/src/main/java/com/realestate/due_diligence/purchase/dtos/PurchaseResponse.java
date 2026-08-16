package com.realestate.due_diligence.purchase.dtos;

import com.realestate.due_diligence.purchase.ApprovalStatus;
import com.realestate.due_diligence.purchase.PurchaseStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PurchaseResponse {

    private Long id;

    private Long propertyId;

    private String propertyAddress;

    private String city;

    private String state;

    private String zipCode;

    private String propertyType;

    private Double price;

    private Long buyerId;

    private String buyerName;

    private String buyerEmail;

    private ApprovalStatus legalStatus;

    private ApprovalStatus financialStatus;

    private PurchaseStatus status;

    private LocalDateTime createdAt;

    private Long legalReviewerId;

    private String legalReviewerName;

    private String legalReviewerEmail;

    private LocalDateTime legalReviewedAt;

    private Long financialReviewerId;

    private String financialReviewerName;

    private String financialReviewerEmail;

    private LocalDateTime financialReviewedAt;
}
