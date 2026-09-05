package com.realestate.agent.service;

public interface EmailService {

    /**
     * Sends an account verification email containing the verification URL.
     *
     * @param recipientEmail the email address of the recipient
     * @param verificationUrl the full URL for email verification
     */
    void sendVerificationEmail(String recipientEmail, String verificationUrl);

    /**
     * Sends a password reset email containing the password reset URL.
     *
     * @param recipientEmail the email address of the recipient
     * @param resetUrl the full URL for resetting the password
     */
    void sendPasswordResetEmail(String recipientEmail, String resetUrl);

    /**
     * Checks if email delivery is configured.
     *
     * @return true if email service is configured and ready to send
     */
    boolean isConfigured();
}
