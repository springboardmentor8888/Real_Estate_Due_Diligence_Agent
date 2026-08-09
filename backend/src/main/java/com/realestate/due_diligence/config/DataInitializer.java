package com.realestate.due_diligence.config;

import com.realestate.due_diligence.repository.RoleRepository;
import com.realestate.due_diligence.role.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        List<String> requiredRoles = List.of(
                "Buyer",
                "Real Estate Agent",
                "Legal Reviewer",
                "Financial Institution",
                "Administrator"
        );

        for (String roleName : requiredRoles) {
            if (roleRepository.findByRoleName(roleName).isEmpty()) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
                System.out.println("Seeded database role: " + roleName);
            }
        }
    }
}
