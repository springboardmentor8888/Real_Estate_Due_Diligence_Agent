package com.realestate.due_diligence.integration.address;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import com.realestate.due_diligence.property.dto.AddressValidationRequest;
import com.realestate.due_diligence.property.dto.AddressValidationResponse;

@Service
public class AddressValidationServiceImpl implements AddressValidationService {

    @Override
    @Retryable(
            retryFor = Exception.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000)
    )
    public AddressValidationResponse validateAddress(AddressValidationRequest request) {

        /*
         * Future implementation:
         *
         * Call external Address Validation API
         * using RestTemplate / WebClient / OpenFeign.
         */

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

    @Recover
    public AddressValidationResponse recover(Exception ex,
                                             AddressValidationRequest request) {

        AddressValidationResponse response = new AddressValidationResponse();

        response.setValid(false);
        response.setNormalizedAddress(null);
        response.setMessage(
                "Address validation service is currently unavailable. Please try again later.");

        return response;
    }
}