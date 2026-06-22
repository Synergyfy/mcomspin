# Step 7: MCOM Mall Business Dashboard — Local Mall

## Overview
Build the Local Mall ecosystem for businesses — the core collaboration layer inside MCOM Mall. This connects businesses to their high street, borough, partnerships, share exchange, community activation, expo ecosystem, and visibility controls.

## Sections

### Section A — My High Street
**Route:** `/dashboard/local-mall/high-street`

Top Bar: Borough, High Street, Postcode Zone, # of Businesses, Active Promotions, Events

Business Map View: Interactive map showing participating businesses, categories, promotion hotspots, event locations

Business List View: Cards with Name, Logo, Category, Distance, Partnership Compatibility, Promotion Activity, Visibility Status

High Street Rank: Rising / Active / Featured / Top High Street Business

Borough Activity Feed: Live borough promotions, events, trending businesses, gamification campaigns

AI Preset Suggestions: Category-based recommendations (e.g., "Restaurants near you are promoting lunch specials...")

### Section B — Partnerships
**Route:** `/dashboard/local-mall/partnerships`

Home: Suggested partners, nearby compatible businesses, partnership requests, active partnerships

Matching Engine: Auto-suggested businesses based on category, borough, customer overlap, high street proximity

Business Partnership Card: Name, Compatibility %, Shared Customer Potential, Distance, Category, Actions (View, Request Partnership, Send Message)

Request Flow: Select partnership type (Cross-promotion, Shared event, Shared audience, Shared rewards, Shared campaign, Product collaboration) → Add message → Send

Active Partnerships: Partner businesses, active campaigns, shared promotions, events, audiences

### Section C — Share Exchange
**Route:** `/dashboard/local-mall/share-exchange`

Home: Shared campaigns, audience reach, promotion swaps, cross-promotion opportunities

Create Shared Campaign Flow:
1. Select Partner Business (existing partnerships, nearby, suggested)
2. Select Campaign Type (Joint discount, Shared rewards, Event collaboration, Product bundle, Borough campaign, Seasonal)
3. Campaign Setup (Name, Duration, Offer details, Shared rewards, Customer targeting)
4. Publish (appears in Local Mall, rotators, gamification, borough promotions, customer feeds)

Shared Audience System: Reach nearby customers, share campaign visibility, participate in borough campaigns

### Section D — Local Mall Visibility
**Route:** `/dashboard/local-mall/visibility`

Home: Visibility Score, Borough Reach, High Street Reach, Rotator Visibility, Featured Status

Controls:
- Featured Placement (High street, Borough, Local Mall, Rotators)
- High Street Visibility (Nearby discovery, Recommended businesses, Category listings, Rotator campaigns)
- Borough Visibility (Borough-only, Expanded, Event, Promotion visibility)
- Rotator Visibility (Product, Promo, Event rotators)
- Gamification Visibility (Spin wheel, Reward campaigns, Point campaigns, Prize campaigns)

Boost Visibility Flow:
1. Select Boost Type (Borough boost, High street boost, Event boost, Product boost)
2. Duration (24 hours, 7 days, 30 days)
3. Confirm activation

### Section E — Community Activation
**Route:** `/dashboard/local-mall/community`

Businesses Awaiting Claim, Suggested Businesses, Community Requests, Activation Opportunities

Actions: Recommend Business, Invite Business, Request Activation, Follow Progress

Rewards: Points for successful activations, unlocks for referrals

### Section F — Storefront Clusters
**Route:** `/dashboard/local-mall/clusters`

Shows grouped business ecosystems: Independent Storefronts, Active Clusters, Emerging High Streets, Community Zones, Official MCOM Malls

Business Cards: Verification %, Activity Level, Promotions, Partnership Readiness, Customer Interest

Actions: Join Cluster, Connect Business, Request Collaboration

### Section G — Expo & Booth Ecosystem
**Route:** `/dashboard/local-mall/expo`

Expo Hub: Upcoming Expos, Live Demonstrations, Workshops, Training Events, Booth Opportunities

Create Booth: Booth Banner, Featured Products, Live Sessions, QR Links, Promotions

Event & Demo Management: Schedule Event, Invite Businesses, Manage Live Sessions

### Section H — Hub & Support
**Route:** `/dashboard/local-mall/hub`

Hub Participation: Assigned Hub, Borough Hub, Support Contacts, Community Managers

Account Manager Support: Assigned Manager, Activation Status, Open Requests, Guidance Tasks

## API Endpoints Required

```
GET    /business/local-mall/high-street       — High street overview
GET    /business/local-mall/map                — Map data for businesses
GET    /business/local-mall/partnerships       — Partnership list
POST   /business/local-mall/partnerships/request — Send partnership request
PUT    /business/local-mall/partnerships/:id   — Update partnership
DELETE /business/local-mall/partnerships/:id   — End partnership
GET    /business/local-mall/share-campaigns    — Shared campaign list
POST   /business/local-mall/share-campaigns    — Create shared campaign
PUT    /business/local-mall/visibility         — Update visibility settings
POST   /business/local-mall/visibility/boost   — Activate visibility boost
GET    /business/local-mall/community          — Community activation data
POST   /business/local-mall/community/activate — Activate a business
GET    /business/local-mall/clusters           — Storefront clusters
POST   /business/local-mall/clusters/join      — Join cluster
GET    /business/local-mall/expo               — Expo opportunities
POST   /business/local-mall/expo/booth         — Create booth
GET    /business/local-mall/hub                — Hub information
GET    /business/local-mall/notifications      — Local mall notifications
```

## Key UI Components
- Interactive map with business pins, promotion heat zones
- Partnership compatibility meter (percentage bar with color scale)
- Shared campaign builder (multi-step form)
- Visibility score gauge
- Boost timer and countdown display
- Cluster cards with join animation
- Expo booth preview with live demo capability
- Community activation progress tracker
- Borough activity live feed
