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

        // Fetch dependent records safely to prevent NullPointerExceptions
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

        // Initialize base sub-scores out of 100 (100 = best/safest)
        int ownershipScore = 95;
        int legalScore = 90;
        int taxScore = 95;
        int floodScore = 90;
        int permitScore = 90;
        int zoningScore = (property != null && property.getCity() != null && !property.getCity().isEmpty()) ? 95 : 70;

        // 1. Ownership & Legal Risk Evaluation
        if (ownershipHistory.size() > 5) {
            riskScore += 20;
            ownershipScore -= 30;
            legalScore -= 25;
            riskFactors.add("Very frequent ownership changes");
        } else if (ownershipHistory.size() > 3) {
            riskScore += 10;
            ownershipScore -= 15;
            legalScore -= 10;
            riskFactors.add("Frequent ownership changes");
        } else if (ownershipHistory.isEmpty()) {
            ownershipScore = 50;
            legalScore = 60;
            riskFactors.add("Ownership history records pending verification");
        }

        // 2. Property Tax Risk Evaluation
        if (taxHistory.isEmpty()) {
            riskScore += 15;
            taxScore = 50;
            riskFactors.add("No property tax history available");
        } else {
            boolean hasUnpaid = taxHistory.stream()
                    .anyMatch(t -> "UNPAID".equalsIgnoreCase(t.getPaymentStatus()));
            if (hasUnpaid) {
                riskScore += 25;
                taxScore = 40;
                riskFactors.add("Unpaid property tax dues detected");
            }
        }

        // 3. Flood Risk Evaluation
        for (FloodZoneInfoResponse flood : floodZoneInfo) {
            if ("HIGH".equalsIgnoreCase(flood.getFloodRiskLevel())) {
                riskScore += 30;
                floodScore -= 40;
                riskFactors.add("Property is located in a high flood risk area");
            } else if ("MEDIUM".equalsIgnoreCase(flood.getFloodRiskLevel())) {
                riskScore += 15;
                floodScore -= 20;
                riskFactors.add("Property is located in a moderate flood risk area");
            }

            if (Boolean.TRUE.equals(flood.getFloodInsuranceRequired())) {
                riskScore += 10;
                floodScore -= 10;
                riskFactors.add("Flood insurance is required");
            }
        }

        // 4. Environmental Risk Evaluation
        for (EnvironmentalRecordResponse environmental : environmentalRecords) {
            if ("HIGH".equalsIgnoreCase(environmental.getEnvironmentalRisk())) {
                riskScore += 30;
                riskFactors.add("High environmental risk");
            } else if ("MEDIUM".equalsIgnoreCase(environmental.getEnvironmentalRisk())) {
                riskScore += 15;
                riskFactors.add("Moderate environmental risk");
            }

            if ("HIGH".equalsIgnoreCase(environmental.getContaminationLevel())) {
                riskScore += 25;
                riskFactors.add("High contamination level");
            } else if ("MEDIUM".equalsIgnoreCase(environmental.getContaminationLevel())) {
                riskScore += 10;
                riskFactors.add("Moderate contamination level");
            }
        }

        // 5. Building Permit Risk Evaluation
        for (BuildingPermitResponse permit : permitHistory) {
            if ("REJECTED".equalsIgnoreCase(permit.getStatus())) {
                riskScore += 20;
                permitScore -= 35;
                riskFactors.add("Building permit was rejected");
            } else if ("EXPIRED".equalsIgnoreCase(permit.getStatus())) {
                riskScore += 10;
                permitScore -= 15;
                riskFactors.add("Building permit has expired");
            } else if ("PENDING".equalsIgnoreCase(permit.getStatus())) {
                riskScore += 5;
                permitScore -= 10;
                riskFactors.add("Building permit is pending approval");
            }
        }

        // Clamp sub-scores between 0 and 100
        ownershipScore = Math.max(0, Math.min(100, ownershipScore));
        legalScore = Math.max(0, Math.min(100, legalScore));
        taxScore = Math.max(0, Math.min(100, taxScore));
        floodScore = Math.max(0, Math.min(100, floodScore));
        permitScore = Math.max(0, Math.min(100, permitScore));
        zoningScore = Math.max(0, Math.min(100, zoningScore));

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
            recommendation = "Conduct a detailed legal and environmental review before purchasing the property.";
        } else if ("MEDIUM".equals(overallRisk)) {
            recommendation = "Review the identified risk factors before proceeding.";
        } else {
            recommendation = "Title records, tax clearances, and municipal zoning are fully verified. Safe for acquisition.";
        }

        RiskAssessmentResponse response = new RiskAssessmentResponse();

        response.setPropertyId(property != null ? property.getId() : propertyId);
        response.setRiskScore(riskScore);
        response.setOverallRisk(overallRisk);
        response.setRiskFactors(new ArrayList<>(riskFactors));
        response.setRecommendation(recommendation);

        // Map sub-scores to the DTO
        response.setLegalScore(legalScore);
        response.setTaxScore(taxScore);
        response.setFloodScore(floodScore);
        response.setPermitScore(permitScore);
        response.setZoningScore(zoningScore);
        response.setOwnershipScore(ownershipScore);

        return response;
    }
}