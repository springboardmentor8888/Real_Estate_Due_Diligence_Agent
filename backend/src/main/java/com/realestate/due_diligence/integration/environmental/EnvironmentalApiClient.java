package com.realestate.due_diligence.integration.environmental;

import java.util.List;

import com.realestate.due_diligence.environmental.dto.EnvironmentalRecordResponse;

public interface EnvironmentalApiClient {

    List<EnvironmentalRecordResponse> fetchEnvironmentalRecords(Long propertyId);

}