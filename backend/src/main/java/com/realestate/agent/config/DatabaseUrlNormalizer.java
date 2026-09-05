package com.realestate.agent.config;

/**
 * Utility for normalizing PostgreSQL database connection URLs.
 * Ensures URLs starting with "postgresql://" are converted to standard JDBC URLs
 * starting with "jdbc:postgresql://", as required by org.postgresql.Driver.
 */
public final class DatabaseUrlNormalizer {

    public static final String POSTGRESQL_PREFIX = "postgresql://";
    public static final String JDBC_POSTGRESQL_PREFIX = "jdbc:postgresql://";

    private DatabaseUrlNormalizer() {
    }

    /**
     * Normalizes a database URL:
     * - If DB_URL starts with "postgresql://", prepend "jdbc:"
     * - If DB_URL already starts with "jdbc:postgresql://", leave it unchanged.
     * - If null or empty, returns as-is.
     *
     * @param url the input database URL
     * @return the normalized JDBC database URL
     */
    public static String normalize(String url) {
        if (url == null) {
            return null;
        }
        String trimmed = url.trim();
        if (trimmed.isEmpty()) {
            return trimmed;
        }
        if (trimmed.startsWith(JDBC_POSTGRESQL_PREFIX)) {
            return trimmed;
        }
        if (trimmed.startsWith(POSTGRESQL_PREFIX)) {
            return "jdbc:" + trimmed;
        }
        return trimmed;
    }
}
