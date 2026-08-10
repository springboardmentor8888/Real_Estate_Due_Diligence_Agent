package com.infosys.realestate.service;

import com.infosys.realestate.entity.DueDiligenceReport;

public interface PropertyDueDiligenceService {
    DueDiligenceReport processDueDiligence(Long propertyId);
}
