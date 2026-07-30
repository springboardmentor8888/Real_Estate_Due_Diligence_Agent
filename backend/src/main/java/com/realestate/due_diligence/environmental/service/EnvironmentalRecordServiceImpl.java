package com.realestate.due_diligence.environmental.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.realestate.due_diligence.environmental.EnvironmentalRecord;
import com.realestate.due_diligence.environmental.dto.EnvironmentalRecordResponse;
import com.realestate.due_diligence.repository.EnvironmentalRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnvironmentalRecordServiceImpl implements EnvironmentalRecordService {

    private final EnvironmentalRecordRepository repository;

    @Override
    public List<EnvironmentalRecordResponse> getEnvironmentalRecords(Long propertyId) {

        return repository.findByPropertyId(propertyId)
                .stream()
                .map(this::convert)
                .toList();
    }

    private EnvironmentalRecordResponse convert(EnvironmentalRecord record) {

        EnvironmentalRecordResponse response = new EnvironmentalRecordResponse();

        response.setId(record.getId());
        if (record.getProperty() != null) {
            response.setPropertyId(record.getProperty().getId());
        }
        response.setEnvironmentalRisk(record.getRiskLevel());
        response.setContaminationLevel(record.getRecordType());
        response.setRemarks(record.getDescription());

        return response;
    }
}
