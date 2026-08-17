package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.PublicRecordsReportResponse;
import com.infosys.realestate.entity.OwnershipRecord;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.PropertyTaxRecord;
import com.infosys.realestate.entity.PublicRecord;
import com.infosys.realestate.exception.ResourceNotFoundException;
import com.infosys.realestate.repository.OwnershipRecordRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.PropertyTaxRecordRepository;
import com.infosys.realestate.repository.PublicRecordRepository;
import com.infosys.realestate.service.PublicRecordsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PublicRecordsServiceImpl implements PublicRecordsService {

    private final PropertyRepository propertyRepository;
    private final OwnershipRecordRepository ownershipRecordRepository;
    private final PropertyTaxRecordRepository propertyTaxRecordRepository;
    private final PublicRecordRepository publicRecordRepository;

    public PublicRecordsServiceImpl(PropertyRepository propertyRepository,
                                    OwnershipRecordRepository ownershipRecordRepository,
                                    PropertyTaxRecordRepository propertyTaxRecordRepository,
                                    PublicRecordRepository publicRecordRepository) {
        this.propertyRepository = propertyRepository;
        this.ownershipRecordRepository = ownershipRecordRepository;
        this.propertyTaxRecordRepository = propertyTaxRecordRepository;
        this.publicRecordRepository = publicRecordRepository;
    }

    @Override
    public List<OwnershipRecord> getOwnershipHistory(Long propertyId) {
        Property property = findPropertyOrThrow(propertyId);
        List<OwnershipRecord> records = ownershipRecordRepository
                .findByPropertyPropertyIdOrderByAcquisitionDateDesc(propertyId);

        // If no records exist in DB yet, return seeded dummy data
        if (records.isEmpty()) {
            return generateDummyOwnershipRecords(property);
        }
        return records;
    }

    @Override
    public List<PropertyTaxRecord> getTaxHistory(Long propertyId) {
        Property property = findPropertyOrThrow(propertyId);
        List<PropertyTaxRecord> records = propertyTaxRecordRepository
                .findByPropertyPropertyIdOrderByTaxYearDesc(propertyId);

        if (records.isEmpty()) {
            return generateDummyTaxRecords(property);
        }
        return records;
    }

    @Override
    public List<PublicRecord> getPublicRecords(Long propertyId) {
        Property property = findPropertyOrThrow(propertyId);
        List<PublicRecord> records = publicRecordRepository
                .findByPropertyPropertyIdOrderByFilingDateDesc(propertyId);

        if (records.isEmpty()) {
            return generateDummyPublicRecords(property);
        }
        return records;
    }

    @Override
    public PublicRecordsReportResponse getCombinedPublicRecordsReport(Long propertyId) {
        Property property = findPropertyOrThrow(propertyId);

        List<OwnershipRecord> ownershipRecords = getOwnershipHistory(propertyId);
        List<PropertyTaxRecord> taxRecords = getTaxHistory(propertyId);
        List<PublicRecord> publicRecords = getPublicRecords(propertyId);

        long activePublicRecords = publicRecords.stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()))
                .count();

        String riskFlag = determineRiskFlag(publicRecords, taxRecords);

        PublicRecordsReportResponse response = new PublicRecordsReportResponse();
        response.setPropertyId(property.getPropertyId());
        response.setPropertyAddress(property.getAddress());
        response.setPropertyCity(property.getCity());
        response.setPropertyState(property.getState());
        response.setPropertyZipCode(property.getZipCode());
        response.setOverallRiskFlag(riskFlag);
        response.setOwnershipHistory(ownershipRecords);
        response.setTaxHistory(taxRecords);
        response.setPublicRecords(publicRecords);
        response.setTotalOwnershipRecords(ownershipRecords.size());
        response.setTotalTaxRecords(taxRecords.size());
        response.setTotalPublicRecords(publicRecords.size());
        response.setActivePublicRecordsCount((int) activePublicRecords);

        return response;
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private Property findPropertyOrThrow(Long propertyId) {
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));
    }

    private String determineRiskFlag(List<PublicRecord> publicRecords, List<PropertyTaxRecord> taxRecords) {
        boolean hasHighSeverityRecord = publicRecords.stream()
                .anyMatch(r -> "HIGH".equalsIgnoreCase(r.getSeverity()) && "ACTIVE".equalsIgnoreCase(r.getStatus()));

        boolean hasDelinquentTax = taxRecords.stream()
                .anyMatch(r -> "DELINQUENT".equalsIgnoreCase(r.getPaymentStatus()));

        boolean hasMediumRecord = publicRecords.stream()
                .anyMatch(r -> "MEDIUM".equalsIgnoreCase(r.getSeverity()) && "ACTIVE".equalsIgnoreCase(r.getStatus()));

        if (hasHighSeverityRecord || hasDelinquentTax) return "HIGH_RISK";
        if (hasMediumRecord) return "CONCERNS_FOUND";
        return "CLEAR";
    }

    // ─── Dummy Data Generators ────────────────────────────────────────────────

    private List<OwnershipRecord> generateDummyOwnershipRecords(Property property) {
        List<OwnershipRecord> records = new ArrayList<>();

        records.add(new OwnershipRecord(
                property, "John A. Doe", "INDIVIDUAL",
                LocalDate.of(2018, 3, 15), null,
                450000.00, "DEED-2018-00432", true
        ));
        records.add(new OwnershipRecord(
                property, "Greenfield Holdings LLC", "CORPORATION",
                LocalDate.of(2012, 7, 20), LocalDate.of(2018, 3, 10),
                310000.00, "DEED-2012-00891", false
        ));
        records.add(new OwnershipRecord(
                property, "Mary T. Wilson", "INDIVIDUAL",
                LocalDate.of(2005, 11, 5), LocalDate.of(2012, 7, 15),
                195000.00, "DEED-2005-00124", false
        ));

        return records;
    }

    private List<PropertyTaxRecord> generateDummyTaxRecords(Property property) {
        List<PropertyTaxRecord> records = new ArrayList<>();

        records.add(new PropertyTaxRecord(
                property, 2024, 420000.00, 460000.00,
                5250.00, 1.25, "PAID", "2025-01-15",
                "County Tax Assessor Office", "PRC-20240" + property.getPropertyId()
        ));
        records.add(new PropertyTaxRecord(
                property, 2023, 400000.00, 440000.00,
                5000.00, 1.25, "PAID", "2024-01-12",
                "County Tax Assessor Office", "PRC-20230" + property.getPropertyId()
        ));
        records.add(new PropertyTaxRecord(
                property, 2022, 375000.00, 415000.00,
                4688.00, 1.25, "PAID", "2023-01-20",
                "County Tax Assessor Office", "PRC-20220" + property.getPropertyId()
        ));
        records.add(new PropertyTaxRecord(
                property, 2021, 350000.00, 390000.00,
                4375.00, 1.25, "PAID", "2022-02-05",
                "County Tax Assessor Office", "PRC-20210" + property.getPropertyId()
        ));

        return records;
    }

    private List<PublicRecord> generateDummyPublicRecords(Property property) {
        List<PublicRecord> records = new ArrayList<>();

        records.add(new PublicRecord(
                property, "BUILDING_VIOLATION", "Minor Building Code Violation - Fence Height",
                "Fence on north boundary exceeds permitted height by 6 inches. Owner notified.",
                LocalDate.of(2023, 5, 10), LocalDate.of(2023, 8, 22),
                "RESOLVED", "City Building Department", "BV-2023-1045", "LOW"
        ));
        records.add(new PublicRecord(
                property, "LIEN", "HOA Assessment Lien",
                "Homeowners Association placed a lien due to unpaid quarterly dues for Q1 2024.",
                LocalDate.of(2024, 4, 1), null,
                "ACTIVE", "Maplewood HOA", "LIEN-2024-0312", "MEDIUM"
        ));

        return records;
    }
}
