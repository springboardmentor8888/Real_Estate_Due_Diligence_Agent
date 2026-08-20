package com.realestate.agent.service;

import com.realestate.agent.dto.LoginRequest;
import com.realestate.agent.dto.LoginResponse;
import com.realestate.agent.dto.RegisterRequest;
import com.realestate.agent.dto.RegisterResponse;
import com.realestate.agent.entity.User;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    LoginResponse googleLogin(String email, String firstName, String lastName);

    User updateUserRole(Long userId, String roleName);
    User getUserById(Long userId);
    User getUserByEmail(String email);
}