package com.realestate.due_diligence.integration.address;

import com.realestate.due_diligence.property.dto.AddressValidationRequest;
import com.realestate.due_diligence.property.dto.AddressValidationResponse;

public interface AddressValidationService {

    AddressValidationResponse validateAddress(AddressValidationRequest request);

}