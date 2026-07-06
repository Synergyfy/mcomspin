# Step 2: API Core, Auth & Middleware

## Overview
Build the NestJS API foundation: module structure, authentication system, guards, middleware, and shared infrastructure.

## Module Structure

```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   ├── roles.decorator.ts
│   │   └── public.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── throttle.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   ├── transform.interceptor.ts
│   │   └── audit.interceptor.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── middleware/
│   │   ├── request-logger.middleware.ts
│   │   └── device-detector.middleware.ts
│   ├── pipes/
│   │   ├── validation.pipe.ts
│   │   └── parse-ulid.pipe.ts
│   └── constants/
│       ├── permissions.constant.ts
│       └── roles.constant.ts
├── modules/
│   ├── auth/
│   ├── users/
│   ├── businesses/
│   ├── storefronts/
│   ├── campaigns/
│   ├── games/
│   ├── rewards/
│   ├── boroughs/
│   ├── high-streets/
│   ├── partnerships/
│   ├── events/
│   ├── notifications/
│   ├── analytics/
│   ├── billing/
│   ├── moderation/
│   └── uploads/
└── prisma/
    ├── prisma.service.ts
    └── prisma.module.ts
```

## Authentication System

### Auth Methods
1. **JWT Access + Refresh Tokens**
   - Access token: 15min expiry, short-lived
   - Refresh token: 7 day expiry, rotating
   - Stored in httpOnly cookies + Authorization header

2. **OTP Login (Phone/Email)**
   - Send OTP to phone (SMS) or email
   - Verify OTP, issue temporary token
   - Complete profile or log in

3. **Social Login (Google, Apple)**
   - OAuth 2.0 flow
   - Account linking
   - Profile data import

### Auth Module
```
auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts
│   ├── jwt-refresh.strategy.ts
│   ├── otp.strategy.ts
│   └── google.strategy.ts
├── dto/
│   ├── login.dto.ts
│   ├── register.dto.ts
│   ├── verify-otp.dto.ts
│   └── refresh-token.dto.ts
└── guards/
    ├── local-auth.guard.ts
    └── otp-auth.guard.ts
```

## Role-Based Access Control

### Role Hierarchy
```
SuperAdmin          — Full system access
BoroughAdmin        — Borough-scoped management
HighStreetManager   — High street operations
CampaignManager     — Campaign creation & management
Moderator           — Content moderation
SupportStaff        — Ticket resolution
BusinessOwner       — Own business management
Staff               — Limited business access
Customer            — Consumer platform access
```

### Permission Model
Granular permissions on each resource:
- `business:create`, `business:read`, `business:update`, `business:delete`
- `campaign:create`, `campaign:approve`, `campaign:feature`
- `reward:manage`, `reward:redeem`
- `user:manage`, `user:suspend`
- `borough:assign`, `borough:override`
- `moderation:review`, `moderation:escalate`
- `billing:read`, `billing:refund`

## Guards & Decorators

### Guards
- **JwtAuthGuard** — Validates JWT on protected routes
- **RolesGuard** — Checks user roles against required roles
- **PermissionsGuard** — Checks granular permissions
- **ThrottleGuard** — Rate limiting per endpoint
- **BoroughScopeGuard** — Ensures admin can only access their borough

### Decorators
- `@CurrentUser()` — Inject current authenticated user
- `@Roles('ADMIN', 'MANAGER')` — Require specific roles
- `@Permissions('campaign:create')` — Require specific permission
- `@Public()` — Mark route as public (no auth required)
- `@BoroughScope()` — Inject current user's borough scope

## Middleware

### Request Logger
- Log method, URL, status, duration
- Capture user ID if authenticated
- Structured JSON logging

### Device Detector
- Parse User-Agent for device type
- Detect mobile/tablet/desktop
- Store device info in request context

## Shared Infrastructure

### Prisma Service
- Singleton PrismaClient
- Soft-delete middleware
- Audit logging middleware
- Query timing logging (dev only)

### Validation
- Global validation pipe using class-validator
- Custom validation decorators for business rules
- Sanitization for text inputs

### Response Transform
- Standard envelope: `{ success, data, meta, error }`
- Pagination metadata
- Field selection support
- Error code standardization

### File Upload
- Multer-based upload module
- S3/Local storage abstraction
- Image optimization pipeline
- File type validation
- Size limits per entity type

## API Versioning
- URI-based versioning: `/api/v1/...`
- All endpoints prefixed with `/api/v1`

## Swagger/OpenAPI
- `@nestjs/swagger` integration
- Tagged by module
- Auth schemes documented
- Example responses for all endpoints
- DTOs auto-generated in spec
