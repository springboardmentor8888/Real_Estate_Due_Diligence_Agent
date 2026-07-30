package com.realestate.due_diligence.integration.floodzone;

import com.realestate.due_diligence.floodzone.dto.FloodZoneInfoResponse;

public interface FloodZoneClient {
    FloodZoneInfoResponse getFloodInfo(String address);
}