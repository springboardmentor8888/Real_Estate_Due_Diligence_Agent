package com.realestate.due_diligence.propertyvaluation.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class PropertyValuationResponse {

    private Long propertyId;

    private Integer comparablePropertyCount;

    private Integer similarityScore;

    private String valuationRemark;

    private BigDecimal currentMarketValue;

    private BigDecimal previousMarketValue;

    private BigDecimal growthPercentage;

    private List<ValueHistoryPoint> valueHistory;

    @Getter
    @Setter
    public static class ValueHistoryPoint {

        private Integer year;

        private BigDecimal marketValue;

        private String source;

        public ValueHistoryPoint() {
        }

        public ValueHistoryPoint(
                Integer year,
                BigDecimal marketValue,
                String source) {

            this.year = year;
            this.marketValue = marketValue;
            this.source = source;
        }
    }
}