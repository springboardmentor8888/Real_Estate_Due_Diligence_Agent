package com.realestate.agent;

import com.realestate.agent.dto.LoginRequest;
import com.realestate.agent.dto.RegisterRequest;
import com.realestate.agent.entity.Role;
import com.realestate.agent.entity.User;
import com.realestate.agent.exception.ResourceAlreadyExistsException;
import com.realestate.agent.repository.RoleRepository;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.security.CustomUserDetails;
import com.realestate.agent.security.JwtService;
import com.realestate.agent.security.CustomUserDetailsService;
import com.realestate.agent.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @InjectMocks
    private AuthServiceImpl authService;

    private Role buyerRole;

    @BeforeEach
    void setUp() {
        buyerRole = new Role();
        buyerRole.setRoleId(1L);
        buyerRole.setRoleName("BUYER");
    }

    @Test
    void register_shouldRejectAdminRole() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("admin@example.com");
        request.setFullName("Jane Admin");
        request.setPassword("StrongPass123!");
        request.setRole("ADMIN");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.register(request));

        assertTrue(ex.getMessage().contains("ADMIN is not a valid registration role"));
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_shouldCreateUserWhenRoleExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("buyer@example.com");
        request.setFullName("Ava Buyer");
        request.setPassword("StrongPass123!");
        request.setRole("BUYER");

        when(userRepository.existsByEmail("buyer@example.com")).thenReturn(false);
        when(roleRepository.findByRoleName("BUYER")).thenReturn(Optional.of(buyerRole));
        when(passwordEncoder.encode("StrongPass123!")).thenReturn("hashed");

        User savedUser = new User();
        savedUser.setUserId(42L);
        savedUser.setFirstName("Ava");
        savedUser.setLastName("Buyer");
        savedUser.setEmail("buyer@example.com");
        savedUser.setPasswordHash("hashed");
        savedUser.setRole(buyerRole);
        savedUser.setIsActive(true);
        savedUser.setEmailVerified(false);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        var response = authService.register(request);

        assertNull(response.getToken());
        assertEquals(42L, response.getUserId());
        assertEquals("BUYER", response.getRole());
        assertEquals("Ava Buyer", response.getFullName());
        assertTrue(response.getMessage().contains("verify"));
    }

    @Test
    void register_shouldRejectDuplicateEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("duplicate@example.com");
        request.setFullName("Dup User");
        request.setPassword("StrongPass123!");
        request.setRole("BUYER");

        when(userRepository.existsByEmail("duplicate@example.com")).thenReturn(true);

        assertThrows(ResourceAlreadyExistsException.class, () -> authService.register(request));
    }

    @Test
    void login_shouldGenerateTokenForExistingUser() {
        LoginRequest request = new LoginRequest();
        request.setEmail("buyer@example.com");
        request.setPassword("StrongPass123!");

        User user = new User();
        user.setUserId(7L);
        user.setEmail("buyer@example.com");
        user.setFirstName("Ava");
        user.setLastName("Buyer");
        user.setRole(buyerRole);
        user.setIsActive(true);
        user.setEmailVerified(true);
        user.setPasswordHash("hashed-password");

        CustomUserDetails userDetails = new CustomUserDetails(user);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authToken);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any())).thenReturn("login-token");

        var result = authService.login(request);

        assertEquals("login-token", result.getToken());
        assertEquals("buyer@example.com", result.getEmail());
        assertEquals("BUYER", result.getRole());
    }

    @Test
    void verifyEmail_shouldConsumeValidToken() {
        String token = "valid-token";
        User user = new User();
        user.setEmailVerified(false);
        user.setVerificationTokenHash(hashToken(token));
        user.setVerificationTokenExpiresAt(java.time.LocalDateTime.now().plusMinutes(10));

        when(userRepository.findByVerificationTokenHash(hashToken(token))).thenReturn(Optional.of(user));

        authService.verifyEmail(token);

        assertTrue(user.getEmailVerified());
        assertNull(user.getVerificationTokenHash());
        assertNull(user.getVerificationTokenExpiresAt());
        verify(userRepository).save(user);
    }

    @Test
    void verifyEmail_shouldRejectInvalidToken() {
        when(userRepository.findByVerificationTokenHash(any())).thenReturn(Optional.empty());

        assertThrows(com.realestate.agent.exception.BadRequestException.class,
                () -> authService.verifyEmail("invalid-token"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void verifyEmail_shouldRejectExpiredToken() {
        String token = "expired-token";
        User user = new User();
        user.setEmailVerified(false);
        user.setVerificationTokenHash(hashToken(token));
        user.setVerificationTokenExpiresAt(java.time.LocalDateTime.now().minusMinutes(1));

        when(userRepository.findByVerificationTokenHash(hashToken(token))).thenReturn(Optional.of(user));

        assertThrows(com.realestate.agent.exception.BadRequestException.class,
                () -> authService.verifyEmail(token));
        assertFalse(user.getEmailVerified());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void verifyEmail_shouldRejectReusedToken() {
        String token = "single-use-token";
        User user = new User();
        user.setEmailVerified(false);
        user.setVerificationTokenHash(hashToken(token));
        user.setVerificationTokenExpiresAt(java.time.LocalDateTime.now().plusMinutes(10));

        when(userRepository.findByVerificationTokenHash(hashToken(token)))
                .thenReturn(Optional.of(user), Optional.empty());

        authService.verifyEmail(token);

        assertThrows(com.realestate.agent.exception.BadRequestException.class,
                () -> authService.verifyEmail(token));
        verify(userRepository).save(user);
    }

    @Test
    void resetPassword_shouldConsumeValidTokenAndHashNewPassword() {
        String token = "reset-token";
        User user = new User();
        user.setPasswordResetTokenHash(hashToken(token));
        user.setPasswordResetTokenExpiresAt(java.time.LocalDateTime.now().plusMinutes(10));
        when(userRepository.findByPasswordResetTokenHash(hashToken(token))).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("NewStrongPass123!")).thenReturn("new-hash");

        authService.resetPassword(token, "NewStrongPass123!");

        assertEquals("new-hash", user.getPasswordHash());
        assertNull(user.getPasswordResetTokenHash());
        assertNull(user.getPasswordResetTokenExpiresAt());
        verify(userRepository).save(user);
    }

    @Test
    void resetPassword_shouldRejectExpiredToken() {
        String token = "expired-reset-token";
        User user = new User();
        user.setPasswordResetTokenHash(hashToken(token));
        user.setPasswordResetTokenExpiresAt(java.time.LocalDateTime.now().minusMinutes(1));
        when(userRepository.findByPasswordResetTokenHash(hashToken(token))).thenReturn(Optional.of(user));

        assertThrows(com.realestate.agent.exception.BadRequestException.class,
                () -> authService.resetPassword(token, "NewStrongPass123!"));
        verify(userRepository, never()).save(any(User.class));
    }

    private String hashToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte value : digest) {
                hex.append(String.format("%02x", value));
            }
            return hex.toString();
        } catch (Exception ex) {
            throw new AssertionError(ex);
        }
    }
}
