package com.realestate.due_diligence.report.service.impl;

import com.realestate.due_diligence.comparableproperty.dto.ComparablePropertyResponse;
import com.realestate.due_diligence.comparableproperty.service.ComparablePropertyService;
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
import com.realestate.due_diligence.propertyhistory.dto.PropertyHistoryResponse;
import com.realestate.due_diligence.propertyhistory.service.PropertyHistoryService;
import com.realestate.due_diligence.propertytax.dto.PropertyTaxHistoryResponse;
import com.realestate.due_diligence.propertytax.service.PropertyTaxHistoryService;
import com.realestate.due_diligence.propertyvaluation.dto.PropertyValuationResponse;
import com.realestate.due_diligence.propertyvaluation.service.PropertyValuationService;
import com.realestate.due_diligence.report.dto.ReportResponse;
import com.realestate.due_diligence.report.service.ReportService;
import com.realestate.due_diligence.riskassessment.dto.RiskAssessmentResponse;
import com.realestate.due_diligence.riskassessment.service.RiskAssessmentService;
import com.realestate.due_diligence.zoning.dto.ZoningInfoResponse;
import com.realestate.due_diligence.zoning.service.ZoningInfoService;
import com.realestate.due_diligence.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final PropertyService propertyService;
    private final RiskAssessmentService riskAssessmentService;
    private final ComparablePropertyService comparablePropertyService;
    private final PropertyValuationService propertyValuationService;

    private final PropertyHistoryService propertyHistoryService;
    private final OwnershipRecordService ownershipRecordService;
    private final PropertyTaxHistoryService propertyTaxHistoryService;
    private final ZoningInfoService zoningInfoService;
    private final FloodZoneInfoService floodZoneInfoService;
    private final BuildingPermitService buildingPermitService;
    private final EnvironmentalRecordService environmentalRecordService;

    // Notification service
    private final NotificationService notificationService;

    @Override
    public ReportResponse generateReport(Long propertyId) {

        // =====================================================
        // PROPERTY
        // =====================================================

        PropertyResponse property =
                propertyService.getPropertyById(propertyId);


        // =====================================================
        // RISK ASSESSMENT
        // =====================================================

        RiskAssessmentResponse risk =
                riskAssessmentService.assessRisk(propertyId);


        // =====================================================
        // PROPERTY VALUATION
        // =====================================================

        PropertyValuationResponse valuation =
                propertyValuationService.getPropertyValuation(propertyId);


        // =====================================================
        // COMPARABLE PROPERTIES
        // =====================================================

        List<ComparablePropertyResponse> comparables =
                comparablePropertyService.getComparableProperties(propertyId);


        // =====================================================
        // PROPERTY HISTORY
        // =====================================================

        List<PropertyHistoryResponse> propertyHistory =
                propertyHistoryService.getPropertyHistory(propertyId);


        // =====================================================
        // OWNERSHIP HISTORY
        // =====================================================

        List<OwnershipRecordResponse> ownershipHistory =
                ownershipRecordService.getOwnershipHistory(propertyId);


        // =====================================================
        // TAX HISTORY
        // =====================================================

        List<PropertyTaxHistoryResponse> taxHistory =
                propertyTaxHistoryService.getTaxHistory(propertyId);


        // =====================================================
        // ZONING INFORMATION
        // =====================================================

        List<ZoningInfoResponse> zoningInfo =
                zoningInfoService.getZoningInfo(propertyId);


        // =====================================================
        // FLOOD ZONE INFORMATION
        // =====================================================

        List<FloodZoneInfoResponse> floodZoneInfo =
                floodZoneInfoService.getFloodZoneInfo(propertyId);


        // =====================================================
        // BUILDING PERMIT HISTORY
        // =====================================================

        List<BuildingPermitResponse> permitHistory =
                buildingPermitService.getPermitHistory(propertyId);


        // =====================================================
        // ENVIRONMENTAL RECORDS
        // =====================================================

        List<EnvironmentalRecordResponse> environmentalRecords =
                environmentalRecordService.getEnvironmentalRecords(propertyId);


        // =====================================================
        // BUILD REPORT
        // =====================================================

        ReportResponse report = new ReportResponse();

        report.setProperty(property);
        report.setRiskAssessment(risk);
        report.setValuation(valuation);
        report.setComparableProperties(comparables);

        report.setPropertyHistory(propertyHistory);
        report.setOwnershipHistory(ownershipHistory);
        report.setTaxHistory(taxHistory);
        report.setZoningInfo(zoningInfo);
        report.setFloodZoneInfo(floodZoneInfo);
        report.setPermitHistory(permitHistory);
        report.setEnvironmentalRecords(environmentalRecords);

        report.setGeneratedOn(LocalDateTime.now());


        // =====================================================
        // CREATE REPORT READY NOTIFICATION
        // =====================================================
        //
        // The notification is created only after the report
        // has been successfully assembled.
        //
        // property.getAddress() comes from the existing
        // backend PropertyResponse.
        //
        notificationService.createReportReadyNotification(
                propertyId,
                property.getAddress()
        );


        // =====================================================
        // RETURN REPORT
        // =====================================================

        return report;
    }
}