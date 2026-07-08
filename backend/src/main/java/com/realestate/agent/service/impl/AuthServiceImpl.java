package com.realestate.agent.service.impl;

import com.realestate.agent.exception.ResourceAlreadyExistsException;
import com.realestate.agent.exception.ResourceNotFoundException;
import com.realestate.agent.dto.RegisterRequest;
import com.realestate.agent.dto.RegisterResponse;
import com.realestate.agent.entity.Role;
import com.realestate.agent.entity.User;
import com.realestate.agent.repository.RoleRepository;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        if (request.getPhone() != null &&
                userRepository.existsByPhone(request.getPhone())) {

            throw new ResourceAlreadyExistsException("Phone number already exists");
        }

        Role role = roleRepository.findByRoleName("Buyer")
                .orElseThrow(() ->
                        new ResourceNotFoundException("Default role Buyer not found"));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .companyName(request.getCompanyName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        return RegisterResponse.builder()
                .userId(savedUser.getUserId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .message("User registered successfully")
                .build();
    }
}