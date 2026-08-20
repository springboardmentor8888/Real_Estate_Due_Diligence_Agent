package com.realestate.agent.config;

import com.realestate.agent.entity.Role;
import com.realestate.agent.entity.User;
import com.realestate.agent.repository.RoleRepository;
import com.realestate.agent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Startup database sanitizer that ensures:
 * 1. Every user in PostgreSQL is assigned one of the 5 valid roles (BUYER, SELLER, AGENT, LEGAL_REVIEWER, BANK).
 * 2. Any legacy ADMIN user (such as system account) is safely migrated to AGENT role.
 * 3. Any null or blank roles/statuses are fixed cleanly.
 * 4. ADMIN is completely purged from roles table.
 */
@Component
@RequiredArgsConstructor
public class DatabaseSanitizerRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSanitizerRunner.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Running Database Sanitizer: Ensuring role and status consistency across PostgreSQL...");

        // Ensure 5 standard roles exist in roles table
        List<String> standardRoles = List.of("BUYER", "SELLER", "AGENT", "LEGAL_REVIEWER", "BANK");
        for (String roleName : standardRoles) {
            if (roleRepository.findByRoleName(roleName).isEmpty()) {
                Role newRole = Role.builder()
                        .roleName(roleName)
                        .description(roleName + " role")
                        .isActive(true)
                        .build();
                roleRepository.save(newRole);
                log.info("Seeded missing role: {}", roleName);
            }
        }

        Role defaultAgentRole = roleRepository.findByRoleName("AGENT").orElseThrow();
        Role defaultBuyerRole = roleRepository.findByRoleName("BUYER").orElseThrow();

        // Migrate all users in database
        List<User> users = userRepository.findAll();
        for (User user : users) {
            boolean updated = false;

            // Fix NULL or blank roles or ADMIN role
            if (user.getRole() == null || user.getRole().getRoleName() == null || user.getRole().getRoleName().trim().isEmpty()) {
                user.setRole(defaultBuyerRole);
                updated = true;
                log.info("Migrated user ID {} ({}) from null role to BUYER", user.getUserId(), user.getEmail());
            } else if ("ADMIN".equalsIgnoreCase(user.getRole().getRoleName().trim())) {
                user.setRole(defaultAgentRole);
                updated = true;
                log.info("Migrated user ID {} ({}) from ADMIN role to AGENT", user.getUserId(), user.getEmail());
            }

            // Fix NULL active status
            if (user.getIsActive() == null) {
                user.setIsActive(true);
                updated = true;
            }

            // Fix NULL emailVerified status
            if (user.getEmailVerified() == null) {
                user.setEmailVerified(true);
                updated = true;
            }

            if (updated) {
                userRepository.save(user);
            }
        }

        // Safely delete ADMIN role from roles table if it exists
        Optional<Role> adminRoleOpt = roleRepository.findByRoleName("ADMIN");
        if (adminRoleOpt.isPresent()) {
            try {
                roleRepository.delete(adminRoleOpt.get());
                log.info("Successfully purged ADMIN role from PostgreSQL roles table");
            } catch (Exception e) {
                log.warn("Could not delete ADMIN role record (might be referenced), but all users have been re-assigned.");
            }
        }

        log.info("Database Sanitizer complete. All users now possess valid application roles.");
    }
}
