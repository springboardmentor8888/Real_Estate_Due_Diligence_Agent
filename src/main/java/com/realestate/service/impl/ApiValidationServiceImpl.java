package com.realestate.service.impl;

import com.realestate.service.ApiValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ApiValidationServiceImpl implements ApiValidationService {

    @Autowired
    private RestTemplate restTemplate;

    @Override
    @Retryable(maxAttempts = 3)
    public String validateConnection() {

        String url = "https://jsonplaceholder.typicode.com/posts/1";

        return restTemplate.getForObject(url, String.class);
    }
}