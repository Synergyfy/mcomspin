# Step 1: Database Schema & Prisma Models

## Overview
Define the complete Prisma schema covering every entity across MCOMSpin and MCOM Mall. This schema serves as the single source of truth for all services.

## Entity Map

### Core Identity & Auth
- **User** — Base user (customers, business owners, staff, admins)
- **Role** — Role definitions (SuperAdmin, BoroughAdmin, HighStreetManager, BusinessOwner, Staff, Customer)
- **Permission** — Granular permission flags
- **UserRole** — Many-to-many: users ↔ roles
- **Session** — Auth sessions, device tracking

### Location Hierarchy
- **Borough** — Borough/district entity
- **HighStreet** — High street within a borough
- **StorefrontCluster** — Sublocation grouping (plaza, mini-mall, market)
- **Location** — Physical address (polymorphic: business, hub, event)

### Business Ecosystem
- **Business** — Core business entity
- **BusinessVerification** — Verification status, documents, google connection
- **BusinessClaim** — Claim/unclaim tracking
- **BusinessStaff** — Staff members with permissions
- **BusinessMembership** — Bronze/Silver/Gold/Platinum tier tracking
- **BusinessLocation** — Multi-location support
- **BusinessHours** — Operating hours per location
- **BusinessCategory** — Category assignments
- **BusinessTag** — Tags for discovery

### Storefront
- **Storefront** — Digital storefront configuration
- **StorefrontTheme** — Theme settings (light/dark/brand)
- **StorefrontBanner** — Banner images
- **StorefrontMedia** — Gallery images and videos
- **Product** — Products with pricing, stock, status
- **Service** — Services with duration, pricing, booking
- **ServiceAvailability** — Time slots and capacity
- **ProductPromotion** — Product-to-promotion linking

### Campaigns & Promotions
- **Campaign** — Campaign entity (type, dates, rules, targeting)
- **CampaignBusiness** — Businesses participating in a campaign
- **CampaignReward** — Rewards attached to a campaign
- **CampaignTarget** — Targeting rules (borough, segment, location)
- **Promotion** — Individual promotion (flash deal, seasonal, etc.)
- **PromotionRedemption** — Customer redemption tracking
- **Rotator** — Rotator configuration (product, promo, event)
- **RotatorItem** — Items within a rotator

### Gamification
- **Game** — Game definitions (Ball Drop, Spin Wheel, Scratch Card, etc.)
- **GameSession** — Customer play sessions
- **GameConfig** — Per-business game configuration (physics, boxes, shuffle)
- **GameCampaign** — Game-to-campaign linking

### Rewards & Loyalty
- **Reward** — Reward definitions (discount, voucher, product, cashback, points)
- **RewardInventory** — Per-business reward stock
- **RewardRedemption** — Customer redemption log
- **CustomerReward** — Customer's earned rewards
- **LoyaltyProgram** — Business loyalty program settings
- **LoyaltyMembership** — Customer loyalty membership
- **LoyaltyTier** — Tier definitions (Bronze→Platinum)
- **PointsTransaction** — Points earned/spent log
- **Voucher** — Voucher/gift card entity

### QLinks & QR
- **QLink** — QR campaign/link definition
- **QLinkScan** — Scan tracking log
- **QLinkCampaign** — QLink-to-campaign linking

### Events & Expo
- **Event** — Event entity (workshop, expo, demo, competition)
- **EventRegistration** — Customer registrations
- **EventCheckIn** — QR check-in log
- **Expo** — Expo/event ecosystem
- **ExpoBooth** — Virtual booth within an expo
- **ExpoParticipation** — Business participation in expo

### Partnerships & Share Exchange
- **Partnership** — Business-to-business partnership
- **PartnershipRequest** — Pending partnership requests
- **SharedCampaign** — Cross-business campaign
- **SharedAudience** — Audience sharing configuration

### Community & Activation
- **CommunityGroup** — High street/borough community groups
- **CommunityPost** — Community feed posts
- **CommunityActivity** — Activity tracking
- **BusinessActivation** — Customer-led business activation requests
- **ActivationReward** — Rewards for activating businesses
- **InterestSignal** — Customer interest signals for businesses

### Notifications & Communication
- **Notification** — Notification log
- **NotificationTemplate** — Reusable notification templates
- **NotificationPreference** — User notification preferences
- **Message** — In-app messages
- **MessageThread** — Message conversations

### Audits & Visibility
- **Audit** — Audit records (short, full, MCOM)
- **AuditRecommendation** — Improvement recommendations
- **VisibilityScore** — Per-business visibility scoring
- **VisibilityBoost** — Visibility boost campaigns
- **StorefrontScore** — Storefront completion/quality scoring

### Automation
- **AutomationRule** — Automation rule definitions
- **AutomationTrigger** — Trigger definitions
- **AutomationAction** — Action definitions
- **AutomationLog** — Execution log

### Moderation & Compliance
- **AbuseReport** — Reported content/users
- **ModerationAction** — Actions taken (warn, suspend, ban)
- **ModerationRule** — Automated moderation rules
- **FraudAlert** — Fraud detection alerts

### Billing & Financial
- **Subscription** — Business subscription tracking
- **SubscriptionPlan** — Plan definitions (Free, Starter, Growth, Enterprise)
- **Invoice** — Billing invoices
- **PaymentMethod** — Saved payment methods
- **Transaction** — Financial transactions
- **Credit** — Business credit/voucher tracking
- **CreditUsage** — Credit usage log

### Analytics & Tracking
- **AnalyticsEvent** — Raw analytics events
- **AnalyticsAggregation** — Pre-computed aggregations
- **CustomerActivityLog** — Customer action log
- **BusinessActivityLog** — Business action log

## Schema Implementation Notes

1. All models use UUID primary keys
2. All models include `createdAt` and `updatedAt` timestamps
3. Soft delete via `deletedAt` nullable timestamp where applicable
4. JSON/JSONB fields for flexible configurations
5. Composite indexes on frequently queried columns (borough, status, date ranges)
6. Full-text search indexes on business names, product names, descriptions
7. Enum types for statuses, types, and categories
8. Audit triggers on sensitive models (billing, moderation, business verification)

## Relations Diagram (High-Level)

```
User ──┬── Business (owner)
       ├── BusinessStaff
       ├── CustomerReward
       ├── GameSession
       ├── EventRegistration
       └── Notification

Business ──┬── Storefront ──┬── Product
           │                ├── Service
           │                ├── StorefrontMedia
           │                └── StorefrontTheme
           ├── Campaign (many-to-many via CampaignBusiness)
           ├── Reward (via RewardInventory)
           ├── Location
           ├── BusinessMembership
           ├── Partnership
           └── Audit

Borough ──┬── HighStreet ──┬── StorefrontCluster
          │                └── BusinessLocation
          ├── Campaign
          └── CommunityGroup

Campaign ──┬── CampaignReward
           ├── CampaignBusiness
           ├── CampaignTarget
           └── Promotion
```
