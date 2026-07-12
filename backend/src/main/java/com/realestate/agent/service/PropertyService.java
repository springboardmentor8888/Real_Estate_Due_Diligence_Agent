package com.realestate.agent.service;

import com.realestate.agent.dto.PropertyCreateRequest;
import com.realestate.agent.dto.PropertyResponse;
import com.realestate.agent.dto.PropertySearchCriteria;
import org.springframework.data.domain.Page;

public interface PropertyService {

    PropertyResponse createProperty(PropertyCreateRequest request, String userEmail);

    Page<PropertyResponse> searchProperties(PropertySearchCriteria criteria);

    PropertyResponse getPropertyById(Long id);
}
