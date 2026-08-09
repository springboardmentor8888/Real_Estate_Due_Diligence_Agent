package com.realestate.due_diligence.propertyvaluation.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestate.due_diligence.comparableproperty.dto.ComparablePropertyResponse;
import com.realestate.due_diligence.comparableproperty.service.ComparablePropertyService;
import com.realestate.due_diligence.propertyvaluation.PropertyValuationHistory;
import com.realestate.due_diligence.propertyvaluation.dto.PropertyValuationResponse;
import com.realestate.due_diligence.propertyvaluation.service.PropertyValuationService;
import com.realestate.due_diligence.repository.PropertyValuationHistoryRepository;

@Service
public class PropertyValuationServiceImpl
        implements PropertyValuationService {

    private final ComparablePropertyService comparablePropertyService;

    private final PropertyValuationHistoryRepository valuationHistoryRepository;

    public PropertyValuationServiceImpl(
            ComparablePropertyService comparablePropertyService,
            PropertyValuationHistoryRepository valuationHistoryRepository) {

        this.comparablePropertyService = comparablePropertyService;
        this.valuationHistoryRepository = valuationHistoryRepository;
    }

    @Override
    public PropertyValuationResponse getPropertyValuation(Long propertyId) {

        // Get comparable properties
        List<ComparablePropertyResponse> comparableProperties =
                comparablePropertyService.getComparableProperties(propertyId);

        // Get valuation history from database
        List<PropertyValuationHistory> valuationHistory =
                valuationHistoryRepository
                        .findByPropertyIdOrderByValuationYearAsc(propertyId);

        PropertyValuationResponse response =
                new PropertyValuationResponse();

        // Property ID
        response.setPropertyId(propertyId);

        // =====================================================
        // COMPARABLE PROPERTY COUNT
        // =====================================================

        response.setComparablePropertyCount(
                comparableProperties.size()
        );

        // =====================================================
        // SIMILARITY SCORE
        // =====================================================

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

        // =====================================================
        // VALUATION REMARK
        // =====================================================

        String remark;

        if (similarityScore >= 90) {

            remark =
                    "Excellent comparable property availability.";

        } else if (similarityScore >= 75) {

            remark =
                    "Good comparable property availability.";

        } else if (similarityScore >= 60) {

            remark =
                    "Limited comparable property availability.";

        } else {

            remark =
                    "Very few comparable properties found.";
        }

        response.setValuationRemark(remark);

        // =====================================================
        // CURRENT MARKET VALUE
        // =====================================================

        if (!valuationHistory.isEmpty()) {

            PropertyValuationHistory latest =
                    valuationHistory.get(
                            valuationHistory.size() - 1
                    );

            response.setCurrentMarketValue(
                    latest.getMarketValue()
            );
        }

        // =====================================================
        // PREVIOUS MARKET VALUE
        // =====================================================

        if (valuationHistory.size() >= 2) {

            PropertyValuationHistory previous =
                    valuationHistory.get(
                            valuationHistory.size() - 2
                    );

            response.setPreviousMarketValue(
                    previous.getMarketValue()
            );
        }

        // =====================================================
        // VALUE HISTORY
        // =====================================================

        List<PropertyValuationResponse.ValueHistoryPoint>
                valueHistory =
                valuationHistory.stream()
                        .map(item ->
                                new PropertyValuationResponse.ValueHistoryPoint(
                                        item.getValuationYear(),
                                        item.getMarketValue(),
                                        item.getSource()
                                )
                        )
                        .toList();

        response.setValueHistory(valueHistory);

        // =====================================================
        // GROWTH PERCENTAGE
        // =====================================================

        if (valuationHistory.size() >= 2) {

            BigDecimal previousValue =
                    valuationHistory
                            .get(valuationHistory.size() - 2)
                            .getMarketValue();

            BigDecimal currentValue =
                    valuationHistory
                            .get(valuationHistory.size() - 1)
                            .getMarketValue();

            if (previousValue != null
                    && currentValue != null
                    && previousValue.compareTo(BigDecimal.ZERO) > 0) {

                BigDecimal growth =
                        currentValue
                                .subtract(previousValue)
                                .multiply(BigDecimal.valueOf(100))
                                .divide(
                                        previousValue,
                                        2,
                                        java.math.RoundingMode.HALF_UP
                                );

                response.setGrowthPercentage(growth);
            }
        }

        return response;
    }
}