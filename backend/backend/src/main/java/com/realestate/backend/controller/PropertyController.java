package com.realestate.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.realestate.backend.entity.Property;
import com.realestate.backend.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping
    public Property saveProperty(@Valid @RequestBody Property property) {
        return propertyService.saveProperty(property);
    }

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties();
    }

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

    @PutMapping("/{id}")
    public Property updateProperty(@PathVariable Long id,
                                   @Valid @RequestBody Property property) {
        return propertyService.updateProperty(id, property);
    }

    @DeleteMapping("/{id}")
    public void deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
    }

    @GetMapping("/search/city/{city}")
    public List<Property> searchByCity(@PathVariable String city) {
        return propertyService.searchByCity(city);
    }

    @GetMapping("/search/state/{state}")
    public List<Property> searchByState(@PathVariable String state) {
        return propertyService.searchByState(state);
    }

    @GetMapping("/search/pincode/{pincode}")
    public List<Property> searchByPincode(@PathVariable String pincode) {
        return propertyService.searchByPincode(pincode);
    }

    @GetMapping("/search/type/{propertyType}")
    public List<Property> searchByPropertyType(@PathVariable String propertyType) {
        return propertyService.searchByPropertyType(propertyType);
    }
}