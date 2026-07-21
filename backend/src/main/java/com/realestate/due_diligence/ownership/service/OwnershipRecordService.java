package com.realestate.due_diligence.ownership.service;

import com.realestate.due_diligence.ownership.dto.OwnershipRecordResponse;

import java.util.List;

public interface OwnershipRecordService {

    List<OwnershipRecordResponse> getOwnershipHistory(Long propertyId);
}