package com.realestate.agent.controller;

import com.realestate.agent.entity.Role;
import com.realestate.agent.entity.User;
import com.realestate.agent.repository.RoleRepository;
import com.realestate.agent.repository.UserRepository;
import com.realestate.agent.security.CustomUserDetails;
import com.realestate.agent.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class UserController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private static final Set<String> ALLOWED_ROLES = Set.of("BUYER", "SELLER", "AGENT", "LEGAL_REVIEWER", "BANK");

    // -------------------------------------------------------
    // SELF-SERVICE: any authenticated user (all 5 roles)
    // -------------------------------------------------------

    /** Returns the currently logged-in user's own profile. All roles allowed. */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        User user = userDetails.getUser();
        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "BUYER";
        if ("ADMIN".equalsIgnoreCase(roleName)) roleName = "AGENT";

        Map<String, Object> response = new HashMap<>();
        response.put("userId",       user.getUserId());
        response.put("email",        user.getEmail());
        response.put("firstName",    user.getFirstName());
        response.put("lastName",     user.getLastName());
        response.put("fullName",     ((user.getFirstName() != null ? user.getFirstName() : "") + " "
                                    + (user.getLastName()  != null ? user.getLastName()  : "")).trim());
        response.put("phone",        user.getPhone());
        response.put("role",         roleName);
        response.put("isActive",     user.getIsActive()     != null ? user.getIsActive()     : true);
        response.put("emailVerified",user.getEmailVerified() != null ? user.getEmailVerified() : true);
        return ResponseEntity.ok(response);
    }

    /** Update own profile (name, phone). All roles allowed. */
    @PutMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (userDetails == null || userDetails.getUser() == null ||
                    !userId.equals(userDetails.getUser().getUserId())) {
                return ResponseEntity.status(403).body(Map.of("error", "You may only update your own profile"));
            }
            User user = authService.getUserById(userId);
            if (request.containsKey("firstName")) user.setFirstName((String) request.get("firstName"));
            if (request.containsKey("lastName"))  user.setLastName((String)  request.get("lastName"));
            if (request.containsKey("phone"))     user.setPhone((String)     request.get("phone"));

            User saved = userRepository.save(user);
            Map<String, Object> response = new HashMap<>();
            response.put("userId",  saved.getUserId());
            response.put("email",   saved.getEmail());
            response.put("firstName", saved.getFirstName());
            response.put("lastName",  saved.getLastName());
            response.put("role",    saved.getRole() != null ? saved.getRole().getRoleName() : "BUYER");
            response.put("message", "Profile updated successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** Get any single user by ID (own profile view). All roles allowed. */
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserById(
            @PathVariable Long userId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (userDetails == null || userDetails.getUser() == null ||
                    !userId.equals(userDetails.getUser().getUserId())) {
                return ResponseEntity.status(403).body(Map.of("error", "You may only view your own profile"));
            }
            User user = authService.getUserById(userId);
            String roleName = user.getRole() != null ? user.getRole().getRoleName() : "BUYER";
            if ("ADMIN".equalsIgnoreCase(roleName)) roleName = "AGENT";

            Map<String, Object> response = new HashMap<>();
            response.put("userId",       user.getUserId());
            response.put("id",           user.getUserId());
            response.put("email",        user.getEmail());
            response.put("firstName",    user.getFirstName());
            response.put("lastName",     user.getLastName());
            response.put("fullName",     ((user.getFirstName() != null ? user.getFirstName() : "") + " "
                                        + (user.getLastName()  != null ? user.getLastName()  : "")).trim());
            response.put("role",         roleName);
            response.put("isActive",     user.getIsActive()     != null ? user.getIsActive()     : true);
            response.put("emailVerified",user.getEmailVerified() != null ? user.getEmailVerified() : true);
            response.put("createdAt",    user.getCreatedAt());
            response.put("lastLogin",    user.getLastLogin());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // -------------------------------------------------------
    // AGENT-ONLY: system directory / user management
    // -------------------------------------------------------

    /** List all registered users. AGENT only. */
    @GetMapping
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> userList = new ArrayList<>();
            for (User u : users) {
                String roleName = u.getRole() != null ? u.getRole().getRoleName() : "BUYER";
                if ("ADMIN".equalsIgnoreCase(roleName) || roleName.trim().isEmpty()) roleName = "AGENT";

                String fn = u.getFirstName() != null ? u.getFirstName() : "";
                String ln = u.getLastName()  != null ? u.getLastName()  : "";
                String fullName = (fn + " " + ln).trim();
                if (fullName.isEmpty()) fullName = "Registered User";

                Map<String, Object> um = new HashMap<>();
                um.put("id",           u.getUserId());
                um.put("userId",       u.getUserId());
                um.put("fullName",     fullName);
                um.put("firstName",    u.getFirstName());
                um.put("lastName",     u.getLastName());
                um.put("email",        u.getEmail());
                um.put("role",         roleName);
                um.put("active",       u.getIsActive()     != null ? u.getIsActive()     : true);
                um.put("emailVerified",u.getEmailVerified() != null ? u.getEmailVerified() : true);
                um.put("createdAt",    u.getCreatedAt());
                um.put("lastLogin",    u.getLastLogin());
                userList.add(um);
            }
            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch users: " + e.getMessage()));
        }
    }

    /** Aggregated user stats. AGENT only. */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<?> getUserStats() {
        try {
            List<User> users = userRepository.findAll();

            long totalBuyers = 0, totalSellers = 0, totalAgents = 0, totalLegal = 0, totalBanks = 0;
            long activeUsers = 0, inactiveUsers = 0;

            for (User u : users) {
                String role = u.getRole() != null ? u.getRole().getRoleName() : "BUYER";
                if ("ADMIN".equalsIgnoreCase(role)) role = "AGENT";

                switch (role.toUpperCase()) {
                    case "BUYER":          totalBuyers++;  break;
                    case "SELLER":         totalSellers++; break;
                    case "AGENT":          totalAgents++;  break;
                    case "LEGAL_REVIEWER": totalLegal++;   break;
                    case "BANK":           totalBanks++;   break;
                    default:               totalBuyers++;  break;
                }
                if (u.getIsActive() != null && u.getIsActive()) activeUsers++;
                else inactiveUsers++;
            }

            long totalUsers = totalBuyers + totalSellers + totalAgents + totalLegal + totalBanks;
            LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
            long recentUsers = users.stream()
                    .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(sevenDaysAgo))
                    .count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers",         totalUsers);
            stats.put("totalBuyers",        totalBuyers);
            stats.put("totalSellers",       totalSellers);
            stats.put("totalAgents",        totalAgents);
            stats.put("totalLegalReviewers",totalLegal);
            stats.put("totalBanks",         totalBanks);
            stats.put("activeUsers",        activeUsers);
            stats.put("inactiveUsers",      inactiveUsers);
            stats.put("recentlyRegistered", recentUsers);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to calculate user stats"));
        }
    }

    /** Change a user's role. AGENT only. */
    @PutMapping("/{userId}/role")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {

        String roleName = request.get("role");
        if (roleName == null || roleName.trim().isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Role cannot be empty"));

        String targetRole = roleName.trim().toUpperCase();
        if (!ALLOWED_ROLES.contains(targetRole))
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid role. Allowed: BUYER, SELLER, AGENT, LEGAL_REVIEWER, BANK"));

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            Role roleEntity = roleRepository.findByRoleName(targetRole)
                    .orElseGet(() -> roleRepository.save(
                            Role.builder().roleName(targetRole).description(targetRole + " role").isActive(true).build()));
            user.setRole(roleEntity);
            User saved = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("userId",  saved.getUserId());
            response.put("id",      saved.getUserId());
            response.put("email",   saved.getEmail());
            response.put("firstName", saved.getFirstName());
            response.put("lastName",  saved.getLastName());
            response.put("role",    saved.getRole().getRoleName());
            response.put("message", "Role updated to " + saved.getRole().getRoleName());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** Toggle a user's active/inactive status. AGENT only. */
    @PutMapping("/{userId}/status")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            boolean newStatus = user.getIsActive() == null || !user.getIsActive();
            user.setIsActive(newStatus);
            User saved = userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "active", saved.getIsActive()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** Delete a user account. AGENT only. */
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
