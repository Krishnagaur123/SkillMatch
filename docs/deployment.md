# SkillMatch Production Deployment Architecture

This document accurately describes the current production deployment architecture for SkillMatch. It carefully distinguishes between the local development environment and the production environment.

## Production Architecture

The production environment is hosted on AWS and follows this high-level request flow:

```text
Internet
  ↓
Nginx (Running directly on the EC2 host)
  ↓
Spring Boot Backend (Running in Docker on EC2)
  ├── Redis (Running in Docker on the same EC2 instance)
  ├── Amazon RDS PostgreSQL (In private subnets)
  └── Amazon S3 (Object storage)

EC2 host
  ↓
CloudWatch Agent
  ↓
CloudWatch Logs / monitoring
  ↓
SNS notifications
```

The application relies on the following infrastructure:
- **Amazon S3**: Used for object storage (resumes and avatars).
- **Amazon RDS**: Managed PostgreSQL database in private subnets.
- **Redis**: In-memory cache running as a Docker container on the EC2 instance.
- **EC2 (Ubuntu)**: Hosts the Dockerized Spring Boot application, the Redis container, and the Nginx reverse proxy.
- **CloudWatch**: Centralized log storage and monitoring, fed by CloudWatch Agent running on the EC2 host.
- **SNS**: Notification delivery for CloudWatch alarms.
- **Environment Variables**: Application configuration is injected via a `.env` file located at `/opt/skillmatch/` on the EC2 instance. This file contains production secrets and is intentionally omitted from version control.
- **Production `docker-compose.yml`**: Maintained directly on the EC2 instance and NOT committed to Git.

---

## VPC / Network

- RDS is placed in the **private DB subnet group** and is NOT publicly accessible.
- The EC2 instance accesses RDS through the VPC and security group configuration.
- Redis is NOT publicly exposed. The backend communicates with Redis over the Docker network.
- Only the required EC2-to-RDS PostgreSQL connectivity (port 5432) is permitted through security groups.

---

## EC2 Configuration

- **OS**: Ubuntu EC2 instance.
- **Nginx**: Runs directly on the host (outside of Docker) and acts as the public-facing reverse proxy. Forwards requests to `127.0.0.1:8080` (the backend container port). Nginx access and error logs are available on the EC2 host under `/var/log/nginx`.
- **Docker**: Runs the Spring Boot backend container and the Redis container. The backend container is configured with `restart: unless-stopped` and includes a health check.
- **IAM Instance Role**: `SkillMatchEC2Role` is assigned to the EC2 instance, granting it the minimum S3 permissions required. No AWS access keys are stored on the instance.
- **Environment Configuration**: The production backend container loads its variables from the EC2 `.env` file.

---

## RDS Configuration

- **Database Engine**: PostgreSQL on Amazon RDS.
- **Network Security**: RDS is placed in the private DB subnet group and is NOT publicly accessible.
- **Port**: 5432.
- **Connection**: Spring Boot connects using `DB_URL` (e.g., `jdbc:postgresql://<RDS_ENDPOINT>:5432/skillmatch`), `DB_USERNAME`, and `DB_PASSWORD`. Actual credentials and endpoints are managed outside the repository.

---

## Database Migrations

SkillMatch uses **Flyway** for database schema migrations.

- The RDS database is initialized and kept up to date by Flyway migrations (`V1` through `V13`).
- Migrations are applied automatically on application startup.
- Hibernate is configured with `ddl-auto=validate`: it validates the schema against entity mappings on startup but never modifies the database. Schema changes go through Flyway only.

---

## Storage Configuration

- **PostgreSQL**: The database runs on Amazon RDS — NOT on the EC2 host. There is no local PostgreSQL Docker container in production.
- **Object Storage**: Resume PDF files and avatar images are stored on Amazon S3. No local filesystem bind mounts are used for persistence in production.
- **Storage Key Design**: The `storagePath` column (on `Resume`) and `avatarStorageKey` column (on `User`) store logical storage keys (e.g., `users/{userId}/resumes/{uuid}.pdf`), not absolute filesystem paths. This makes the keys portable and provider-independent.

---

## Redis Configuration

Redis runs as a Docker container on the same EC2 instance as the backend. It is used as the caching layer for Career Analytics.

| Property | Value |
|---|---|
| Image | `redis:7-alpine` |
| Max memory | 30 MB |
| Eviction policy | `allkeys-lru` |
| Health check | `redis-cli ping` |
| Restart policy | `unless-stopped` |
| Network exposure | Internal Docker network only — NOT publicly exposed |

**Why 30 MB?** The EC2 instance has limited memory. This is a cache, not a durable store. A cache miss simply causes recomputation from the database.

The backend communicates with Redis over the Docker network. In production, the Redis hostname is the Docker service name. The Redis hostname is externalised as `SPRING_REDIS_HOST` to support both Docker Compose and host-based backend execution.

---

## IAM

- The EC2 instance is assigned the IAM instance role **`SkillMatchEC2Role`**.
- The role grants the minimum S3 permissions required by the application (least privilege).
- The Spring Boot S3 client uses `DefaultCredentialsProvider`, which automatically picks up the instance role on EC2. No access keys are stored anywhere.
- *(Note: IAM authentication to PostgreSQL and AWS Secrets Manager are NOT currently implemented.)*

---

## CloudWatch

Amazon CloudWatch Agent runs on the EC2 host. It collects the following Nginx log files and ships them to CloudWatch Logs:

- `/var/log/nginx/access.log`
- `/var/log/nginx/error.log`

CloudWatch Logs provides centralized log storage and analysis, replacing the need to manually inspect the EC2 filesystem for Nginx log data.

---

## SNS / Monitoring

CloudWatch monitoring alarms and SNS notifications have been configured as part of the production monitoring setup. When a CloudWatch alarm triggers, an SNS notification is delivered.

*(Specific alarm thresholds and metric names are configured in AWS and are not codified in this repository.)*

---

## Local vs Production Environments

It is critical to maintain the distinction between local development and production.

### Local Development

The `docker-compose.yml` present in this repository is strictly for **LOCAL DEVELOPMENT**.

```text
docker-compose.yml
  → postgres container (local database)
  → redis container (local cache)
  → backend container
```

The backend depends on both `postgres` and `redis` passing their health checks before starting.

**Redis host distinction:** When Spring Boot runs inside Docker Compose, it reaches Redis at hostname `redis` (the Docker Compose service name). When Spring Boot runs directly on the host (e.g., from IntelliJ), it must reach Redis at `localhost`. This distinction is why `SPRING_REDIS_HOST` is externalised as an environment variable. Set it to `redis` in `.env` when running inside Docker Compose, and to `localhost` when running the backend directly on the host.

This setup allows developers to run a full stack locally without needing AWS infrastructure or cloud credentials.

### Production

The production environment intentionally differs to provide security, durability, and performance:

```text
EC2 Host
  → Nginx (Host-level reverse proxy → 127.0.0.1:8080)
  → Spring Boot Docker container (Stateless backend)
  → Redis Docker container (Cache)
  → Amazon RDS PostgreSQL (Managed database, private subnets)
  → Amazon S3 (Managed object storage)
```

State (database, object storage) is fully separated from compute. The EC2 instance can be restarted or replaced without data loss. Redis is a cache — losing it on a restart causes cache misses, not data loss.

---

## Deployment Flow

The current deployment is automated via GitHub Actions, as defined in `.github/workflows/backend-ci.yml`.

1. **Build & Test**: On push to `main`, a CI job builds the Java 21 backend and runs tests using a local PostgreSQL 16 service container.
2. **Docker Publish**: The verified backend JAR is packaged into a Docker image (`skillmatch:latest` and a version tag) and pushed to Docker Hub.
3. **Deploy to EC2**: The pipeline SSHes into the EC2 instance, navigates to `/opt/skillmatch`, pulls the latest Docker images (`docker compose pull`), restarts the backend container (`docker compose up -d`), and prunes old images.

The production `docker-compose.yml` on the EC2 instance is not committed to Git. It pulls the pre-built backend image from Docker Hub and does not include a local `postgres` service (production uses RDS).

---

## Environment Configuration

All sensitive configuration is externalised. The production `.env` file on EC2 contains:

| Variable | Purpose |
|---|---|
| `DB_URL` | RDS PostgreSQL JDBC connection string |
| `DB_USERNAME`, `DB_PASSWORD` | RDS credentials |
| `JWT_SECRET` | HMAC signing secret for JWT |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth2 client credentials |
| `S3_BUCKET`, `S3_REGION` | S3 bucket configuration |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |
| `AUTH_REDIRECT_URL` | Post-OAuth2 redirect target |
| `COOKIE_SECURE` | `true` in production (enables `Secure` flag on cookies) |
| `SPRING_REDIS_HOST` | Redis hostname (Docker service name in production) |
| `APP_STORAGE_PROVIDER` | `s3` in production |

Local development uses the same variable names but with local values.

---

## Security

- **Network Isolation**: RDS is strictly private. Only the required EC2-to-RDS PostgreSQL connectivity (port 5432) is allowed through security groups. Redis is not publicly exposed.
- **IAM Roles**: The EC2 instance uses `SkillMatchEC2Role` for AWS access. No hardcoded access keys anywhere.
- **Secret Management**: Real secrets (JWT secrets, OAuth credentials, DB passwords) are kept entirely outside of Git and are stored only in the EC2 `.env` file.
- **Reverse Proxy**: Nginx is the public-facing entry point, terminating outside connections and securely proxying to the isolated Docker backend.
- **`ddl-auto=validate`**: Hibernate validates the schema on startup but never modifies the database. All schema changes go through Flyway migrations.
- *(Note: IAM authentication to PostgreSQL and AWS Secrets Manager are NOT currently implemented.)*

---

## Operational Commands

### Check running containers
```bash
docker compose ps
```

### View backend logs
```bash
docker compose logs -f backend
```

### View Redis logs
```bash
docker compose logs -f redis
```

### Check Nginx logs (on EC2 host)
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Manually deploy latest image
```bash
cd /opt/skillmatch
docker compose pull
docker compose up -d
docker image prune -f
```

### Connect to Redis CLI (inside container)
```bash
docker exec -it skillmatch-redis redis-cli
```

---

## Cost Considerations

- Redis is kept at 30 MB because this project currently has low real-user traffic and the EC2 instance has limited memory. A cache miss simply causes recomputation from the database — there is no data loss.
- The production `docker-compose.yml` keeps Redis and the backend on the same EC2 instance to avoid the cost of a separate managed cache service (e.g., ElastiCache) at this scale.

---

## Future Infrastructure Roadmap

The following items are part of the roadmap but are **not yet implemented**:

- **Terraform / Infrastructure as Code**: Codify the AWS infrastructure (VPC, subnets, security groups, EC2, RDS, S3, IAM) for reproducibility and auditability.
- **Private EC2 & Application Load Balancer**: Move the EC2 instance into a private subnet and place an ALB in front of it for HTTPS termination and horizontal scaling.
- **AWS Secrets Manager / Parameter Store**: Migrate away from the local EC2 `.env` file to a managed secrets solution.
- **Distributed / Managed Redis**: Replace the single-instance Docker Redis with Amazon ElastiCache if caching demands increase or high availability is required.
- **Kubernetes**: Container orchestration for automated scaling, self-healing, and rolling deployments.
- **Stronger Observability**: Structured application logs from the Spring Boot container shipped to CloudWatch, distributed tracing (e.g., OpenTelemetry), and dashboards.
- **Multi-AZ RDS**: Enable Multi-AZ failover on RDS for high availability.
