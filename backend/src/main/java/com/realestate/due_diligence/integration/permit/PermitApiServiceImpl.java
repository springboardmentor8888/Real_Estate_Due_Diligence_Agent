package com.realestate.due_diligence.integration.permit;

import java.util.Collections;
import java.util.List;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import com.realestate.due_diligence.permit.dto.PermitRecordResponse;
import com.realestate.due_diligence.permit.service.PermitRecordService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermitApiServiceImpl implements PermitApiService {

    private final PermitRecordService permitRecordService;

    @Override
    @Retryable(
            retryFor = Exception.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000)
    )
    public List<PermitRecordResponse> fetchPermitRecords(Long propertyId) {

        /*
         * Future implementation:
         *
         * Replace this with an external Permit API call
         * using RestTemplate / WebClient / OpenFeign.
         */

        return permitRecordService.getPermitRecords(propertyId);
    }

    @Recover
    public List<PermitRecordResponse> recover(Exception ex, Long propertyId) {

        System.err.println(
                "Failed to fetch permit records after retries: "
                        + ex.getMessage());

        return Collections.emptyList();
    }
}