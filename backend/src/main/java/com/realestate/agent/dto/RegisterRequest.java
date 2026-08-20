package com.realestate.agent.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    /** Full name as sent by the frontend registration form (e.g. "Ava Chen"). */
    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "^$|^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    /** Derives firstName from fullName (everything before the first space). */
    public String getFirstName() {
        if (fullName == null || fullName.isBlank()) return "";
        int idx = fullName.trim().indexOf(' ');
        return idx > 0 ? fullName.trim().substring(0, idx) : fullName.trim();
    }

    /** Derives lastName from fullName (everything after the first space). */
    public String getLastName() {
        if (fullName == null || fullName.isBlank()) return "";
        int idx = fullName.trim().indexOf(' ');
        return idx > 0 ? fullName.trim().substring(idx + 1) : "";
    }
}