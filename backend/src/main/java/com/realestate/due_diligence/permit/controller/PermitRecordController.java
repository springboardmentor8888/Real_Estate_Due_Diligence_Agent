package com.realestate.due_diligence.permit.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realestate.due_diligence.permit.dto.PermitRecordResponse;
import com.realestate.due_diligence.permit.service.PermitRecordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/permits")
@RequiredArgsConstructor
public class PermitRecordController {

    private final PermitRecordService permitRecordService;

    @GetMapping("/{propertyId}")
    public List<PermitRecordResponse> getPermitRecords(
            @PathVariable Long propertyId) {

        return permitRecordService.getPermitRecords(propertyId);
    }
}