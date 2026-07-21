package com.realestate.due_diligence.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter.
 *
 * <p>Intercepts every incoming HTTP request and checks for a valid JWT token
 * in the {@code Authorization} header. If found and validated, populates
 * Spring Security's {@link SecurityContextHolder}.
 *
 * <p>Uses Spring Security 6 best practices and the {@link JwtService}
 * and {@link UserDetailsService} (implemented by {@link UserDetailsServiceImpl})
 * created in earlier steps.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    /**
     * Inspects the Authorization header, extracts the JWT, loads the user details,
     * validates the token, and configures the Spring Security context.
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Requirement 6: Check for Bearer token in Authorization header.
        // Requirement 7: If absent or invalid prefix, pass request along the chain without authenticating.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userEmail = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            // If token parsing fails (expired, malformed, invalid signature),
            // gracefully log/ignore and continue the chain without authenticating.
            filterChain.doFilter(request, response);
            return;
        }

        // Requirement 8: If username is extracted and no authentication already exists in security context.
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Reuse UserDetailsServiceImpl to load UserDetails (which maps roles to ROLE_ prefixed authorities).
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Reuse JwtService to validate token.
            if (jwtService.isTokenValid(jwt, userDetails)) {
                
                // Create UsernamePasswordAuthenticationToken.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // Build and set web details (IP address, session ID, etc.).
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Populate security context.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Pass control to the next filter in the chain.
        filterChain.doFilter(request, response);
    }
}
