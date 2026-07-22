package com.realestate.due_diligence.floodzone.controller;

import com.realestate.due_diligence.floodzone.dto.FloodZoneInfoResponse;
import com.realestate.due_diligence.floodzone.service.FloodZoneInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flood-zones")
@RequiredArgsConstructor
public class FloodZoneInfoController {

    private final FloodZoneInfoService floodZoneInfoService;

    @GetMapping("/property/{propertyId}")
    public List<FloodZoneInfoResponse> getFloodZoneInfo(
            @PathVariable Long propertyId) {

        return floodZoneInfoService.getFloodZoneInfo(propertyId);
    }
}