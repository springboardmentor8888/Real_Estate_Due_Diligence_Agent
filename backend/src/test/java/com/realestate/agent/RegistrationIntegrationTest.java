package com.realestate.agent;

import com.realestate.agent.exception.EmailDeliveryUnavailableException;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RegistrationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private EmailService emailService;

    @BeforeEach
    void resetEmailService() {
        reset(emailService);
    }

    @Test
    void register_acceptsEverySupportedRole_andRequiresVerification() throws Exception {
        for (String role : List.of("BUYER", "SELLER", "AGENT", "LEGAL_REVIEWER", "BANK")) {
            String email = uniqueEmail(role);

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody(email, role)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.role").value(role))
                    .andExpect(jsonPath("$.token").isEmpty())
                    .andExpect(jsonPath("$.message").value(containsString("verify")));

            assertFalse(userRepository.findByEmail(email).orElseThrow().getEmailVerified());
        }
    }

    @Test
    void register_returnsServiceUnavailable_andRollsBack_whenVerificationEmailCannotBeSent() throws Exception {
        String email = uniqueEmail("AGENT");
        doThrow(new EmailDeliveryUnavailableException(
                "Unable to send the verification email. Please try again later.",
                new RuntimeException("Brevo API error")))
                .when(emailService).sendVerificationEmail(any(), any());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody(email, "AGENT")))
                    .andExpect(status().isServiceUnavailable())
                    .andExpect(jsonPath("$.message").value("Unable to send the verification email. Please try again later."));

        assertFalse(userRepository.existsByEmail(email));
    }

    @Test
    void register_rejectsDuplicateEmail_withConflictStatus() throws Exception {
        String email = uniqueEmail("BUYER");

        // First registration succeeds
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody(email, "BUYER")))
                .andExpect(status().isOk());

        // Duplicate registration must return 409 Conflict
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody(email, "BUYER")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    void register_rejectsAdminRole_withBadRequest() throws Exception {
        String email = uniqueEmail("ADMIN");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody(email, "ADMIN")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("ADMIN is not a valid registration role")));
    }

    @Test
    void register_returnsValidationErrorsClearly_whenFieldsMissing() throws Exception {
        String invalidBody = "{\"fullName\":\"\",\"email\":\"not-an-email\",\"password\":\"\",\"role\":\"\"}";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.fullName").exists())
                .andExpect(jsonPath("$.validationErrors.email").exists())
                .andExpect(jsonPath("$.validationErrors.password").exists())
                .andExpect(jsonPath("$.validationErrors.role").exists());
    }

    @Test
    void resendVerification_returnsSuccessForUnverifiedAccount() throws Exception {
        String email = uniqueEmail("AGENT");

        // Register user
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody(email, "AGENT")))
                .andExpect(status().isOk());

        // Resend verification
        mockMvc.perform(post("/api/auth/resend-verification")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(containsString("verification link has been sent")));
    }

    private String uniqueEmail(String role) {
        return "registration-" + role.toLowerCase() + "-" + UUID.randomUUID() + "@example.test";
    }

    private String requestBody(String email, String role) {
        return "{\"fullName\":\"Registration Test\",\"email\":\"" + email
                + "\",\"password\":\"StrongPass123!\",\"role\":\"" + role + "\"}";
    }
}
