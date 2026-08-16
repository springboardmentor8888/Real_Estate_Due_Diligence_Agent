package com.realestate.due_diligence.purchase.service;


import com.realestate.due_diligence.purchase.dtos.PurchaseResponse;

import java.util.List;

public interface PurchaseService {

    PurchaseResponse createPurchaseRequest(Long propertyId);

    List<PurchaseResponse> getMyPurchaseRequests();

    List<PurchaseResponse> getLegalPendingRequests();

    List<PurchaseResponse> getFinancialPendingRequests();

    PurchaseResponse legalApprove(Long purchaseId);

    PurchaseResponse legalReject(Long purchaseId);

    PurchaseResponse financialApprove(Long purchaseId);

    PurchaseResponse financialReject(Long purchaseId);

    List<PurchaseResponse> getLegalReviewHistory();

    List<PurchaseResponse> getFinancialReviewHistory();

    PurchaseResponse getPropertyPurchaseStatus(Long propertyId);

    List<PurchaseResponse> getCompletedPurchases();


}
