package com.realestate.due_diligence.ownership.service;

import com.realestate.due_diligence.ownership.OwnershipRecord;
import com.realestate.due_diligence.ownership.dto.OwnershipRecordResponse;
import com.realestate.due_diligence.repository.OwnershipRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OwnershipRecordServiceImpl implements OwnershipRecordService {

    private final OwnershipRecordRepository ownershipRecordRepository;

    @Override
    public List<OwnershipRecordResponse> getOwnershipHistory(Long propertyId) {

        return ownershipRecordRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private OwnershipRecordResponse mapToResponse(OwnershipRecord record) {

        OwnershipRecordResponse response = new OwnershipRecordResponse();

        response.setId(record.getId());
        response.setOwnerName(record.getOwnerName());
        response.setPurchaseDate(record.getPurchaseDate());
        response.setPurchasePrice(record.getPurchasePrice());

        return response;
    }
}