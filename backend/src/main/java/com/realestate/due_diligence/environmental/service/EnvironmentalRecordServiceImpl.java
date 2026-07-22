package com.realestate.due_diligence.environmental.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.realestate.due_diligence.environmental.EnvironmentalRecord;
import com.realestate.due_diligence.environmental.dto.EnvironmentalRecordResponse;
import com.realestate.due_diligence.repository.EnvironmentalRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnvironmentalRecordServiceImpl
        implements EnvironmentalRecordService {

    private final EnvironmentalRecordRepository repository;

    @Override
    public List<EnvironmentalRecordResponse> getEnvironmentalRecords(Long propertyId) {

        return repository.findByPropertyId(propertyId)
                .stream()
                .map(this::convert)
                .toList();
    }

    private EnvironmentalRecordResponse convert(EnvironmentalRecord record) {

        EnvironmentalRecordResponse response =
                new EnvironmentalRecordResponse();

        response.setId(record.getId());
        response.setPropertyId(record.getPropertyId());
        response.setEnvironmentalRisk(record.getEnvironmentalRisk());
        response.setContaminationLevel(record.getContaminationLevel());
        response.setRemarks(record.getRemarks());

        return response;
    }
}