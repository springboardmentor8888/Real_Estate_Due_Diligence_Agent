package com.realestate.due_diligence.floodzone.service;

import com.realestate.due_diligence.floodzone.dto.FloodZoneInfoResponse;

import java.util.List;

public interface FloodZoneInfoService {

    List<FloodZoneInfoResponse> getFloodZoneInfo(Long propertyId);
}