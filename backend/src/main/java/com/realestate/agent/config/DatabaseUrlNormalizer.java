package com.realestate.agent.config;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * Utility for normalizing PostgreSQL database connection URLs.
 * <p>
 * Specifically handles platforms like Render where database URLs are provided in URI format:
 *   postgresql://USERNAME:PASSWORD@HOST[:PORT]/DATABASE[?params]
 * <p>
 * Converts them to standard JDBC format expected by org.postgresql.Driver:
 *   jdbc:postgresql://HOST[:PORT]/DATABASE[?params]
 * <p>
 * Strips username and password from the authority in the JDBC URL,
 * allowing authentication to be handled cleanly through Spring DataSource credentials.
 */
public final class DatabaseUrlNormalizer {

    public static final String POSTGRESQL_PREFIX = "postgresql://";
    public static final String JDBC_POSTGRESQL_PREFIX = "jdbc:postgresql://";

    private DatabaseUrlNormalizer() {
    }

    /**
     * Normalizes a database URL for PostgreSQL JDBC driver compatibility:
     * - Strips user credentials (username:password@) from authority if present.
     * - Ensures the scheme prefix is "jdbc:postgresql://".
     * - Leaves standard "jdbc:postgresql://HOST..." URLs unchanged.
     * - Preserves ports, paths, and query parameters.
     *
     * @param url the input database URL
     * @return the normalized JDBC database URL without credentials in authority
     */
    public static String normalize(String url) {
        if (url == null) {
            return null;
        }
        String trimmed = url.trim();
        if (trimmed.isEmpty()) {
            return trimmed;
        }

        String rest;
        if (trimmed.startsWith(JDBC_POSTGRESQL_PREFIX)) {
            rest = trimmed.substring(JDBC_POSTGRESQL_PREFIX.length());
        } else if (trimmed.startsWith(POSTGRESQL_PREFIX)) {
            rest = trimmed.substring(POSTGRESQL_PREFIX.length());
        } else {
            return trimmed;
        }

        // rest is now of the form: [user[:password]@]host[:port][/database][?params]
        int slashIndex = rest.indexOf('/');
        int questionIndex = rest.indexOf('?');
        int pathStart;
        if (slashIndex != -1) {
            pathStart = slashIndex;
        } else if (questionIndex != -1) {
            pathStart = questionIndex;
        } else {
            pathStart = rest.length();
        }

        String authority = rest.substring(0, pathStart);
        String pathAndQuery = rest.substring(pathStart);

        // Check if authority contains credentials: user[:password]@host[:port]
        int atIndex = authority.lastIndexOf('@');
        String hostAndPort;
        if (atIndex != -1) {
            hostAndPort = authority.substring(atIndex + 1);
        } else {
            hostAndPort = authority;
        }

        return JDBC_POSTGRESQL_PREFIX + hostAndPort + pathAndQuery;
    }

    /**
     * Extracts credentials (username and password) from a database URL if present in authority.
     *
     * @param url the database URL
     * @return Credentials if present, or null if no credentials found
     */
    public static Credentials extractCredentials(String url) {
        if (url == null) {
            return null;
        }
        String trimmed = url.trim();
        String rest;
        if (trimmed.startsWith(JDBC_POSTGRESQL_PREFIX)) {
            rest = trimmed.substring(JDBC_POSTGRESQL_PREFIX.length());
        } else if (trimmed.startsWith(POSTGRESQL_PREFIX)) {
            rest = trimmed.substring(POSTGRESQL_PREFIX.length());
        } else {
            return null;
        }

        int slashIndex = rest.indexOf('/');
        int questionIndex = rest.indexOf('?');
        int pathStart;
        if (slashIndex != -1) {
            pathStart = slashIndex;
        } else if (questionIndex != -1) {
            pathStart = questionIndex;
        } else {
            pathStart = rest.length();
        }

        String authority = rest.substring(0, pathStart);
        int atIndex = authority.lastIndexOf('@');
        if (atIndex == -1) {
            return null;
        }

        String userInfo = authority.substring(0, atIndex);
        if (userInfo.isEmpty()) {
            return null;
        }

        String username;
        String password = null;
        int colonIndex = userInfo.indexOf(':');
        if (colonIndex != -1) {
            username = decode(userInfo.substring(0, colonIndex));
            password = decode(userInfo.substring(colonIndex + 1));
        } else {
            username = decode(userInfo);
        }

        return new Credentials(username, password);
    }

    private static String decode(String value) {
        if (value == null) {
            return null;
        }
        try {
            return URLDecoder.decode(value, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return value;
        }
    }

    public record Credentials(String username, String password) {
    }
}
