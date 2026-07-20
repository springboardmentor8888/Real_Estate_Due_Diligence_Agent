package com.realestate.service.impl;

import com.realestate.entity.EnvironmentalRecord;
import com.realestate.repository.EnvironmentalRecordRepository;
import com.realestate.service.EnvironmentalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnvironmentalRecordServiceImpl implements EnvironmentalRecordService {

    @Autowired
    private EnvironmentalRecordRepository environmentalRecordRepository;

    @Override
    public EnvironmentalRecord saveRecord(EnvironmentalRecord record) {
        return environmentalRecordRepository.save(record);
    }

    @Override
    public List<EnvironmentalRecord> getAllRecords() {
        return environmentalRecordRepository.findAll();
    }

    @Override
    public EnvironmentalRecord getRecordById(Long id) {
        return environmentalRecordRepository.findById(id).orElse(null);
    }

    @Override
    public List<EnvironmentalRecord> getRecordsByPropertyAddress(String propertyAddress) {
        return environmentalRecordRepository.findByPropertyAddress(propertyAddress);
    }

    @Override
    public void deleteRecord(Long id) {
        environmentalRecordRepository.deleteById(id);
    }
}