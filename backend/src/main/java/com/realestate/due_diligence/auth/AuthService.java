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
     * @return AuthResponse with JWT token, message, role, and user details
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Reject duplicate email.
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException(
                    "Email address '" + request.getEmail() + "' is already registered."
            );
        }

        // 2. Dynamically determine role from request (e.g. AGENT, BUYER, etc.)
        String requestedRoleName = request.getRole() != null && !request.getRole().isBlank()
                ? request.getRole().trim().toUpperCase()
                : "BUYER";

        // Format role name to match database conventions (e.g., ROLE_AGENT, ROLE_BUYER)
        String targetRole = requestedRoleName.startsWith("ROLE_") 
                ? requestedRoleName 
                : "ROLE_" + requestedRoleName;

        // Try searching by exact name (ROLE_AGENT), plain name (AGENT), or fallback to default
        Role userRole = roleRepository.findByRoleName(targetRole)
                .orElseGet(() -> roleRepository.findByRoleName(requestedRoleName)
                .orElseGet(() -> roleRepository.findByRoleName("ROLE_USER")
                .orElseGet(() -> roleRepository.findById(1L)
                .orElseThrow(() -> new IllegalStateException("Requested role could not be configured.")))));

        // 3. Create user entity.
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);

        // 4. Save to database.
        User savedUser = userRepository.save(user);

        // 5. Build UserDetails representation inline to avoid extra DB round-trip.
        UserDetails userDetails = buildUserDetails(savedUser);

        // 6. Generate JWT token for the newly registered user.
        String token = jwtService.generateToken(userDetails);

        // 7. Extract role string safely
        String roleName = savedUser.getRole() != null ? savedUser.getRole().getRoleName() : "ROLE_USER";

        return AuthResponse.builder()
                .token(token)
                .message("User registered successfully")
                .role(roleName)      // 👈 POPULATE ROLE
                .email(savedUser.getEmail()) // 👈 POPULATE EMAIL
                .name(savedUser.getName())   // 👈 POPULATE NAME
                .build();
    }

    /**
     * User login flow.
     *
     * @param request the credentials
     * @return AuthResponse with JWT token, message, role, and user details
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // 1. Authenticate credentials via AuthenticationManager.
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

        // 3. Extract role string safely
        String userRoleName = (user.getRole() != null && user.getRole().getRoleName() != null)
                ? user.getRole().getRoleName()
                : "ROLE_USER";

        // 4. Build UserDetails for token generation.
        UserDetails userDetails = buildUserDetails(user);

        // 5. Generate JWT token.
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .message("Login successful")
                .role(userRoleName)   // 👈 POPULATE ROLE
                .email(user.getEmail()) // 👈 POPULATE EMAIL
                .name(user.getName())   // 👈 POPULATE NAME
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

            // Avoid duplicate "ROLE_" prefix if already present
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