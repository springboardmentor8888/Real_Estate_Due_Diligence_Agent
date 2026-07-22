package com.realestate.due_diligence.integration.environmental;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestate.due_diligence.environmental.dto.EnvironmentalRecordResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnvironmentalApiServiceImpl implements EnvironmentalApiService {

    @Override
    public List<EnvironmentalRecordResponse> fetchEnvironmentalRecords(Long propertyId) {

        /*
         * Future implementation:
         *
         * Call Environmental Records API
         * using RestTemplate / WebClient.
         */

        return Collections.emptyList();
    }
}