package com.realestate.due_diligence.security;

import com.realestate.due_diligence.repository.UserRepository;
import com.realestate.due_diligence.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Spring Security {@link UserDetailsService} implementation.
 *
 * <p>Loads a {@link User} from the database by email address and converts
 * it into a Spring Security {@link UserDetails} object.
 *
 * <p>Role mapping strategy (decided by project owner):
 * <ul>
 *   <li>The {@code roles} table stores plain names: {@code Buyer}, {@code Administrator}, etc.</li>
 *   <li>At runtime we prefix them with {@code "ROLE_"} to create a {@link SimpleGrantedAuthority}.</li>
 *   <li>The database is NOT modified — conversion is done here only.</li>
 * </ul>
 *
 * <p>Mapping examples:
 * <pre>
 *   DB role_name            → GrantedAuthority
 *   "Buyer"                 → "ROLE_Buyer"
 *   "Administrator"         → "ROLE_Administrator"
 *   "Real Estate Agent"     → "ROLE_Real Estate Agent"
 *   "Legal Reviewer"        → "ROLE_Legal Reviewer"
 *   "Financial Institution" → "ROLE_Financial Institution"
 * </pre>
 *
 * <p>A null {@code role} (role_id is nullable in the schema) results in an
 * empty authority list — the user can still authenticate but will be
 * denied access to role-restricted endpoints.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    /**
     * Reuses the existing repository — no duplicate repository created.
     * Uses {@link UserRepository#findByEmail(String)} to look up by email,
     * because email is the login identifier in this project.
     */
    private final UserRepository userRepository;

    /**
     * Load a user by their email address.
     *
     * <p>Spring Security calls this method during authentication.
     * The {@code username} parameter maps to the user's email in this project.
     *
     * @param email the email address used as the login identifier
     * @return a {@link UserDetails} built from the domain {@link User}
     * @throws UsernameNotFoundException if no user with that email exists
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Step 1: Fetch user from DB using the existing UserRepository method.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + email
                ));

        // Step 2: Build the authority list from the existing Role entity.
        //         role_id is nullable in the schema → guard against null role.
        List<SimpleGrantedAuthority> authorities = buildAuthorities(user);

        // Step 3: Return Spring Security's built-in UserDetails implementation.
        //         We do NOT modify the User entity — the domain object stays clean.
        //         UserDetails fields:
        //           username  = user.getEmail()    (login identifier)
        //           password  = user.getPassword() (BCrypt hash stored in DB)
        //           authorities = ROLE_<roleName>
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Convert the domain {@link User}'s role into a Spring Security authority list.
     *
     * <p>Prefix convention: Spring Security's {@code hasRole("X")} checks for
     * authority {@code "ROLE_X"}. We apply the {@code "ROLE_"} prefix here so
     * SecurityConfig can use {@code hasRole("Administrator")} naturally.
     *
     * @param user the domain user loaded from the database
     * @return a single-element list with {@code "ROLE_<roleName>"}, or an empty
     *         list if the user has no role assigned
     */
    private List<SimpleGrantedAuthority> buildAuthorities(User user) {

        // Null-safe guard: role_id is nullable (no NOT NULL constraint in DB).
        if (user.getRole() == null || user.getRole().getRoleName() == null) {
            return List.of();
        }

        String normalizedRoleName = user.getRole().getRoleName()
                .trim()
                .replace(" ", "_")
                .toUpperCase();

        String authority = "ROLE_" + normalizedRoleName;
        return List.of(new SimpleGrantedAuthority(authority));
    }
}
