package com.realestate.backend.service.impl;

import com.realestate.backend.entity.ZoningInformation;
import com.realestate.backend.repository.ZoningInformationRepository;
import com.realestate.backend.service.ZoningInformationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoningInformationServiceImpl implements ZoningInformationService {

    @Autowired
    private ZoningInformationRepository zoningInformationRepository;

    @Override
    public ZoningInformation saveZoningInformation(ZoningInformation zoningInformation) {
        return zoningInformationRepository.save(zoningInformation);
    }

    @Override
    public List<ZoningInformation> getAllZoningInformation() {
        return zoningInformationRepository.findAll();
    }

    @Override
    public ZoningInformation getZoningInformationById(Long id) {
        return zoningInformationRepository.findById(id).orElse(null);
    }

    @Override
    public ZoningInformation updateZoningInformation(Long id, ZoningInformation zoningInformation) {
        zoningInformation.setId(id);
        return zoningInformationRepository.save(zoningInformation);
    }

    @Override
    public void deleteZoningInformation(Long id) {
        zoningInformationRepository.deleteById(id);
    }
}