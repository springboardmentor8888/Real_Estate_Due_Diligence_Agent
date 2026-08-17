package com.infosys.realestate.service;

import com.infosys.realestate.dto.PublicRecordsReportResponse;
import com.infosys.realestate.entity.OwnershipRecord;
import com.infosys.realestate.entity.PropertyTaxRecord;
import com.infosys.realestate.entity.PublicRecord;

import java.util.List;

public interface PublicRecordsService {

    List<OwnershipRecord> getOwnershipHistory(Long propertyId);

    List<PropertyTaxRecord> getTaxHistory(Long propertyId);

    List<PublicRecord> getPublicRecords(Long propertyId);

    PublicRecordsReportResponse getCombinedPublicRecordsReport(Long propertyId);
}
