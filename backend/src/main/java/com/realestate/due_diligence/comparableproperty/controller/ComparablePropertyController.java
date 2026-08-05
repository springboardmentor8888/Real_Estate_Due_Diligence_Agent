package com.realestate.due_diligence.comparableproperty.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realestate.due_diligence.comparableproperty.dto.ComparablePropertyResponse;
import com.realestate.due_diligence.comparableproperty.service.ComparablePropertyService;

@RestController
@RequestMapping("/api/properties")
public class ComparablePropertyController {

    private final ComparablePropertyService comparablePropertyService;

    public ComparablePropertyController(
            ComparablePropertyService comparablePropertyService) {

        this.comparablePropertyService = comparablePropertyService;
    }

    @GetMapping("/{propertyId}/comparables")
    public List<ComparablePropertyResponse> getComparableProperties(
            @PathVariable Long propertyId) {

        return comparablePropertyService.getComparableProperties(propertyId);
    }
}