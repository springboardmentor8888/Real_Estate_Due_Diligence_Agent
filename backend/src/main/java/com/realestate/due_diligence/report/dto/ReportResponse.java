package com.realestate.due_diligence.report.dto;

import com.realestate.due_diligence.comparableproperty.dto.ComparablePropertyResponse;
import com.realestate.due_diligence.environmental.dto.EnvironmentalRecordResponse;
import com.realestate.due_diligence.floodzone.dto.FloodZoneInfoResponse;
import com.realestate.due_diligence.ownership.dto.OwnershipRecordResponse;
import com.realestate.due_diligence.permit.dto.BuildingPermitResponse;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.propertyhistory.dto.PropertyHistoryResponse;
import com.realestate.due_diligence.propertytax.dto.PropertyTaxHistoryResponse;
import com.realestate.due_diligence.propertyvaluation.dto.PropertyValuationResponse;
import com.realestate.due_diligence.riskassessment.dto.RiskAssessmentResponse;
import com.realestate.due_diligence.zoning.dto.ZoningInfoResponse;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ReportResponse {

    private PropertyResponse property;

    private RiskAssessmentResponse riskAssessment;

    private PropertyValuationResponse valuation;

    private List<ComparablePropertyResponse> comparableProperties;

    private List<PropertyHistoryResponse> propertyHistory;

    private List<OwnershipRecordResponse> ownershipHistory;

    private List<PropertyTaxHistoryResponse> taxHistory;

    private List<ZoningInfoResponse> zoningInfo;

    private List<FloodZoneInfoResponse> floodZoneInfo;

    private List<BuildingPermitResponse> permitHistory;

    private List<EnvironmentalRecordResponse> environmentalRecords;

    private LocalDateTime generatedOn;
}