package com.realestate.due_diligence.permit.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.realestate.due_diligence.permit.PermitRecord;
import com.realestate.due_diligence.permit.dto.PermitRecordResponse;
import com.realestate.due_diligence.repository.PermitRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermitRecordServiceImpl
        implements PermitRecordService {

    private final PermitRecordRepository repository;

    @Override
    public List<PermitRecordResponse> getPermitRecords(Long propertyId) {

        return repository.findByPropertyId(propertyId)
                .stream()
                .map(this::convert)
                .toList();
    }

    private PermitRecordResponse convert(PermitRecord permit) {

        PermitRecordResponse response =
                new PermitRecordResponse();

        response.setId(permit.getId());
        response.setPropertyId(permit.getPropertyId());
        response.setPermitNumber(permit.getPermitNumber());
        response.setPermitType(permit.getPermitType());
        response.setStatus(permit.getStatus());
        response.setIssueDate(permit.getIssueDate());

        return response;
    }
}