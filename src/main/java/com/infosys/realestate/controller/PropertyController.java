package com.infosys.realestate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.infosys.realestate.entity.Property;
import com.infosys.realestate.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
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
    @PreAuthorize("hasAuthority('ADMIN')")
    public Property updateProperty(@PathVariable Long id,
                                   @Valid @RequestBody Property property) {
        return propertyService.updateProperty(id, property);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
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
    public List<Property> searchByZipCode(@PathVariable String pincode) {
        return propertyService.searchByZipCode(pincode);
    }

    @GetMapping("/search/type/{propertyType}")
    public List<Property> searchByPropertyType(@PathVariable String propertyType) {
        return propertyService.searchByPropertyType(propertyType);
    }
}
