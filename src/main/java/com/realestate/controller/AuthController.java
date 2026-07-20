package com.realestate.controller;

import com.realestate.dto.request.LoginRequest;
import com.realestate.dto.request.RegisterRequest;
import com.realestate.dto.response.ApiResponse;
import com.realestate.dto.response.LoginResponse;
import com.realestate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ApiResponse register(@RequestBody RegisterRequest request) {

        String message = userService.register(request);
        return new ApiResponse(message);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return userService.login(request);
    }
}