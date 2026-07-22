package com.realestate.backend.service.impl;

import com.realestate.backend.entity.FloodZone;
import com.realestate.backend.repository.FloodZoneRepository;
import com.realestate.backend.service.FloodZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FloodZoneServiceImpl implements FloodZoneService {

    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Override
    public FloodZone saveFloodZone(FloodZone floodZone) {
        return floodZoneRepository.save(floodZone);
    }

    @Override
    public List<FloodZone> getAllFloodZones() {
        return floodZoneRepository.findAll();
    }

    @Override
    public FloodZone getFloodZoneById(Long id) {
        return floodZoneRepository.findById(id).orElse(null);
    }

    @Override
    public FloodZone updateFloodZone(Long id, FloodZone floodZone) {
        floodZone.setId(id);
        return floodZoneRepository.save(floodZone);
    }

    @Override
    public void deleteFloodZone(Long id) {
        floodZoneRepository.deleteById(id);
    }
}