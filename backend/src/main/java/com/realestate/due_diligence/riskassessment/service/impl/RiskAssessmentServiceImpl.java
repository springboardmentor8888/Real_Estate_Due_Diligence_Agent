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

        List<PropertyTaxHistoryResponse> taxHistory =
                propertyTaxHistoryService.getTaxHistory(propertyId);

        List<FloodZoneInfoResponse> floodZoneInfo =
                floodZoneInfoService.getFloodZoneInfo(propertyId);

        List<EnvironmentalRecordResponse> environmentalRecords =
                environmentalRecordService.getEnvironmentalRecords(propertyId);

        List<BuildingPermitResponse> permitHistory =
                buildingPermitService.getPermitHistory(propertyId);

        int riskScore = 0;

        Set<String> riskFactors = new LinkedHashSet<>();
        // Ownership Risk
        if (ownershipHistory.size() > 5) {

            riskScore += 20;
            riskFactors.add("Very frequent ownership changes");

        } else if (ownershipHistory.size() > 3) {

            riskScore += 10;
            riskFactors.add("Frequent ownership changes");
        }

        // Property Tax Risk
        if (taxHistory.isEmpty()) {

            riskScore += 15;
            riskFactors.add("No property tax history available");
        }

        // Flood Risk
        for (FloodZoneInfoResponse flood : floodZoneInfo) {

            if ("HIGH".equalsIgnoreCase(flood.getFloodRiskLevel())) {

                riskScore += 30;
                riskFactors.add("Property is located in a high flood risk area");

            } else if ("MEDIUM".equalsIgnoreCase(flood.getFloodRiskLevel())) {

                riskScore += 15;
                riskFactors.add("Property is located in a moderate flood risk area");
            }

            if (Boolean.TRUE.equals(flood.getFloodInsuranceRequired())) {

                riskScore += 10;
                riskFactors.add("Flood insurance is required");
            }
        }

        // Environmental Risk
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

        // Building Permit Risk
        for (BuildingPermitResponse permit : permitHistory) {

            if ("REJECTED".equalsIgnoreCase(permit.getStatus())) {

                riskScore += 20;
                riskFactors.add("Building permit was rejected");

            } else if ("EXPIRED".equalsIgnoreCase(permit.getStatus())) {

                riskScore += 10;
                riskFactors.add("Building permit has expired");

            } else if ("PENDING".equalsIgnoreCase(permit.getStatus())) {

                riskScore += 5;
                riskFactors.add("Building permit is pending approval");
            }
        }

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

            recommendation = "No significant risks identified.";
        }

        RiskAssessmentResponse response = new RiskAssessmentResponse();

        response.setPropertyId(property.getId());
        response.setRiskScore(riskScore);
        response.setOverallRisk(overallRisk);
        response.setRiskFactors(new ArrayList<>(riskFactors));
        response.setRecommendation(recommendation);

        return response;
    }
}