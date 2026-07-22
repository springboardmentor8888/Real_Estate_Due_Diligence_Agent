package com.realestate.due_diligence.propertytax.controller;

import com.realestate.due_diligence.propertytax.dto.PropertyTaxHistoryResponse;
import com.realestate.due_diligence.propertytax.service.PropertyTaxHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/property-tax")
@RequiredArgsConstructor
public class PropertyTaxHistoryController {

    private final PropertyTaxHistoryService propertyTaxHistoryService;

    @GetMapping("/property/{propertyId}")
    public List<PropertyTaxHistoryResponse> getTaxHistory(
            @PathVariable Long propertyId) {

        return propertyTaxHistoryService.getTaxHistory(propertyId);
    }
}