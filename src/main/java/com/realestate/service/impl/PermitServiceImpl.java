package com.realestate.service.impl;

import com.realestate.entity.Permit;
import com.realestate.repository.PermitRepository;
import com.realestate.service.PermitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermitServiceImpl implements PermitService {

    @Autowired
    private PermitRepository permitRepository;

    @Override
    public Permit savePermit(Permit permit) {
        return permitRepository.save(permit);
    }

    @Override
    public List<Permit> getAllPermits() {
        return permitRepository.findAll();
    }

    @Override
    public Permit getPermitById(Long id) {
        return permitRepository.findById(id).orElse(null);
    }

    @Override
    public List<Permit> getPermitsByPropertyAddress(String propertyAddress) {
        return permitRepository.findByPropertyAddress(propertyAddress);
    }

    @Override
    public void deletePermit(Long id) {
        permitRepository.deleteById(id);
    }
}