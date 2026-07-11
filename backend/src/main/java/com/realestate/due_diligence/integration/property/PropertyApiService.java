package com.realestate.due_diligence.integration.property;

import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.mapper.PropertyMapper;
import com.realestate.due_diligence.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PropertyApiServiceImpl implements PropertyApiService {

    private final PropertyRepository propertyRepository;

    private final PropertyMapper propertyMapper;

    @Override
    public PropertyResponse fetchPropertyDetails(Long propertyId) {

        return propertyRepository.findById(propertyId)
                .map(propertyMapper::toResponse)
                .orElse(null);
    }
}