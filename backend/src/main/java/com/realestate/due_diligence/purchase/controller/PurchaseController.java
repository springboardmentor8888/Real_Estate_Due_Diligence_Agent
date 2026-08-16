package com.realestate.due_diligence.purchase.controller;


import com.realestate.due_diligence.purchase.dtos.PurchaseResponse;
import com.realestate.due_diligence.purchase.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping("/property/{propertyId}")
    public PurchaseResponse createPurchase(
            @PathVariable Long propertyId) {

        return purchaseService.createPurchaseRequest(propertyId);
    }

    @GetMapping("/my")
    public List<PurchaseResponse> getMyPurchases() {

        return purchaseService.getMyPurchaseRequests();
    }

    @GetMapping("/property/{propertyId}/status")
    public PurchaseResponse getPropertyPurchaseStatus(
            @PathVariable Long propertyId) {

        return purchaseService.getPropertyPurchaseStatus(propertyId);
    }

    @GetMapping("/legal/pending")
    public List<PurchaseResponse> getLegalPending() {

        return purchaseService.getLegalPendingRequests();
    }

    @GetMapping("/financial/pending")
    public List<PurchaseResponse> getFinancialPending() {

        return purchaseService.getFinancialPendingRequests();
    }

    @PutMapping("/{id}/legal/approve")
    public PurchaseResponse legalApprove(
            @PathVariable Long id) {

        return purchaseService.legalApprove(id);
    }

    @PutMapping("/{id}/legal/reject")
    public PurchaseResponse legalReject(
            @PathVariable Long id) {

        return purchaseService.legalReject(id);
    }

    @PutMapping("/{id}/financial/approve")
    public PurchaseResponse financialApprove(
            @PathVariable Long id) {

        return purchaseService.financialApprove(id);
    }

    @PutMapping("/{id}/financial/reject")
    public PurchaseResponse financialReject(
            @PathVariable Long id) {

        return purchaseService.financialReject(id);
    }

    @GetMapping("/legal/history")
    public List<PurchaseResponse> getLegalReviewHistory() {

        return purchaseService.getLegalReviewHistory();
    }

    @GetMapping("/financial/history")
    public List<PurchaseResponse> getFinancialReviewHistory() {

        return purchaseService.getFinancialReviewHistory();
    }
    @GetMapping("/completed/customers")
    public List<PurchaseResponse> getCompletedCustomers() {

        return purchaseService.getCompletedPurchases();
    }
}
