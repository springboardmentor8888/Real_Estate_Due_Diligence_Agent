package com.realestate.due_diligence.zoning.controller;

import com.realestate.due_diligence.zoning.dto.ZoningInfoResponse;
import com.realestate.due_diligence.zoning.service.ZoningInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zoning")
@RequiredArgsConstructor
public class ZoningInfoController {

    private final ZoningInfoService zoningInfoService;

    @GetMapping("/property/{propertyId}")
    public List<ZoningInfoResponse> getZoningInfo(
            @PathVariable Long propertyId) {

        return zoningInfoService.getZoningInfo(propertyId);
    }
}