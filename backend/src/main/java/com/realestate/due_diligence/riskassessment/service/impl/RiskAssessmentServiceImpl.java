package com.realestate.due_diligence.riskassessment.service.impl;

import com.realestate.due_diligence.environmental.dto.EnvironmentalRecordResponse;
import com.realestate.due_diligence.environmental.service.EnvironmentalRecordService;
import com.realestate.due_diligence.floodzone.dto.FloodZoneInfoResponse;
import com.realestate.due_diligence.floodzone.service.FloodZoneInfoService;
import com.realestate.due_diligence.ownership.dto.OwnershipRecordResponse;
import com.realestate.due_diligence.ownership.service.OwnershipRecordService;
import com.realestate.due_diligence.permit.dto.BuildingPermitResponse;
import com.realestate.due_diligence.permit.service.BuildingPermitService;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.service.PropertyService;
import com.realestate.due_diligence.propertytax.dto.PropertyTaxHistoryResponse;
import com.realestate.due_diligence.propertytax.service.PropertyTaxHistoryService;
import com.realestate.due_diligence.riskassessment.dto.RiskAssessmentResponse;
import com.realestate.due_diligence.riskassessment.service.RiskAssessmentService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class RiskAssessmentServiceImpl implements RiskAssessmentService {

    private final PropertyService propertyService;
    private final OwnershipRecordService ownershipRecordService;
    private final PropertyTaxHistoryService propertyTaxHistoryService;
    private final FloodZoneInfoService floodZoneInfoService;
    private final EnvironmentalRecordService environmentalRecordService;
    private final BuildingPermitService buildingPermitService;

    public RiskAssessmentServiceImpl(
            PropertyService propertyService,
            OwnershipRecordService ownershipRecordService,
            PropertyTaxHistoryService propertyTaxHistoryService,
            FloodZoneInfoService floodZoneInfoService,
            EnvironmentalRecordService environmentalRecordService,
            BuildingPermitService buildingPermitService) {

        this.propertyService = propertyService;
        this.ownershipRecordService = ownershipRecordService;
        this.propertyTaxHistoryService = propertyTaxHistoryService;
        this.floodZoneInfoService = floodZoneInfoService;
        this.environmentalRecordService = environmentalRecordService;
        this.buildingPermitService = buildingPermitService;
    }

    @Override
    public RiskAssessmentResponse assessRisk(Long propertyId) {

        PropertyResponse property =
                propertyService.getPropertyById(propertyId);

        List<OwnershipRecordResponse> ownershipHistory =
                ownershipRecordService.getOwnershipHistory(propertyId);
        if (ownershipHistory == null) ownershipHistory = new ArrayList<>();

        List<PropertyTaxHistoryResponse> taxHistory =
                propertyTaxHistoryService.getTaxHistory(propertyId);
        if (taxHistory == null) taxHistory = new ArrayList<>();

        List<FloodZoneInfoResponse> floodZoneInfo =
                floodZoneInfoService.getFloodZoneInfo(propertyId);
        if (floodZoneInfo == null) floodZoneInfo = new ArrayList<>();

        List<EnvironmentalRecordResponse> environmentalRecords =
                environmentalRecordService.getEnvironmentalRecords(propertyId);
        if (environmentalRecords == null) environmentalRecords = new ArrayList<>();

        List<BuildingPermitResponse> permitHistory =
                buildingPermitService.getPermitHistory(propertyId);
        if (permitHistory == null) permitHistory = new ArrayList<>();

        int riskScore = 0;
        Set<String> riskFactors = new LinkedHashSet<>();

        int ownershipScore = 95;
        int legalScore = 90;
        int taxScore = 95;
        int floodScore = 90;
        int permitScore = 90;
        int zoningScore = (property != null && property.getCity() != null && !property.getCity().isEmpty()) ? 95 : 70;

        if (ownershipHistory.isEmpty()) {

            riskScore += 20;
            ownershipScore = 50;
            legalScore = 60;

            riskFactors.add(
                    "Ownership history records pending verification"
            );

        } else if (ownershipHistory.size() > 5) {

            riskScore += 20;
            ownershipScore -= 30;
            legalScore -= 25;

            riskFactors.add(
                    "Very frequent ownership changes"
            );

        } else if (ownershipHistory.size() > 3) {

            riskScore += 10;
            ownershipScore -= 15;
            legalScore -= 10;

            riskFactors.add(
                    "Frequent ownership changes"
            );
        }

        if (taxHistory.isEmpty()) {
            riskScore += 15;
            taxScore = 50;
            riskFactors.add("No property tax history available");
        } else {

            boolean hasUnpaid = taxHistory.stream()
                    .anyMatch(t ->
                            "UNPAID".equalsIgnoreCase(t.getPaymentStatus()));

            boolean hasPending = taxHistory.stream()
                    .anyMatch(t ->
                            "PENDING".equalsIgnoreCase(t.getPaymentStatus()));

            if (hasUnpaid) {

                riskScore += 25;
                taxScore = 40;

                riskFactors.add(
                        "Unpaid property tax dues detected"
                );

            } else if (hasPending) {

                riskScore += 10;
                taxScore = 70;

                riskFactors.add(
                        "Property tax payment is pending"
                );
            }
        }

        if (floodZoneInfo.isEmpty()) {

            floodScore = 60;

            riskFactors.add(
                    "Flood zone information pending verification"
            );

        } else {

            for (FloodZoneInfoResponse flood : floodZoneInfo) {

                if ("HIGH".equalsIgnoreCase(flood.getFloodRiskLevel())) {

                    riskScore += 30;
                    floodScore -= 40;

                    riskFactors.add(
                            "Property is located in a high flood risk area"
                    );

                } else if ("MEDIUM".equalsIgnoreCase(
                        flood.getFloodRiskLevel())) {

                    riskScore += 15;
                    floodScore -= 20;

                    riskFactors.add(
                            "Property is located in a moderate flood risk area"
                    );
                }

                if (Boolean.TRUE.equals(
                        flood.getFloodInsuranceRequired())) {

                    riskScore += 10;
                    floodScore -= 10;

                    riskFactors.add(
                            "Flood insurance is required"
                    );
                }
            }
        }

        if (environmentalRecords.isEmpty()) {

            riskFactors.add(
                    "Environmental records pending verification"
            );

        } else {

            for (EnvironmentalRecordResponse environmental
                    : environmentalRecords) {

                if ("HIGH".equalsIgnoreCase(
                        environmental.getEnvironmentalRisk())) {

                    riskScore += 30;

                    riskFactors.add(
                            "High environmental risk"
                    );

                } else if ("MEDIUM".equalsIgnoreCase(
                        environmental.getEnvironmentalRisk())) {

                    riskScore += 15;

                    riskFactors.add(
                            "Moderate environmental risk"
                    );
                }

                if ("HIGH".equalsIgnoreCase(
                        environmental.getContaminationLevel())) {

                    riskScore += 25;

                    riskFactors.add(
                            "High contamination level"
                    );

                } else if ("MEDIUM".equalsIgnoreCase(
                        environmental.getContaminationLevel())) {

                    riskScore += 10;

                    riskFactors.add(
                            "Moderate contamination level"
                    );
                }
            }
        }

        if (permitHistory.isEmpty()) {

            permitScore = 60;

            riskFactors.add(
                    "Building permit records pending verification"
            );

        } else {

            for (BuildingPermitResponse permit : permitHistory) {

                if ("REJECTED".equalsIgnoreCase(permit.getStatus())) {

                    riskScore += 20;
                    permitScore -= 35;

                    riskFactors.add(
                            "Building permit was rejected"
                    );

                } else if ("EXPIRED".equalsIgnoreCase(
                        permit.getStatus())) {

                    riskScore += 10;
                    permitScore -= 15;

                    riskFactors.add(
                            "Building permit has expired"
                    );

                } else if ("PENDING".equalsIgnoreCase(
                        permit.getStatus())) {

                    riskScore += 5;
                    permitScore -= 10;

                    riskFactors.add(
                            "Building permit is pending approval"
                    );
                }
            }
        }
        ownershipScore = Math.max(0, Math.min(100, ownershipScore));
        legalScore = Math.max(0, Math.min(100, legalScore));
        taxScore = Math.max(0, Math.min(100, taxScore));
        floodScore = Math.max(0, Math.min(100, floodScore));
        permitScore = Math.max(0, Math.min(100, permitScore));
        zoningScore = Math.max(0, Math.min(100, zoningScore));
        riskScore = Math.max(0, Math.min(100, riskScore));

        String overallRisk;
        if (riskScore >= 60) {
            overallRisk = "HIGH";
        } else if (riskScore >= 30) {
            overallRisk = "MEDIUM";
        } else {
            overallRisk = "LOW";
        }


        String recommendation;

        if ("HIGH".equals(overallRisk)) {

            recommendation =
                    "Conduct a detailed legal and environmental review before purchasing the property.";

        } else if ("MEDIUM".equals(overallRisk)) {

            recommendation =
                    "Review the identified risk factors before proceeding.";

        } else if (!riskFactors.isEmpty()) {

            recommendation =
                    "Risk is currently low, but some records require verification before acquisition.";

        } else {

            recommendation =
                    "Title records, tax clearances, permits, environmental records, and zoning are verified. Property is suitable for acquisition.";
        }

        RiskAssessmentResponse response = new RiskAssessmentResponse();

        response.setPropertyId(property != null ? property.getId() : propertyId);
        response.setRiskScore(riskScore);
        response.setOverallRisk(overallRisk);
        response.setRiskFactors(new ArrayList<>(riskFactors));
        response.setRecommendation(recommendation);

        response.setLegalScore(legalScore);
        response.setTaxScore(taxScore);
        response.setFloodScore(floodScore);
        response.setPermitScore(permitScore);
        response.setZoningScore(zoningScore);
        response.setOwnershipScore(ownershipScore);

        return response;
    }
}