package com.realestate.due_diligence.integration.permit;

import java.util.List;

import org.springframework.stereotype.Service;

import com.realestate.due_diligence.permit.dto.PermitRecordResponse;
import com.realestate.due_diligence.permit.service.PermitRecordService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermitApiServiceImpl implements PermitApiService {

    private final PermitRecordService permitRecordService;

    @Override
    public List<PermitRecordResponse> fetchPermitRecords(Long propertyId) {

        /*
         * Future:
         * Replace this with a REST API call
         * using WebClient / RestTemplate / OpenFeign.
         */

        return permitRecordService.getPermitRecords(propertyId);
    }
}