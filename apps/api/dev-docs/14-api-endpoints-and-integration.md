# Step 14: API Endpoints & Integration

## Overview
Define and implement the complete REST API surface for the MCOM ecosystem. All endpoints follow RESTful conventions with consistent error handling, pagination, filtering, and response envelopes.

## API Conventions

### Base URL
```
/api/v1
```

### Response Envelope
```typescript
{
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Authentication
- JWT Bearer token in `Authorization` header for authenticated routes
- `@Public()` decorator for public routes
- Refresh token rotation via `POST /auth/refresh`

### Pagination Query Params
```
?page=1&limit=20&sort=createdAt&order=desc
```

### Filter Query Params
```
?status=ACTIVE&boroughId=uuid&category=FOOD
```

### Search Query Params
```
?search=term&searchFields=name,description
```

## Complete Endpoint Catalog

### Auth Module
```
POST   /auth/register                  — Register new user
POST   /auth/login                     — Login (email/phone + password)
POST   /auth/login/social              — Social login (Google, Apple)
POST   /auth/otp/send                  — Send OTP for phone/email
POST   /auth/otp/verify                — Verify OTP
POST   /auth/refresh                   — Refresh access token
POST   /auth/logout                    — Logout (invalidate refresh token)
POST   /auth/forgot-password           — Send password reset
POST   /auth/reset-password            — Reset password with token
GET    /auth/me                        — Get current user profile
```

### User Management
```
GET    /users                          — List users (admin)
GET    /users/:id                      — Get user detail
PUT    /users/:id                      — Update user
DELETE /users/:id                      — Soft delete user
PUT    /users/:id/role                 — Update user role (admin)
PUT    /users/:id/status               — Suspend/activate user (admin)
```

### Boroughs
```
GET    /boroughs                       — List boroughs
GET    /boroughs/:id                   — Borough detail with stats
POST   /boroughs                       — Create borough (admin)
PUT    /boroughs/:id                   — Update borough (admin)
DELETE /boroughs/:id                   — Delete borough (admin)
GET    /boroughs/:id/businesses        — Businesses in borough
GET    /boroughs/:id/campaigns         — Campaigns in borough
GET    /boroughs/:id/analytics         — Borough analytics
```

### High Streets
```
GET    /high-streets                   — List high streets
GET    /high-streets/:id               — High street detail
POST   /high-streets                   — Create high street (admin)
PUT    /high-streets/:id               — Update/activate high street
DELETE /high-streets/:id               — Delete high street
POST   /high-streets/:id/activate      — Activate high street (step wizard)
GET    /high-streets/:id/businesses    — Businesses on high street
GET    /high-streets/:id/map           — Map data
```

### Businesses
```
GET    /businesses                     — List businesses
GET    /businesses/:id                 — Business detail
POST   /businesses                     — Register business
PUT    /businesses/:id                 — Update business
DELETE /businesses/:id                 — Soft delete business
PUT    /businesses/:id/verify          — Verify business (admin)
PUT    /businesses/:id/approve         — Approve business (admin)
PUT    /businesses/:id/suspend         — Suspend business (admin)
PUT    /businesses/:id/feature         — Toggle featured status
GET    /businesses/:id/analytics       — Business analytics
GET    /businesses/:id/activity        — Business activity log
PUT    /businesses/:id/membership      — Update membership tier
GET    /businesses/nearby              — Nearby businesses (geo query)
```

### Storefront
```
GET    /business/:businessId/storefront           — Get storefront
PUT    /business/:businessId/storefront/profile   — Update profile
POST   /business/:businessId/storefront/logo      — Upload logo
POST   /business/:businessId/storefront/cover     — Upload cover
PUT    /business/:businessId/storefront/hours     — Update hours
PUT    /business/:businessId/storefront/social    — Update social links
PUT    /business/:businessId/storefront/appearance — Update appearance
GET    /business/:businessId/storefront/verification — Verification status
POST   /business/:businessId/storefront/verification/google — Connect Google
POST   /business/:businessId/storefront/verification/verify — Submit verification
```

### Products
```
GET    /business/:businessId/products             — Product list
POST   /business/:businessId/products             — Create product
PUT    /business/:businessId/products/:id         — Update product
DELETE /business/:businessId/products/:id         — Delete product
POST   /business/:businessId/products/:id/images  — Upload product images
PUT    /business/:businessId/products/:id/status  — Update status
POST   /business/:businessId/products/:id/promote — Link to promotion
```

### Services
```
GET    /business/:businessId/services             — Service list
POST   /business/:businessId/services             — Create service
PUT    /business/:businessId/services/:id         — Update service
DELETE /business/:businessId/services/:id         — Delete service
PUT    /business/:businessId/services/:id/availability — Update availability
POST   /business/:businessId/services/:id/spare-capacity — Create spare capacity offer
```

### Campaigns
```
GET    /campaigns                        — List campaigns
GET    /campaigns/:id                    — Campaign detail
POST   /campaigns                        — Create campaign
PUT    /campaigns/:id                    — Update campaign
DELETE /campaigns/:id                    — Delete campaign
PUT    /campaigns/:id/status             — Update status (pause/activate/complete)
POST   /campaigns/:id/duplicate          — Duplicate campaign
GET    /campaigns/:id/analytics          — Campaign analytics
POST   /campaigns/:id/boost              — Boost campaign visibility
```

### Promotions
```
GET    /promotions                       — List promotions
GET    /promotions/:id                   — Promotion detail
POST   /promotions                       — Create promotion
PUT    /promotions/:id                   — Update promotion
DELETE /promotions/:id                   — Delete promotion
PUT    /promotions/:id/status            — Update status
GET    /promotions/nearby                — Nearby promotions (geo)
POST   /promotions/:id/redeem            — Customer redeems promotion
```

### Events
```
GET    /events                           — List events
GET    /events/:id                       — Event detail
POST   /events                           — Create event
PUT    /events/:id                       — Update event
DELETE /events/:id                       — Delete event
POST   /events/:id/register              — Customer registers
POST   /events/:id/check-in              — QR check-in
GET    /events/:id/registrations         — Registration list (business)
GET    /events/nearby                    — Nearby events
```

### Rewards
```
GET    /rewards                          — List rewards
GET    /rewards/:id                      — Reward detail
POST   /rewards                          — Create reward
PUT    /rewards/:id                      — Update reward
DELETE /rewards/:id                      — Delete reward
GET    /rewards/:id/redemptions          — Redemption history
GET    /customer/rewards                 — Customer's rewards wallet
POST   /customer/rewards/:id/redeem      — Customer redeems reward
POST   /customer/rewards/:id/save        — Save reward for later
```

### Gamification
```
GET    /games                            — Game list
GET    /games/:id                        — Game detail
POST   /games                            — Create game config (admin)
PUT    /games/:id                        — Update game config
POST   /customer/games/play              — Start game session
POST   /customer/games/:sessionId/drop   — Process ball drop result
POST   /customer/games/:sessionId/claim  — Claim game reward
GET    /customer/games/history           — Customer game history
GET    /games/leaderboard                — Leaderboard data
```

### QLinks
```
GET    /qlinks                           — QLink list
POST   /qlinks                           — Create QLink
PUT    /qlinks/:id                       — Update QLink
DELETE /qlinks/:id                       — Delete QLink
POST   /qlinks/:id/generate              — Generate QR code
GET    /qlinks/:id/scans                 — Scan analytics
POST   /qlinks/:id/scan                  — Record a scan
```

### Local Mall (Partnerships / Share Exchange)
```
GET    /business/:businessId/local-mall/high-street      — High street overview
GET    /business/:businessId/local-mall/partnerships      — Partnership list
POST   /business/:businessId/local-mall/partnerships/request — Request partnership
PUT    /business/:businessId/local-mall/partnerships/:id  — Update partnership
DELETE /business/:businessId/local-mall/partnerships/:id  — End partnership
GET    /business/:businessId/local-mall/share-campaigns   — Shared campaign list
POST   /business/:businessId/local-mall/share-campaigns   — Create shared campaign
PUT    /business/:businessId/local-mall/visibility        — Update visibility
POST   /business/:businessId/local-mall/clusters/join     — Join storefront cluster
GET    /business/:businessId/local-mall/expo              — Expo opportunities
```

### Notifications
```
GET    /notifications                   — User notifications
PUT    /notifications/:id/read          — Mark as read
PUT    /notifications/read-all          — Mark all as read
POST   /notifications/send              — Send notification (business/admin)
GET    /notifications/preferences       — Get preferences
PUT    /notifications/preferences       — Update preferences
```

### Audits
```
GET    /business/:businessId/audits     — Audit history
POST   /business/:businessId/audits/run — Run a new audit
GET    /business/:businessId/audits/:id — Audit detail
GET    /business/:businessId/recommendations — Improvement recommendations
PUT    /business/:businessId/recommendations/:id/apply — Apply recommendation
```

### Analytics
```
GET    /analytics/dashboard             — Dashboard KPIs
GET    /analytics/boroughs              — Borough analytics
GET    /analytics/campaigns             — Campaign analytics
GET    /analytics/rewards               — Rewards analytics
GET    /analytics/customers             — Customer analytics
GET    /analytics/engagement            — Engagement metrics
GET    /analytics/export                — Export data (CSV/PDF)
```

### Billing
```
GET    /billing/subscription            — Current subscription
PUT    /billing/subscription/upgrade    — Upgrade plan
POST   /billing/payment-methods         — Add payment method
DELETE /billing/payment-methods/:id     — Remove payment method
GET    /billing/invoices                — Invoice list
GET    /billing/invoices/:id            — Invoice detail
POST   /billing/invoices/:id/pay        — Pay invoice
GET    /billing/transactions            — Transaction history
```

### Moderation
```
GET    /moderation/reports              — Report list
POST   /moderation/reports              — Submit report
PUT    /moderation/reports/:id          — Take action (admin)
GET    /moderation/abuse                — Abuse alerts
GET    /moderation/fraud                — Fraud detection alerts
```

### Admin
```
GET    /admin/dashboard                 — Dashboard KPIs
GET    /admin/activity                  — Live activity feed
GET    /admin/settings                  — Platform settings
PUT    /admin/settings                  — Update settings
GET    /admin/team                      — Admin team list
POST   /admin/team/invite               — Invite admin
PUT    /admin/team/:id                  — Update admin role
GET    /admin/support/tickets           — Support tickets
PUT    /admin/support/tickets/:id       — Update ticket
```

### Upload
```
POST   /upload/image                    — Upload image (returns URL)
POST   /upload/document                 — Upload document
DELETE /upload/:fileId                  — Delete uploaded file
```

## WebSocket Events

### Admin Dashboard
- `admin:activity:new` — New activity in the ecosystem
- `admin:alert:fraud` — Fraud detection alert

### Business Dashboard
- `business:reward:redeemed` — Customer redeemed a reward
- `business:customer:new` — New customer interaction
- `business:campaign:performance` — Campaign metric update

### Customer
- `customer:reward:earned` — New reward earned
- `customer:game:timeout` — Game session about to expire
- `customer:notification:new` — New notification

## Integration Architecture

### External Services
1. **Google Business API** — Import business data, verify ownership
2. **Payment Gateway** (Stripe/PayPal) — Subscription billing
3. **SMS Provider** (Twilio) — OTP and notification delivery
4. **Email Provider** (SendGrid/Resend) — Email notifications
5. **Cloud Storage** (S3/R2) — Image and document uploads
6. **Map Service** (Mapbox/Google Maps) — Interactive maps
7. **QR Generation** — Server-side QR code generation (qrcode library)

### Webhook Endpoints
```
POST   /webhooks/payment/success        — Payment gateway callback
POST   /webhooks/payment/failed         — Payment failure callback
POST   /webhooks/google/notification    — Google Business API updates
```

### Rate Limiting
- 100 requests/min for authenticated users
- 20 requests/min for public endpoints
- 10 requests/min for auth endpoints (login, register, OTP)

### Caching Strategy
- Redis for session storage
- In-memory cache for lookup data (boroughs, categories)
- CDN for uploaded images
- Query result caching for analytics aggregations
