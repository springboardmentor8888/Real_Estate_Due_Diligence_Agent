package com.realestate.agent.controller;

import com.realestate.agent.dto.LoginRequest;
import com.realestate.agent.dto.LoginResponse;
import com.realestate.agent.dto.RegisterRequest;
import com.realestate.agent.dto.RegisterResponse;
import com.realestate.agent.entity.User;
import com.realestate.agent.security.CustomUserDetails;
import com.realestate.agent.service.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "${app.cors.allowed-origins}",
        allowCredentials = "true"
)
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        authService.verifyEmail(request != null ? request.get("token") : null);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request) {
        authService.resendVerificationEmail(request != null ? request.get("email") : null);
        return ResponseEntity.ok(Map.of("message", "If an unverified account exists with that email, a verification link has been sent."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        authService.requestPasswordReset(request != null ? request.get("email") : null);
        return ResponseEntity.ok(Map.of("message", "If the account exists, a password reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        authService.resetPassword(
            request != null ? request.get("token") : null,
            request != null ? request.get("newPassword") : null
        );
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null || userDetails.getUser() == null ||
                !userId.equals(userDetails.getUser().getUserId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You may only update your own role"));
        }

        String roleName = request.get("role");

        if (roleName == null || roleName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Role cannot be empty")
            );
        }

        // ADMIN role is removed from this application
        if ("ADMIN".equalsIgnoreCase(roleName.trim())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "ADMIN is not a valid user role")
            );
        }

        java.util.Set<String> allowed = java.util.Set.of("BUYER", "SELLER", "AGENT", "LEGAL_REVIEWER", "BANK");
        if (!allowed.contains(roleName.trim().toUpperCase())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid role. Allowed: BUYER, SELLER, AGENT, LEGAL_REVIEWER, BANK")
            );
        }

        try {
            User updatedUser = authService.updateUserRole(userId, roleName);

            Map<String, Object> response = new HashMap<>();
            response.put("userId", updatedUser.getUserId());
            response.put("email", updatedUser.getEmail());
            response.put("firstName", updatedUser.getFirstName());
            response.put("lastName", updatedUser.getLastName());
            response.put("role", updatedUser.getRole().getRoleName());
            response.put("message", "Role updated successfully");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserById(
            @PathVariable Long userId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (userDetails == null || userDetails.getUser() == null ||
                    !userId.equals(userDetails.getUser().getUserId())) {
                return ResponseEntity.status(403).body(Map.of("error", "You may only view your own profile"));
            }
            User user = authService.getUserById(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getUserId());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("role", user.getRole() != null ? user.getRole().getRoleName() : "");
            response.put("isActive", user.getIsActive());
            response.put("emailVerified", user.getEmailVerified());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
