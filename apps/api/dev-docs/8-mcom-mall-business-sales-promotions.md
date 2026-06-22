# Step 8: MCOM Mall Business Dashboard — Sales & Promotions

## Overview
Build the 84+ screen marketing engine for businesses. This is the core growth engine — not just discounts, but a complete system for promotions, events, rotators, gamification, coupons, QLinks, automation, and AI-guided marketing.

## Sections

### 1. Sales & Promotions Home
**Route:** `/dashboard/sales`

Top Summary: Active Promotions, Running Events, Live Campaigns, Borough Visibility, Storefront Traffic, QR Engagement, Reward Activity, Gamification Activity

Quick Actions: Create Promotion, Launch Event, Start Gamification, Generate QR, Boost Visibility, Activate Borough Campaign

Performance Cards: Views, Redemptions, Event Registrations, QR Scans, Voucher Usage, Rotator Clicks, Storefront Visits

Live Activity Feed: Real-time customer interactions and campaign events

AI Suggestion Area: Preset suggestions based on business category (Weekend Promo, Lunch Deal, Reward Spin, Borough Event, Flash Discount)

### 2. Promotions System
**Route:** `/dashboard/sales/promotions`

Dashboard Tabs: All, Active, Scheduled, Drafts, Expired, Borough, High Street, Shared

Promotion Types: Flash Deal, Daily Deal, Weekend Offer, Seasonal, Loyalty, Borough Campaign, High Street, Clearance, New Customer, Returning Customer, Shared Partnership, Gamified

Template Library: Preset templates by industry (Restaurant, Beauty, Fashion, Grocery, Service)

Create Promotion Flow:
1. Select Type
2. Choose Template
3. Customize (Title, Description, Discount, Dates, Toggles for Featured/Borough/Rotator/QR/Reward)
4. Target Audience (All, Nearby, Loyalty, Borough, Returning, New, Gamification, Event)
5. Rewards Attachment (Bonus Points, Voucher, Spin, Unlock, QR, Referral)
6. Preview (Mobile, Storefront, Borough Feed, Rotator, QR)
7. Launch

### 3. Events & Expo System
**Route:** `/dashboard/sales/events`

Dashboard Tabs: Upcoming, Active, Past, Drafts, Borough Events, Expo Events, Live Sessions

Event Types: In-Store, Workshop, Webinar, Demonstration, Product Launch, Food Competition, Beauty Session, Community Event, Expo Booth, Live Stream, Training

Create Event Flow:
1. Select Type → Template → Customize (Title, Description, Date, Time, Capacity, Venue, Borough)
2. Registration Settings (Free, Paid, Points, Invite Only, QR Check-In)
3. Promotion Settings (Rotator, Notifications, Countdown, Rewards, Voucher, Borough)
4. Preview → Go Live

Live Event Control Center: Registrations, QR Check-Ins, Live Engagement, Attendee List

### 4. Rotator Campaigns
**Route:** `/dashboard/sales/rotators`

Dashboard Tabs: Active, Scheduled, Borough, Featured, Drafts

Types: Product, Promotion, Event, Borough, Featured Rotator

Setup: Select content (Products, Promotions, Events, Services, Gamification) → Display Settings (Speed, Duration, Priority, Placement) → Preview → Activate

### 5. Gamification System
**Route:** `/dashboard/sales/gamification`

Dashboard Tabs: Active, Reward Campaigns, Seasonal, Challenges, Drafts

Game Types: Spin Wheel, Reward Drop, Prize Unlock, Point Challenge, Scratch Card, QR Hunt, Borough Challenge

Setup: Select Game → Add Rewards (Discounts, Free Products, Points, Vouchers, Services, Event Access) → Set Rules (Daily play, Loyalty only, Min spend, QR unlock, Borough) → Preview → Activate

### 6. Coupons & Vouchers
**Route:** `/dashboard/sales/vouchers`

Types: Gift Voucher, Discount Voucher, QR Voucher, Reward Voucher, Membership Voucher

Create: Title, Value, Expiry, Rules → Distribution (Storefront, Email, QR, Borough, Gamification) → Preview → Activate

### 7. QR / QLinks System
**Route:** `/dashboard/sales/qr`

Types: Storefront, Product, Event, Promotion, Reward QR

Generate: Select type → Link content → Generate QR + short link → Share (Download, Print, Social, Copy)

### 8. Business Activation System
**Route:** `/dashboard/sales/activation`

Dashboard: Businesses Registered By Me, Claimed, Pending, Activation Rewards

Register a Business: Name, Postcode, Phone, Borough, Category

Unclaimed Business Preview + Interest Signals

Activation Leaderboard: Top Activators, Borough Contributors

### 9. Interest Signal System
**Route:** `/dashboard/sales/interest`

Customer Requests, Partnership Interest, Borough Demand

"Request Activation" flow for customers + Claim Request Campaigns

### 10. Campaign Automation
**Route:** `/dashboard/sales/automation`

Dashboard: Scheduled, Recurring, Seasonal Campaigns

Automation Builder: Repeat Weekly/Monthly, Seasonal Trigger, Borough Trigger

Campaign Calendar: Upcoming, Scheduled, Expiring

### 11. High Street & Borough Visibility
**Route:** `/dashboard/sales/visibility`

Controls: Borough Visibility, High Street Placement, Featured Placement, Rotator Priority

High Street Readiness Score, Borough Campaign Participation

### 12. Live Campaign Monitoring
**Route:** `/dashboard/sales/live`

Live Promotions, Live Engagement, Real-Time Redemptions, Borough Activity

### 13. AI Guided Marketing Assistant
**Route:** `/dashboard/sales/ai-assistant`

Suggested Campaigns, Visibility Recommendations, Best Times To Launch, Optimization Tips

### 14. Global Analytics Center
**Route:** `/dashboard/sales/analytics`

Metrics: Promotion Reach, Event Traffic, QR Performance, Voucher Usage, Borough Participation, Repeat Customers

### 15. Notifications & Messaging
**Route:** `/dashboard/sales/notifications`

Send Promotion, Invite Customers, Send Event Updates

## API Endpoints Required

```
GET    /dashboard/sales/summary               — Sales dashboard KPIs
GET    /dashboard/sales/promotions            — Promotion list
POST   /dashboard/sales/promotions            — Create promotion
PUT    /dashboard/sales/promotions/:id        — Update/pause promotion
GET    /dashboard/sales/events                — Event list
POST   /dashboard/sales/events                — Create event
PUT    /dashboard/sales/events/:id            — Update event
POST   /dashboard/sales/events/:id/check-in   — QR check-in
GET    /dashboard/sales/rotators              — Rotator list
POST   /dashboard/sales/rotators              — Create rotator
GET    /dashboard/sales/gamification          — Gamification config
POST   /dashboard/sales/gamification          — Create game
GET    /dashboard/sales/vouchers              — Voucher list
POST   /dashboard/sales/vouchers              — Create voucher
GET    /dashboard/sales/qr                    — QR list
POST   /dashboard/sales/qr/generate           — Generate QR
GET    /dashboard/sales/activation            — Activation dashboard
POST   /dashboard/sales/activation/register   — Register a business
GET    /dashboard/sales/analytics             — Sales analytics
POST   /dashboard/sales/automations           — Create automation
GET    /dashboard/sales/automations           — Automation list
POST   /dashboard/sales/ai/suggest            — Get AI suggestions
```

## Key UI Components
- Multi-step form wizards with progress indicators
- Mobile-responsive campaign previews
- QR code generator with download options
- Live countdown timers for flash deals
- Drag-and-drop rotator builder
- Spin wheel animation preview
- AI suggestion cards with one-tap apply
- Real-time redemption counter
- Campaign performance sparkline charts
- Template library with category filters
