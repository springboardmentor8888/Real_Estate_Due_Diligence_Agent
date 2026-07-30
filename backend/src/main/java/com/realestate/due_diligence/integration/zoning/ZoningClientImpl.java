package com.realestate.due_diligence.integration.zoning;

import com.realestate.due_diligence.zoning.dto.ZoningInfoResponse;
import org.springframework.stereotype.Service;

@Service
public class ZoningClientImpl implements ZoningClient {

    @Override
    public ZoningInfoResponse getZoningInfo(String address) {
        // Mock data response for testing
        ZoningInfoResponse response = new ZoningInfoResponse();
        // Set fields according to your ZoningInfoResponse class definition
        return response;
    }
}