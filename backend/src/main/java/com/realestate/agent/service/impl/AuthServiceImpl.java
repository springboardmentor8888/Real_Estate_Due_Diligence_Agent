package com.realestate.agent.service.impl;

import com.realestate.agent.dto.LoginRequest;
import com.realestate.agent.dto.LoginResponse;
import com.realestate.agent.dto.RegisterRequest;
import com.realestate.agent.dto.RegisterResponse;
import com.realestate.agent.entity.Role;
import com.realestate.agent.entity.User;
import com.realestate.agent.exception.BadRequestException;
import com.realestate.agent.exception.EmailDeliveryUnavailableException;
import com.realestate.agent.exception.ResourceAlreadyExistsException;
import com.realestate.agent.exception.ResourceNotFoundException;
import com.realestate.agent.repository.RoleRepository;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.security.CustomUserDetails;
import com.realestate.agent.security.CustomUserDetailsService;
import com.realestate.agent.security.JwtService;
import com.realestate.agent.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.verification.token-expiration-minutes:1440}")
    private long verificationTokenExpirationMinutes;

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        log.info("Registration request received for email: {}, role: {}", request.getEmail(), request.getRole());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        if (StringUtils.hasText(request.getPhone()) && userRepository.existsByPhone(request.getPhone())) {
            throw new ResourceAlreadyExistsException("Phone number already exists");
        }

        // Reject ADMIN role registration — ADMIN is not available in this application
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            throw new IllegalArgumentException("ADMIN is not a valid registration role. Choose: BUYER, SELLER, AGENT, LEGAL_REVIEWER, or BANK");
        }

        Role role = roleRepository.findByRoleName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

        String verificationToken = UUID.randomUUID().toString();
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .emailVerified(false)
                .verificationTokenHash(hashToken(verificationToken))
                .verificationTokenExpiresAt(LocalDateTime.now().plusMinutes(verificationTokenExpirationMinutes))
                .build();

        User savedUser = userRepository.save(user);

        log.info("User registered with ID: {}, role: {}", savedUser.getUserId(), role.getRoleName());

        sendVerificationEmail(savedUser, verificationToken);

        String fullName = ((savedUser.getFirstName() != null ? savedUser.getFirstName() : "") + " " +
                           (savedUser.getLastName() != null ? savedUser.getLastName() : "")).trim();
        if (fullName.isEmpty()) fullName = savedUser.getEmail();

        String roleName = savedUser.getRole() != null ? savedUser.getRole().getRoleName() : request.getRole();

        return RegisterResponse.builder()
                .token(null)
                .userId(savedUser.getUserId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .fullName(fullName)
                .email(savedUser.getEmail())
                .role(roleName)
                .message("Registration successful. Check your email to verify your account before logging in.")
                .build();
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new BadRequestException("Please verify your email before logging in.");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .token(jwtToken)
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(((user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "")).trim())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().getRoleName() : "")
                .active(user.getIsActive())
                .build();
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        if (!StringUtils.hasText(token)) {
            throw new BadRequestException("Verification token is required.");
        }

        User user = userRepository.findByVerificationTokenHash(hashToken(token))
                .orElseThrow(() -> new BadRequestException("Invalid or already-used verification token."));

        if (user.getVerificationTokenExpiresAt() == null
                || user.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired.");
        }

        user.setEmailVerified(true);
        user.setVerificationTokenHash(null);
        user.setVerificationTokenExpiresAt(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void resendVerificationEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return;
        }
        User user = userRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
        if (user == null || Boolean.TRUE.equals(user.getEmailVerified())) {
            return;
        }
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationTokenHash(hashToken(verificationToken));
        user.setVerificationTokenExpiresAt(LocalDateTime.now().plusMinutes(verificationTokenExpirationMinutes));
        userRepository.save(user);

        sendVerificationEmail(user, verificationToken);
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        if (!StringUtils.hasText(email)) {
            return;
        }

        userRepository.findByEmail(email.trim()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setPasswordResetTokenHash(hashToken(token));
            user.setPasswordResetTokenExpiresAt(LocalDateTime.now().plusMinutes(verificationTokenExpirationMinutes));
            userRepository.save(user);

            sendPasswordResetEmail(user, token);
        });
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        if (!StringUtils.hasText(token) || !StringUtils.hasText(newPassword) || newPassword.length() < 8) {
            throw new BadRequestException("A valid reset token and password of at least 8 characters are required.");
        }

        User user = userRepository.findByPasswordResetTokenHash(hashToken(token))
                .orElseThrow(() -> new BadRequestException("Invalid or already-used password reset token."));

        if (user.getPasswordResetTokenExpiresAt() == null
                || user.getPasswordResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Password reset token has expired.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordResetTokenHash(null);
        user.setPasswordResetTokenExpiresAt(null);
        userRepository.save(user);
    }

    private boolean isMailDeliveryConfigured(JavaMailSender mailSender) {
        if (mailSender == null) {
            return false;
        }
        if (mailSender instanceof JavaMailSenderImpl impl) {
            if (!StringUtils.hasText(impl.getHost())) {
                return false;
            }
            String auth = impl.getJavaMailProperties() != null
                    ? impl.getJavaMailProperties().getProperty("mail.smtp.auth")
                    : null;
            if ("true".equalsIgnoreCase(auth) && !StringUtils.hasText(impl.getUsername())) {
                return false;
            }
        }
        return true;
    }

    private void sendVerificationEmail(User user, String token) {
        JavaMailSender mailSender = mailSenderProvider != null ? mailSenderProvider.getIfAvailable() : null;
        String baseUrl = StringUtils.hasText(frontendBaseUrl) ? frontendBaseUrl : "http://localhost:3000";
        if (!isMailDeliveryConfigured(mailSender)) {
            log.info("SMTP delivery not configured. Verification link for {}: {}/verify-email?token={}",
                    user.getEmail(), baseUrl, token);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Verify your Real Estate Due Diligence account");
        message.setText("Verify your account using this link: " + baseUrl
                + "/verify-email?token=" + token);
        try {
            mailSender.send(message);
        } catch (MailException ex) {
            throw new EmailDeliveryUnavailableException(
                    "Unable to send the verification email. Please try again later.", ex);
        }
    }

    private void sendPasswordResetEmail(User user, String token) {
        JavaMailSender mailSender = mailSenderProvider != null ? mailSenderProvider.getIfAvailable() : null;
        String baseUrl = StringUtils.hasText(frontendBaseUrl) ? frontendBaseUrl : "http://localhost:3000";
        if (!isMailDeliveryConfigured(mailSender)) {
            log.info("SMTP delivery not configured. Password reset link for {}: {}/reset-password?token={}",
                    user.getEmail(), baseUrl, token);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Reset your Real Estate Due Diligence password");
        message.setText("Reset your password using this link: " + baseUrl
                + "/reset-password?token=" + token);
        try {
            mailSender.send(message);
        } catch (MailException ex) {
            throw new EmailDeliveryUnavailableException(
                    "Unable to send the password reset email. Please try again later.", ex);
        }
    }

    private String hashToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte value : digest) {
                hex.append(String.format("%02x", value));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is unavailable", ex);
        }
    }

    @Override
    @Transactional
    public LoginResponse googleLogin(String email, String firstName, String lastName) {

        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Google account email is missing");
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            Role defaultRole = roleRepository.findByRoleName("BUYER")
                    .orElseThrow(() -> new ResourceNotFoundException("Default role BUYER not found"));

            user = User.builder()
                    .firstName(StringUtils.hasText(firstName) ? firstName : "Google")
                    .lastName(StringUtils.hasText(lastName) ? lastName : "User")
                    .email(email)
                    .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(defaultRole)
                    .isActive(true)
                    .emailVerified(true)
                    .build();

            user = userRepository.save(user);

            log.info("New Google user created with default role BUYER: {}", email);

        } else {
            if (StringUtils.hasText(firstName)) {
                user.setFirstName(firstName);
            }
            if (StringUtils.hasText(lastName)) {
                user.setLastName(lastName);
            }
            user.setEmailVerified(true);
            user.setLastLogin(LocalDateTime.now());
            user = userRepository.save(user);

            log.info("Existing Google user logged in: {}", email);
        }

        CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(email);
        String jwtToken = jwtService.generateToken(userDetails);

        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "";

        return LoginResponse.builder()
                .token(jwtToken)
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(((user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "")).trim())
                .email(user.getEmail())
                .role(roleName)
                .active(user.getIsActive())
                .build();
    }

    @Override
    @Transactional
    public User updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        user.setRole(role);
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
