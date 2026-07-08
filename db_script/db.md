# Database Design - Real Estate Due Diligence Agent

## Core Tables

### roles
- id (PK)
- role_name

### users
- id (PK)
- name
- email
- password
- role_id (FK)

### properties
- id (PK)
- address
- city
- state
- zip_code
- property_type

### ownership_records
- id (PK)
- property_id (FK)
- owner_name
- purchase_date

### tax_history
- id (PK)
- property_id (FK)
- tax_year
- tax_amount
- payment_status

### reports
- id (PK)
- property_id (FK)
- risk_score
- generated_at

### audit_logs
- id (PK)
- user_id (FK)
- action
- created_at

## Relationships

- Role (1) → (Many) Users
- Property (1) → (Many) Ownership Records
- Property (1) → (Many) Tax History Records
- Property (1) → (Many) Reports
- User (1) → (Many) Audit Logs

## Future Tables (Based on Project Modules)

### user_profiles
- user_id (FK)
- phone
- address

### property_history
- property_id (FK)
- event_details
- event_date

### building_permits
- property_id (FK)
- permit_number
- permit_status
- issue_date

### zoning_info
- property_id (FK)
- zone_type
- compliance_status

### flood_zones
- property_id (FK)
- flood_risk_level

### environmental_records
- property_id (FK)
- record_type
- description

### utility_information
- property_id (FK)
- utility_type
- provider_name

### risk_assessments
- property_id (FK)
- legal_risk
- tax_risk
- flood_risk
- zoning_risk
- overall_score

### comparable_properties
- property_id (FK)
- comparable_property_id

### market_trends
- city
- average_price
- trend_date

### notifications
- user_id (FK)
- message
- status
- created_at

### api_logs
- endpoint
- request_time
- response_status

### report_history
- report_id (FK)
- generated_by
- generated_at