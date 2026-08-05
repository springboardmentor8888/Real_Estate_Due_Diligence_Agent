package com.realestate.due_diligence.propertyvaluation.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realestate.due_diligence.propertyvaluation.dto.PropertyValuationResponse;
import com.realestate.due_diligence.propertyvaluation.service.PropertyValuationService;

@RestController
@RequestMapping("/api/properties")
public class PropertyValuationController {

    private final PropertyValuationService propertyValuationService;

    public PropertyValuationController(
            PropertyValuationService propertyValuationService) {

        this.propertyValuationService = propertyValuationService;
    }

    @GetMapping("/{propertyId}/valuation")
    public PropertyValuationResponse getPropertyValuation(
            @PathVariable Long propertyId) {

        return propertyValuationService.getPropertyValuation(propertyId);
    }
}