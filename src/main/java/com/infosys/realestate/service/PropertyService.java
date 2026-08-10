package com.infosys.realestate.service;

import java.util.List;
import com.infosys.realestate.entity.Property;

public interface PropertyService {

    Property saveProperty(Property property);

    List<Property> getAllProperties();

    Property getPropertyById(Long id);

    Property updateProperty(Long id, Property property);

    void deleteProperty(Long id);

    List<Property> searchByCity(String city);

    List<Property> searchByState(String state);

    List<Property> searchByZipCode(String zipCode);

    List<Property> searchByPropertyType(String propertyType);
}
