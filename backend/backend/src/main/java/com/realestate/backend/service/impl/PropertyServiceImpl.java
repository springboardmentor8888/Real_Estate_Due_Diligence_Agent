package com.realestate.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.realestate.backend.entity.Property;
import com.realestate.backend.repository.PropertyRepository;
import com.realestate.backend.service.PropertyService;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    public Property saveProperty(Property property) {
        return propertyRepository.save(property);
    }

    @Override
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @Override
    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id).orElse(null);
    }

    @Override
    public Property updateProperty(Long id, Property property) {
        property.setId(id);
        return propertyRepository.save(property);
    }

    @Override
    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    @Override
    public List<Property> searchByCity(String city) {
        return propertyRepository.findByCity(city);
    }

    @Override
    public List<Property> searchByState(String state) {
        return propertyRepository.findByState(state);
    }

    @Override
    public List<Property> searchByPincode(String pincode) {
        return propertyRepository.findByPincode(pincode);
    }

    @Override
    public List<Property> searchByPropertyType(String propertyType) {
        return propertyRepository.findByPropertyType(propertyType);
    }
}