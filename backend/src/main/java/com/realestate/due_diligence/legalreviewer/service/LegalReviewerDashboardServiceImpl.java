package com.realestate.due_diligence.legalreviewer.service;

import com.realestate.due_diligence.legalreviewer.dtos.LegalReviewHistoryResponse;
import com.realestate.due_diligence.legalreviewer.dtos.LegalReviewPropertyResponse;
import com.realestate.due_diligence.legalreviewer.dtos.LegalReviewerDashboardResponse;

import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.service.PropertyService;
import com.realestate.due_diligence.ownership.service.OwnershipRecordService;
import com.realestate.due_diligence.propertytax.service.PropertyTaxHistoryService;
import com.realestate.due_diligence.permit.service.BuildingPermitService;
import com.realestate.due_diligence.propertyhistory.dto.PropertyHistoryResponse;
import com.realestate.due_diligence.propertyhistory.service.PropertyHistoryService;
import com.realestate.due_diligence.riskassessment.dto.RiskAssessmentResponse;
import com.realestate.due_diligence.riskassessment.service.RiskAssessmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LegalReviewerDashboardServiceImpl
        implements LegalReviewerDashboardService {

    private final PropertyService propertyService;
    private final OwnershipRecordService ownershipRecordService;
    private final PropertyTaxHistoryService propertyTaxHistoryService;
    private final BuildingPermitService buildingPermitService;
    private final PropertyHistoryService propertyHistoryService;
    private final RiskAssessmentService riskAssessmentService;

    @Override
    public LegalReviewerDashboardResponse getDashboard() {

        List<PropertyResponse> properties =
                propertyService.getAllProperties();

        if (properties == null) {
            properties = new ArrayList<>();
        }

        int pendingReviews = 0;
        int highLegalRisk = 0;
        int documentsPending = 0;

        List<LegalReviewPropertyResponse> pendingProperties =
                new ArrayList<>();

        List<LegalReviewHistoryResponse> recentReviews =
                new ArrayList<>();

        for (PropertyResponse property : properties) {

            if (property == null || property.getId() == null) {
                continue;
            }

            Long propertyId = property.getId();
            RiskAssessmentResponse risk = null;

            try {
                risk = riskAssessmentService.assessRisk(propertyId);
            } catch (Exception ignored) {
            }

            int riskScore =
                    risk != null && risk.getRiskScore() != null
                            ? risk.getRiskScore()
                            : 0;

            String overallRisk =
                    risk != null && risk.getOverallRisk() != null
                            ? risk.getOverallRisk()
                            : "UNKNOWN";

            if ("HIGH".equalsIgnoreCase(overallRisk)
                    || "MEDIUM".equalsIgnoreCase(overallRisk)) {

                pendingReviews++;

                LegalReviewPropertyResponse item =
                        new LegalReviewPropertyResponse();

                item.setPropertyId(propertyId);
                item.setAddress(property.getAddress());
                item.setCity(property.getCity());
                item.setState(property.getState());
                item.setRiskScore(riskScore);
                item.setOverallRisk(overallRisk);
                item.setReviewStatus("PENDING");

                pendingProperties.add(item);
            }

            if ("HIGH".equalsIgnoreCase(overallRisk)) {
                highLegalRisk++;
            }
            boolean hasMissingDocuments = false;

            try {
                if (ownershipRecordService
                        .getOwnershipHistory(propertyId)
                        .isEmpty()) {

                    hasMissingDocuments = true;
                }
            } catch (Exception ignored) {
                hasMissingDocuments = true;
            }

            try {
                if (propertyTaxHistoryService
                        .getTaxHistory(propertyId)
                        .isEmpty()) {

                    hasMissingDocuments = true;
                }
            } catch (Exception ignored) {
                hasMissingDocuments = true;
            }

            try {
                if (buildingPermitService
                        .getPermitHistory(propertyId)
                        .isEmpty()) {

                    hasMissingDocuments = true;
                }
            } catch (Exception ignored) {
                hasMissingDocuments = true;
            }

            if (hasMissingDocuments) {
                documentsPending++;
            }
            try {

                List<PropertyHistoryResponse> history =
                        propertyHistoryService
                                .getPropertyHistory(propertyId);

                if (history != null && !history.isEmpty()) {

                    PropertyHistoryResponse latest =
                            history.stream()
                                    .filter(item -> item.getEventDate() != null)
                                    .max(
                                            Comparator.comparing(
                                                    PropertyHistoryResponse::getEventDate
                                            )
                                    )
                                    .orElse(null);

                    if (latest != null) {

                        LegalReviewHistoryResponse review =
                                new LegalReviewHistoryResponse();

                        review.setPropertyId(propertyId);
                        review.setAddress(property.getAddress());
                        review.setReviewStatus(
                                latest.getEventType()
                        );
                        review.setReviewDate(
                                latest.getEventDate()
                        );

                        recentReviews.add(review);
                    }
                }

            } catch (Exception ignored) {
            }
        }

        recentReviews.sort(
                Comparator.comparing(
                        LegalReviewHistoryResponse::getReviewDate,
                        Comparator.nullsLast(Comparator.reverseOrder())
                )
        );

        if (recentReviews.size() > 5) {
            recentReviews =
                    new ArrayList<>(
                            recentReviews.subList(0, 5)
                    );
        }
        int completedReviews = 0;
        LegalReviewerDashboardResponse response =
                new LegalReviewerDashboardResponse();

        response.setPendingReviews(pendingReviews);
        response.setHighLegalRisk(highLegalRisk);
        response.setDocumentsPending(documentsPending);
        response.setCompletedReviews(completedReviews);

        response.setPendingProperties(pendingProperties);
        response.setRecentReviews(recentReviews);

        return response;
    }
}
