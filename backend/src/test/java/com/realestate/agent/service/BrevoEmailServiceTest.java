package com.realestate.agent.service;

import com.realestate.agent.exception.EmailDeliveryUnavailableException;
import com.realestate.agent.service.impl.BrevoEmailServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

class BrevoEmailServiceTest {

    private static final String API_KEY = "xkeysib-test-secret-api-key-12345";
    private static final String SENDER_EMAIL = "noreply@realestate-agent.com";
    private static final String SENDER_NAME = "Real Estate Due Diligence";
    private static final String API_URL = "https://api.brevo.com/v3";

    private MockRestServiceServer mockServer;
    private BrevoEmailServiceImpl emailService;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        emailService = new BrevoEmailServiceImpl(
                API_KEY,
                SENDER_EMAIL,
                SENDER_NAME,
                API_URL,
                Optional.of(builder)
        );
    }

    @Test
    void isConfigured_returnsTrue_whenApiKeyPresent() {
        assertTrue(emailService.isConfigured());
    }

    @Test
    void isConfigured_returnsFalse_whenApiKeyBlankOrNull() {
        BrevoEmailServiceImpl emptyKeyService = new BrevoEmailServiceImpl(
                "",
                SENDER_EMAIL,
                SENDER_NAME,
                API_URL,
                Optional.empty()
        );
        assertFalse(emptyKeyService.isConfigured());

        BrevoEmailServiceImpl nullKeyService = new BrevoEmailServiceImpl(
                null,
                SENDER_EMAIL,
                SENDER_NAME,
                API_URL,
                Optional.empty()
        );
        assertFalse(nullKeyService.isConfigured());
    }

    @Test
    void sendVerificationEmail_success() {
        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("api-key", API_KEY))
                .andExpect(header("Content-Type", MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.sender.name").value(SENDER_NAME))
                .andExpect(jsonPath("$.sender.email").value(SENDER_EMAIL))
                .andExpect(jsonPath("$.to[0].email").value("buyer@example.test"))
                .andExpect(jsonPath("$.subject").value("Verify your Real Estate Due Diligence account"))
                .andExpect(jsonPath("$.textContent").value(containsString("https://app.example.test/verify-email?token=abc-123")))
                .andExpect(jsonPath("$.htmlContent").value(containsString("https://app.example.test/verify-email?token=abc-123")))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"messageId\":\"<20260905.test@brevo.com>\"}"));

        assertDoesNotThrow(() ->
                emailService.sendVerificationEmail("buyer@example.test", "https://app.example.test/verify-email?token=abc-123")
        );

        mockServer.verify();
    }

    @Test
    void sendPasswordResetEmail_success() {
        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("api-key", API_KEY))
                .andExpect(header("Content-Type", MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.sender.name").value(SENDER_NAME))
                .andExpect(jsonPath("$.sender.email").value(SENDER_EMAIL))
                .andExpect(jsonPath("$.to[0].email").value("seller@example.test"))
                .andExpect(jsonPath("$.subject").value("Reset your Real Estate Due Diligence password"))
                .andExpect(jsonPath("$.textContent").value(containsString("https://app.example.test/reset-password?token=pwd-456")))
                .andExpect(jsonPath("$.htmlContent").value(containsString("https://app.example.test/reset-password?token=pwd-456")))
                .andRespond(withStatus(HttpStatus.CREATED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"messageId\":\"<20260905.reset@brevo.com>\"}"));

        assertDoesNotThrow(() ->
                emailService.sendPasswordResetEmail("seller@example.test", "https://app.example.test/reset-password?token=pwd-456")
        );

        mockServer.verify();
    }

    @Test
    void unconfiguredApiKey_doesNotCallBrevoApi_andDoesNotThrow() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer unconfiguredMockServer = MockRestServiceServer.bindTo(builder).build();
        BrevoEmailServiceImpl unconfiguredService = new BrevoEmailServiceImpl(
                "",
                SENDER_EMAIL,
                SENDER_NAME,
                API_URL,
                Optional.of(builder)
        );

        // Neither method should attempt an HTTP call or throw
        assertDoesNotThrow(() ->
                unconfiguredService.sendVerificationEmail("buyer@example.test", "https://app.example.test/verify-email?token=abc")
        );
        assertDoesNotThrow(() ->
                unconfiguredService.sendPasswordResetEmail("buyer@example.test", "https://app.example.test/reset-password?token=xyz")
        );

        unconfiguredMockServer.verify();
    }

    @Test
    void sendVerificationEmail_brevoApiError_throwsEmailDeliveryUnavailableException_withoutExposingKey() {
        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"code\":\"unauthorized\",\"message\":\"Key not found\"}"));

        EmailDeliveryUnavailableException ex = assertThrows(
                EmailDeliveryUnavailableException.class,
                () -> emailService.sendVerificationEmail("agent@example.test", "https://app.example.test/verify-email?token=fail")
        );

        assertEquals("Unable to send the verification email. Please try again later.", ex.getMessage());
        assertFalse(ex.getMessage().contains(API_KEY));
    }

    @Test
    void sendPasswordResetEmail_brevoApiError_throwsEmailDeliveryUnavailableException_withoutExposingKey() {
        mockServer.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withServerError());

        EmailDeliveryUnavailableException ex = assertThrows(
                EmailDeliveryUnavailableException.class,
                () -> emailService.sendPasswordResetEmail("agent@example.test", "https://app.example.test/reset-password?token=fail")
        );

        assertEquals("Unable to send the password reset email. Please try again later.", ex.getMessage());
        assertFalse(ex.getMessage().contains(API_KEY));
    }
}
