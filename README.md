# Real Estate Due Diligence Agent

A full-stack application for real estate diligence workflows across buyer, seller, agent, legal, and bank roles.

## Stack

- Backend: Java 21, Spring Boot 3.4.2, Spring Security, PostgreSQL, JPA
- Frontend: React 19, CRA, Tailwind CSS
- Containerization: Docker Compose

## Local development

### 1) Start PostgreSQL

Use Docker Compose:

```bash
docker compose up -d postgres
```

Then copy `backend/.env.example` to `backend/.env` and provide local values. Do not commit either `.env` file.

### 2) Backend

```bash
cd backend
set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot
mvn spring-boot:run
```

### 3) Frontend

```bash
cd frontend
set REACT_APP_API_URL=http://localhost:8080/api
npm start
```

## Environment variables

### Backend

```env
DB_URL=jdbc:postgresql://localhost:5432/real_estate_due_diligence
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET_KEY=base64-encoded-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000
SERVER_PORT=8080
VERIFICATION_TOKEN_EXPIRATION_MINUTES=1440
EXTERNAL_API_ALLOWED_HOSTS=api.example.com
# Optional SMTP delivery for verification links
SPRING_MAIL_HOST=smtp.example.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-smtp-username
SPRING_MAIL_PASSWORD=your-smtp-password
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true
```

### Frontend

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=ws://localhost:8080/ws
PORT=3000
```

## Docker

Copy `.env.example` to `.env` and replace the required secret values before starting the stack:

```bash
copy .env.example .env
```

The frontend container is served by Nginx on port `3000`; the backend is on port `8080`. `FRONTEND_API_URL` is compiled into the frontend image, so set it to the public backend URL when deploying.

```bash
docker compose up --build
```

This starts PostgreSQL, the backend, and the frontend together.

## Deployment notes

- Avoid hardcoded `localhost` values in production builds.
- Set `FRONTEND_URL` and `CORS_ALLOWED_ORIGINS` to the deployed frontend origin.
- Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` to the managed PostgreSQL connection values.
- Set `JWT_SECRET_KEY` to a strong base64-encoded secret and keep it in the hosting provider's secret store.
- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, and register `{baseUrl}/login/oauth2/code/google` with Google for the deployed backend URL.
- Set `EXTERNAL_API_ALLOWED_HOSTS` to exact trusted provider hostnames before using outbound API integrations; provider URLs and sub-endpoints are rejected otherwise.
- Set `FRONTEND_API_URL` and `FRONTEND_WS_URL` to browser-reachable public URLs before building the frontend image.
- Use `DDL_AUTO=validate` after applying schema migrations in production; `update` is only a local-development default.

## Testing

Frontend tests run with CRA and currently cover API URL configuration. Add behavior tests for critical screens before release; do not treat a successful build as browser workflow verification.

Backend tests can be run with Maven:

```bash
cd backend
mvn test
```

Swagger UI is available at `http://localhost:8080/swagger-ui/index.html` when the backend is running. The OpenAPI document is available at `http://localhost:8080/v3/api-docs`.

The current backend test suite covers authentication service behavior and application context startup. Role authorization, ownership isolation, external provider failure paths, and full browser workflows still require additional integration or manual testing.

### Manual authentication and role-guard check

For each role, sign in, open a permitted dashboard, then paste a URL for another role (for example `/bank/dashboard` as a buyer). The app should redirect to `/dashboard`; direct API calls must still receive `401` or `403`. Repeat after logout to confirm protected routes redirect to `/login`.

Reports, documents, and risk records are property-level records in the current schema. Before production, add explicit property-access policy and integration tests if those records must be private to a specific user rather than visible to an authorized workflow role.
