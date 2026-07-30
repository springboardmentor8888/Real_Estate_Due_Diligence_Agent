package com.realestate.due_diligence.integration.floodzone;

import com.realestate.due_diligence.floodzone.dto.FloodZoneInfoResponse;
import org.springframework.stereotype.Service;

@Service
public class FloodZoneClientImpl implements FloodZoneClient {

    @Override
    public FloodZoneInfoResponse getFloodInfo(String address) {
        // Mock data response for testing
        FloodZoneInfoResponse response = new FloodZoneInfoResponse();
        // Set fields according to your FloodZoneInfoResponse class definition
        return response;
    }
}