# SkillMatch

**SkillMatch** is a Career Opportunity Intelligence Platform that goes beyond simple job listings. It helps users understand where they stand in the job market, how well they match specific opportunities, and what skills they need to close the gap.

- **Live Application:** https://skill-match.in

---

## Why I Built SkillMatch

I started SkillMatch from a problem I was personally experiencing while preparing for software engineering opportunities.

I was learning and preparing, but I wasn't getting shortlisted consistently. That created a very practical question:

> *"If I'm not getting shortlisted, what exactly am I missing?"*

There was plenty of generic advice — learn DevOps, System Design, Docker, AWS. But that raised a second question:

> *"Which skills actually matter for the opportunities I'm targeting, and what should I learn next?"*

Instead of treating this only as a preparation problem, I decided to build a system that could answer the question using actual opportunity data. The idea became:

- Which opportunities match my current skills?
- Which skills am I missing for those roles?
- Which missing skills appear most frequently across real opportunities?
- What should I prioritize learning?
- How does my profile change as I improve?

That became SkillMatch — a Career Opportunity Intelligence Platform.

The gap wasn't just a preparation problem. It was an information problem: I didn't have a clear picture of what the market was actually asking for relative to what I had. SkillMatch is the system I built to close that gap — not with generic career advice, but with data from real opportunity postings.

What started as a personal question about improving my chances of getting shortlisted gradually became an exercise in backend engineering and production infrastructure.


**Hence the platform focuses on four core capabilities:**

- **Skill Gap Analysis** — Compares skills extracted from a user's active resume against what opportunities in their target roles demand, showing matched skills, missing required skills, and missing preferred skills with weighted scoring.
- **Opportunity Matching** — Calculates a weighted match percentage between a user's resume skill set and each opportunity's skill requirements, ranked by relevance.
- **Market Demand Insights** — Aggregates skill frequency and importance across live opportunity data to surface which skills are most in-demand for a user's target roles, including a learning roadmap and strength analysis.
- **Application Tracking** — Allows users to track opportunities they have applied to, update application status, and attach notes — all linked to the corresponding match score at tracking time.

The project is intentionally built to demonstrate production-oriented backend engineering practices, not just to solve the problem. Every major decision — from storage abstraction, to database migration strategy, to CI/CD pipeline design — reflects how these problems would be approached in a real production environment.

---
## From a Personal Problem to a Production System

```
Personal problem: gap between preparation and opportunities
          ↓
Opportunity + skill matching engine
          ↓
Modular Monolith (Spring Boot)
          ↓
Docker (consistent runtime across environments)
          ↓
AWS EC2 (production deployment)
          ↓
RDS + S3 (separate compute from state)
          ↓
Nginx (controlled public-facing edge layer)
          ↓
CloudWatch + SNS (centralized monitoring)
          ↓
Redis (caching for expensive analytics)
          ↓
Production-oriented Modular Monolith ✓
          ↓
Next: Microservices + gRPC + Kubernetes
```

Each major infrastructure decision came from a concrete problem or requirement encountered while building the system. The goal was not to add technologies for the sake of a longer stack, but to understand what problem each technology actually solves.

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

### Admin Opportunity Management
- Dedicated admin portal for opportunity data ingestion and management
- Full CRUD capabilities for job postings (Create, Read, Update, Delete)
- Role-based access control ensuring only users with `isAdmin` privileges can modify the opportunity pipeline

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
| Database | Amazon RDS PostgreSQL 16 |
| Migrations | Flyway |
| Cache | Redis 7 (Docker) |
| Storage | Local filesystem / Amazon S3 |
| Authentication | Google OAuth2 + JWT |
| Container | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | AWS EC2 |
| Monitoring | Amazon CloudWatch, SNS |

### Why Start With a Modular Monolith?

I wanted to eventually learn and implement microservices, but starting with microservices would have meant introducing network boundaries before fully understanding the domain boundaries.

So the system was deliberately started as a modular monolith. The backend is split into clear domain modules:

`auth` — `user` — `resume` — `opportunity` — `application` — `analytics` — `skill` — `role` — `company`

Each module has clear responsibilities with its own controller, service, repository, DTO, and entity layers, while the application still runs as one deployable unit. This allowed domain boundaries to emerge from a working system rather than being guessed upfront. The future microservice architecture can therefore be an extraction of real, proven boundaries rather than a theoretical split.

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
- Initially, PostgreSQL ran on the EC2 instance alongside the backend. That coupled compute and persistent storage to the same machine. As the system became more production-oriented, PostgreSQL was moved to **Amazon RDS** in private subnets — giving the database its own lifecycle, separate from the application server.

**Flyway**
- Versioned SQL migration tool. Schema changes are tracked as numbered migration scripts (`V1__` through `V13__`), ensuring every environment (local, CI, production) runs the exact same schema. This eliminates "it works on my machine" schema drift.
- `spring.jpa.hibernate.ddl-auto=validate` is used in production — Hibernate validates the schema against entities but never modifies the database, which is a production-safe configuration.

**Redis 7**
- In-memory data store used as the caching layer. Runs as a `redis:7-alpine` Docker container. Configured with a 30 MB memory cap and the `allkeys-lru` eviction policy, which is appropriate for a cache (not a durable store) on an EC2 instance with limited memory.

### Cloud & Storage

**Amazon S3**
- Object storage for resume PDFs and processed avatar images. Objects are stored under a namespaced key structure (`users/{userId}/resumes/{uuid}.pdf`, `users/{userId}/avatars/{uuid}.jpg`) for clean isolation.

**AWS EC2**
- The backend Docker container runs on an EC2 instance alongside a Redis container. Nginx runs directly on the EC2 host as the public-facing reverse proxy. Persistent state (database, object storage) lives in RDS and S3, keeping the EC2 instance stateless and replaceable.

### Authentication

**Google OAuth2**
- Users authenticate through Google's OAuth2 flow. The application never handles passwords. After the OAuth2 callback, a JWT is issued and delivered as an `HttpOnly` cookie.

**JWT (JJWT)**
- Stateless session tokens validated on every request by a custom `JwtAuthenticationFilter` that populates the Spring Security `SecurityContext`.

### CI/CD

**GitHub Actions**
- Three-stage pipeline: build & test → Docker build & push → EC2 deployment.

### Monitoring

**Amazon CloudWatch + SNS**
- Initially, with a single EC2 instance, it was reasonable to inspect Nginx logs directly on the machine (`/var/log/nginx/access.log`, `/var/log/nginx/error.log`). As the system became more production-oriented, relying only on files on one server became inconvenient. The CloudWatch Agent was introduced to collect those logs and forward them to CloudWatch Logs — providing centralized storage, search, and alerting. CloudWatch is the log storage and analysis layer; the agent's job is collection and forwarding only.

```
Nginx
  ↓
/var/log/nginx/*.log
  ↓
CloudWatch Agent (collection / forwarding)
  ↓
CloudWatch Logs (centralized storage / search / analysis)
  ↓
CloudWatch Alarms → SNS notifications
```

### Production Deployment

The production environment intentionally differs from the local development setup:
- **Compute**: Ubuntu EC2 instance running Nginx (as a host-level reverse proxy) and the Spring Boot backend inside Docker.
- **Database**: Managed Amazon RDS PostgreSQL placed in private subnets, accessed securely from the EC2 instance.
- **Cache**: Redis runs as a Docker container on the same EC2 instance as the backend, communicating over the Docker network.
- **Storage**: Amazon S3 is used for durable object storage (resumes, avatars).
- **IAM**: The EC2 instance uses an IAM instance role (`SkillMatchEC2Role`) for AWS access. No hardcoded credentials.
- **Monitoring**: Amazon CloudWatch Agent runs on the EC2 host, shipping Nginx access and error logs to CloudWatch Logs. CloudWatch alarms and SNS notifications are configured for production monitoring.
- **Local Development**: Continues to use the repository's `docker-compose.yml`, which spins up a local PostgreSQL container, a local Redis container, and the backend.

```
Internet
  ↓
Nginx on EC2 host
  ↓
Spring Boot backend in Docker
  ├── Redis in Docker (same EC2)
  ├── Amazon RDS PostgreSQL (private subnets)
  └── Amazon S3

EC2 host
  ↓
CloudWatch Agent
  ↓
CloudWatch Logs / monitoring
  ↓
SNS notifications
```

For a detailed breakdown of the production infrastructure, configuration, and security, see [docs/deployment.md](docs/deployment.md).

---

## System Design

### Authentication Module (`auth`)

Handles the complete OAuth2 flow. After Google redirects to the callback, `OAuth2SuccessHandler` extracts user claims (subject, email, name, picture) from the OIDC principal, creates or updates the user record via `AuthService`, generates a signed JWT, and delivers it as an `HttpOnly` cookie before redirecting to the frontend. The `JwtAuthenticationFilter` intercepts every subsequent request, validates the token, and populates the security context.

### User Module (`user`)

Manages user identity, extended profile (`UserProfile`), avatar storage, skill tracking, and profile completion scoring. `CurrentUserService` is the single point of truth for resolving the authenticated user from the security context. `ProfileCompletionService` dynamically computes a weighted score (summing to 100) across nine profile sections without ever persisting the score. `UserSkillService` manages manually declared skills separate from resume-extracted skills.

### Resume Module (`resume`)

Responsible for the full lifecycle of resume files: upload, storage, parsing, analysis, and management. `ResumeService` orchestrates the pipeline. `ResumeParserService` delegates to Apache PDFBox for text extraction. `ResumeAnalysisService` coordinates three extractors (skills, education, experience) and persists the results. If any step fails, the resume status is set to `FAILED` and orphaned files are cleaned up.

### Opportunity Module (`opportunity`)

Stores job opportunities with associated skills, importance levels, employment type, experience level, and location. `OpportunityService` handles reading and filtering for users, while `OpportunityIngestionService` provides a secure pipeline for administrators to manage live opportunities. `MatchingService` computes weighted match scores between a user's active resume skills and an opportunity's skill requirements. `RecommendationService` fetches all matching opportunities, scores each one against the user's resume, and returns them sorted by match percentage descending with pagination.

### Analytics Module (`analytics`)

`CareerAnalyticsService` computes five analytics sections — market coverage, learning roadmap, skills in demand, top strengths, and resume insights — using two batch database queries and in-memory aggregation. No analytics data is persisted; results are computed on demand from live opportunity and resume data.

The `getCareerAnalytics` method is annotated with `@Cacheable` (cache: `careerAnalytics`, key: `analytics:career:<userId>`). Results are cached in Redis with a 10-minute TTL. Cache entries are proactively evicted with `@CacheEvict` whenever underlying data changes — see the [Caching](#caching) section for details.

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

### Why S3?

Resume PDFs and profile avatars are persistent user data. Keeping those files on the EC2 filesystem would tie persistent storage to a particular server — if the instance is replaced, the files disappear.

Production storage was therefore moved to Amazon S3, while the application uses a storage abstraction so that business logic does not depend on the storage provider. Local development uses a local filesystem provider with no AWS credentials required.

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

### Why an EC2 IAM Role?

Once the application needed access to S3, long-lived AWS access keys were deliberately avoided. Keeping access keys inside an environment file or application configuration is a common credential leak vector — they don't rotate, and a leak can expose the account indefinitely.

Instead, the EC2 instance uses an IAM instance role (`SkillMatchEC2Role`). The AWS SDK obtains temporary credentials through the instance metadata service automatically. No access keys are stored anywhere on the instance or in the codebase.

### IAM Roles in Production (Technical Detail)

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

## Caching

### Why Redis?

Career analytics performs two batch database queries and aggregates the results in memory for every request. That work does not need to be repeated when the underlying user data — resume, skills, target roles — has not changed.

Once that became clear, caching was a natural optimization. Redis was introduced as a cache, not as a source of truth. The intended flow is:

```
Cache HIT
    ↓
Return cached CareerAnalyticsResponse (no database touched)

Cache MISS
    ↓
Query PostgreSQL
    ↓
Calculate analytics in-memory
    ↓
Store result in Redis
    ↓
Return response
```

The EC2 instance has limited memory and the project currently has low real-user traffic, so Redis is deliberately capped at 30 MB with `allkeys-lru` eviction. A cache miss is safe: it simply means the calculation runs again against the source-of-truth database.

### Overview

The cache is backed by a `redis:7-alpine` container. The `CacheConfig` class configures the `RedisCacheManager` with per-cache settings. Each cache name is a constant defined in `CacheConfig` to prevent typo-related bugs.

### Career Analytics Cache

`CareerAnalyticsService.getCareerAnalytics()` is annotated with `@Cacheable`:

```java
@Cacheable(
    cacheNames = CacheConfig.CAREER_ANALYTICS_CACHE,   // "careerAnalytics"
    key = "'analytics:career:' + #userId"
)
public CareerAnalyticsResponse getCareerAnalytics(UUID userId) { ... }
```

| Property | Value |
|---|---|
| Cache name | `careerAnalytics` |
| Key format | `analytics:career:<userId>` |
| TTL | 10 minutes |
| Value serializer | `Jackson2JsonRedisSerializer<CareerAnalyticsResponse>` (typed) |

**Cache hit:** Redis returns the cached `CareerAnalyticsResponse` without touching the database.  
**Cache miss:** The method executes two batch database queries, computes analytics in-memory, serializes the result, and stores it in Redis.

### A Real Redis Debugging Lesson

The first serializer tried was `GenericJackson2JsonRedisSerializer` with Jackson default typing. The first request successfully populated Redis, but the second request failed during deserialization because the expected `@class` type metadata was missing from the stored JSON.

This exposed an important detail: caching is not just about storing bytes in Redis — the application also needs a compatible serialization and deserialization strategy on both sides.

Because the `careerAnalytics` cache stores exactly one known type, the cache was switched to a typed `Jackson2JsonRedisSerializer<CareerAnalyticsResponse>`:

```
CareerAnalyticsResponse
    ↓
JSON (no @class metadata required)
    ↓
Redis
    ↓
JSON
    ↓
CareerAnalyticsResponse
```

No polymorphic `@class` metadata is embedded. Deserialization succeeds reliably because the target type is known at compile time.

### Why @CacheEvict?

TTL alone would eventually remove stale analytics, but it could still leave a user seeing outdated results for several minutes after they change their resume, skills, or target roles. Because the application knows exactly which operations affect career analytics, those mutations proactively evict the relevant cache entry:

```
Data changes (resume upload / skill added / target roles updated)
    ↓
@CacheEvict
    ↓
User's analytics cache entry removed
    ↓
Next analytics request → Redis MISS → fresh calculation
```

TTL is the automatic expiration safety net. `@CacheEvict` is proactive invalidation when the underlying data is known to have changed.

`@CacheEvict` proactively removes a user's cached analytics when their underlying data changes, so the next request always recomputes from fresh data.

| Service | Method | Eviction trigger |
|---|---|---|
| `ResumeService` | `uploadResume()` | New resume changes extracted skills |
| `ResumeService` | `deleteResume()` | Active resume skills may change |
| `ResumeService` | `activateResume()` | Active resume (and thus skills) changes |
| `UserSkillService` | `addSkill()` | Manually declared skills change |
| `UserSkillService` | `removeSkill()` | Manually declared skills change |
| `TargetRoleService` | `updateCurrentUserTargetRoles()` | Target roles determine which opportunities analytics covers |
| `UserService` | `updateCurrentUserProfile()` | Profile changes may affect analytics scope |

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

### Why Nginx?

Once the application was deployed on EC2, I didn't want the Spring Boot / Tomcat server to be the public-facing entry point. A dedicated edge layer can handle responsibilities that sit outside the application itself:

- HTTPS / TLS termination and certificate handling
- Reverse proxying to the application container
- Request-level access and error logging
- A future path toward load balancing

This led to the architecture:

```
Internet
    ↓
Nginx (EC2 host, NOT inside Docker)
    ↓
127.0.0.1:8080
    ↓
Spring Boot / Tomcat
```

Nginx keeps the application server from being directly exposed to the public internet and provides a controlled edge layer. Spring Boot only listens locally.

### Docker

Docker gave the backend and its supporting infrastructure a consistent runtime and made the same application image usable across development and production. The `Dockerfile` uses `eclipse-temurin:21-jre` — a JRE-only image (smaller than JDK) from the Adoptium distribution. The Maven build runs in CI, not inside Docker, so the Dockerfile is a single-stage image that copies the pre-built JAR. This keeps image build time minimal.

The repository `docker-compose.yml` is for **local development** and defines three services: `postgres`, `redis`, and `backend`. The backend waits for both `postgres` and `redis` to pass their health checks before starting. Both PostgreSQL and Redis use a named volume / in-container data respectively and communicate on the isolated `skillmatch-network`.

> **Note:** The production `docker-compose.yml` is maintained directly on the EC2 instance and is **not** committed to Git. It differs from the local file: it omits the local `postgres` service (using RDS instead) and pulls the pre-built image from Docker Hub rather than building from source.

### EC2

The EC2 instance runs Docker and Docker Compose. The application is deployed to `/opt/skillmatch`. All secrets are supplied through environment variables defined in `./backend/.env` on the instance — no secrets are baked into images or committed to source control.

The EC2 instance is assigned the IAM instance role `SkillMatchEC2Role`, which grants the minimum S3 permissions required. This means no AWS access keys are stored anywhere on the instance.

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
| `SPRING_REDIS_HOST` | Redis hostname (`localhost` when backend runs on host; `redis` when inside Docker Compose) |

---

## CI/CD Pipeline

Once deployment became repeatable, manually rebuilding and transferring the application to EC2 became unnecessary overhead. The CI/CD pipeline is the bridge between a Git push and a running backend on the server — removing human steps from the critical path.

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
│       │   ├── config/             # S3, cache (Redis), and app configuration
│       │   ├── opportunity/        # Opportunities, matching, recommendations
│       │   ├── resume/             # Upload, parsing, analysis, storage
│       │   ├── role/               # Target role management
│       │   ├── skill/              # Skill dictionary and user skills
│       │   └── user/               # Profile, avatar, completion score
│       └── resources/
│           ├── application.properties
│           └── db/migration/       # 13 versioned Flyway SQL scripts (V1-V13)
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
└── docker-compose.yml              # Local development compose file (postgres, redis, backend)
```

---

## Future Roadmap

### Implemented

Modular Monolith • Docker • GitHub Actions CI/CD • AWS EC2 • Amazon RDS PostgreSQL • Amazon S3 • Nginx • Redis caching • CloudWatch logging • SNS alerting

### Next

- **Microservices Extraction** — The modular monolith is designed to allow individual modules (e.g., resume processing, analytics) to be extracted into independent services with their own databases as scale or team structure demands it.
- **gRPC** — Synchronous service-to-service communication if microservices are introduced.
- **Kubernetes** — Container orchestration for automated scaling, self-healing, and rolling deployments.

### Exploratory / Conditional

- **Kafka / Event-Driven Architecture** — Only if a concrete async use case emerges (e.g., decoupled resume processing between services). Not a planned addition yet.
- **Terraform / Infrastructure as Code** — Codify the AWS infrastructure for reproducibility. A future learning phase; the current infrastructure was set up manually.
- **ALB + Multiple EC2 Instances** — Horizontal scaling behind an Application Load Balancer if traffic demands it.
- **Distributed / Managed Redis** — Replace the single-instance Docker Redis with Amazon ElastiCache if caching demands or availability requirements increase.
- **Stronger Observability** — Distributed tracing (e.g., OpenTelemetry) and structured application logs from the Spring Boot container shipped to CloudWatch.
- **AWS Secrets Manager / Parameter Store** — Migrate production secrets off the EC2 `.env` file to a managed secrets solution.

---

## Engineering Decisions

This section is a compact reference. The "Why?" reasoning for most infrastructure decisions is explained inline in the relevant sections above.

**Why Spring Boot?**
Spring Boot provides a battle-tested ecosystem for every production concern — security, data access, validation, configuration management, health checks, and testing infrastructure — without requiring from-scratch implementation. Its auto-configuration reduces boilerplate while remaining fully overridable.

**Why PostgreSQL?**
The domain is inherently relational. Users have resumes, resumes have extracted skills, opportunities have required skills, applications link users to opportunities. These relationships benefit from foreign key enforcement, JOIN queries, and transactional consistency. In production, PostgreSQL runs on Amazon RDS. See [Database](#database) for the migration story.

**Why Flyway?**
Database schema must be versioned the same way application code is versioned. Flyway's numbered migration scripts (`V1__` through `V13__`) ensure every environment reaches the exact same schema state. Combined with `ddl-auto=validate`, this prevents silent schema drift from ever reaching production.

**Why Docker?**
Docker eliminates environment inconsistencies. The same image that is built and tested in CI runs on EC2. Dependencies (Java version, OS libraries) are baked into the image and cannot drift between environments. For production, the backend image is pulled from Docker Hub while the production Compose configuration is maintained on EC2.

**Why EC2?**
EC2 provides direct control over the deployment environment — operating system, network configuration, IAM role assignment, and Docker runtime — without the abstractions and constraints of managed container services. It is the right tradeoff for a project that needs full deployment control without Kubernetes complexity.

**Why Storage Abstraction?**
Hardcoding S3 into service classes would make local development require AWS credentials and make it impossible to switch providers without modifying business logic. The `ResumeStorageService` and `AvatarStorageService` interfaces isolate the storage decision to a single configuration property, keeping business logic clean and provider-independent. Local development uses the local provider with no cloud credentials required.

**Why GitHub Actions?**
GitHub Actions is natively integrated with the repository, requiring no additional CI infrastructure. The pipeline is defined as code in the repository itself, making it versioned, reviewable, and reproducible.

---

## Running the Project

### Prerequisites

- Java 21
- Docker and Docker Compose
- Node.js 20+
- A Google OAuth2 application (Client ID and Client Secret)
- AWS credentials configured if using the S3 storage provider

### Running with Docker Compose (Backend + Database + Redis)

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
SPRING_REDIS_HOST=redis
```

2. Start the services:

```bash
docker compose up --build
```

This starts `postgres`, `redis`, and `backend`. The backend waits for both `postgres` and `redis` to pass their health checks before starting.

The backend will be available at `http://localhost:8080`.  
Health check: `http://localhost:8080/actuator/health`

### Running the Backend Locally (Without Docker)

```bash
cd backend
./mvnw spring-boot:run
```

Requires a running PostgreSQL instance and a running Redis instance (you can start just those two from Docker Compose: `docker compose up postgres redis`). Set `SPRING_REDIS_HOST=localhost` when the backend runs directly on the host.

> **Local Redis host distinction:** When Spring Boot runs inside Docker Compose, it reaches Redis at hostname `redis` (the Docker service name). When Spring Boot runs directly on the host (e.g., from IntelliJ), it must reach Redis at `localhost`. This distinction caused a real local debugging issue and is the reason `SPRING_REDIS_HOST` is externalised as an environment variable.

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

> Screenshots will be added after the current frontend polish pass is complete.

---

## License

This project is licensed under the [MIT License](LICENSE).
