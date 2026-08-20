package com.realestate.agent.service.impl;

import com.realestate.agent.dto.LoginRequest;
import com.realestate.agent.dto.LoginResponse;
import com.realestate.agent.dto.RegisterRequest;
import com.realestate.agent.dto.RegisterResponse;
import com.realestate.agent.entity.Role;
import com.realestate.agent.entity.User;
import com.realestate.agent.exception.ResourceAlreadyExistsException;
import com.realestate.agent.exception.ResourceNotFoundException;
import com.realestate.agent.repository.RoleRepository;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.security.CustomUserDetails;
import com.realestate.agent.security.CustomUserDetailsService;
import com.realestate.agent.security.JwtService;
import com.realestate.agent.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        System.out.println("====================================");
        System.out.println("REGISTRATION REQUEST RECEIVED");
        System.out.println("Email: " + request.getEmail());
        System.out.println("FullName: " + request.getFullName());
        System.out.println("Role requested: " + request.getRole());
        System.out.println("====================================");

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        if (StringUtils.hasText(request.getPhone()) && userRepository.existsByPhone(request.getPhone())) {
            throw new ResourceAlreadyExistsException("Phone number already exists");
        }

        // Reject ADMIN role registration — ADMIN is not available in this application
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            throw new IllegalArgumentException("ADMIN is not a valid registration role. Choose: BUYER, SELLER, AGENT, LEGAL_REVIEWER, or BANK");
        }

        Role role = roleRepository.findByRoleName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

        System.out.println("Role found in DB: " + role.getRoleName() + " (ID: " + role.getRoleId() + ")");

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .emailVerified(true)
                .build();

        User savedUser = userRepository.save(user);

        System.out.println("User saved with ID: " + savedUser.getUserId());
        System.out.println("User role after save: " + (savedUser.getRole() != null ? savedUser.getRole().getRoleName() : "NULL"));

        // Generate JWT token directly upon registration
        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String jwtToken = jwtService.generateToken(userDetails);

        String fullName = ((savedUser.getFirstName() != null ? savedUser.getFirstName() : "") + " " +
                           (savedUser.getLastName() != null ? savedUser.getLastName() : "")).trim();
        if (fullName.isEmpty()) fullName = savedUser.getEmail();

        String roleName = savedUser.getRole() != null ? savedUser.getRole().getRoleName() : request.getRole();

        System.out.println("====================================");
        System.out.println("REGISTRATION SUCCESS");
        System.out.println("UserId: " + savedUser.getUserId());
        System.out.println("FullName: " + fullName);
        System.out.println("Role in response: " + roleName);
        System.out.println("Token generated: " + (jwtToken != null && !jwtToken.isEmpty()));
        System.out.println("====================================");

        return RegisterResponse.builder()
                .token(jwtToken)
                .userId(savedUser.getUserId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .fullName(fullName)
                .email(savedUser.getEmail())
                .role(roleName)
                .message("User registered successfully")
                .build();
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .token(jwtToken)
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(((user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "")).trim())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().getRoleName() : "")
                .active(user.getIsActive())
                .build();
    }

    @Override
    @Transactional
    public LoginResponse googleLogin(String email, String firstName, String lastName) {

        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Google account email is missing");
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            Role defaultRole = roleRepository.findByRoleName("BUYER")
                    .orElseThrow(() -> new ResourceNotFoundException("Default role BUYER not found"));

            user = User.builder()
                    .firstName(StringUtils.hasText(firstName) ? firstName : "Google")
                    .lastName(StringUtils.hasText(lastName) ? lastName : "User")
                    .email(email)
                    .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(defaultRole)
                    .isActive(true)
                    .emailVerified(true)
                    .build();

            user = userRepository.save(user);

            System.out.println("✅ New Google user created with default role BUYER: " + email);

        } else {
            if (StringUtils.hasText(firstName)) {
                user.setFirstName(firstName);
            }
            if (StringUtils.hasText(lastName)) {
                user.setLastName(lastName);
            }
            user.setEmailVerified(true);
            user.setLastLogin(LocalDateTime.now());
            user = userRepository.save(user);

            System.out.println("✅ Existing Google user logged in: " + email);
        }

        CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(email);
        String jwtToken = jwtService.generateToken(userDetails);

        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "";

        System.out.println("====================================");
        System.out.println("GOOGLE LOGIN SUCCESS");
        System.out.println("Email: " + email);
        System.out.println("Role: '" + roleName + "'");
        System.out.println("Has role? " + (roleName != null && !roleName.isEmpty()));
        System.out.println("====================================");

        return LoginResponse.builder()
                .token(jwtToken)
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(((user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "")).trim())
                .email(user.getEmail())
                .role(roleName)
                .active(user.getIsActive())
                .build();
    }

    @Override
    @Transactional
    public User updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        user.setRole(role);
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}