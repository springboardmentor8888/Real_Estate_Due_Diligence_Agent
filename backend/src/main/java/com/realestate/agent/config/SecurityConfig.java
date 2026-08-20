package com.realestate.agent.config;

import com.realestate.agent.security.CustomAccessDeniedHandler;
import com.realestate.agent.security.JwtAuthenticationEntryPoint;
import com.realestate.agent.security.JwtAuthenticationFilter;
import com.realestate.agent.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final ObjectProvider<AuthService> authServiceProvider;
    private final ObjectProvider<ClientRegistrationRepository> clientRegistrationRepositoryProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        OAuth2AuthorizationRequestResolver authorizationResolver = null;
        ClientRegistrationRepository clientRegistrationRepository = clientRegistrationRepositoryProvider.getIfAvailable();
        if (clientRegistrationRepository != null) {
            DefaultOAuth2AuthorizationRequestResolver defaultResolver =
                    new DefaultOAuth2AuthorizationRequestResolver(clientRegistrationRepository, "/oauth2/authorization");
            defaultResolver.setAuthorizationRequestCustomizer(
                    customizer -> customizer.additionalParameters(params -> params.put("prompt", "select_account"))
            );
            authorizationResolver = defaultResolver;
        }

        final OAuth2AuthorizationRequestResolver finalResolver = authorizationResolver;

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authenticationProvider(authenticationProvider())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api", "/api/", "/api/auth/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth -> {
                    if (finalResolver != null) {
                        oauth.authorizationEndpoint(authorization -> authorization.authorizationRequestResolver(finalResolver));
                    }
                    oauth
                        .successHandler((request, response, authentication) -> {
                            try {
                                OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();

                                String email = googleUser.getAttribute("email");
                                String firstName = googleUser.getAttribute("given_name");
                                String lastName = googleUser.getAttribute("family_name");

                                if (firstName == null) firstName = "";
                                if (lastName == null) lastName = "";

                                if (email == null || email.isBlank()) {
                                    response.sendRedirect("http://localhost:3000/login?error=google_email");
                                    return;
                                }

                                AuthService authService = authServiceProvider.getObject();
                                var loginResponse = authService.googleLogin(email, firstName, lastName);

                                String token = loginResponse.getToken();
                                String userId = String.valueOf(loginResponse.getUserId());
                                String role = loginResponse.getRole() != null ? loginResponse.getRole().toUpperCase().trim() : "";
                                if ("ADMIN".equals(role)) role = "AGENT";
                                String fullName = (firstName + " " + lastName).trim();
                                if (fullName.isEmpty()) fullName = email;

                                String redirectUrl = "http://localhost:3000/oauth2-callback"
                                        + "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
                                        + "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8)
                                        + "&fullName=" + URLEncoder.encode(fullName, StandardCharsets.UTF_8)
                                        + "&userId=" + URLEncoder.encode(userId, StandardCharsets.UTF_8)
                                        + "&role=" + URLEncoder.encode(role, StandardCharsets.UTF_8);

                                System.out.println("====================================");
                                System.out.println("GOOGLE LOGIN SUCCESS");
                                System.out.println("Google email: " + email);
                                System.out.println("Role: " + role);
                                System.out.println("Redirecting to frontend callback");
                                System.out.println("====================================");

                                response.sendRedirect(redirectUrl);

                            } catch (Exception e) {
                                e.printStackTrace();
                                response.sendRedirect("http://localhost:3000/login?error=google");
                            }
                        })
                        .failureHandler((request, response, exception) -> {
                            exception.printStackTrace();
                            response.sendRedirect("http://localhost:3000/login?error=google");
                        });
                });

        return http.build();
    }
}