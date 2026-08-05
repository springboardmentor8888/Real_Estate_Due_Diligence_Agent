INSERT INTO roles (role_name) VALUES
('BUYER'),
('REAL_ESTATE_AGENT'),
('LEGAL_REVIEWER'),
('FINANCIAL_INSTITUTION'),
('ADMINISTRATOR'),
('ADMIN');

-- Default Admin User (Password is 'admin123' hashed with BCrypt)
INSERT INTO users (name, email, password, role_id, created_at) VALUES 
('System Admin', 'admin@example.com', '$2a$10$e.w2.b6Q5lA9H9.E4Xk0Iu6O5h6P.VlQ8N2E2aO2e4M4R.U4q4K22', (SELECT role_id FROM roles WHERE role_name = 'ADMIN'), CURRENT_TIMESTAMP);