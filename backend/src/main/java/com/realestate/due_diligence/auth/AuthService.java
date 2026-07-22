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

/**
 * Authentication Service handling registration and login flow logic.
 *
 * <p>Uses Spring Security 6, constructor dependency injection, and proper
 * input validations/exceptions.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * User registration flow.
     *
     * @param request the registration details
     * @return AuthResponse with JWT token and message
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Reject duplicate email.
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException(
                    "Email address '" + request.getEmail() + "' is already registered."
            );
        }

        // 2. Load the default role "Buyer" from RoleRepository.
        //    Throws a specific IllegalStateException if the database has not been seeded.
        Role defaultRole = roleRepository.findByRoleName("Buyer")
                .orElseThrow(() -> new IllegalStateException(
                        "Default user role 'Buyer' is not configured in the database."
                ));

        // 3. Create user entity.
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // Encode password using configured PasswordEncoder.
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(defaultRole);

        // 4. Save to database.
        User savedUser = userRepository.save(user);

        // 5. Build UserDetails representation inline to avoid extra DB round-trip.
        UserDetails userDetails = buildUserDetails(savedUser);

        // 6. Generate JWT token for the newly registered user.
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .message("User registered successfully")
                .build();
    }

    /**
     * User login flow.
     *
     * @param request the credentials
     * @return AuthResponse with JWT token and message
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // 1. Authenticate credentials via AuthenticationManager.
        //    Throws BadCredentialsException or AuthenticationException if invalid.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Load user from database.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + request.getEmail()
                ));

        // 3. Build UserDetails for token generation.
        UserDetails userDetails = buildUserDetails(user);

        // 4. Generate JWT token.
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .message("Login successful")
                .build();
    }

    // -------------------------------------------------------------------------
    // Helper Methods
    // -------------------------------------------------------------------------

    /**
     * Translates a User domain model to a Spring Security UserDetails representation
     * consistent with UserDetailsServiceImpl mapping rules.
     */
    private UserDetails buildUserDetails(User user) {
        List<SimpleGrantedAuthority> authorities = List.of();
        
        if (user.getRole() != null && user.getRole().getRoleName() != null) {
            String normalizedRole = user.getRole().getRoleName()
                    .trim()
                    .replace(" ", "_")
                    .toUpperCase();
            authorities = List.of(new SimpleGrantedAuthority("ROLE_" + normalizedRole));
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }
}
