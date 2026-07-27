package com.realestate.backend.controller;

import com.realestate.backend.entity.FloodZone;
import com.realestate.backend.service.FloodZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flood-zones")
public class FloodZoneController {

    @Autowired
    private FloodZoneService floodZoneService;

    @PostMapping
    public FloodZone saveFloodZone(@RequestBody FloodZone floodZone) {
        return floodZoneService.saveFloodZone(floodZone);
    }

    @GetMapping
    public List<FloodZone> getAllFloodZones() {
        return floodZoneService.getAllFloodZones();
    }

    @GetMapping("/{id}")
    public FloodZone getFloodZoneById(@PathVariable Long id) {
        return floodZoneService.getFloodZoneById(id);
    }

    @PutMapping("/{id}")
    public FloodZone updateFloodZone(@PathVariable Long id,
                                     @RequestBody FloodZone floodZone) {
        return floodZoneService.updateFloodZone(id, floodZone);
    }

    @DeleteMapping("/{id}")
    public void deleteFloodZone(@PathVariable Long id) {
        floodZoneService.deleteFloodZone(id);
    }
}