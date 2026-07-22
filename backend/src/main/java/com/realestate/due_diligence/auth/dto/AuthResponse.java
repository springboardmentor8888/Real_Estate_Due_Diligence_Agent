package com.realestate.due_diligence.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication responses, containing the JWT access token.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;

    /**
     * Optional message, e.g. for registration success
     */
    private String message;
}
