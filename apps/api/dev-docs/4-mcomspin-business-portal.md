# Step 4: MCOMSpin Business Portal

## Overview
Build the full 18-section business portal for MCOMSpin. This is the merchant-facing dashboard where businesses manage campaigns, rewards, game configuration, customers, redemptions, analytics, staff, locations, billing, and settings.

## Sections

### Section 1 — Landing Page (Public)
**Route:** `/`

Purpose: Sell MCOMSpin to businesses.

Content:
- Hero Section (headline, benefits, demo video, Play Demo button)
- Why Use MCOMSpin (Get More Customers, Increase Repeat Visits, Run Reward Campaigns, Build Loyalty, Track Results)
- How It Works (4 steps: Create Campaign → Customers Play → Customers Win → Customers Visit)
- Demo Area (interactive Ball Drop demo)
- Pricing (Free, Starter, Growth, Enterprise)
- Testimonials (success stories)
- FAQ
- CTA (Start Free Trial, Book Demo)

### Section 2 — Business Sign Up
**Route:** `/auth?signup=business`

Fields: Business Name, Contact Name, Email, Phone, Password, Business Type (Restaurant, Salon, Barber, Retail, Fashion, Beauty, Event, Other)

### Section 3 — Business Verification
**Route:** `/auth/verify`

Methods: Email verification, Phone verification
Optional: Business Registration Number, Website, Social Media
Status: Pending → Approved → Verified

### Section 4 — Subscription & Billing
**Route:** `/acquire` (steps 1-4)

Plans: Free, Starter, Growth, Enterprise
Billing: Monthly, Yearly
Payment Methods: Card, Bank Transfer

### Section 5 — Business Onboarding
**Route:** `/acquire` (steps 5-10)

Steps:
- Business Information (name, description, industry, address, phone, email, website)
- Branding (logo, cover image, business colours)
- Locations (single or multiple)
- Review & Launch

### Section 6 — Business Dashboard
**Route:** `/dashboard`

KPI Cards: Active Campaigns, Rewards Issued, Rewards Redeemed, Total Plays, Customers Engaged, Redemption Rate

Quick Actions: Create Campaign, Create Reward, View Analytics

Recent Activity Feed: Customer wins, reward redemptions, campaign activity

### Section 7 — Campaigns
**Route:** `/dashboard/campaign`

Tabs: Active, Draft, Scheduled, Completed, Paused

Table: Campaign Name, Status, Start/End Date, Plays, Rewards Issued

Actions: Create, Edit, Duplicate, Pause, Delete

Campaign Detail (tabbed): Info, Rules, Rewards, Performance

### Section 8 — Rewards
**Route:** `/dashboard/rewards`

Types: Discount, Voucher, Product, Service, Cashback, Loyalty Points, Mystery Reward

Management: Create, Edit, Pause, Delete

Inventory: Quantity, Remaining, Expired tracking

### Section 9 — Ball Drop Game
**Route:** `/dashboard/game`

Status: Active / Paused

Settings: Box Layout (2/4/6/8), Campaign Assignment

Demo Preview: Live customer experience preview

### Section 10 — Customers
**Route:** `/dashboard/customers`

List: Name, Phone, Email, Rewards Won, Rewards Redeemed

Customer Detail (tabbed): Activity, Rewards, Visits

### Section 11 — Redemptions
**Route:** `/dashboard/customer-rewards`

Dashboard: Pending, Redeemed, Expired, Rejected

Scanner: QR Scanner, Code Entry

History: Complete redemption log

### Section 12 — Analytics
**Route:** `/dashboard/performance`

Campaign Analytics: Plays, Wins, Redemptions

Reward Analytics: Most/Lest Popular Rewards

Customer Analytics: New, Returning, Repeat Visits

Revenue Analytics (future)

### Section 13 — Notifications
**Route:** `/dashboard/notifications`

Send To Customers: Campaign Alert, Reward Alert, Expiry Reminder

Channels: Email, SMS, Push Notification

### Section 14 — Staff Management
**Route:** `/dashboard/staff`

Roles: Owner, Manager, Staff, Cashier

Permissions: Campaign Access, Reward Access, Redemption Access, Analytics Access

### Section 15 — Locations
**Route:** `/dashboard/locations`

List: Store Name, Address, Status

Actions: Add, Edit, Disable

### Section 16 — Billing
**Route:** `/dashboard/billing`

Subscription: Current Plan, Renewal Date, Usage

Invoices: Download, Payment History

### Section 17 — Support
**Route:** `/dashboard/support`

Resources: Guides, Tutorials, Videos, FAQs

Contact: Chat, Ticket, Email

### Section 18 — Settings
**Route:** `/dashboard/settings`

Profile: Business Details

Branding: Logo, Colours, Banners

Notifications: Email, SMS, Push preferences

Security: Password, 2FA, Login History

## API Endpoints Required

```
POST   /auth/business/register      — Business registration
POST   /auth/business/verify        — Business verification
GET    /dashboard/summary           — Aggregated KPI data
GET    /business/profile            — Get business profile
PUT    /business/profile            — Update business profile
GET    /business/locations          — Location list
POST   /business/locations         — Add location
PUT    /business/locations/:id     — Update location
DELETE /business/locations/:id     — Disable location
GET    /business/staff              — Staff list
POST   /business/staff              — Invite staff
PUT    /business/staff/:id          — Update staff role/permissions
DELETE /business/staff/:id          — Remove staff
GET    /business/analytics          — Business analytics
PUT    /business/settings           — Update settings
POST   /business/notifications/send — Send notification to customers
```

## Key UX Patterns
- Guided flows with progress indicators
- Mobile-first card layouts
- Preset templates for campaigns and rewards
- QR scanner integration for redemptions
- Real-time activity updates
- Drag-and-drop game configuration preview
- Exportable reports (CSV, PDF)
- One-tap actions for common operations
