package com.realestate.due_diligence.permit.service;

import java.util.List;

import com.realestate.due_diligence.permit.dto.PermitRecordResponse;

public interface PermitRecordService {

    List<PermitRecordResponse> getPermitRecords(Long propertyId);

}