package com.realestate.agent.service.impl;

import com.realestate.agent.exception.EmailDeliveryUnavailableException;
import com.realestate.agent.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class BrevoEmailServiceImpl implements EmailService {

    private final String apiKey;
    private final String senderEmail;
    private final String senderName;
    private final String apiUrl;
    private final RestClient restClient;

    @Autowired
    public BrevoEmailServiceImpl(
            @Value("${brevo.api-key:}") String apiKey,
            @Value("${brevo.sender-email:noreply@realestate-agent.com}") String senderEmail,
            @Value("${brevo.sender-name:Real Estate Due Diligence}") String senderName,
            @Value("${brevo.api-url:https://api.brevo.com/v3}") String apiUrl,
            Optional<RestClient.Builder> restClientBuilder) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.senderEmail = StringUtils.hasText(senderEmail) ? senderEmail.trim() : "noreply@realestate-agent.com";
        this.senderName = StringUtils.hasText(senderName) ? senderName.trim() : "Real Estate Due Diligence";
        this.apiUrl = StringUtils.hasText(apiUrl) ? apiUrl.trim() : "https://api.brevo.com/v3";

        RestClient.Builder builder = restClientBuilder.orElseGet(RestClient::builder);
        this.restClient = builder
                .baseUrl(this.apiUrl)
                .build();
    }

    public BrevoEmailServiceImpl(String apiKey, String senderEmail, String senderName, String apiUrl, RestClient restClient) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.senderEmail = StringUtils.hasText(senderEmail) ? senderEmail.trim() : "noreply@realestate-agent.com";
        this.senderName = StringUtils.hasText(senderName) ? senderName.trim() : "Real Estate Due Diligence";
        this.apiUrl = StringUtils.hasText(apiUrl) ? apiUrl.trim() : "https://api.brevo.com/v3";
        this.restClient = restClient;
    }

    @Override
    public boolean isConfigured() {
        return StringUtils.hasText(apiKey);
    }

    @Override
    public void sendVerificationEmail(String recipientEmail, String verificationUrl) {
        if (!isConfigured()) {
            log.info("Brevo email delivery not configured. Verification link for {}: {}",
                    recipientEmail, verificationUrl);
            return;
        }

        String subject = "Verify your Real Estate Due Diligence account";
        String textContent = "Verify your account using this link: " + verificationUrl;
        String htmlContent = buildHtmlTemplate(
                "Account Verification",
                "Thank you for registering with Real Estate Due Diligence. Please click the button below to verify your email address and activate your account:",
                "Verify Account",
                verificationUrl,
                "This verification link will expire in 24 hours."
        );

        sendBrevoEmail(
                recipientEmail,
                subject,
                textContent,
                htmlContent,
                "verification",
                "Unable to send the verification email. Please try again later."
        );
    }

    @Override
    public void sendPasswordResetEmail(String recipientEmail, String resetUrl) {
        if (!isConfigured()) {
            log.info("Brevo email delivery not configured. Password reset link for {}: {}",
                    recipientEmail, resetUrl);
            return;
        }

        String subject = "Reset your Real Estate Due Diligence password";
        String textContent = "Reset your password using this link: " + resetUrl;
        String htmlContent = buildHtmlTemplate(
                "Password Reset Request",
                "We received a request to reset the password for your Real Estate Due Diligence account. Please click the button below to choose a new password:",
                "Reset Password",
                resetUrl,
                "If you did not request a password reset, you can safely ignore this email."
        );

        sendBrevoEmail(
                recipientEmail,
                subject,
                textContent,
                htmlContent,
                "password-reset",
                "Unable to send the password reset email. Please try again later."
        );
    }

    private void sendBrevoEmail(
            String recipientEmail,
            String subject,
            String textContent,
            String htmlContent,
            String emailType,
            String failureMessage) {

        BrevoPayload payload = new BrevoPayload(
                new BrevoSender(this.senderName, this.senderEmail),
                Collections.singletonList(new BrevoRecipient(recipientEmail)),
                subject,
                htmlContent,
                textContent
        );

        try {
            restClient.post()
                    .uri("/smtp/email")
                    .header("api-key", this.apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Successfully dispatched {} email to Brevo REST API for recipient.", emailType);
        } catch (RestClientResponseException ex) {
            log.error("Brevo API returned error status {} for {} email delivery.",
                    ex.getStatusCode().value(), emailType);
            throw new EmailDeliveryUnavailableException(failureMessage, ex);
        } catch (Exception ex) {
            log.error("Failed to connect or send {} email via Brevo REST API: {}",
                    emailType, ex.getMessage());
            throw new EmailDeliveryUnavailableException(failureMessage, ex);
        }
    }

    private String buildHtmlTemplate(
            String title,
            String description,
            String buttonText,
            String actionUrl,
            String footerNotice) {

        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head><meta charset=\"UTF-8\"></head>\n" +
                "<body style=\"margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b;\">\n" +
                "  <table role=\"presentation\" style=\"width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 32px;\">\n" +
                "    <tr><td>\n" +
                "      <h2 style=\"margin-top: 0; color: #0f172a; font-size: 22px;\">" + title + "</h2>\n" +
                "      <p style=\"font-size: 15px; line-height: 1.6;\">" + description + "</p>\n" +
                "      <div style=\"margin: 28px 0; text-align: center;\">\n" +
                "        <a href=\"" + actionUrl + "\" style=\"background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: 600; display: inline-block;\">" + buttonText + "</a>\n" +
                "      </div>\n" +
                "      <p style=\"font-size: 13px; color: #64748b; line-height: 1.5;\">Or copy and paste this link into your browser:<br/><a href=\"" + actionUrl + "\" style=\"color: #2563eb; word-break: break-all;\">" + actionUrl + "</a></p>\n" +
                "      <hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;\" />\n" +
                "      <p style=\"font-size: 12px; color: #94a3b8; margin-bottom: 0;\">" + footerNotice + "</p>\n" +
                "    </td></tr>\n" +
                "  </table>\n" +
                "</body>\n" +
                "</html>";
    }

    public record BrevoSender(String name, String email) {}
    public record BrevoRecipient(String email) {}
    public record BrevoPayload(
            BrevoSender sender,
            List<BrevoRecipient> to,
            String subject,
            String htmlContent,
            String textContent
    ) {}
}
