package com.infosys.realestate.service.impl;

import com.infosys.realestate.entity.Property;
import com.infosys.realestate.service.AddressValidationService;
import org.springframework.stereotype.Service;

@Service
public class AddressValidationServiceImpl implements AddressValidationService {

    @Override
    public boolean validateAddress(Property property) {
        if (property.getAddress() == null || property.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Address line cannot be empty");
        }
        if (property.getCity() == null || property.getCity().trim().isEmpty()) {
            throw new IllegalArgumentException("City cannot be empty");
        }
        if (property.getState() == null || property.getState().trim().isEmpty()) {
            throw new IllegalArgumentException("State cannot be empty");
        }
        if (property.getZipCode() == null || !property.getZipCode().matches("^[0-9]{5,6}$")) {
            throw new IllegalArgumentException("Invalid ZIP code format");
        }
        
        // Placeholder for external API integration (e.g., USPS, Google Maps)
        // If a real API key is configured, this would call out to verify the address.
        return true;
    }
}
