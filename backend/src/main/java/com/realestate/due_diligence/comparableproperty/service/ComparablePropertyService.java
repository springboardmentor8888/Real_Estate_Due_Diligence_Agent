package com.realestate.due_diligence.comparableproperty.service;

import java.util.List;

import com.realestate.due_diligence.comparableproperty.dto.ComparablePropertyResponse;

public interface ComparablePropertyService {

    List<ComparablePropertyResponse> getComparableProperties(Long propertyId);

}