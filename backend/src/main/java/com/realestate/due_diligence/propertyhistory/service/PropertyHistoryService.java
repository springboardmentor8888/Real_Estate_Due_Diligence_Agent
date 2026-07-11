package com.realestate.due_diligence.propertyhistory.service;

import com.realestate.due_diligence.propertyhistory.dto.PropertyHistoryResponse;

import java.util.List;

public interface PropertyHistoryService {

    List<PropertyHistoryResponse> getPropertyHistory(Long propertyId);

}