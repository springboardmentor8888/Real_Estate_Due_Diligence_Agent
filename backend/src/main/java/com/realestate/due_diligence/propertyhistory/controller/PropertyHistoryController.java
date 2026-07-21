package com.realestate.due_diligence.propertyhistory.controller;

import com.realestate.due_diligence.propertyhistory.dto.PropertyHistoryResponse;
import com.realestate.due_diligence.propertyhistory.service.PropertyHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/property-history")
@RequiredArgsConstructor
public class PropertyHistoryController {

    private final PropertyHistoryService propertyHistoryService;

    @GetMapping("/{propertyId}")
    public List<PropertyHistoryResponse> getPropertyHistory(
            @PathVariable Long propertyId) {

        return propertyHistoryService.getPropertyHistory(propertyId);
    }
}