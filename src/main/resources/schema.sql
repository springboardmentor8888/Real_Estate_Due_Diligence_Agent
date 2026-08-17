-- Schema for Real Estate Due Diligence Agent
-- Milestone 1: Core Setup, Users, Properties, Ownership, and Taxes

-- -----------------------------------------------------
-- Table: roles
-- -----------------------------------------------------
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Insert default roles mapping to the requirements
INSERT INTO roles (name) VALUES 
('ROLE_BUYER'), 
('ROLE_REAL_ESTATE_AGENT'), 
('ROLE_LEGAL_REVIEWER'), 
('ROLE_FINANCIAL_INSTITUTION'), 
('ROLE_ADMIN');

-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
);

-- Index for fast user lookups by email
CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------
-- Table: properties
-- -----------------------------------------------------
CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    validation_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Prevent exact duplicate properties
    CONSTRAINT uq_property_address UNIQUE (address_line_1, city, state, zip_code)
);

-- Index for property search performance
CREATE INDEX idx_properties_zip_code ON properties(zip_code);
CREATE INDEX idx_properties_city ON properties(city);

-- -----------------------------------------------------
-- Table: ownership_records
-- -----------------------------------------------------
CREATE TABLE ownership_records (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    purchase_date DATE,
    sale_price DECIMAL(15, 2),
    deed_type VARCHAR(100),
    recording_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ownership_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
);

-- Index to fetch all ownership records for a specific property quickly
CREATE INDEX idx_ownership_property_id ON ownership_records(property_id);

-- -----------------------------------------------------
-- Table: tax_histories
-- -----------------------------------------------------
CREATE TABLE tax_histories (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    tax_year INT NOT NULL,
    assessed_value DECIMAL(15, 2),
    tax_amount DECIMAL(15, 2) NOT NULL,
    amount_paid DECIMAL(15, 2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'UNPAID',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tax_property FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
    -- A property should only have one tax record per year
    CONSTRAINT uq_property_tax_year UNIQUE (property_id, tax_year)
);

-- Index to fetch tax history records for a specific property quickly
CREATE INDEX idx_tax_property_id ON tax_histories(property_id);

-- -----------------------------------------------------
-- Table: due_diligence_reports
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS due_diligence_reports (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    report_url VARCHAR(500),
    requested_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_ms BIGINT,
    error_message VARCHAR(1000)
);

-- -----------------------------------------------------
-- Table: notifications
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(50) NOT NULL,
    report_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table: audit_logs
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_email VARCHAR(150),
    actor_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    description VARCHAR(1000),
    ip_address VARCHAR(50),
    outcome VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table: report_histories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS report_histories (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT,
    property_id BIGINT NOT NULL,
    user_id BIGINT,
    export_format VARCHAR(20),
    status VARCHAR(50) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_url VARCHAR(500),
    summary VARCHAR(1000)
);

