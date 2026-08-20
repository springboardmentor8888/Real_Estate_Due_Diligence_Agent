-- Seed roles: BUYER, SELLER, AGENT, LEGAL_REVIEWER, BANK
-- NOTE: ADMIN role has been intentionally removed from this application.
-- Use ON CONFLICT DO NOTHING so this can be re-run safely.
INSERT INTO roles (role_name) VALUES
('BUYER'),
('SELLER'),
('AGENT'),
('LEGAL_REVIEWER'),
('BANK')
ON CONFLICT (role_name) DO NOTHING;