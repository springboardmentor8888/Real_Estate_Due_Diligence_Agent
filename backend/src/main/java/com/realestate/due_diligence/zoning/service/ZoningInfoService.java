package com.realestate.due_diligence.zoning.service;

import com.realestate.due_diligence.zoning.dto.ZoningInfoResponse;

import java.util.List;

public interface ZoningInfoService {

    List<ZoningInfoResponse> getZoningInfo(Long propertyId);
}