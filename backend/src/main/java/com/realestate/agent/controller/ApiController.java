package com.realestate.agent.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping({"", "/"})
    public ResponseEntity<?> getApiStatus() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Real Estate Due Diligence API Service is active",
                "version", "1.0.0"
        ));
    }
}
