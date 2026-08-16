package com.realestate.due_diligence.purchase;

import com.realestate.due_diligence.common.BaseEntity;
import com.realestate.due_diligence.property.Property;
import com.realestate.due_diligence.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "property_purchase_requests")
public class PropertyPurchaseRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PurchaseStatus status = PurchaseStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "legal_status", nullable = false)
    private ApprovalStatus legalStatus = ApprovalStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "financial_status", nullable = false)
    private ApprovalStatus financialStatus = ApprovalStatus.PENDING;

    private LocalDateTime legalReviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "legal_reviewer_id")
    private User legalReviewer;

    private LocalDateTime financialReviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "financial_reviewer_id")
    private User financialReviewer;


}
