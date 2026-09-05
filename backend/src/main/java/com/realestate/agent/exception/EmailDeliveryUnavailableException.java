package com.realestate.agent.exception;

/**
 * Indicates that a security-sensitive email could not be delivered.
 * The caller's transaction must roll back so an account is never created
 * without a usable verification path.
 */
public class EmailDeliveryUnavailableException extends RuntimeException {

    public EmailDeliveryUnavailableException(String message) {
        super(message);
    }

    public EmailDeliveryUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
