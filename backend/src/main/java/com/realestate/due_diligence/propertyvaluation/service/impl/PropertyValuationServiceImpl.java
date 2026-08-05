package com.realestate.due_diligence.propertyvaluation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.realestate.due_diligence.comparableproperty.dto.ComparablePropertyResponse;
import com.realestate.due_diligence.comparableproperty.service.ComparablePropertyService;
import com.realestate.due_diligence.propertyvaluation.dto.PropertyValuationResponse;
import com.realestate.due_diligence.propertyvaluation.service.PropertyValuationService;

@Service
public class PropertyValuationServiceImpl
        implements PropertyValuationService {

    private final ComparablePropertyService comparablePropertyService;

    public PropertyValuationServiceImpl(
            ComparablePropertyService comparablePropertyService) {

        this.comparablePropertyService = comparablePropertyService;
    }

    @Override
    public PropertyValuationResponse getPropertyValuation(Long propertyId) {

        List<ComparablePropertyResponse> comparableProperties =
                comparablePropertyService.getComparableProperties(propertyId);

        PropertyValuationResponse response =
                new PropertyValuationResponse();

        response.setPropertyId(propertyId);

        response.setComparablePropertyCount(
                comparableProperties.size());

        int similarityScore;

        if (comparableProperties.size() >= 5) {

            similarityScore = 90;

        } else if (comparableProperties.size() >= 3) {

            similarityScore = 75;

        } else if (comparableProperties.size() >= 1) {

            similarityScore = 60;

        } else {

            similarityScore = 30;
        }

        response.setSimilarityScore(similarityScore);

        String remark;

        if (similarityScore >= 90) {

            remark = "Excellent comparable property availability.";

        } else if (similarityScore >= 75) {

            remark = "Good comparable property availability.";

        } else if (similarityScore >= 60) {

            remark = "Limited comparable property availability.";

        } else {

            remark = "Very few comparable properties found.";
        }

        response.setValuationRemark(remark);

        return response;
    }
}