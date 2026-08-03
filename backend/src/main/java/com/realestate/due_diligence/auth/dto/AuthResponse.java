package com.realestate.due_diligence.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication responses, containing JWT token, role, and user details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;

    /**
     * Optional message, e.g. for registration or login success
     */
    private String message;

    // 🚀 Added fields so Spring Boot serializes role and user info into JSON
    private String role;
    private String email;
    private String name;
}