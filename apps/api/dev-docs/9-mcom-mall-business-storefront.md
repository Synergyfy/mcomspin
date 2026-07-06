# Step 9: MCOM Mall Business Dashboard — Storefront

## Overview
Build the complete digital storefront system for businesses. This is the business's digital identity inside MCOM Mall — their shopfront, product catalog, service listings, appearance controls, and verification system.

## Sections

### Section A — Storefront Home
**Route:** `/dashboard/storefront`

Top Area: Logo, Name, Borough, High Street, Verification Badge, Storefront Status, Membership Status, Visibility Score

Quick Actions: Add Product, Add Service, Create Promotion, Boost Storefront

Live Storefront Preview Card: Cover image, featured products, promotions, gamification, rotator visibility

Section Cards: Business Profile, Products, Services, Appearance, Verification

### Section B — Business Profile
**Route:** `/dashboard/storefront/profile`

Overview: Business Name, Logo, Cover Image, Description, Address, Borough, High Street, Contact Info, Website, Social Links, Opening Hours

Edit Profile: Name, Description, Phone, Email, Website, Address

Logo Management: Upload, Replace, Crop, Remove, Square format preferred

Cover Image: Upload Banner, Replace, Crop, Mobile Preview

Opening Hours: Operating Days, Opening/Closing Time, Holiday Hours schedule

Social Links: Instagram, Facebook, TikTok, LinkedIn, YouTube (Connect/Remove)

Address & Location: Address, Postcode, Borough, High Street, Map Preview, Request Change

Profile Preview: Customer-facing mobile view

### Section C — Products
**Route:** `/dashboard/storefront/products`

Tabs: All Products, Active, Draft, Out of Stock

Product Card: Image, Name, Category, Price, Availability, Promotion Status, Visibility Status

Actions: Edit, Duplicate, Promote, Archive

Add Product Flow:
1. Information: Name, Category, Description, Price, Stock Quantity
2. Images: Main image, Gallery images
3. Settings: Featured Product, Promotion Eligible, Rotator Eligible, Gamification Eligible toggles
4. Publish or Save Draft

Product Promotion: Push to promotions, rotators, spin wheel, borough campaigns

Inventory: Stock levels, low stock alerts, out of stock controls

### Section D — Services
**Route:** `/dashboard/storefront/services`

Tabs: All Services, Active, Booking Enabled

Service Card: Name, Category, Duration, Pricing, Availability, Booking Status

Add Service Flow:
1. Information: Name, Category, Description, Duration, Price
2. Availability: Days, Time Slots, Capacity
3. Booking Settings: Instant Booking, Request Booking, Approval Required
4. Visibility: Rotator, Promotion, Gamification toggles
5. Publish or Save Draft

Spare Capacity: Empty time slots, instant deals, quick offers, push to nearby customers

### Section E — Storefront Appearance
**Route:** `/dashboard/storefront/appearance`

Theme: Light, Dark, Brand Theme selection

Banner Settings: Upload banner, seasonal banner, promotional banner

Featured Products: Select and reorder featured items

Featured Services: Select and reorder priority services

Rotator Display: Enable/disable Product, Promo, Event rotators; control display order

Gamification Display: Spin wheel visibility, reward campaigns, prize campaigns toggles

Storefront Preview: Mobile view, customer view, rotator preview, gamification preview

### Section F — Verification
**Route:** `/dashboard/storefront/verification`

Status Display: Google Verification (Connected/Not Connected/Pending), Ownership Status (Verified/Pending/Review), Claim Status (Claimed/Unclaimed/Admin Managed)

Google Connection Flow: Connect Google Business → Authenticate → Select Profile → Approve Permissions → Sync Data

Ownership Verification: Upload Documents, Submit Verification Request

Claim Status Management

Verification Success: Verified badge, connected status, sync success

## Storefront Customer-Facing Views

These are the public-facing storefront pages that customers see:

- Storefront Page: Banner, Logo, Products, Services, Promotions, Events, Gamification
- Product View Page: Details, Promotions, QR Code, Rewards
- Service View Page: Details, Booking Options, Availability
- Gamification View: Spin Wheel, Rewards, Interactive Campaigns
- Rotator View: Featured Promotions, Products, Events

## API Endpoints Required

```
GET    /business/storefront                 — Storefront overview
PUT    /business/storefront/profile         — Update profile
POST   /business/storefront/logo            — Upload logo
POST   /business/storefront/cover           — Upload cover image
PUT    /business/storefront/hours           — Update opening hours
PUT    /business/storefront/social          — Update social links
GET    /business/storefront/products        — Product list
POST   /business/storefront/products        — Add product
PUT    /business/storefront/products/:id    — Update product
DELETE /business/storefront/products/:id    — Delete product
POST   /business/storefront/products/:id/promote — Promote product
GET    /business/storefront/services        — Service list
POST   /business/storefront/services        — Add service
PUT    /business/storefront/services/:id    — Update service
DELETE /business/storefront/services/:id    — Delete service
POST   /business/storefront/services/:id/spare-capacity — Create spare capacity offer
PUT    /business/storefront/appearance      — Update appearance settings
POST   /business/storefront/appearance/banner — Upload banner
POST   /business/storefront/appearance/theme — Apply theme
GET    /business/storefront/verification    — Verification status
POST   /business/storefront/verification/google — Connect Google
POST   /business/storefront/verification/verify — Submit verification
POST   /business/storefront/verification/claim — Claim business
```

## Key UI Components
- Live storefront preview panel (mobile view)
- Image upload with drag-and-drop and crop controls
- Opening hours grid selector (days × time slots)
- Theme preview switcher (light/dark/brand)
- Product/service card grid with status badges
- Verification progress stepper
- Media gallery reorder (drag)
- Rotator display order list
- Social link connection buttons
- Spare capacity calendar view
