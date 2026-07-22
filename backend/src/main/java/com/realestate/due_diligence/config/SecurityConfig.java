package com.realestate.due_diligence.config;

import com.realestate.due_diligence.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security 6 configuration class.
 *
 * <p>Sets up stateless JWT authentication, disables CSRF, configures CORS
 * properties, and specifies role-based authorization rules.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private List<String> allowedOrigins;

    @Value("${app.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS,PATCH}")
    private List<String> allowedMethods;

    @Value("${app.cors.allowed-headers:*}")
    private List<String> allowedHeaders;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configure CORS using source defined below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Disable CSRF since we are using stateless JWT authentication
                .csrf(AbstractHttpConfigurer::disable)
                // Configure authorized endpoints
                .authorizeHttpRequests(auth -> auth
                        // Permit public authentication endpoints
                        .requestMatchers("/auth/**").permitAll()
                        // Permit public Swagger and OpenAPI endpoints
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-ui/index.html"
                        ).permitAll()
                        // Role-based authorization: DELETE on any resource is restricted to Administrator
                        .requestMatchers(HttpMethod.DELETE, "/**").hasRole("ADMINISTRATOR")
                        // Require authentication for all other requests
                        .anyRequest().authenticated()
                )
                // Set session management to stateless
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Configure authentication provider
                .authenticationProvider(authenticationProvider())
                // Register JWT authentication filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(allowedMethods);
        configuration.setAllowedHeaders(allowedHeaders);
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}