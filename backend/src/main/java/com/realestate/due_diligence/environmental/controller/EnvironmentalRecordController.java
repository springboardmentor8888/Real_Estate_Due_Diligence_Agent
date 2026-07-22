package com.realestate.due_diligence.environmental.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realestate.due_diligence.environmental.dto.EnvironmentalRecordResponse;
import com.realestate.due_diligence.environmental.service.EnvironmentalRecordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/environmental")
@RequiredArgsConstructor
public class EnvironmentalRecordController {

    private final EnvironmentalRecordService environmentalRecordService;

    @GetMapping("/{propertyId}")
    public List<EnvironmentalRecordResponse> getEnvironmentalRecords(
            @PathVariable Long propertyId) {

        return environmentalRecordService.getEnvironmentalRecords(propertyId);
    }
}