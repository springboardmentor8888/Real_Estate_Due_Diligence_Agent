# Implementation & Postman Presentation Guide

Use this guide to explain the technical implementation and demonstrate the REST APIs in Postman during code reviews or presentations.

---

## Part 1: Technical Architecture & Task Explanation

### 1. Risk Assessment (`RiskAssessment` Entity)
- **What was built**: Enhanced the `RiskAssessment` JPA entity mapped to table `risk_assessments`.
- **Key Details**: Stores granular sub-scores across 5 due diligence vectors:
  - `titleRiskScore`, `taxRiskScore`, `zoningRiskScore`, `floodRiskScore`, `environmentalRiskScore`
  - Calculates `overallRiskScore` and assigns categorical `riskLevel` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
  - Includes `mitigationRecommendations` text providing actionable steps to resolve identified risks.

### 2. Comparable Property Analysis (`ComparableProperty` Entity)
- **What was built**: Created the `ComparableProperty` entity mapped to `comparable_properties`.
- **Key Details**: Represents historical sales of similar properties in the same neighborhood:
  - Tracks `salePrice`, `saleDate`, `squareFootage`, `pricePerSqFt`, `distanceInMiles`, and `similarityScore` (0-100%).

### 3. Property Valuation (`PropertyValuation` Entity)
- **What was built**: Created the `PropertyValuation` entity mapped to `property_valuations`.
- **Key Details**: Stores property valuation metrics:
  - Tracks `estimatedValue`, confidence interval (`valueRangeLow` to `valueRangeHigh`), `confidenceScore` (e.g. 92%), `valuationMethod` (`COMPARABLE_SALES_AND_AVM`), and notes.

### 4. Property-Related Database Relationships
- **What was built**: Configured JPA annotations to model relational integrity:
  - Child entities (`RiskAssessment`, `ComparableProperty`, `PropertyValuation`) use `@ManyToOne` pointing to target `Property`.
  - Parent `Property` entity uses `@OneToMany` with `CascadeType.ALL` and `@JsonIgnore` (prevents infinite recursion during JSON serialization).

### 5. Repository & Database Queries
- **What was built**: Spring Data JPA repositories with custom queries:
  - **`RiskAssessmentRepository`**: `findTopByPropertyPropertyIdOrderByCreatedAtDesc` for active risk assessments.
  - **`ComparablePropertyRepository`**: `findBySubjectPropertyPropertyIdOrderBySimilarityScoreDesc` and JPQL query `calculateAveragePricePerSqFt`.
  - **`ValuationRepository`**: `findTopByPropertyPropertyIdOrderByValuationDateDesc` for latest valuation.

### 6. Service-Layer Integration
- **What was built**: Decoupled service layer handling business logic and DB persistence:
  - `RiskAssessmentServiceImpl`: Performs multi-vector risk calculations and generates mitigation guidance.
  - `ComparablePropertyServiceImpl`: Retrieves and auto-generates localized comp sales.
  - `ValuationServiceImpl`: Computes market value estimates based on price/sqft averages and confidence ranges.
  - `PropertyAnalysisServiceImpl`: Unified orchestrator combining risk, comps, and valuation into a single DTO payload.

### 7. Controller APIs (`PropertyAnalysisController`)
- **What was built**: REST controller mapping `/api/analysis` secured via JWT Spring Security.
- **Endpoints**:
  - `GET /api/analysis/properties/{propertyId}/summary` -> Full unified analysis
  - `POST /api/analysis/properties/{propertyId}/summary/run` -> Execute fresh analysis & persist to DB
  - `GET /api/analysis/properties/{propertyId}/risk` -> Risk Assessment details
  - `GET /api/analysis/properties/{propertyId}/comps` -> Comparable Properties list
  - `GET /api/analysis/properties/{propertyId}/valuation` -> Valuation metrics

---

## Part 2: Postman Demo Script (Step-by-Step)

### Step 1: Explain the Authentication Flow
> *"Our API uses stateless JWT authentication. First, we log in to obtain a signed token."*
- **Postman Action**: Run `POST http://localhost:8080/auth/login`
- **Body**: `{"email": "admin@example.com", "password": "admin123"}`
- **Explanation**: Show the returned `"token"` string. Explain that this JWT token is passed in the HTTP `Authorization: Bearer <TOKEN>` header for all subsequent API calls.

### Step 2: Demonstrate Unified Analysis Summary
> *"Next, we retrieve a 360° due diligence summary for Property #1 in a single HTTP request."*
- **Postman Action**: Run `GET http://localhost:8080/api/analysis/properties/1/summary`
- **Authorization**: `Bearer <TOKEN>`
- **Explanation**: Point out the response JSON structure:
  1. `propertyName`, `address`, `city`, `state`
  2. `currentValuation` (estimated market value & confidence range)
  3. `latestRiskAssessment` (overall score, sub-scores breakdown, recommendations)
  4. `comparableProperties` (array of comp sales with similarity scores)

### Step 3: Demonstrate Granular Modular Endpoints
> *"Each domain can also be queried independently for specialized modules."*
- **Postman Action 1**: Run `GET http://localhost:8080/api/analysis/properties/1/risk`
  - Explain: Shows standalone risk assessment sub-scores across title, tax, zoning, flood, and environment.
- **Postman Action 2**: Run `GET http://localhost:8080/api/analysis/properties/1/comps`
  - Explain: Shows comp sales list sorted by similarity score.
- **Postman Action 3**: Run `GET http://localhost:8080/api/analysis/properties/1/valuation`
  - Explain: Shows property valuation and AVM confidence interval.

### Step 4: Demonstrate Triggering & Persisting Fresh Analysis
> *"Finally, we can trigger the AI analysis engine to recalculate and persist fresh metrics into PostgreSQL."*
- **Postman Action**: Run `POST http://localhost:8080/api/analysis/properties/1/summary/run`
- **Explanation**: Show that fresh comp calculations, updated valuation estimates, and risk records were generated and persisted into PostgreSQL tables `risk_assessments`, `comparable_properties`, and `property_valuations`.
