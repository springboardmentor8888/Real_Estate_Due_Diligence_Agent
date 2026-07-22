package com.realestate.due_diligence.permit.service;

import com.realestate.due_diligence.permit.dto.BuildingPermitResponse;

import java.util.List;

public interface BuildingPermitService {

    List<BuildingPermitResponse> getPermitHistory(Long propertyId);
}