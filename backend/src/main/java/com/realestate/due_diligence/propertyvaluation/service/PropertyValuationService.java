package com.realestate.due_diligence.propertyvaluation.service;

import com.realestate.due_diligence.propertyvaluation.dto.PropertyValuationResponse;

public interface PropertyValuationService {

    PropertyValuationResponse getPropertyValuation(Long propertyId);

}