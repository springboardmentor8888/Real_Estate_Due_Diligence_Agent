package com.realestate.agent.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Spring Boot EnvironmentPostProcessor that automatically normalizes DB_URL
 * and spring.datasource.url before the application context or DataSource is initialized.
 * <p>
 * Specifically handles platforms like Render that provide URI-style database URLs:
 *   postgresql://USERNAME:PASSWORD@HOST[:PORT]/DATABASE[?params]
 * <p>
 * Converts them to standard PostgreSQL JDBC format without credentials in the URL:
 *   jdbc:postgresql://HOST[:PORT]/DATABASE[?params]
 * <p>
 * If DB_USERNAME and DB_PASSWORD environment variables are set, they are preserved.
 * If credentials are in the URL and DB_USERNAME was not explicitly provided, the extracted
 * credentials are supplied to the datasource.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final Logger log = LoggerFactory.getLogger(DatabaseUrlEnvironmentPostProcessor.class);

    public static final String PROPERTY_SOURCE_NAME = "databaseUrlNormalization";
    public static final String DB_URL_PROPERTY = "DB_URL";
    public static final String DATABASE_URL_PROPERTY = "DATABASE_URL";
    public static final String SPRING_DATASOURCE_URL = "spring.datasource.url";
    public static final String DB_USERNAME_PROPERTY = "DB_USERNAME";
    public static final String SPRING_DATASOURCE_USERNAME = "spring.datasource.username";
    public static final String SPRING_DATASOURCE_PASSWORD = "spring.datasource.password";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String rawDbUrl = environment.getProperty(DB_URL_PROPERTY);
        if (rawDbUrl == null) {
            rawDbUrl = environment.getProperty(DATABASE_URL_PROPERTY);
        }
        String datasourceUrl = environment.getProperty(SPRING_DATASOURCE_URL);

        Map<String, Object> normalizedProperties = new HashMap<>();

        if (rawDbUrl != null) {
            String normalizedDbUrl = DatabaseUrlNormalizer.normalize(rawDbUrl);
            if (!rawDbUrl.equals(normalizedDbUrl)) {
                log.info("Normalizing DB_URL for PostgreSQL JDBC compatibility: credentials stripped from URL authority");
                normalizedProperties.put(DB_URL_PROPERTY, normalizedDbUrl);
                normalizedProperties.put(SPRING_DATASOURCE_URL, normalizedDbUrl);
            }

            // If credentials were in the URL and DB_USERNAME was not explicitly set,
            // supply them to datasource as fallback
            if (environment.getProperty(DB_USERNAME_PROPERTY) == null) {
                DatabaseUrlNormalizer.Credentials creds = DatabaseUrlNormalizer.extractCredentials(rawDbUrl);
                if (creds != null && creds.username() != null) {
                    normalizedProperties.put(SPRING_DATASOURCE_USERNAME, creds.username());
                    if (creds.password() != null) {
                        normalizedProperties.put(SPRING_DATASOURCE_PASSWORD, creds.password());
                    }
                }
            }
        }

        if (datasourceUrl != null) {
            String normalizedDatasourceUrl = DatabaseUrlNormalizer.normalize(datasourceUrl);
            if (!datasourceUrl.equals(normalizedDatasourceUrl)) {
                log.info("Normalizing spring.datasource.url for PostgreSQL JDBC compatibility");
                normalizedProperties.put(SPRING_DATASOURCE_URL, normalizedDatasourceUrl);
            }

            if (environment.getProperty(DB_USERNAME_PROPERTY) == null && !normalizedProperties.containsKey(SPRING_DATASOURCE_USERNAME)) {
                DatabaseUrlNormalizer.Credentials creds = DatabaseUrlNormalizer.extractCredentials(datasourceUrl);
                if (creds != null && creds.username() != null) {
                    normalizedProperties.put(SPRING_DATASOURCE_USERNAME, creds.username());
                    if (creds.password() != null) {
                        normalizedProperties.put(SPRING_DATASOURCE_PASSWORD, creds.password());
                    }
                }
            }
        }

        if (!normalizedProperties.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, normalizedProperties));
        }
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
