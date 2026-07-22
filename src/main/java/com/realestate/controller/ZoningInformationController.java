package com.realestate.backend.controller;

import com.realestate.backend.entity.ZoningInformation;
import com.realestate.backend.service.ZoningInformationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zoning-information")
public class ZoningInformationController {

    @Autowired
    private ZoningInformationService zoningInformationService;

    @PostMapping
    public ZoningInformation saveZoningInformation(@RequestBody ZoningInformation zoningInformation) {
        return zoningInformationService.saveZoningInformation(zoningInformation);
    }

    @GetMapping
    public List<ZoningInformation> getAllZoningInformation() {
        return zoningInformationService.getAllZoningInformation();
    }

    @GetMapping("/{id}")
    public ZoningInformation getZoningInformationById(@PathVariable Long id) {
        return zoningInformationService.getZoningInformationById(id);
    }

    @PutMapping("/{id}")
    public ZoningInformation updateZoningInformation(
            @PathVariable Long id,
            @RequestBody ZoningInformation zoningInformation) {

        return zoningInformationService.updateZoningInformation(id, zoningInformation);
    }

    @DeleteMapping("/{id}")
    public void deleteZoningInformation(@PathVariable Long id) {
        zoningInformationService.deleteZoningInformation(id);
    }
}