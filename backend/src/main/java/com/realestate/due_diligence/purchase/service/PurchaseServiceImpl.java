package com.realestate.due_diligence.purchase.service;


import com.realestate.due_diligence.property.Property;
import com.realestate.due_diligence.purchase.ApprovalStatus;
import com.realestate.due_diligence.purchase.PurchaseStatus;
import com.realestate.due_diligence.purchase.PropertyPurchaseRequest;
import com.realestate.due_diligence.purchase.dtos.PurchaseResponse;
import com.realestate.due_diligence.repository.PropertyRepository;
import com.realestate.due_diligence.repository.PurchaseRepository;
import com.realestate.due_diligence.repository.UserRepository;
import com.realestate.due_diligence.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Logged-in user not found"));
    }

    @Override
    @Transactional
    public PurchaseResponse createPurchaseRequest(Long propertyId) {

        User buyer = getLoggedInUser();

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found with id: " + propertyId
                        ));
        boolean alreadyPurchased =
                purchaseRepository.findFirstByPropertyIdAndStatusIn(
                        propertyId,
                        List.of(
                                PurchaseStatus.PENDING,
                                PurchaseStatus.COMPLETED
                        )
                ).isPresent();

        if (alreadyPurchased) {
            throw new RuntimeException(
                    "This property is already sold or has a pending purchase request."
            );
        }

        PropertyPurchaseRequest request =
                new PropertyPurchaseRequest();

        request.setProperty(property);
        request.setBuyer(buyer);
        request.setStatus(PurchaseStatus.PENDING);
        request.setLegalStatus(ApprovalStatus.PENDING);
        request.setFinancialStatus(ApprovalStatus.PENDING);

        return mapToResponse(
                purchaseRepository.save(request)
        );
    }

    @Override
    public List<PurchaseResponse> getMyPurchaseRequests() {

        User buyer = getLoggedInUser();

        return purchaseRepository
                .findByBuyerIdOrderByCreatedAtDesc(buyer.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseResponse getPropertyPurchaseStatus(Long propertyId) {

        return purchaseRepository
                .findFirstByPropertyIdAndStatusIn(
                        propertyId,
                        List.of(
                                PurchaseStatus.PENDING,
                                PurchaseStatus.COMPLETED
                        )
                )
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Override
    public List<PurchaseResponse> getLegalPendingRequests() {

        return purchaseRepository
                .findByLegalStatusOrderByCreatedAtDesc(
                        ApprovalStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseResponse> getLegalReviewHistory() {

        return purchaseRepository
                .findByLegalStatusInOrderByLegalReviewedAtDesc(
                        Arrays.asList(
                                ApprovalStatus.APPROVED,
                                ApprovalStatus.REJECTED
                        )
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<PurchaseResponse> getFinancialPendingRequests() {

        return purchaseRepository
                .findByFinancialStatusOrderByCreatedAtDesc(
                        ApprovalStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public PurchaseResponse legalApprove(Long purchaseId) {

        PropertyPurchaseRequest request =
                getRequest(purchaseId);

        request.setLegalStatus(ApprovalStatus.APPROVED);
        request.setLegalReviewedAt(LocalDateTime.now());
        request.setLegalReviewer(getLoggedInUser());

        updateOverallStatus(request);

        return mapToResponse(
                purchaseRepository.save(request)
        );
    }

    @Override
    @Transactional
    public PurchaseResponse legalReject(Long purchaseId) {

        PropertyPurchaseRequest request =
                getRequest(purchaseId);

        request.setLegalStatus(ApprovalStatus.REJECTED);
        request.setLegalReviewedAt(LocalDateTime.now());
        request.setLegalReviewer(getLoggedInUser());
        request.setStatus(PurchaseStatus.REJECTED);

        return mapToResponse(
                purchaseRepository.save(request)
        );
    }

    @Override
    @Transactional
    public PurchaseResponse financialApprove(Long purchaseId) {

        PropertyPurchaseRequest request =
                getRequest(purchaseId);

        request.setFinancialStatus(ApprovalStatus.APPROVED);
        request.setFinancialReviewedAt(LocalDateTime.now());
        request.setFinancialReviewer(getLoggedInUser());

        updateOverallStatus(request);

        return mapToResponse(
                purchaseRepository.save(request)
        );
    }

    @Override
    @Transactional
    public PurchaseResponse financialReject(Long purchaseId) {

        PropertyPurchaseRequest request =
                getRequest(purchaseId);

        request.setFinancialStatus(ApprovalStatus.REJECTED);
        request.setFinancialReviewedAt(LocalDateTime.now());
        request.setFinancialReviewer(getLoggedInUser());
        request.setStatus(PurchaseStatus.REJECTED);

        return mapToResponse(
                purchaseRepository.save(request)
        );
    }

    private void updateOverallStatus(
            PropertyPurchaseRequest request) {

        if (request.getLegalStatus() == ApprovalStatus.APPROVED
                && request.getFinancialStatus() == ApprovalStatus.APPROVED) {

            request.setStatus(PurchaseStatus.COMPLETED);
        }
    }

    private PropertyPurchaseRequest getRequest(Long id) {

        return purchaseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Purchase request not found: " + id
                        ));
    }

    private PurchaseResponse mapToResponse(
            PropertyPurchaseRequest request) {

        Property property = request.getProperty();
        User buyer = request.getBuyer();

        return PurchaseResponse.builder()
                .id(request.getId())
                .propertyId(property.getId())
                .propertyAddress(property.getAddress())
                .city(property.getCity())
                .state(property.getState())
                .zipCode(property.getZipCode())
                .propertyType(property.getPropertyType())
                .price(property.getPrice())
                .buyerId(buyer.getId())
                .buyerName(buyer.getName())
                .buyerEmail(buyer.getEmail())
                .legalStatus(request.getLegalStatus())
                .financialStatus(request.getFinancialStatus())
                .status(request.getStatus())
                .legalReviewerId(
                        request.getLegalReviewer() != null
                                ? request.getLegalReviewer().getId()
                                : null
                )
                .legalReviewerName(
                        request.getLegalReviewer() != null
                                ? request.getLegalReviewer().getName()
                                : null
                )
                .legalReviewerEmail(
                        request.getLegalReviewer() != null
                                ? request.getLegalReviewer().getEmail()
                                : null
                )
                .legalReviewedAt(request.getLegalReviewedAt())
                .financialReviewerId(
                        request.getFinancialReviewer() != null
                                ? request.getFinancialReviewer().getId()
                                : null
                )
                .financialReviewerName(
                        request.getFinancialReviewer() != null
                                ? request.getFinancialReviewer().getName()
                                : null
                )
                .financialReviewerEmail(
                        request.getFinancialReviewer() != null
                                ? request.getFinancialReviewer().getEmail()
                                : null
                )
                .financialReviewedAt(request.getFinancialReviewedAt())

                .createdAt(request.getCreatedAt())
                .build();


    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseResponse> getFinancialReviewHistory() {

        return purchaseRepository
                .findByFinancialStatusInOrderByFinancialReviewedAtDesc(
                        List.of(
                                ApprovalStatus.APPROVED,
                                ApprovalStatus.REJECTED
                        )
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseResponse> getCompletedPurchases() {

        return purchaseRepository
                .findByStatusOrderByCreatedAtDesc(PurchaseStatus.COMPLETED)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}
