package com.infosys.realestate.dto;

import com.infosys.realestate.entity.OwnershipRecord;
import com.infosys.realestate.entity.PropertyTaxRecord;
import com.infosys.realestate.entity.PublicRecord;

import java.util.List;

public class PublicRecordsReportResponse {

    private Long propertyId;
    private String propertyAddress;
    private String propertyCity;
    private String propertyState;
    private String propertyZipCode;
    private String overallRiskFlag; // CLEAR, CONCERNS_FOUND, HIGH_RISK

    private List<OwnershipRecord> ownershipHistory;
    private List<PropertyTaxRecord> taxHistory;
    private List<PublicRecord> publicRecords;

    private int totalOwnershipRecords;
    private int totalTaxRecords;
    private int totalPublicRecords;
    private int activePublicRecordsCount;

    public PublicRecordsReportResponse() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPropertyAddress() { return propertyAddress; }
    public void setPropertyAddress(String propertyAddress) { this.propertyAddress = propertyAddress; }

    public String getPropertyCity() { return propertyCity; }
    public void setPropertyCity(String propertyCity) { this.propertyCity = propertyCity; }

    public String getPropertyState() { return propertyState; }
    public void setPropertyState(String propertyState) { this.propertyState = propertyState; }

    public String getPropertyZipCode() { return propertyZipCode; }
    public void setPropertyZipCode(String propertyZipCode) { this.propertyZipCode = propertyZipCode; }

    public String getOverallRiskFlag() { return overallRiskFlag; }
    public void setOverallRiskFlag(String overallRiskFlag) { this.overallRiskFlag = overallRiskFlag; }

    public List<OwnershipRecord> getOwnershipHistory() { return ownershipHistory; }
    public void setOwnershipHistory(List<OwnershipRecord> ownershipHistory) { this.ownershipHistory = ownershipHistory; }

    public List<PropertyTaxRecord> getTaxHistory() { return taxHistory; }
    public void setTaxHistory(List<PropertyTaxRecord> taxHistory) { this.taxHistory = taxHistory; }

    public List<PublicRecord> getPublicRecords() { return publicRecords; }
    public void setPublicRecords(List<PublicRecord> publicRecords) { this.publicRecords = publicRecords; }

    public int getTotalOwnershipRecords() { return totalOwnershipRecords; }
    public void setTotalOwnershipRecords(int totalOwnershipRecords) { this.totalOwnershipRecords = totalOwnershipRecords; }

    public int getTotalTaxRecords() { return totalTaxRecords; }
    public void setTotalTaxRecords(int totalTaxRecords) { this.totalTaxRecords = totalTaxRecords; }

    public int getTotalPublicRecords() { return totalPublicRecords; }
    public void setTotalPublicRecords(int totalPublicRecords) { this.totalPublicRecords = totalPublicRecords; }

    public int getActivePublicRecordsCount() { return activePublicRecordsCount; }
    public void setActivePublicRecordsCount(int activePublicRecordsCount) { this.activePublicRecordsCount = activePublicRecordsCount; }
}
