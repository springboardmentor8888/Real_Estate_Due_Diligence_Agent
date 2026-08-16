package com.realestate.agent.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.stereotype.Component;

@Component
public class OAuth2ConfigLogger implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(OAuth2ConfigLogger.class);
    private final ClientRegistrationRepository clientRegistrationRepository;

    public OAuth2ConfigLogger(ClientRegistrationRepository clientRegistrationRepository) {
        this.clientRegistrationRepository = clientRegistrationRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        ClientRegistration google = clientRegistrationRepository.findByRegistrationId("google");
        if (google != null) {
            String clientId = google.getClientId();
            String clientSecret = google.getClientSecret();

            boolean hasClientId = clientId != null && !clientId.isBlank() && !clientId.contains("placeholder");
            boolean hasClientSecret = clientSecret != null && !clientSecret.isBlank() && !clientSecret.contains("placeholder");

            log.info("OAuth2 Registration [google] -> Client ID configured: {} (length: {}), Client Secret configured: {} (length: {})",
                    hasClientId,
                    clientId != null ? clientId.length() : 0,
                    hasClientSecret,
                    clientSecret != null ? clientSecret.length() : 0);
        } else {
            log.warn("OAuth2 Registration [google] is NOT registered in ClientRegistrationRepository");
        }
    }
}