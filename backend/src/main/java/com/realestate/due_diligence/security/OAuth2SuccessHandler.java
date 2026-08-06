package com.realestate.due_diligence.security;

import com.realestate.due_diligence.repository.UserRepository;
import com.realestate.due_diligence.user.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalStateException("User not found in database."));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());

        String jwt = jwtService.generateToken(userDetails);

        String role = user.getRole() != null
                ? user.getRole().getRoleName()
                : "BUYER";

        response.sendRedirect(
                frontendUrl
                        + "/oauth2/success"
                        + "?token=" + URLEncoder.encode(jwt, StandardCharsets.UTF_8)
                        + "&role=" + URLEncoder.encode(role, StandardCharsets.UTF_8)
                        + "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
                        + "&name=" + URLEncoder.encode(user.getName(), StandardCharsets.UTF_8)
        );
    }
}
