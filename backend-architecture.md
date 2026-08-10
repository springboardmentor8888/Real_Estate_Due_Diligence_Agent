# Real Estate Due Diligence Agent - Backend Architecture

## 1. Overall Backend Architecture
The backend is built on **Java 21** and **Spring Boot 3**, providing a robust, scalable, and enterprise-grade foundation. It exposes RESTful APIs to the frontend (React/Next.js). The system integrates with multiple external public record services (APIs) to aggregate property data. 

**Core Components:**
- **Web Layer:** Spring MVC for handling HTTP REST requests.
- **Business Logic Layer:** Spring Services orchestrating complex data aggregation and risk assessment workflows.
- **Data Access Layer:** Spring Data JPA (Hibernate) abstracting database interactions.
- **Database:** PostgreSQL for persistent relational data; Redis for caching frequent searches and reducing external API load.
- **Security:** Spring Security utilizing JWT (JSON Web Tokens) and OAuth2 for secure, role-based access control.

## 2. Layered Architecture Overview
The application follows a standard multi-tier (n-tier) architecture, promoting separation of concerns and maintainability.

*   **Presentation/Controller Layer (`controller`):** Defines API endpoints, accepts HTTP requests, validates incoming DTOs, and delegates tasks to the Service layer.
*   **Service Layer (`service`):** Contains core business logic, orchestrates calls to external APIs, handles transactions, and maps between Entities and DTOs.
*   **Data Access/Repository Layer (`repository`):** Interfaces directly with the database using Spring Data JPA, managing CRUD operations and custom queries.
*   **Domain Model/Entity Layer (`entity`):** Java classes mapped directly to database tables (via Hibernate/JPA annotations).

## 3. Request Flow (Controller → Service → Repository → Database)
1.  **Client Request:** The client makes an HTTP POST request to a REST API endpoint (e.g., `/api/properties/search`).
2.  **Controller:** The `PropertyController` intercepts the request, validates the input payload, and calls `PropertyService.searchProperty()`.
3.  **Service:** The `PropertyService` executes the business rules. It checks if data is cached in Redis. If not, it invokes methods on `PropertyRepository` and integrates with `ExternalApiService`.
4.  **Repository:** The `PropertyRepository` translates the Java method calls into SQL queries via Hibernate.
5.  **Database:** PostgreSQL executes the query and returns the ResultSet.
6.  **Response Workflow:** The Repository maps the result back to an Entity, returns it to the Service, which converts it to a Data Transfer Object (DTO) and returns it to the Controller. Finally, the Controller serializes it to JSON and sends a `200 OK` HTTP response to the client.

## 4. Database Interaction Workflow
*   **ORM Mapping:** Entities are mapped using JPA annotations (`@Entity`, `@Table`, `@OneToMany`, etc.).
*   **Transactions:** The `@Transactional` annotation is heavily utilized at the Service layer to ensure ACID compliance, rolling back partial data writes if an external API crashes mid-workflow.
*   **Schema Management:** In production, tools like Flyway or Liquibase will typically manage `schema.sql` migrations. Spring Data JPA reads the schema and binds it to entities.

## 5. High-Level Workflow for Property Due Diligence Processing
1.  **Address Validation & Search:** The user inputs an address; the system standardizes and validates it.
2.  **Parallel Data Aggregation:** The Service layer triggers parallel/asynchronous tasks to fetch data from:
    *   Land Registries (Ownership)
    *   Tax Authorities (Tax History)
    *   FEMA (Flood Zones)
    *   GIS Services (Zoning/Permits)
3.  **Data Persistence:** Aggregated data is sanitized and stored in PostgreSQL, linked to the `Property` entity via Foreign Keys.
4.  **Risk Assessment Pipeline:** A rule engine evaluates the gathered data, scoring legal, flood, and tax risks.
5.  **Report Generation:** The analyzed data is passed to JasperReports/iText, generating PDF and Excel documents asynchronously.
6.  **Notification:** The user is alerted when the due diligence report is available for download.

## 6. Package Responsibilities
*   **`config`**: Spring configurations (Security, Redis, Swagger/OpenAPI, Beans).
*   **`controller`**: REST API endpoints mapping and routing.
*   **`service`**: Business logic, workflow orchestration, and external API clients.
*   **`repository`**: Spring Data JPA repository interfaces for database access.
*   **`entity`**: JPA domain models mapping to PostgreSQL tables.
*   **`dto`**: Data Transfer Objects for client-server communication.
*   **`exception`**: Global exception handlers (`@ControllerAdvice`) and custom exception classes.
*   **`util`**: Helper classes, constants, formatters, and utility methods.
