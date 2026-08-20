package com.realestate.agent.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
public class AddressController {

    @GetMapping("/test")
    public ResponseEntity<String> testAddressController() {
        return ResponseEntity.ok("Address Controller is working");
    }
}