package com.realestate.agent.security;

import com.realestate.agent.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (user.getRole() == null || user.getRole().getRoleName() == null) {
            System.out.println("⚠️ [CustomUserDetails] User " + getUsername() + " has NO role in DB!");
            return Collections.emptyList();
        }
        String rawRole = user.getRole().getRoleName().trim().toUpperCase();
        String baseRole = rawRole.startsWith("ROLE_") ? rawRole.substring(5) : rawRole;
        String roleWithPrefix = "ROLE_" + baseRole;

        return List.of(
                new SimpleGrantedAuthority(roleWithPrefix),
                new SimpleGrantedAuthority(baseRole)
        );
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getIsActive() != null && user.getIsActive();
    }
}