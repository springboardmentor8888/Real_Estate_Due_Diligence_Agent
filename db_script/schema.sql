-- PostgreSQL Schema for Real Estate Due Diligence Agent Platform

CREATE TABLE IF NOT EXISTS roles (
    role_id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role_id BIGINT REFERENCES roles(role_id),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_types (
    type_id BIGSERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS addresses (
    address_id BIGSERIAL PRIMARY KEY,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    county VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    apn VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS properties (
    property_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address_id BIGINT REFERENCES addresses(address_id),
    type_id BIGINT REFERENCES property_types(type_id),
    owner_id BIGINT REFERENCES users(user_id),
    estimated_value DECIMAL(15, 2),
    year_built INT,
    square_feet DECIMAL(10, 2),
    lot_size_acres DECIMAL(10, 4),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS due_diligence_reports (
    report_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    requested_by BIGINT REFERENCES users(user_id),
    overall_risk_score INT,
    status VARCHAR(50) DEFAULT 'PENDING',
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS risk_assessments (
    assessment_id BIGSERIAL PRIMARY KEY,
    report_id BIGINT REFERENCES due_diligence_reports(report_id),
    category_id BIGINT REFERENCES risk_categories(category_id),
    risk_score INT,
    risk_level VARCHAR(20),
    findings TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_taxes (
    tax_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    tax_year INT,
    assessed_value DECIMAL(15, 2),
    tax_amount DECIMAL(15, 2),
    payment_status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS permits (
    permit_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    permit_number VARCHAR(100),
    permit_type VARCHAR(100),
    issue_date DATE,
    status VARCHAR(50),
    description TEXT
);

CREATE TABLE IF NOT EXISTS owners (
    owner_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    owner_type VARCHAR(50),
    contact_info TEXT
);

CREATE TABLE IF NOT EXISTS ownership_records (
    record_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    owner_id BIGINT REFERENCES owners(owner_id),
    ownership_percentage DECIMAL(5, 2),
    start_date DATE,
    end_date DATE
);

CREATE TABLE IF NOT EXISTS environmental_records (
    record_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    hazard_type VARCHAR(100),
    risk_level VARCHAR(20),
    details TEXT
);

CREATE TABLE IF NOT EXISTS flood_information (
    flood_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    flood_zone VARCHAR(50),
    base_flood_elevation DECIMAL(8, 2),
    firm_panel VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS utility_information (
    utility_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    utility_type VARCHAR(100),
    provider_name VARCHAR(150),
    service_status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS zoning_information (
    zoning_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    zoning_code VARCHAR(50),
    zoning_description TEXT,
    permitted_uses TEXT
);

CREATE TABLE IF NOT EXISTS comparable_properties (
    comp_id BIGSERIAL PRIMARY KEY,
    base_property_id BIGINT REFERENCES properties(property_id),
    comp_property_id BIGINT REFERENCES properties(property_id),
    similarity_score DECIMAL(5, 2),
    distance_miles DECIMAL(6, 2)
);

CREATE TABLE IF NOT EXISTS property_documents (
    document_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    document_type VARCHAR(100),
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS property_listings (
    listing_id BIGSERIAL PRIMARY KEY,
    property_id BIGINT REFERENCES properties(property_id),
    listing_price DECIMAL(15, 2),
    listing_status VARCHAR(50),
    listed_date DATE
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    title VARCHAR(200),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_providers (
    provider_id BIGSERIAL PRIMARY KEY,
    provider_name VARCHAR(100) UNIQUE NOT NULL,
    api_base_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS api_logs (
    log_id BIGSERIAL PRIMARY KEY,
    provider_id BIGINT REFERENCES api_providers(provider_id),
    endpoint VARCHAR(255),
    response_status INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);