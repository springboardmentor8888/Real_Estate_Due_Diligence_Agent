package com.realestate.agent;

import com.realestate.agent.config.DatabaseUrlEnvironmentPostProcessor;
import com.realestate.agent.config.DatabaseUrlNormalizationBeanPostProcessor;
import com.realestate.agent.config.DatabaseUrlNormalizer;
import com.realestate.agent.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.postgresql.Driver;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseUrlNormalizationTest {

    @Test
    void testRenderUrlFormatWithCredentialsStripped() {
        String renderUrl = "postgresql://real_estate_user:secret_password@dpg-c123456789.oregon-postgres.render.com/real_estate_db_5adt";
        String normalized = DatabaseUrlNormalizer.normalize(renderUrl);

        // Result must start with jdbc:postgresql://
        assertTrue(normalized.startsWith("jdbc:postgresql://"));

        // Credentials must NOT be present in the JDBC URL
        assertFalse(normalized.contains("real_estate_user"), "Normalized URL must not contain username");
        assertFalse(normalized.contains("secret_password"), "Normalized URL must not contain password");
        assertFalse(normalized.contains("@"), "Normalized URL must not contain '@'");

        // Exact expected JDBC URL
        assertEquals("jdbc:postgresql://dpg-c123456789.oregon-postgres.render.com/real_estate_db_5adt", normalized);
    }

    @Test
    void testRenderUrlWithPortAndQueryParams() {
        String renderUrl = "postgresql://real_estate_user:secret_password@dpg-c123456789.oregon-postgres.render.com:5432/real_estate_db_5adt?sslmode=require";
        String normalized = DatabaseUrlNormalizer.normalize(renderUrl);

        assertEquals("jdbc:postgresql://dpg-c123456789.oregon-postgres.render.com:5432/real_estate_db_5adt?sslmode=require", normalized);
        assertFalse(normalized.contains("real_estate_user"));
        assertFalse(normalized.contains("secret_password"));
    }

    @Test
    void testJdbcUrlWithCredentialsStripped() {
        String jdbcWithCreds = "jdbc:postgresql://real_estate_user:secret_password@dpg-c123456789.oregon-postgres.render.com/real_estate_db_5adt";
        String normalized = DatabaseUrlNormalizer.normalize(jdbcWithCreds);

        assertEquals("jdbc:postgresql://dpg-c123456789.oregon-postgres.render.com/real_estate_db_5adt", normalized);
        assertFalse(normalized.contains("real_estate_user"));
        assertFalse(normalized.contains("secret_password"));
    }

    @Test
    void testLocalDevelopmentUrlRemainsUnchanged() {
        String localUrl = "jdbc:postgresql://localhost:5432/real_estate_due_diligence";
        assertEquals(localUrl, DatabaseUrlNormalizer.normalize(localUrl));
    }

    @Test
    void testPostgresqlWithoutCredentialsGetsJdbcPrefix() {
        String url = "postgresql://localhost:5432/real_estate_due_diligence";
        assertEquals("jdbc:postgresql://localhost:5432/real_estate_due_diligence", DatabaseUrlNormalizer.normalize(url));
    }

    @Test
    void testUrlEncodedCredentialsAndQueryParams() {
        String url = "postgresql://user%40domain:p%40ss%3Aword@db.render.com:5432/prod_db?ssl=true&sslmode=require";
        String normalized = DatabaseUrlNormalizer.normalize(url);

        assertEquals("jdbc:postgresql://db.render.com:5432/prod_db?ssl=true&sslmode=require", normalized);

        DatabaseUrlNormalizer.Credentials creds = DatabaseUrlNormalizer.extractCredentials(url);
        assertNotNull(creds);
        assertEquals("user@domain", creds.username());
        assertEquals("p@ss:word", creds.password());
    }

    @Test
    void testDriverRejectsUrlWithCredentialsAndAcceptsNormalized() {
        Driver driver = new Driver();
        String renderUrlWithCreds = "jdbc:postgresql://real_estate_user:secret_password@dpg-c123456789.oregon-postgres.render.com/real_estate_db_5adt";

        // Without stripping credentials, PostgreSQL driver parse fails or rejects
        // because "real_estate_user:secret_password@..." contains colons in host
        assertFalse(driver.acceptsURL(renderUrlWithCreds),
                "org.postgresql.Driver must reject URLs with credentials in authority");

        // After normalization, driver accepts the URL
        String normalized = DatabaseUrlNormalizer.normalize(renderUrlWithCreds);
        assertTrue(driver.acceptsURL(normalized),
                "org.postgresql.Driver must accept normalized URL without authority credentials");
    }

    @Test
    void testEnvironmentPostProcessorWithRenderUrlAndPreservedDbCredentials() {
        StandardEnvironment environment = new StandardEnvironment();
        Map<String, Object> testProps = new HashMap<>();
        testProps.put("DB_URL", "postgresql://real_estate_user:secret@dpg-host:5432/real_estate_db");
        testProps.put("DB_USERNAME", "custom_user");
        testProps.put("DB_PASSWORD", "custom_pass");
        environment.getPropertySources().addFirst(new MapPropertySource("renderEnv", testProps));

        DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();
        processor.postProcessEnvironment(environment, null);

        // URL must be normalized without credentials
        assertEquals("jdbc:postgresql://dpg-host:5432/real_estate_db", environment.getProperty("DB_URL"));
        assertEquals("jdbc:postgresql://dpg-host:5432/real_estate_db", environment.getProperty("spring.datasource.url"));

        // Explicit DB_USERNAME and DB_PASSWORD must be preserved
        assertEquals("custom_user", environment.getProperty("DB_USERNAME"));
        assertEquals("custom_pass", environment.getProperty("DB_PASSWORD"));
        assertNull(environment.getProperty("spring.datasource.username"), "Explicit DB_USERNAME takes precedence");
    }

    @Test
    void testEnvironmentPostProcessorExtractsCredentialsWhenDbUsernameNotSet() {
        StandardEnvironment environment = new StandardEnvironment();
        Map<String, Object> testProps = new HashMap<>();
        testProps.put("DB_URL", "postgresql://render_user:render_secret@dpg-render-host:5432/render_db");
        environment.getPropertySources().addFirst(new MapPropertySource("renderEnv", testProps));

        DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();
        processor.postProcessEnvironment(environment, null);

        // URL is clean
        assertEquals("jdbc:postgresql://dpg-render-host:5432/render_db", environment.getProperty("spring.datasource.url"));

        // Fallback datasource credentials extracted
        assertEquals("render_user", environment.getProperty("spring.datasource.username"));
        assertEquals("render_secret", environment.getProperty("spring.datasource.password"));
    }

    @Test
    void testBeanPostProcessorStripsCredentialsFromDataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        properties.setUrl("postgresql://user:pass@host:5432/db");
        properties.setUsername("existing_user");
        properties.setPassword("existing_pass");

        DatabaseUrlNormalizationBeanPostProcessor postProcessor = new DatabaseUrlNormalizationBeanPostProcessor();
        postProcessor.postProcessBeforeInitialization(properties, "dataSourceProperties");

        // URL has credentials stripped
        assertEquals("jdbc:postgresql://host:5432/db", properties.getUrl());
        // Username and password on DataSourceProperties remain intact
        assertEquals("existing_user", properties.getUsername());
        assertEquals("existing_pass", properties.getPassword());
    }

    @Test
    void testBeanPostProcessorLeavesLocalDataSourcePropertiesUnchanged() {
        DataSourceProperties properties = new DataSourceProperties();
        String localUrl = "jdbc:postgresql://localhost:5432/real_estate_due_diligence";
        properties.setUrl(localUrl);
        properties.setUsername("postgres");

        DatabaseUrlNormalizationBeanPostProcessor postProcessor = new DatabaseUrlNormalizationBeanPostProcessor();
        postProcessor.postProcessBeforeInitialization(properties, "dataSourceProperties");

        assertEquals(localUrl, properties.getUrl());
        assertEquals("postgres", properties.getUsername());
    }

    @Test
    void testNormalizerHandlesNullAndEmpty() {
        assertNull(DatabaseUrlNormalizer.normalize(null));
        assertEquals("", DatabaseUrlNormalizer.normalize(""));
        assertEquals("", DatabaseUrlNormalizer.normalize("   "));
    }

    @Test
    void testCorsConfigurationAllowsVercelFrontend() {
        SecurityConfig config = new SecurityConfig(null, null, null, null, null, null);
        org.springframework.test.util.ReflectionTestUtils.setField(config, "frontendBaseUrl", "https://realestate-due-diligence.vercel.app");
        org.springframework.test.util.ReflectionTestUtils.setField(config, "allowedOrigins", "http://localhost:3000,https://realestate-due-diligence.vercel.app");

        org.springframework.web.cors.CorsConfigurationSource source = config.corsConfigurationSource();
        org.springframework.mock.web.MockHttpServletRequest request = new org.springframework.mock.web.MockHttpServletRequest();
        request.setRequestURI("/api/auth/login");
        request.addHeader("Origin", "https://realestate-due-diligence.vercel.app");

        org.springframework.web.cors.CorsConfiguration corsConfig = source.getCorsConfiguration(request);
        assertNotNull(corsConfig);
        assertEquals("https://realestate-due-diligence.vercel.app", corsConfig.checkOrigin("https://realestate-due-diligence.vercel.app"));
        assertEquals("https://preview-123.vercel.app", corsConfig.checkOrigin("https://preview-123.vercel.app"));
        assertEquals("http://localhost:3000", corsConfig.checkOrigin("http://localhost:3000"));
        assertTrue(corsConfig.getAllowCredentials());
    }
}
