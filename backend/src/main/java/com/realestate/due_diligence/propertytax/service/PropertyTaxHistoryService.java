package com.realestate.due_diligence.propertytax.service;

import com.realestate.due_diligence.propertytax.dto.PropertyTaxHistoryResponse;

import java.util.List;

public interface PropertyTaxHistoryService {

    List<PropertyTaxHistoryResponse> getTaxHistory(Long propertyId);
}