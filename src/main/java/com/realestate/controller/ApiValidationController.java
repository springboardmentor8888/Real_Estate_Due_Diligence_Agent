package com.realestate.controller;

import com.realestate.service.ApiValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/validation")
public class ApiValidationController {

    @Autowired
    private ApiValidationService apiValidationService;

    @GetMapping
    public String validate() {
        return apiValidationService.validateConnection();
    }
}