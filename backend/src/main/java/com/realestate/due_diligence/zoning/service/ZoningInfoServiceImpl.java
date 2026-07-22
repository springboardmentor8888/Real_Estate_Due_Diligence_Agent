package com.realestate.due_diligence.zoning.service;

import com.realestate.due_diligence.repository.ZoningInfoRepository;
import com.realestate.due_diligence.zoning.ZoningInfo;
import com.realestate.due_diligence.zoning.dto.ZoningInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ZoningInfoServiceImpl implements ZoningInfoService {

    private final ZoningInfoRepository zoningInfoRepository;

    @Override
    public List<ZoningInfoResponse> getZoningInfo(Long propertyId) {

        return zoningInfoRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ZoningInfoResponse mapToResponse(ZoningInfo zoning) {

        ZoningInfoResponse response = new ZoningInfoResponse();

        response.setId(zoning.getId());
        response.setZoningCode(zoning.getZoningCode());
        response.setZoningDescription(zoning.getZoningDescription());
        response.setPermittedUse(zoning.getPermittedUse());

        return response;
    }
}