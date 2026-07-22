package com.realestate.due_diligence.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT utility service.
 *
 * <p>Uses JJWT 0.12.6 API (not the legacy 0.9.x API).
 * Reads {@code jwt.secret} (256-bit Base64-encoded string) and {@code jwt.expiration}
 * (milliseconds) from application.properties.
 *
 * <p>Token structure:
 * <ul>
 *   <li>Header  : {"alg":"HS256","typ":"JWT"}</li>
 *   <li>Payload : {"sub":"<email>","iat":"<issued>","exp":"<expiry>"}</li>
 *   <li>Signature: HMAC-SHA256 with jwt.secret</li>
 * </ul>
 */
@Service
public class JwtService {

    /**
     * 256-bit Base64-encoded HMAC-SHA256 signing key.
     * Injected from application.properties: jwt.secret
     * Decoded at runtime via JJWT's {@code Decoders.BASE64.decode()}.
     */
    @Value("${jwt.secret}")
    private String secretKey;

    /**
     * Token validity period in milliseconds.
     * Injected from application.properties: jwt.expiration
     * Default configured value: 86400000 ms = 24 hours.
     */
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Generate a JWT token for the given UserDetails.
     * The token subject is set to {@code userDetails.getUsername()} (= email).
     *
     * @param userDetails the authenticated user
     * @return signed compact JWT string
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generate a JWT token with additional extra claims.
     *
     * @param extraClaims additional claims to embed in the payload
     * @param userDetails the authenticated user
     * @return signed compact JWT string
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())          // subject = email
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())                   // HMAC-SHA256
                .compact();
    }

    /**
     * Extract the username (email) from a JWT token.
     *
     * @param token the JWT string
     * @return the subject claim (email address)
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Validate a JWT token against the given UserDetails.
     * Checks: (1) username matches, (2) token not expired.
     *
     * @param token       the JWT string
     * @param userDetails the UserDetails to validate against
     * @return {@code true} if the token is valid
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Extract a single claim from the token using a resolver function.
     *
     * @param token          the JWT string
     * @param claimsResolver a function mapping Claims → T
     * @param <T>            the claim type
     * @return the extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Parse and return all claims from the token.
     * Throws {@link io.jsonwebtoken.JwtException} if the token is
     * invalid, tampered, or expired.
     *
     * <p>Uses the JJWT 0.12.6 API:
     * {@code Jwts.parser().verifyWith(key).build().parseSignedClaims(token)}
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())   // supply the signing key for verification
                .build()
                .parseSignedClaims(token)      // parse + verify signature in one step
                .getPayload();                 // return the Claims body
    }

    /**
     * Check whether the token's expiration date is before now.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extract the expiration date from the token.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Decode the Base64-encoded {@code jwt.secret} into an HMAC-SHA256 SecretKey.
     *
     * <p>Uses JJWT's built-in {@code io.jsonwebtoken.io.Decoders.BASE64.decode()}
     * — no custom byte conversion needed.
     * {@code Keys.hmacShaKeyFor(byte[])} then wraps the bytes as a
     * {@code SecretKey} suitable for HMAC-SHA256 signing.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}