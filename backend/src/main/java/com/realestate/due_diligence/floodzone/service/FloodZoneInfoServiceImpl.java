package com.realestate.due_diligence.floodzone.service;

import com.realestate.due_diligence.floodzone.FloodZoneInfo;
import com.realestate.due_diligence.floodzone.dto.FloodZoneInfoResponse;
import com.realestate.due_diligence.repository.FloodZoneInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FloodZoneInfoServiceImpl implements FloodZoneInfoService {

    private final FloodZoneInfoRepository floodZoneInfoRepository;

    @Override
    public List<FloodZoneInfoResponse> getFloodZoneInfo(Long propertyId) {

        return floodZoneInfoRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private FloodZoneInfoResponse mapToResponse(FloodZoneInfo floodZone) {

        FloodZoneInfoResponse response = new FloodZoneInfoResponse();

        response.setId(floodZone.getId());
        response.setFloodZoneCode(floodZone.getFloodZoneCode());
        response.setFloodRiskLevel(floodZone.getFloodRiskLevel());
        response.setFloodInsuranceRequired(
                floodZone.getFloodInsuranceRequired());

        return response;
    }
}