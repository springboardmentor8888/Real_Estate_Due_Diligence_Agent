package com.infosys.realestate.service;

import com.infosys.realestate.dto.PropertyInformationResponse;

public interface PropertyInformationAggregationService {
    PropertyInformationResponse getAggregatedPropertyInformation(Long propertyId);
}
