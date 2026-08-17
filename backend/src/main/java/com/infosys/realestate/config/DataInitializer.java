package com.infosys.realestate.config;

import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.Role;
import com.infosys.realestate.entity.User;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.RoleRepository;
import com.infosys.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Ensure ADMIN role exists
        Role adminRole = roleRepository.findByRoleName("ADMIN")
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setRoleName("ADMIN");
                    return roleRepository.save(r);
                });

        // Ensure USER role exists
        roleRepository.findByRoleName("USER")
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setRoleName("USER");
                    return roleRepository.save(r);
                });

        // 2. Ensure admin@example.com user exists and has ADMIN role
        User adminUser = userRepository.findByEmail("admin@example.com")
                .orElseGet(() -> {
                    User u = new User();
                    u.setName("System Admin");
                    u.setEmail("admin@example.com");
                    u.setPassword(passwordEncoder.encode("admin123"));
                    return u;
                });

        // Always ensure ADMIN role is set (in case user existed without a role)
        adminUser.setRole(adminRole);
        adminUser = userRepository.save(adminUser);

        // 3. Ensure sample Property exists
        if (propertyRepository.count() == 0) {
            Property p1 = new Property();
            p1.setPropertyName("Luxury Villa");
            p1.setAddress("12 Anna Nagar East");
            p1.setCity("Chennai");
            p1.setState("Tamil Nadu");
            p1.setZipCode("600040");
            p1.setPropertyType("Residential");
            p1.setCreatedBy(adminUser);
            propertyRepository.save(p1);
        }
    }
}
