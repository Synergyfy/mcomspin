# Step 15: Deployment, DevOps & Testing

## Overview
Set up the infrastructure for deploying, monitoring, and maintaining the MCOM ecosystem. Covers Docker, CI/CD, environments, database operations, testing strategy, monitoring, and security.

## Docker Setup

### Root `docker-compose.yml`
```yaml
version: '3.8'
services:
  traefik:
    image: traefik:v3.0
    # Reverse proxy with SSL termination

  api:
    build: ./apps/api
    # NestJS app
    ports: ['3000']
    environment:
      - DATABASE_URL
      - REDIS_URL
      - JWT_SECRET

  web:
    build: ./apps/web
    # Next.js app
    ports: ['3000']

  postgres:
    image: postgres:16-alpine
    volumes: ['pgdata:/var/lib/postgresql/data']

  redis:
    image: redis:7-alpine

  worker:
    build: ./apps/api
    command: node dist/worker.js
    # Background job processing
```

### Dockerfile Patterns

**API Dockerfile:**
- Multi-stage build (dependencies → build → production)
- pnpm for package management
- Prisma generate + migration on startup
- Non-root user for security

**Web Dockerfile:**
- Multi-stage build
- Next.js standalone output
- Static asset optimization
- CDN integration for images

## CI/CD Pipeline (GitHub Actions)

### Workflows

**1. CI — Lint, Typecheck, Test**
```yaml
name: CI
on: [pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup pnpm + Node
      - pnpm install
      - pnpm lint
      - pnpm typecheck
      - pnpm test
```

**2. CD — Staging Deploy**
```yaml
name: Deploy Staging
on:
  push:
    branches: [develop]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Build Docker images
      - Push to registry
      - Deploy to staging cluster
      - Run database migrations
      - Run smoke tests
```

**3. CD — Production Deploy**
```yaml
name: Deploy Production
on:
  push:
    tags: ['v*']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Build + push images
      - Deploy to production cluster (rolling update)
      - Run migrations (with safety checks)
      - Run post-deploy health checks
      - Notify Slack
```

## Environment Configuration

### Environments
1. **Local** — Docker Compose for dev
2. **Development** — Shared dev server
3. **Staging** — Pre-production (mirrors production)
4. **Production** — Live

### Environment Variables
```
# Database
DATABASE_URL=postgresql://user:pass@host:5432/mcomspin

# Redis
REDIS_URL=redis://host:6379

# Auth
JWT_SECRET=
JWT_EXPIRY=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRY=7d

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=

# SMS (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Email (Resend/SendGrid)
EMAIL_API_KEY=
EMAIL_FROM=noreply@mcomspin.com

# Storage (S3/R2)
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_BUCKET=
STORAGE_ENDPOINT=

# Payment (Stripe)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Maps (Mapbox/Google)
MAPS_API_KEY=

# App
APP_URL=https://mcomspin.com
API_URL=https://api.mcomspin.com
NODE_ENV=production
```

## Database Operations

### Migration Strategy
- Prisma Migrate for schema changes
- Migration files committed to version control
- Automated migration in CI/CD pipeline
- Rollback plan for each deployment

### Migration Safety
- Preview migrations in staging first
- Generate SQL for review on breaking changes
- Backfill data strategies for new columns
- Zero-downtime migrations (expand-contract pattern)

### Backup & Recovery
- Daily automated PostgreSQL backups (pg_dump)
- Point-in-time recovery enabled
- Backup stored in separate S3 bucket
- Retention: daily (30 days), weekly (12 weeks), monthly (12 months)

### Performance
- Query analysis with EXPLAIN ANALYZE
- Slow query logging (100ms threshold)
- Index monitoring and recommendations
- Connection pooling (PgBouncer)
- Read replicas for analytics queries

## Testing Strategy

### Unit Tests (Jest)
- Service layer tests with mocked dependencies
- Utility/helper function tests
- Validation pipe tests
- Coverage target: 80%+

### Integration Tests
- NestJS end-to-end tests with test database
- API endpoint tests (request → response validation)
- Authentication & authorization flow tests
- Prisma query tests

### E2E Tests (Playwright)
- Critical customer journeys:
  - Business registration → campaign creation → game play → reward redemption
  - Customer discovery → promotion claim → reward earn → redeem
  - Admin approval flows
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing

### Load Tests (k6)
- Game session API (high concurrency scenario)
- Customer discovery endpoints (geo-queries)
- Notification dispatch (batch operations)
- Target: 1000 concurrent users with <500ms p95

### Quality Gates
- All lint checks pass
- TypeScript strict mode no errors
- Test coverage >= 80%
- No known CVEs in dependencies
- Bundle size within budget

## Monitoring & Observability

### Logging
- Structured JSON logging (pino)
- Log levels: debug, info, warn, error, fatal
- Request ID tracing across services
- Centralized log aggregation (Grafana Loki / Datadog)

### Metrics
- Node.js runtime metrics (memory, CPU, event loop lag)
- HTTP request metrics (count, duration, status codes)
- Database query metrics
- Business metrics (plays, redemptions, registrations)
- Custom Prometheus metrics

### Alerts
- PagerDuty / Slack integration
- Alert rules:
  - Error rate > 1% over 5 minutes
  - p95 latency > 1s
  - Database connection pool exhaustion
  - Disk space < 20%
  - SSL certificate expiry < 30 days

### APM
- Distributed tracing (OpenTelemetry)
- Transaction performance breakdown
- External service dependency monitoring
- Slow endpoint identification

## Security

### Application Security
- Helmet.js for HTTP headers
- CORS configured per environment
- Rate limiting on auth endpoints
- Input validation on all endpoints
- SQL injection prevention (Prisma parameterized queries)
- XSS protection (output encoding)
- CSRF protection for cookie-based auth

### Authentication Security
- bcrypt for password hashing (cost factor 12)
- JWT stored in httpOnly, secure, sameSite cookies
- Refresh token rotation
- Account lockout after 5 failed attempts
- OTP rate limiting (3 attempts per phone/email per 10 min)

### API Security
- API key for internal services
- Role-based access control (RBAC)
- Permission-based endpoint guards
- Request size limits (10MB uploads)
- API versioning to prevent breaking changes

### Infrastructure Security
- All traffic over TLS 1.3
- Network isolation (internal services not exposed)
- Secrets management (Vault / GitHub Secrets)
- Regular dependency scanning (Dependabot / Snyk)
- Docker image vulnerability scanning

## Infrastructure as Code

### Terraform / Pulumi
- VPC and network configuration
- Database (RDS / Cloud SQL)
- Redis (ElastiCache / Memorystore)
- Object storage (S3 / R2)
- Load balancer configuration
- Auto-scaling groups
- CDN (CloudFront / Cloudflare)

### Kubernetes (Optional for Scale)
- Deployment manifests
- Horizontal Pod Autoscaler
- Ingress configuration
- Service mesh (if needed)
- Pod resource limits

## Performance Budgets

| Metric | Target |
|--------|--------|
| API p95 response time | < 300ms |
| Web page load (LCP) | < 2s |
| Game session start | < 1s |
| Search results | < 500ms |
| Map tile loading | < 1s |
| Notification delivery | < 10s |
| Image upload | < 3s |
| CSV export (10k rows) | < 10s |
| Concurrent game sessions | 1000+ |
| API uptime | 99.9% |

## Rollback Plan

### Pre-Deploy Checklist
- [ ] Database migration reviewed
- [ ] Backups confirmed recent
- [ ] Smoke tests passing
- [ ] Feature flags for new functionality
- [ ] Monitoring dashboards verified

### Rollback Steps
1. Revert Docker image tag to previous version
2. Roll back database migration (if needed)
3. Verify health checks passing
4. Run smoke tests
5. Notify team of rollback

### Feature Flags
- Server-side feature toggle system
- Gradual rollout (10% → 50% → 100%)
- Kill switch for problematic features
- A/B testing capability

## Runbooks

### Common Incidents
1. **High Error Rate** — Check recent deploy, query logs, check external services
2. **Database Slowdowns** — Check slow query log, verify indexes, check connections
3. **Auth Failures** — Verify JWT secret, check Redis sessions, check OAuth provider status
4. **Payment Failures** — Check Stripe dashboard, verify webhook delivery, check billing service logs
5. **Game Performance** — Check game service CPU/memory, verify WebSocket connections, check physics engine config

### Health Endpoints
```
GET  /health          — Basic health check
GET  /health/ready    — Readiness (DB, Redis, external services)
GET  /health/live     — Liveness (process running)
GET  /health/db       — Database connection status
GET  /health/queue    — Job queue status
```

## Development Workflow

### Local Setup
```
git clone git@github.com:mcom/mcomspin.git
cd mcomspin
pnpm install
cp apps/api/.env.example apps/api/.env
docker compose up -d postgres redis
pnpm --filter @mcomspin/api prisma:migrate
pnpm dev
```

### Commit Convention
```
type(scope): description

Types: feat, fix, refactor, test, docs, chore, style
Scopes: api, web, admin, customer, business, game, rewards, campaigns, etc.
```

### Branch Strategy
- `main` — Production-ready code
- `develop` — Integration branch
- `feature/xxx` — Feature branches from develop
- `fix/xxx` — Bug fix branches
- `release/x.x.x` — Release preparation branches

### Code Review Checklist
- [ ] Follows coding conventions
- [ ] TypeScript strict mode passes
- [ ] Tests included/updated
- [ ] API changes documented (Swagger)
- [ ] Database migration safe
- [ ] Error handling complete
- [ ] Security considerations addressed
- [ ] Performance implications considered
