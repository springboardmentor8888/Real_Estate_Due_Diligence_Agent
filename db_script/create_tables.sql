CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id),
    phone VARCHAR(20),
    address TEXT
);

CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    property_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_history (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES properties(id),
    event_type VARCHAR(100),
    event_date DATE,
    description TEXT
);

INSERT INTO roles (role_name) VALUES
('Buyer'),
('Real Estate Agent'),
('Legal Reviewer'),
('Financial Institution'),
('Administrator');


CREATE TABLE ownership_records (
    id BIGSERIAL PRIMARY KEY,
    owner_name VARCHAR(255) NOT NULL,
    purchase_date DATE,
    purchase_price DECIMAL(15,2),
    property_id BIGINT NOT NULL,

    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_ownership_property
        FOREIGN KEY (property_id)
        REFERENCES properties(id)
);

CREATE TABLE property_tax_history (
    id BIGSERIAL PRIMARY KEY,
    tax_year INTEGER,
    tax_amount DECIMAL(15,2),
    payment_status VARCHAR(100),
    property_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tax_property
        FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE
);

CREATE TABLE zoning_info (
    id BIGSERIAL PRIMARY KEY,
    zoning_code VARCHAR(100),
    zoning_description VARCHAR(255),
    permitted_use VARCHAR(255),
    property_id BIGINT REFERENCES properties(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flood_zone_info (
    id BIGSERIAL PRIMARY KEY,
    flood_zone_code VARCHAR(100),
    flood_risk_level VARCHAR(100),
    flood_insurance_required BOOLEAN,
    property_id BIGINT REFERENCES properties(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);