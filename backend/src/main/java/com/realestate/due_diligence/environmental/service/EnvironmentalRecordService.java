package com.realestate.due_diligence.environmental.service;

import java.util.List;

import com.realestate.due_diligence.environmental.dto.EnvironmentalRecordResponse;

public interface EnvironmentalRecordService {

    List<EnvironmentalRecordResponse> getEnvironmentalRecords(Long propertyId);

}