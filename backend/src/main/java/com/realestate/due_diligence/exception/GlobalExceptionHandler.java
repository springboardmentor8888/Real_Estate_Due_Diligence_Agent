package com.realestate.due_diligence.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

/**
 * Global Exception Handler for REST controllers.
 *
 * <p>Uses {@link RestControllerAdvice} to intercept exceptions thrown during
 * request processing and maps them to standard HTTP status codes and structured
 * JSON error responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;

    /**
     * Handles User Not Found exceptions (404 Not Found).
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFound(
            UsernameNotFoundException ex, WebRequest request) {
        log.warn("User lookup failed: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
    }

    /**
     * Handles bad credentials (401 Unauthorized).
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex, WebRequest request) {
        log.warn("Authentication failed: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", "Invalid email or password", request);
    }

    /**
     * Handles access denied / authorization failure (403 Forbidden).
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex, WebRequest request) {
        log.warn("Access denied to resource: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, "Forbidden", "Access Denied: You do not have permissions to perform this action", request);
    }

    /**
     * Handles validation constraints failure (400 Bad Request).
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        String validationErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        
        log.warn("Request validation failed: {}", validationErrors);
        return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", validationErrors, request);
    }

    /**
     * Handles illegal arguments (e.g. duplicate email during registration) (400 Bad Request).
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex, WebRequest request) {
        log.warn("Invalid argument encountered: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request);
    }

    /**
     * Handles general unhandled internal server exceptions (500 Internal Server Error).
     * Requirements: Log unexpected exceptions, do not expose stack traces.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(
            Exception ex, WebRequest request) {
        log.error("An unexpected error occurred during request processing", ex);
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error",
                "An unexpected error occurred. Please try again later.",
                request
        );
    }

    // -------------------------------------------------------------------------
    // Helper Methods & Response DTO
    // -------------------------------------------------------------------------

    private ResponseEntity<ErrorResponse> buildResponse(
            HttpStatus status, String error, String message, WebRequest request) {
        
        String path = request.getDescription(false).replace("uri=", "");
        
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now().format(ISO_FORMATTER),
                status.value(),
                error,
                message,
                path
        );
        
        return new ResponseEntity<>(errorResponse, status);
    }

    /**
     * Consistent error response structure.
     */
    public static class ErrorResponse {
        private final String timestamp;
        private final int status;
        private final String error;
        private final String message;
        private final String path;

        public ErrorResponse(String timestamp, int status, String error, String message, String path) {
            this.timestamp = timestamp;
            this.status = status;
            this.error = error;
            this.message = message;
            this.path = path;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public int getStatus() {
            return status;
        }

        public String getError() {
            return error;
        }

        public String getMessage() {
            return message;
        }

        public String getPath() {
            return path;
        }
    }
}