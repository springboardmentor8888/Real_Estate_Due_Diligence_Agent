package com.realestate.due_diligence.integration.permit;

import java.util.List;

import com.realestate.due_diligence.permit.dto.PermitRecordResponse;

public interface PermitApiClient {

    List<PermitRecordResponse> fetchPermitRecords(Long propertyId);

}