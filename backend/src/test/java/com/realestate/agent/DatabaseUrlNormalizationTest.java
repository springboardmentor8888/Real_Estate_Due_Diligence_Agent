package com.realestate.agent;

import com.realestate.agent.config.DatabaseUrlEnvironmentPostProcessor;
import com.realestate.agent.config.DatabaseUrlNormalizationBeanPostProcessor;
import com.realestate.agent.config.DatabaseUrlNormalizer;
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
    void testNormalizerPrependsJdbcWhenUrlStartsWithPostgresql() {
        String renderUrl = "postgresql://dpg-test-a.oregon-postgres.render.com:5432/real_estate_db?sslmode=require";
        String expected = "jdbc:postgresql://dpg-test-a.oregon-postgres.render.com:5432/real_estate_db?sslmode=require";
        assertEquals(expected, DatabaseUrlNormalizer.normalize(renderUrl));
    }

    @Test
    void testNormalizerLeavesJdbcPostgresqlUnchanged() {
        String standardJdbcUrl = "jdbc:postgresql://localhost:5432/real_estate_due_diligence";
        assertEquals(standardJdbcUrl, DatabaseUrlNormalizer.normalize(standardJdbcUrl));
    }

    @Test
    void testNormalizerHandlesNullAndEmpty() {
        assertNull(DatabaseUrlNormalizer.normalize(null));
        assertEquals("", DatabaseUrlNormalizer.normalize(""));
        assertEquals("", DatabaseUrlNormalizer.normalize("   "));
    }

    @Test
    void testNormalizerHandlesWhitespaceAroundPostgresqlUrl() {
        String paddedUrl = "  postgresql://localhost:5432/real_estate_due_diligence  ";
        String expected = "jdbc:postgresql://localhost:5432/real_estate_due_diligence";
        assertEquals(expected, DatabaseUrlNormalizer.normalize(paddedUrl));
    }

    @Test
    void testDriverAcceptsNormalizedUrl() {
        Driver driver = new Driver();
        String renderUrl = "postgresql://localhost:5432/real_estate_due_diligence";

        // Without normalization, driver refuses the URL
        assertFalse(driver.acceptsURL(renderUrl), "org.postgresql.Driver must reject raw postgresql:// URLs");

        // After normalization, driver accepts the URL
        String normalizedUrl = DatabaseUrlNormalizer.normalize(renderUrl);
        assertTrue(driver.acceptsURL(normalizedUrl), "org.postgresql.Driver must accept normalized jdbc:postgresql:// URLs");
    }

    @Test
    void testEnvironmentPostProcessorNormalizesDbUrl() {
        StandardEnvironment environment = new StandardEnvironment();
        Map<String, Object> testProps = new HashMap<>();
        testProps.put("DB_URL", "postgresql://dpg-render-postgres:5432/real_estate");
        environment.getPropertySources().addFirst(new MapPropertySource("renderEnv", testProps));

        DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();
        processor.postProcessEnvironment(environment, null);

        assertEquals("jdbc:postgresql://dpg-render-postgres:5432/real_estate", environment.getProperty("DB_URL"));
        assertEquals("jdbc:postgresql://dpg-render-postgres:5432/real_estate", environment.getProperty("spring.datasource.url"));
    }

    @Test
    void testEnvironmentPostProcessorLeavesValidJdbcUrlUnchanged() {
        StandardEnvironment environment = new StandardEnvironment();
        Map<String, Object> testProps = new HashMap<>();
        String validJdbcUrl = "jdbc:postgresql://postgres:5432/real_estate_due_diligence";
        testProps.put("DB_URL", validJdbcUrl);
        environment.getPropertySources().addFirst(new MapPropertySource("localEnv", testProps));

        DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();
        processor.postProcessEnvironment(environment, null);

        assertEquals(validJdbcUrl, environment.getProperty("DB_URL"));
        assertNull(environment.getProperty("spring.datasource.url"));
    }

    @Test
    void testEnvironmentPostProcessorNormalizesDatabaseUrlFallback() {
        StandardEnvironment environment = new StandardEnvironment();
        Map<String, Object> testProps = new HashMap<>();
        testProps.put("DATABASE_URL", "postgresql://render-host:5432/db");
        environment.getPropertySources().addFirst(new MapPropertySource("renderEnv", testProps));

        DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();
        processor.postProcessEnvironment(environment, null);

        assertEquals("jdbc:postgresql://render-host:5432/db", environment.getProperty("DB_URL"));
        assertEquals("jdbc:postgresql://render-host:5432/db", environment.getProperty("spring.datasource.url"));
    }

    @Test
    void testBeanPostProcessorNormalizesDataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        properties.setUrl("postgresql://render-host:5432/db");

        DatabaseUrlNormalizationBeanPostProcessor postProcessor = new DatabaseUrlNormalizationBeanPostProcessor();
        postProcessor.postProcessBeforeInitialization(properties, "dataSourceProperties");

        assertEquals("jdbc:postgresql://render-host:5432/db", properties.getUrl());
    }

    @Test
    void testBeanPostProcessorPreservesValidDataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        String validUrl = "jdbc:postgresql://localhost:5432/db";
        properties.setUrl(validUrl);

        DatabaseUrlNormalizationBeanPostProcessor postProcessor = new DatabaseUrlNormalizationBeanPostProcessor();
        postProcessor.postProcessBeforeInitialization(properties, "dataSourceProperties");

        assertEquals(validUrl, properties.getUrl());
    }

    @Test
    void testSpringApplicationDiscoversAndExecutesEnvironmentPostProcessor() {
        org.springframework.context.ConfigurableApplicationContext context =
                new org.springframework.boot.builder.SpringApplicationBuilder()
                        .sources(com.realestate.agent.config.DatabaseUrlNormalizationBeanPostProcessor.class)
                        .web(org.springframework.boot.WebApplicationType.NONE)
                        .run("--DB_URL=postgresql://dpg-render-sample.oregon-postgres.render.com:5432/test_db");
        try {
            assertEquals("jdbc:postgresql://dpg-render-sample.oregon-postgres.render.com:5432/test_db",
                    context.getEnvironment().getProperty("DB_URL"));
            assertEquals("jdbc:postgresql://dpg-render-sample.oregon-postgres.render.com:5432/test_db",
                    context.getEnvironment().getProperty("spring.datasource.url"));
        } finally {
            context.close();
        }
    }
}
