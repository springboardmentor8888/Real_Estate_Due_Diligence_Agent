package com.realestate.due_diligence.auth;

import com.realestate.due_diligence.auth.dto.AuthResponse;
import com.realestate.due_diligence.auth.dto.LoginRequest;
import com.realestate.due_diligence.auth.dto.RegisterRequest;
import com.realestate.due_diligence.repository.RoleRepository;
import com.realestate.due_diligence.repository.UserRepository;
import com.realestate.due_diligence.role.Role;
import com.realestate.due_diligence.security.JwtService;
import com.realestate.due_diligence.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException(
                    "Email address '" + request.getEmail() + "' is already registered."
            );
        }

        String roleName = switch (request.getRole()) {

            case "BUYER" -> "Buyer";

            case "REAL_ESTATE_AGENT" -> "Real Estate Agent";

            case "LEGAL_REVIEWER" -> "Legal Reviewer";

            case "FINANCIAL_INSTITUTION" -> "Financial Institution";

            case "ADMINISTRATOR" -> "Administrator";

            default -> "Buyer";
        };

        Role userRole = roleRepository.findByRoleName(roleName)
                .orElseThrow(() ->
                        new IllegalStateException("Role not found: " + roleName));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        User savedUser = userRepository.save(user);
        UserDetails userDetails = buildUserDetails(savedUser);
        String token = jwtService.generateToken(userDetails);
        String savedRoleName = savedUser.getRole().getRoleName();

        return AuthResponse.builder()
                .token(token)
                .message("User registered successfully")
                .role(savedRoleName)
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + request.getEmail()
                ));

        String userRoleName = (user.getRole() != null && user.getRole().getRoleName() != null)
                ? user.getRole().getRoleName()
                : "ROLE_USER";
        UserDetails userDetails = buildUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .message("Login successful")
                .role(userRoleName)
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }



    private UserDetails buildUserDetails(User user) {
        List<SimpleGrantedAuthority> authorities = List.of();

        if (user.getRole() != null && user.getRole().getRoleName() != null) {
            String normalizedRole = user.getRole().getRoleName()
                    .trim()
                    .replace(" ", "_")
                    .toUpperCase();
            if (!normalizedRole.startsWith("ROLE_")) {
                normalizedRole = "ROLE_" + normalizedRole;
            }

            authorities = List.of(new SimpleGrantedAuthority(normalizedRole));
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }
}