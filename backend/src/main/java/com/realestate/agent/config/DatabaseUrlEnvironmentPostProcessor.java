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
 * Specifically handles platforms like Render that provide database URLs starting
 * with "postgresql://" instead of the JDBC-required "jdbc:postgresql://".
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final Logger log = LoggerFactory.getLogger(DatabaseUrlEnvironmentPostProcessor.class);

    public static final String PROPERTY_SOURCE_NAME = "databaseUrlNormalization";
    public static final String DB_URL_PROPERTY = "DB_URL";
    public static final String DATABASE_URL_PROPERTY = "DATABASE_URL";
    public static final String SPRING_DATASOURCE_URL = "spring.datasource.url";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String dbUrl = environment.getProperty(DB_URL_PROPERTY);
        if (dbUrl == null) {
            dbUrl = environment.getProperty(DATABASE_URL_PROPERTY);
        }
        String datasourceUrl = environment.getProperty(SPRING_DATASOURCE_URL);

        Map<String, Object> normalizedProperties = new HashMap<>();

        if (dbUrl != null) {
            String normalizedDbUrl = DatabaseUrlNormalizer.normalize(dbUrl);
            if (!dbUrl.equals(normalizedDbUrl)) {
                log.info("Normalizing DB_URL for PostgreSQL JDBC compatibility: prefix 'jdbc:' prepended");
                normalizedProperties.put(DB_URL_PROPERTY, normalizedDbUrl);
                normalizedProperties.put(SPRING_DATASOURCE_URL, normalizedDbUrl);
            }
        }

        if (datasourceUrl != null) {
            String normalizedDatasourceUrl = DatabaseUrlNormalizer.normalize(datasourceUrl);
            if (!datasourceUrl.equals(normalizedDatasourceUrl)) {
                log.info("Normalizing spring.datasource.url for PostgreSQL JDBC compatibility: prefix 'jdbc:' prepended");
                normalizedProperties.put(SPRING_DATASOURCE_URL, normalizedDatasourceUrl);
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
