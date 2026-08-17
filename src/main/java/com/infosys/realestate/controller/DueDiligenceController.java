package com.infosys.realestate.controller;

import com.infosys.realestate.entity.DueDiligenceReport;
import com.infosys.realestate.service.PropertyDueDiligenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/due-diligence")
@CrossOrigin(origins = "*")
public class DueDiligenceController {

    @Autowired
    private PropertyDueDiligenceService dueDiligenceService;

    @PostMapping("/{propertyId}/process")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public DueDiligenceReport processDueDiligence(@PathVariable Long propertyId) {
        return dueDiligenceService.processDueDiligence(propertyId);
    }
}
