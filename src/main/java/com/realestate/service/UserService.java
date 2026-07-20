package com.realestate.service;

import com.realestate.dto.request.LoginRequest;
import com.realestate.dto.request.RegisterRequest;
import com.realestate.dto.response.LoginResponse;

public interface UserService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}