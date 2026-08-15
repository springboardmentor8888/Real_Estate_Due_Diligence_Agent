package com.realestate.due_diligence.propertyhistory.service;

import com.realestate.due_diligence.propertyhistory.PropertyHistory;
import com.realestate.due_diligence.propertyhistory.dto.PropertyHistoryResponse;
import com.realestate.due_diligence.repository.PropertyHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyHistoryServiceImpl implements PropertyHistoryService {

    private final PropertyHistoryRepository propertyHistoryRepository;

    @Override
    public List<PropertyHistoryResponse> getPropertyHistory(Long propertyId) {

        return propertyHistoryRepository
                .findByPropertyIdOrderByEventDateDesc(propertyId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private PropertyHistoryResponse convertToResponse(PropertyHistory history) {

        PropertyHistoryResponse response = new PropertyHistoryResponse();

        response.setId(history.getId());
        response.setEventType(history.getEventType());
        response.setEventDate(history.getEventDate());
        response.setDescription(history.getDescription());

        return response;
    }
}