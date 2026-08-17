package com.infosys.realestate.service;

import com.infosys.realestate.dto.PropertyAnalysisSummaryDTO;

public interface PropertyAnalysisService {
    PropertyAnalysisSummaryDTO getPropertyAnalysisSummary(Long propertyId);
    PropertyAnalysisSummaryDTO runFullPropertyAnalysis(Long propertyId);
}
