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
  ↓
Amazon RDS PostgreSQL (In private subnets)
```

The application relies on the following infrastructure:
- **Amazon S3**: Used for object storage (resumes, profiles, and avatars).
- **Amazon RDS**: Managed PostgreSQL database.
- **EC2 (Ubuntu)**: Hosts the Dockerized Spring Boot application and the Nginx reverse proxy.
- **Environment Variables**: Application configuration is injected via a `.env` file located at `/opt/skillmatch/.env` on the EC2 instance. This file contains production secrets and is intentionally omitted from version control.
- **Production `docker-compose.yml`**: Maintained directly on the EC2 instance and NOT committed to Git.

## Current RDS Configuration

- **Database Engine**: PostgreSQL on Amazon RDS.
- **Network Security**: RDS is placed in the private DB subnet group and is NOT publicly accessible. The EC2 instance accesses RDS through the VPC and security group configuration.
- **Port**: 5432.
- **Connection**: Spring Boot connects to the database using the standard Spring Data JPA properties `DB_URL` (e.g., `jdbc:postgresql://<RDS_ENDPOINT>:5432/skillmatch`), `DB_USERNAME`, and `DB_PASSWORD`. Actual database credentials and endpoints are securely managed outside the repository.

## Database Migration

SkillMatch uses **Flyway** for database schema migrations.
- The RDS database was successfully initialized by the application's existing Flyway migrations (currently `V1` through `V13`).
- The application automatically applied all current migrations upon startup.
- Hibernate is configured to validate the resulting schema against entity mappings, without modifying the database.

## EC2 Configuration

- **OS**: Ubuntu EC2 instance.
- **Docker**: Runs the Spring Boot backend application container. The container is configured with `restart: unless-stopped` and includes a healthcheck.
- **Nginx**: Runs directly on the host (outside of Docker) and acts as the public-facing reverse proxy, forwarding requests to the internal backend exposed on `127.0.0.1:8080`.
- **Environment Configuration**: The production backend container loads its variables from the EC2 `.env` file.

## Storage Configuration

- **PostgreSQL**: The database is NO LONGER running on EC2. After a successful migration to Amazon RDS, the old PostgreSQL Docker container and its associated Docker volume were removed from the production EC2 setup.
- **Object Storage**: Resume and avatar file storage is handled through Amazon S3. No local filesystem bind mounts (such as the old `/data` directory) are required or used for persistence in production.

## Local vs Production Environments

It is critical to maintain the distinction between local development and production.

### Local Development

The `docker-compose.yml` present in this repository is strictly for **LOCAL DEVELOPMENT**.

```text
docker-compose.yml
  → Spring Boot container
  → PostgreSQL container (local database)
```
This setup allows developers to run a full stack locally without needing AWS infrastructure or cloud credentials.

### Production

The production environment intentionally differs to provide security, durability, and performance:

```text
EC2 Host
  → Nginx (Host-level reverse proxy)
  → Spring Boot Docker container (Stateless backend)
  → Amazon RDS PostgreSQL (Managed database)
  → Amazon S3 (Managed object storage)
```
This decoupling ensures that state (database, uploads) is separated from compute, allowing the EC2 instance to be safely restarted or replaced without data loss.

## Deployment Flow

The current deployment is automated via GitHub Actions, as defined in `.github/workflows/backend-ci.yml`.

1. **Build & Test**: On push to `main`, a CI job builds the Java 21 backend and runs tests using a local PostgreSQL 16 service container.
2. **Docker Publish**: The verified backend JAR is packaged into a Docker image (`skillmatch:latest` and a version tag) and pushed to Docker Hub.
3. **Deploy to EC2**: The pipeline SSHes into the EC2 instance, navigates to `/opt/skillmatch`, pulls the latest Docker images (`docker compose pull`), restarts the backend container (`docker compose up -d`), and prunes old images.

## Security

- **Network Isolation**: RDS is strictly private. Only the required EC2-to-RDS PostgreSQL connectivity (port 5432) is allowed through security groups.
- **Secret Management**: Real secrets (JWT secrets, OAuth credentials, DB passwords) are kept entirely outside of Git and are stored only in the EC2 `.env` file. Never put secrets in the repository.
- **Reverse Proxy**: Nginx is the public-facing entry point, terminating outside connections and securely proxying to the isolated Docker backend.
- *(Note: IAM authentication to PostgreSQL and AWS Secrets Manager are NOT currently implemented.)*

## Planned / Future Improvements

The following items are part of our roadmap but are **not yet implemented**:
- **CloudWatch / Structured Logging**: Ship structured logs from the application container to CloudWatch Logs for centralized log management and alerting.
- **Redis**: Cache opportunity match results and analytics responses to reduce database load.
- **AWS Secrets Manager / Parameter Store**: Migrate away from the local EC2 `.env` file to a managed secrets solution.
- **Private EC2 & Load Balancer**: Move the EC2 instance into a private subnet and place an Application Load Balancer (ALB) in front of it.
