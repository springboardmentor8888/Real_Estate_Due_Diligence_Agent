package com.realestate.due_diligence.environment.service;

import com.realestate.due_diligence.environment.EnvironmentalRecord;
import com.realestate.due_diligence.environment.dto.EnvironmentalRecordResponse;
import com.realestate.due_diligence.repository.EnvironmentalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnvironmentalRecordServiceImpl
        implements EnvironmentalRecordService {

    private final EnvironmentalRecordRepository environmentalRecordRepository;

    @Override
    public List<EnvironmentalRecordResponse> getEnvironmentalRecords(Long propertyId) {

        return environmentalRecordRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private EnvironmentalRecordResponse mapToResponse(EnvironmentalRecord record) {

        EnvironmentalRecordResponse response = new EnvironmentalRecordResponse();

        response.setId(record.getId());
        response.setRecordType(record.getRecordType());
        response.setRiskLevel(record.getRiskLevel());
        response.setDescription(record.getDescription());

        return response;
    }
}