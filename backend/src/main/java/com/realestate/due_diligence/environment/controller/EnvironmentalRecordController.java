package com.realestate.due_diligence.environment.controller;

import com.realestate.due_diligence.environment.dto.EnvironmentalRecordResponse;
import com.realestate.due_diligence.environment.service.EnvironmentalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/environment")
@RequiredArgsConstructor
public class EnvironmentalRecordController {

    private final EnvironmentalRecordService environmentalRecordService;

    @GetMapping("/property/{propertyId}")
    public List<EnvironmentalRecordResponse> getEnvironmentalRecords(
            @PathVariable Long propertyId) {

        return environmentalRecordService.getEnvironmentalRecords(propertyId);
    }
}