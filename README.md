# SkillMatch

**SkillMatch** is a Career Opportunity Intelligence Platform that goes beyond simple job listings. It helps users understand where they stand in the job market, how well they match specific opportunities, and what skills they need to close the gap.

The platform focuses on four core capabilities:

- **Skill Gap Analysis** — Compares skills extracted from a user's active resume against what opportunities in their target roles demand, showing matched skills, missing required skills, and missing preferred skills with weighted scoring.
- **Opportunity Matching** — Calculates a weighted match percentage between a user's resume skill set and each opportunity's skill requirements, ranked by relevance.
- **Market Demand Insights** — Aggregates skill frequency and importance across live opportunity data to surface which skills are most in-demand for a user's target roles, including a learning roadmap and strength analysis.
- **Application Tracking** — Allows users to track opportunities they have applied to, update application status, and attach notes — all linked to the corresponding match score at tracking time.

The project is intentionally built to demonstrate production-oriented backend engineering practices, not just to solve the problem. Every major decision — from storage abstraction, to database migration strategy, to CI/CD pipeline design — reflects how these problems would be approached in a real production environment.

---

## Key Features

### Authentication
- Google OAuth2 login via Spring Security's OAuth2 client
- JWT-based stateless session management (issued as `HttpOnly`, `Secure`, `SameSite=Lax` cookies after OAuth2 callback)
- Role-based access control enforced at the controller layer

### User & Profile Management
- Profile creation is automatic on first login — no manual sign-up flow
- Extended professional profile: headline, about, experience level, education, contact info, professional links (LinkedIn, GitHub, LeetCode, Codeforces, portfolio)
- Profile completion score computed dynamically (never persisted) with weighted sections and a guided next-action recommendation
- Target role selection to personalise opportunity feeds and analytics

### Resume Management
- PDF resume upload with server-side validation (content type, file extension, filename sanitisation, size limit)
- Multiple resumes supported per user; one resume is designated as active at a time
- Resume download and deletion with automatic storage cleanup
- Conflict detection on duplicate filenames

### Resume Processing Pipeline
- PDF text extraction via Apache PDFBox (text capped at 100,000 characters)
- Skill extraction by matching extracted text against the seeded skill dictionary
- Education extraction: institution, degree, field of study, years, CGPA
- Experience extraction: company, job title, start/end dates, description
- Resume status tracking: `UPLOADED` → `TEXT_EXTRACTED` → `ANALYZED` (or `FAILED`)
- Rollback protection: if analysis fails after storage, the file is deleted to prevent orphaned objects

### Opportunity Matching Engine
- Weighted skill scoring: `REQUIRED` > `PREFERRED` > `GOOD_TO_HAVE`
- Match percentage computed from weighted score obtained vs. maximum possible score
- Returns matched skills, missing required skills, missing preferred skills, and missing good-to-have skills per opportunity
- Opportunities sorted by match score descending in recommendation feed

### Career Analytics
- Market coverage score: percentage of high-priority market skills the user already has
- Learning roadmap: market skills the user is missing, sorted by market demand
- Skills in demand: top skills across all opportunities in target roles
- Top strengths: user's skills that align most with market demand
- Resume insights: skills the user knows but has not included in their active resume

### Application Tracking
- Create, update, retrieve, and delete application records
- Status lifecycle: `APPLIED`, with notes support
- Each application response includes the live match score at retrieval time

### Storage
- Dual-provider storage architecture: Local filesystem and Amazon S3
- Provider selected at startup via `app.storage.provider` configuration property
- `ResumeStorageService` and `AvatarStorageService` interfaces make business logic fully provider-independent
- Avatar images are processed (resized, normalised to JPEG) before storage
- Storage keys (not absolute paths) are persisted to the database, allowing seamless provider migration

---

## Architecture

### Overview

SkillMatch uses a **Modular Monolith** architecture. The backend is a single deployable Spring Boot application, but its internal structure is organised into clearly bounded modules (`auth`, `user`, `resume`, `opportunity`, `application`, `analytics`, `skill`, `role`, `company`), each with its own controller, service, repository, DTO, and entity layers.

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS v4 |
| Backend | Java 21, Spring Boot 3.5 |
| Database | PostgreSQL 16 |
| Migrations | Flyway |
| Storage | Local filesystem / Amazon S3 |
| Authentication | Google OAuth2 + JWT |
| Container | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | AWS EC2 |

### Why Modular Monolith Instead of Microservices

Microservices introduce real operational costs: distributed tracing, inter-service auth, network latency, independent deployments, and data consistency across service boundaries. For a project at this stage, those costs would dominate engineering time without delivering proportional value.

A Modular Monolith was chosen because:
- Module boundaries are enforced by package structure rather than network calls, which eliminates distributed systems complexity while still maintaining separation of concerns.
- Refactoring module boundaries is cheap and safe — there are no network contracts or client libraries to update.
- A single deployment unit is simpler to operate, monitor, and debug.

The project is intentionally designed to be extracted into Microservices later. Each module is self-contained with its own persistence layer, making extraction a packaging decision rather than an architectural rewrite.

---

## Tech Stack

### Backend

**Java 21**
- Long-term support release with modern language features (records, sealed classes, switch expressions, pattern matching) used throughout the codebase.

**Spring Boot 3.5**
- Production-ready auto-configuration, dependency injection, and a rich ecosystem.
- Spring Security for OAuth2 and JWT integration.
- Spring Data JPA for type-safe repository abstractions.
- Spring Validation for declarative request validation.
- Spring Actuator for health endpoint (`/actuator/health`) used by Docker health checks.

**JJWT 0.12.6**
- Industry-standard library for JWT signing and parsing with HMAC-SHA algorithms.

**Apache PDFBox 3.0.3**
- Pure Java PDF parsing library for resume text extraction.

**Lombok**
- Reduces boilerplate (`@Builder`, `@RequiredArgsConstructor`, `@Slf4j`) without runtime overhead.

### Frontend

**React 19 + TypeScript**
- Component-based UI with full type safety.

**Vite**
- Fast development server and optimised production builds.

**TailwindCSS v4**
- Utility-first CSS framework for rapid UI development.

**TanStack Query (React Query)**
- Server state management with caching, background refetching, and loading/error states.

**React Router v7**
- Client-side routing.

**Framer Motion**
- Animation library for UI transitions.

**Recharts**
- Chart library used for analytics visualisation.

**Zod + React Hook Form**
- Schema-based form validation with type inference.

**Axios**
- HTTP client for API calls.

### Database

**PostgreSQL 16**
- Relational database with strong consistency guarantees, robust indexing, and mature support for structured data. Chosen over NoSQL because the domain is highly relational: users have resumes, resumes have skills, opportunities have required skills, applications link users to opportunities — all with referential integrity constraints.

**Flyway**
- Versioned SQL migration tool. Schema changes are tracked as numbered migration scripts (`V1__` through `V12__`), ensuring every environment (local, CI, production) runs the exact same schema. This eliminates "it works on my machine" schema drift.
- `spring.jpa.hibernate.ddl-auto=validate` is used in production — Hibernate validates the schema against entities but never modifies the database, which is a production-safe configuration.

### Cloud & Storage

**Amazon S3**
- Object storage for resume PDFs and processed avatar images. Objects are stored under a namespaced key structure (`users/{userId}/resumes/{uuid}.pdf`, `users/{userId}/avatars/{uuid}.jpg`) for clean isolation.

**AWS EC2**
- The backend Docker container runs on an EC2 instance. Docker Compose manages the backend and PostgreSQL services.

### Authentication

**Google OAuth2**
- Users authenticate through Google's OAuth2 flow. The application never handles passwords. After the OAuth2 callback, a JWT is issued and delivered as an `HttpOnly` cookie.

**JWT (JJWT)**
- Stateless session tokens validated on every request by a custom `JwtAuthenticationFilter` that populates the Spring Security `SecurityContext`.

### CI/CD

**GitHub Actions**
- Three-stage pipeline: build & test → Docker build & push → EC2 deployment.

### Deployment

**Docker + Docker Compose**
- Backend and PostgreSQL are containerised. The Dockerfile uses `eclipse-temurin:21-jre` as the base image. Docker Compose defines service dependencies (backend waits for PostgreSQL health check) and network isolation.

---

## System Design

### Authentication Module (`auth`)

Handles the complete OAuth2 flow. After Google redirects to the callback, `OAuth2SuccessHandler` extracts user claims (subject, email, name, picture) from the OIDC principal, creates or updates the user record via `AuthService`, generates a signed JWT, and delivers it as an `HttpOnly` cookie before redirecting to the frontend. The `JwtAuthenticationFilter` intercepts every subsequent request, validates the token, and populates the security context.

### User Module (`user`)

Manages user identity, extended profile (`UserProfile`), avatar storage, skill tracking, and profile completion scoring. `CurrentUserService` is the single point of truth for resolving the authenticated user from the security context. `ProfileCompletionService` dynamically computes a weighted score (summing to 100) across nine profile sections without ever persisting the score. `UserSkillService` manages manually declared skills separate from resume-extracted skills.

### Resume Module (`resume`)

Responsible for the full lifecycle of resume files: upload, storage, parsing, analysis, and management. `ResumeService` orchestrates the pipeline. `ResumeParserService` delegates to Apache PDFBox for text extraction. `ResumeAnalysisService` coordinates three extractors (skills, education, experience) and persists the results. If any step fails, the resume status is set to `FAILED` and orphaned files are cleaned up.

### Opportunity Module (`opportunity`)

Stores job opportunities with associated skills, importance levels, employment type, experience level, and location. `OpportunityService` handles CRUD and filtering. `MatchingService` computes weighted match scores between a user's active resume skills and an opportunity's skill requirements. `RecommendationService` fetches all matching opportunities, scores each one against the user's resume, and returns them sorted by match percentage descending with pagination.

### Analytics Module (`analytics`)

`CareerAnalyticsService` computes five analytics sections — market coverage, learning roadmap, skills in demand, top strengths, and resume insights — using two batch database queries and in-memory aggregation. No analytics data is persisted; results are computed on demand from live opportunity and resume data.

### Application Module (`application`)

Tracks opportunities users are pursuing. `ApplicationService` enforces uniqueness (one record per user per opportunity), supports status updates and notes, and enriches every response with a live match score at retrieval time by delegating to `MatchingService`.

### Storage Module

Provides pluggable storage backends for both resume files and avatar images, described in detail in the Storage Architecture section below.

### Skill Module (`skill`)

Maintains the canonical skill dictionary seeded in Flyway migration `V6`. Skills are referenced by ID from resumes and opportunities, enabling consistent matching without free-text comparison.

### Role Module (`role`)

Manages target roles that users select to personalise their experience. Target roles are used as filters in opportunity recommendations and as scope for analytics queries.

### Company Module (`company`)

Stores company metadata (name, logo URL) linked to opportunities.

---

## Storage Architecture

### Why a Storage Abstraction Was Introduced

Hardcoding file system paths into business logic creates tight coupling to the deployment environment. It prevents running in S3 in production while using local disk in development, and makes it impossible to switch providers without modifying service code. A storage abstraction decouples the "what" (store this file for this user) from the "how" (where and with which provider).

### ResumeStorageService

`ResumeStorageService` is a Java interface with three operations: `store`, `load`, and `delete`. `ResumeService` depends only on this interface — it has no knowledge of the underlying provider.

```java
public interface ResumeStorageService {
    String store(UUID userId, MultipartFile file);
    InputStream load(String storageKey);
    void delete(String storageKey);
}
```

### AvatarStorageService

`AvatarStorageService` follows the same pattern for avatar images, with an additional `loadAvatar` method that returns `Optional<byte[]>` (used to serve images through the API).

```java
public interface AvatarStorageService {
    String storeAvatar(UUID userId, MultipartFile file);
    void deleteAvatar(String storageKey);
    Optional<byte[]> loadAvatar(String storageKey);
}
```

Both implementations also delegate to `AvatarImageProcessor`, which resizes and normalises avatar images to JPEG before storage, keeping image processing concerns out of the business layer.

### Provider Implementations

**Local Provider** (`@ConditionalOnProperty(name = "app.storage.provider", havingValue = "local", matchIfMissing = true)`)
- Writes files to a configurable directory on the local filesystem.
- Used in local development where no AWS credentials are available.

**S3 Provider** (`@ConditionalOnProperty(name = "app.storage.provider", havingValue = "s3")`)
- Uploads and retrieves objects from Amazon S3 using the AWS SDK v2.
- Used in CI and production.

### Environment-Based Provider Selection

The active provider is controlled by a single property:

```properties
app.storage.provider=s3   # or: local
```

Spring's `@ConditionalOnProperty` activates exactly one implementation at startup. No code changes are required to switch providers.

### Why Storage Keys Are Persisted (Not Absolute Paths)

The `storagePath` column on the `Resume` entity and the `avatarStorageKey` column on the `User` entity store logical storage keys (e.g. `users/abc-123/resumes/xyz-789.pdf`), not absolute filesystem paths (e.g. `/var/uploads/resumes/xyz-789.pdf`). This means:

- Provider migrations do not require database updates.
- Keys are portable across environments.
- The same key works for both local resolution and S3 object retrieval.

### IAM Roles in Production

`S3Config` builds the S3 client using `DefaultCredentialsProvider.create()`:

```java
S3Client.builder()
    .region(Region.of(s3Properties.getRegion()))
    .credentialsProvider(DefaultCredentialsProvider.create())
    .build();
```

`DefaultCredentialsProvider` follows the standard AWS credential chain. On EC2, this automatically picks up the instance's IAM Role without requiring any credentials to be present in the environment, configuration files, or source code. The EC2 instance is granted only the minimum S3 permissions it needs (least privilege), and no AWS access keys are ever stored anywhere.

### Rollback Protection

In `ResumeService.uploadResume`, the file is stored first, then the database record is created. If any subsequent step (parsing, analysis, or persistence) throws an exception, the stored file is explicitly deleted before re-throwing:

```java
String storageKey = resumeStorageService.store(user.getId(), file);
try {
    // ... parse, analyze, save to DB
} catch (Exception e) {
    resumeStorageService.delete(storageKey);
    throw e;
}
```

This prevents orphaned objects in storage when database operations fail.

### Cache Busting for Avatar Updates

Avatar storage keys include a randomly generated UUID (`UUID.randomUUID().toString()`). Each upload produces a new key, which means the old object is deleted and a new object is written at a different key. This naturally busts any HTTP caching on the avatar endpoint without requiring cache-control headers or versioning schemes.

---

## Resume Processing Pipeline

```
Upload (PDF, max 10 MB)
        |
        v
Validation
  - Content type must be application/pdf
  - File extension must be .pdf
  - Filename sanitisation (strip path separators)
  - Duplicate filename check per user
        |
        v
Storage (Local or S3, depending on provider)
  - Returns a storage key
        |
        v
PDF Parsing (Apache PDFBox 3.0.3)
  - Text extracted from stored file via InputStream
  - Extracted text capped at 100,000 characters
        |
        v
Text Extraction
  - SkillExtractor: matches text against skill dictionary (case-insensitive)
  - EducationExtractor: institution, degree, field of study, years, CGPA
  - ExperienceExtractor: company, job title, date ranges, description
        |
        v
Analysis (ResumeAnalysisService)
  - Existing extracted data cleared before re-analysis
  - Skills, education, and experience persisted
  - Resume status updated: ANALYZED (or FAILED on exception)
        |
        v
Database
  - Resume record: status, extracted text, analyzed timestamp
  - ResumeSkill, ResumeEducation, ResumeExperience records persisted
        |
        v
Matching (available immediately)
  - Active resume skills used for opportunity matching and analytics
```

---

## Authentication

### Google OAuth2

Users are authenticated exclusively through Google's OAuth2 / OpenID Connect flow. The application is registered as an OAuth2 client in Google Cloud Console. Spring Security handles the redirect, callback, token exchange, and OIDC claim extraction automatically. The application never stores or handles passwords.

After a successful callback, `OAuth2SuccessHandler` extracts:
- `sub` — Google's stable user identifier
- `email` — used as the user's primary identifier in the system
- `name` — display name
- `picture` — initial avatar URL from Google

The handler creates or updates the user record (`AuthService.handleOAuthUser`) and issues a JWT.

### JWT

A signed JWT is generated by `JwtService` and delivered as an `HttpOnly`, `SameSite=Lax` cookie. The cookie is `Secure` in production (controlled by `COOKIE_SECURE` environment variable). The access token has a 30-day expiration (`2592000000 ms`).

Every subsequent request is intercepted by `JwtAuthenticationFilter`, which:
1. Extracts the token from the `access_token` cookie
2. Validates the signature using the configured HMAC secret
3. Extracts the user ID and email claims
4. Loads the user and populates the Spring Security `SecurityContext`

### Role-Based Authorization

Spring Security's URL-level and method-level security is used to restrict access. `CurrentUserService` ensures that all services always operate on behalf of the authenticated principal — users cannot access or modify other users' data.

---

## Deployment

```
Developer pushes to main
        |
        v
GitHub (source control)
        |
        v
GitHub Actions (triggered automatically)
        |
        v
Checkout + Setup Java 21 (Temurin)
        |
        v
Maven build and test (mvn clean verify)
  - PostgreSQL 16 service container spun up in CI
  - Secrets injected as environment variables
        |
        v
JAR artifact uploaded between jobs
        |
        v
Docker image built from backend/Dockerfile
  - Base: eclipse-temurin:21-jre
  - Tagged with :latest and :v0.1.0
        |
        v
Image pushed to Docker Hub
        |
        v
SSH into EC2 (appleboy/ssh-action)
        |
        v
docker compose pull + docker compose up -d
        |
        v
Old images pruned (docker image prune -f)
        |
        v
Application running in Docker container on EC2
```

### Docker

The `Dockerfile` uses `eclipse-temurin:21-jre` — a JRE-only image (smaller than JDK) from the Adoptium distribution. The Maven build runs in CI, not inside Docker, so the Dockerfile is a single-stage image that copies the pre-built JAR. This keeps image build time minimal.

`docker-compose.yml` defines two services: `postgres` (with a health check using `pg_isready`) and `backend` (which only starts after postgres is healthy). Both services run on an isolated Docker network (`skillmatch-network`). A named volume (`skillmatch_postgres_data`) ensures PostgreSQL data persists across container restarts.

### EC2

The EC2 instance runs Docker and Docker Compose. The application is deployed to `/opt/skillmatch`. All secrets are supplied through environment variables defined in `./backend/.env` on the instance — no secrets are baked into images or committed to source control.

### Environment Variables

All sensitive configuration is externalised:

| Variable | Purpose |
|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL connection |
| `JWT_SECRET` | HMAC signing secret for JWT |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth2 client credentials |
| `S3_BUCKET`, `S3_REGION` | S3 bucket configuration |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |
| `AUTH_REDIRECT_URL` | Post-OAuth2 redirect target |
| `COOKIE_SECURE` | Enables `Secure` flag on cookies in production |
| `RESUME_STORAGE_PATH`, `AVATAR_STORAGE_PATH` | Local storage paths (used when provider is `local`) |

---

## CI/CD Pipeline

The pipeline is defined in `.github/workflows/backend-ci.yml` and is triggered on pushes and pull requests to `main` that modify backend files.

```
Push to main (backend/** or workflow file)
        |
        v
Job 1: Build & Test
  - Spins up postgres:16 service container
  - Sets up Java 21 (Temurin, with Maven cache)
  - Runs: mvn clean verify
  - Uploads JAR as workflow artifact
        |
        v
Job 2: Docker Build & Publish (push events only, after Job 1)
  - Downloads JAR artifact
  - Logs in to Docker Hub
  - Builds image tagged :latest and :v0.1.0
  - Pushes both tags to Docker Hub
        |
        v
Job 3: Deploy to EC2 (push to main only, after Job 2)
  - SSH into EC2 via appleboy/ssh-action
  - cd /opt/skillmatch
  - docker compose pull
  - docker compose up -d
  - docker image prune -f
```

**Why CI/CD was implemented:**

Manual deployments are error-prone, slow, and untraceable. CI/CD ensures:
- Every merge to `main` is automatically tested before deployment.
- Docker images are the deployable artifact — the same image that passes CI is what runs on EC2.
- Deployment is auditable through GitHub Actions run history.
- The PostgreSQL service container in CI mirrors the production database version (16), preventing version-specific schema or query incompatibilities from reaching production.

---

## Security Decisions

| Decision | Rationale |
|---|---|
| **JWT in HttpOnly cookies** | Prevents JavaScript access to the token, mitigating XSS-based token theft. `SameSite=Lax` provides CSRF protection for most attack vectors. |
| **Google OAuth2 only** | Offloads credential management, password hashing, brute-force protection, and account recovery to Google. The application never stores passwords. |
| **IAM Roles (no access keys)** | AWS access keys stored in environment variables or files are a common credential leak vector. IAM Roles bound to the EC2 instance provide temporary, automatically rotated credentials with no secrets to manage. |
| **Least Privilege** | The EC2 IAM Role is granted only the S3 permissions required by the application. No wildcard permissions. |
| **No hardcoded credentials** | All secrets are injected at runtime through environment variables or GitHub Actions secrets. The `.env` file is listed in `.gitignore`. |
| **`COOKIE_SECURE` flag** | Controlled per environment — `false` in local development (HTTP), `true` in production (HTTPS). No code changes required. |
| **`ddl-auto=validate`** | Hibernate validates schema against entities on startup but never modifies the database. Schema changes go through Flyway migrations only, providing a safe, reviewable, and rollback-capable migration path. |
| **Filename sanitisation** | Resume filenames are stripped of path separators before being stored or checked for duplicates, preventing path traversal attacks. |

---

## Project Structure

```
SkillMatch/
├── .github/
│   └── workflows/
│       └── backend-ci.yml          # CI/CD pipeline definition
├── backend/
│   ├── Dockerfile                  # Single-stage JRE image
│   ├── pom.xml                     # Maven dependencies
│   └── src/main/
│       ├── java/com/skillmatch/
│       │   ├── SkillMatchApplication.java
│       │   ├── analytics/          # Career analytics module
│       │   ├── application/        # Application tracking module
│       │   ├── auth/               # OAuth2, JWT, security filters
│       │   ├── common/             # Shared enums and utilities
│       │   ├── company/            # Company data module
│       │   ├── config/             # S3 configuration
│       │   ├── opportunity/        # Opportunities, matching, recommendations
│       │   ├── resume/             # Upload, parsing, analysis, storage
│       │   ├── role/               # Target role management
│       │   ├── skill/              # Skill dictionary and user skills
│       │   └── user/               # Profile, avatar, completion score
│       └── resources/
│           ├── application.properties
│           └── db/migration/       # 12 versioned Flyway SQL scripts (V1-V12)
├── frontend/
│   ├── src/
│   │   ├── pages/                  # landing, dashboard, resumes,
│   │   │                           # opportunities, analytics,
│   │   │                           # applications, profile, companies
│   │   ├── features/               # Feature-specific components
│   │   ├── services/               # Axios API clients
│   │   ├── hooks/                  # Custom React Query hooks
│   │   └── types/                  # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml              # Local and production compose file
```

---

## Future Improvements

These are realistic next steps that have not yet been implemented:

- **Redis** — Cache opportunity match results and analytics responses. Currently all analytics are computed on every request from live database data.
- **Amazon RDS** — Move PostgreSQL off the EC2 instance into a managed RDS instance for automated backups, point-in-time recovery, and Multi-AZ failover.
- **Opportunity Ingestion Pipeline** — Currently, opportunities are seeded via Flyway. A real ingestion service would pull from job APIs or scrapers, normalise skill requirements, and populate the database continuously.
- **Notification Service** — Send email or in-app notifications when new high-match opportunities appear for a user's target roles.
- **CloudWatch / Structured Logging** — Ship structured logs from the application container to CloudWatch Logs for centralised log management and alerting.
- **Distributed Tracing** — Add trace IDs to requests for easier debugging across service calls.
- **Microservices Extraction** — The modular monolith is designed to allow individual modules (e.g., resume processing, analytics) to be extracted into independent services with their own databases as scale or team structure demands it.
- **gRPC / Event-Driven Communication** — If microservices are introduced, service-to-service communication via gRPC or an event bus (e.g., Amazon SQS/SNS) would replace in-process method calls.
- **Kubernetes** — Container orchestration for automated scaling, self-healing, and rolling deployments.

---

## Engineering Decisions

**Why Spring Boot?**
Spring Boot provides a battle-tested ecosystem for every production concern — security, data access, validation, configuration management, health checks, and testing infrastructure — without requiring from-scratch implementation. Its auto-configuration reduces boilerplate while remaining fully overridable.

**Why PostgreSQL?**
The domain is inherently relational. Users have resumes, resumes have extracted skills, opportunities have required skills, applications link users to opportunities. These relationships benefit from foreign key enforcement, JOIN queries, and transactional consistency. PostgreSQL is also first-class in the AWS RDS managed offering, making a future migration straightforward.

**Why Flyway?**
Database schema must be versioned the same way application code is versioned. Flyway's numbered migration scripts (`V1__` through `V12__`) ensure every environment reaches the exact same schema state. Combined with `ddl-auto=validate`, this prevents silent schema drift from ever reaching production.

**Why Docker?**
Docker eliminates environment inconsistencies. The same image that is built and tested in CI runs on EC2. Dependencies (Java version, OS libraries) are baked into the image and cannot drift between environments.

**Why EC2?**
EC2 provides direct control over the deployment environment — operating system, network configuration, IAM role assignment, and Docker runtime — without the abstractions and constraints of managed container services. It is the right tradeoff for a project that needs full deployment control without Kubernetes complexity.

**Why Amazon S3?**
Object storage is the correct abstraction for user-uploaded files. S3 provides high durability, scalability, and built-in versioning without managing disk space on EC2. Decoupling file storage from the application server also means the EC2 instance can be replaced or scaled without losing user data.

**Why Storage Abstraction?**
Hardcoding S3 into service classes would make local development require AWS credentials and make it impossible to switch providers without modifying business logic. The `ResumeStorageService` and `AvatarStorageService` interfaces isolate the storage decision to a single configuration property, keeping business logic clean and provider-independent.

**Why Local + S3 Providers?**
Local development should not require cloud credentials. The local provider allows the full application to run offline. The S3 provider is activated in CI and production. The same codebase supports both without branching or conditionals in business logic.

**Why IAM Roles?**
Access keys stored in environment variables, `.env` files, or Docker images are a persistent security risk — they do not rotate, and a leak exposes the account indefinitely. IAM Roles provide short-lived, automatically rotated credentials that are never written to disk and cannot be accidentally committed to source control.

**Why GitHub Actions?**
GitHub Actions is natively integrated with the repository, requiring no additional CI infrastructure. The pipeline is defined as code in the repository itself, making it versioned, reviewable, and reproducible.

**Why a Modular Monolith?**
Microservices solve problems of team scale and independent deployability, but they introduce distributed systems complexity that must be managed even before a single line of business logic is written. A Modular Monolith delivers the organisational benefits of clear module boundaries at a fraction of the operational cost, with a clear extraction path when scale demands it.

---

## Running the Project

### Prerequisites

- Java 21
- Docker and Docker Compose
- Node.js 20+
- A Google OAuth2 application (Client ID and Client Secret)
- AWS credentials configured if using the S3 storage provider

### Running with Docker Compose (Backend + Database)

1. Create `backend/.env` with the required environment variables:

```env
DB_URL=jdbc:postgresql://postgres:5432/skillmatch
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
CORS_ALLOWED_ORIGINS=http://localhost:3000
COOKIE_SECURE=false
S3_BUCKET=your-bucket-name
S3_REGION=your-region
RESUME_STORAGE_PATH=/app/uploads/resumes
AVATAR_STORAGE_PATH=/app/uploads/avatars
```

2. Start the services:

```bash
docker compose up --build
```

The backend will be available at `http://localhost:8080`.  
Health check: `http://localhost:8080/actuator/health`

### Running the Backend Locally (Without Docker)

```bash
cd backend
./mvnw spring-boot:run
```

Requires a running PostgreSQL instance and the environment variables above exported in your shell.

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs at `http://localhost:3000`.

### Running Backend Tests

```bash
cd backend
./mvnw clean verify
```

---

## Screenshots

> Screenshots will be added once the deployed instance is available.

| | |
|---|---|
| Landing Page | *(coming soon)* |
| Dashboard | *(coming soon)* |
| Resume Upload & Analysis | *(coming soon)* |
| Opportunity Matching | *(coming soon)* |
| Career Analytics | *(coming soon)* |
| AWS Deployment | *(coming soon)* |

---

## License

This project is licensed under the [MIT License](LICENSE).
