package com.realestate.due_diligence.repository;


import com.realestate.due_diligence.purchase.ApprovalStatus;
import com.realestate.due_diligence.purchase.PropertyPurchaseRequest;
import com.realestate.due_diligence.purchase.PurchaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseRepository
        extends JpaRepository<PropertyPurchaseRequest, Long> {

    List<PropertyPurchaseRequest>
    findByBuyerIdOrderByCreatedAtDesc(Long buyerId);

    List<PropertyPurchaseRequest>
    findByLegalStatusOrderByCreatedAtDesc(ApprovalStatus status);

    List<PropertyPurchaseRequest>
    findByFinancialStatusOrderByCreatedAtDesc(ApprovalStatus status);

    List<PropertyPurchaseRequest>
    findByLegalStatusInOrderByLegalReviewedAtDesc(
            List<ApprovalStatus> statuses
    );

    List<PropertyPurchaseRequest>
    findByFinancialStatusInOrderByFinancialReviewedAtDesc(
            List<ApprovalStatus> statuses
    );

    Optional<PropertyPurchaseRequest> findFirstByPropertyIdAndStatusIn(
            Long propertyId,
            List<PurchaseStatus> statuses
    );

    List<PropertyPurchaseRequest> findByStatusOrderByCreatedAtDesc(
            PurchaseStatus status
    );

}
