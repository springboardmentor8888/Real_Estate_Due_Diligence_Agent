package com.realestate.due_diligence.environment.service;

import com.realestate.due_diligence.environment.dto.EnvironmentalRecordResponse;

import java.util.List;

public interface EnvironmentalRecordService {

    List<EnvironmentalRecordResponse> getEnvironmentalRecords(Long propertyId);
}