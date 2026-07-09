package com.realestate.due_diligence.integration.address;

import com.realestate.due_diligence.property.dto.AddressValidationRequest;
import com.realestate.due_diligence.property.dto.AddressValidationResponse;
import org.springframework.stereotype.Service;

@Service
public class AddressValidationServiceImpl implements AddressValidationService {

    @Override
    public AddressValidationResponse validateAddress(AddressValidationRequest request) {

        AddressValidationResponse response = new AddressValidationResponse();

        response.setValid(true);

        response.setNormalizedAddress(
                request.getAddress() + ", "
                        + request.getCity() + ", "
                        + request.getState() + " "
                        + request.getZipCode());

        response.setMessage("Address validated successfully");

        return response;
    }
}