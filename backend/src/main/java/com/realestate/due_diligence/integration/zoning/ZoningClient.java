package com.realestate.due_diligence.integration.zoning;

import com.realestate.due_diligence.zoning.dto.ZoningInfoResponse;

public interface ZoningClient {
    ZoningInfoResponse getZoningInfo(String address);
}