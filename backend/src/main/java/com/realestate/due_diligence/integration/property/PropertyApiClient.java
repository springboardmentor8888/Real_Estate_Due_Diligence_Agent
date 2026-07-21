package com.realestate.due_diligence.integration.property;

import com.realestate.due_diligence.property.dto.PropertyResponse;

public interface PropertyApiClient {

    PropertyResponse fetchProperty(Long propertyId);

}