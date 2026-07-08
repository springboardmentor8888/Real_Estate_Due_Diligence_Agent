package com.realestate.agent.service;

import com.realestate.agent.dto.RegisterRequest;
import com.realestate.agent.dto.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

}