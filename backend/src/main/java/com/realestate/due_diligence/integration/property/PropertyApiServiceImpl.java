package com.realestate.due_diligence.integration.property;

import java.util.Optional;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import com.realestate.due_diligence.property.Property;
import com.realestate.due_diligence.property.dto.PropertyResponse;
import com.realestate.due_diligence.property.mapper.PropertyMapper;
import com.realestate.due_diligence.repository.PropertyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyApiServiceImpl implements PropertyApiService {

    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;

    @Override
    @Retryable(
            retryFor = Exception.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000)
    )
    public PropertyResponse fetchPropertyDetails(Long propertyId) {

        /*
         * Future enhancement:
         * Replace this section with an external Property API call.
         * Example:
         * PropertyResponse apiResponse = externalClient.fetch(propertyId);
         * Save apiResponse into database.
         */

        Optional<Property> propertyOptional =
                propertyRepository.findById(propertyId);

        if (propertyOptional.isEmpty()) {
            return null;
        }

        Property property = propertyOptional.get();

        return propertyMapper.toResponse(property);
    }

    @Recover
    public PropertyResponse recover(Exception ex, Long propertyId) {

        System.err.println("Failed to retrieve property details after retries: "
                + ex.getMessage());

        return null;
    }
}