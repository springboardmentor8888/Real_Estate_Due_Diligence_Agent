package com.realestate.due_diligence.permit.service;

import com.realestate.due_diligence.permit.BuildingPermitRecord;
import com.realestate.due_diligence.permit.dto.BuildingPermitResponse;
import com.realestate.due_diligence.repository.BuildingPermitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuildingPermitServiceImpl implements BuildingPermitService {

    private final BuildingPermitRepository buildingPermitRepository;

    @Override
    public List<BuildingPermitResponse> getPermitHistory(Long propertyId) {

        return buildingPermitRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BuildingPermitResponse mapToResponse(BuildingPermitRecord permit) {

        BuildingPermitResponse response = new BuildingPermitResponse();

        response.setId(permit.getId());
        response.setPermitNumber(permit.getPermitNumber());
        response.setPermitType(permit.getPermitType());
        response.setIssueDate(permit.getIssueDate());
        response.setStatus(permit.getStatus());

        return response;
    }
}