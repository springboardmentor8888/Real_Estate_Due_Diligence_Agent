package com.realestate.due_diligence.permit.controller;

import com.realestate.due_diligence.permit.dto.BuildingPermitResponse;
import com.realestate.due_diligence.permit.service.BuildingPermitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permits")
@RequiredArgsConstructor
public class BuildingPermitController {

    private final BuildingPermitService buildingPermitService;

    @GetMapping("/property/{propertyId}")
    public List<BuildingPermitResponse> getPermitHistory(
            @PathVariable Long propertyId) {

        return buildingPermitService.getPermitHistory(propertyId);
    }
}