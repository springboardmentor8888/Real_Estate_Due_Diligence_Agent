package com.realestate.due_diligence.integration.environmental;

import java.util.Collections;
import java.util.List;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import com.realestate.due_diligence.environmental.dto.EnvironmentalRecordResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnvironmentalApiServiceImpl implements EnvironmentalApiService {

    @Override
    @Retryable(
            retryFor = Exception.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000)
    )
    public List<EnvironmentalRecordResponse> fetchEnvironmentalRecords(Long propertyId) {

        /*
         * Future implementation:
         *
         * Call Environmental Records API
         * using RestTemplate / WebClient / OpenFeign.
         */

        return Collections.emptyList();
    }

    @Recover
    public List<EnvironmentalRecordResponse> recover(Exception ex, Long propertyId) {

        System.err.println(
                "Failed to fetch environmental records after retries: "
                        + ex.getMessage());

        return Collections.emptyList();
    }
}