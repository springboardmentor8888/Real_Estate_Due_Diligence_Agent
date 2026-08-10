package com.infosys.realestate.service;

import com.infosys.realestate.entity.Property;

public interface AddressValidationService {
    boolean validateAddress(Property property);
}
