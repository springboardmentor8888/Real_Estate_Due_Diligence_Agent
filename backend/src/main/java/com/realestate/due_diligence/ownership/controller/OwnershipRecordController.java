package com.realestate.due_diligence.ownership.controller;

import com.realestate.due_diligence.ownership.dto.OwnershipRecordResponse;
import com.realestate.due_diligence.ownership.service.OwnershipRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ownership")
@RequiredArgsConstructor
public class OwnershipRecordController {

    private final OwnershipRecordService ownershipRecordService;

    @GetMapping("/property/{propertyId}")
    public List<OwnershipRecordResponse> getOwnershipHistory(
            @PathVariable Long propertyId) {

        return ownershipRecordService.getOwnershipHistory(propertyId);
    }
}