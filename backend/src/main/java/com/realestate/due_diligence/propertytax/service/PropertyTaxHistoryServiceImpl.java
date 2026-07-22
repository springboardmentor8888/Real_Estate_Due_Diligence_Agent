package com.realestate.due_diligence.propertytax.service;

import com.realestate.due_diligence.propertytax.PropertyTaxHistory;
import com.realestate.due_diligence.propertytax.dto.PropertyTaxHistoryResponse;
import com.realestate.due_diligence.repository.PropertyTaxHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyTaxHistoryServiceImpl implements PropertyTaxHistoryService {

    private final PropertyTaxHistoryRepository propertyTaxHistoryRepository;

    @Override
    public List<PropertyTaxHistoryResponse> getTaxHistory(Long propertyId) {

        return propertyTaxHistoryRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PropertyTaxHistoryResponse mapToResponse(PropertyTaxHistory tax) {

        PropertyTaxHistoryResponse response = new PropertyTaxHistoryResponse();

        response.setId(tax.getId());
        response.setTaxYear(tax.getTaxYear());
        response.setTaxAmount(tax.getTaxAmount());
        response.setPaymentStatus(tax.getPaymentStatus());

        return response;
    }
}