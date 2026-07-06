# Step 12: MCOM Mall Customer App

## Overview
Build the full customer-facing MCOM Mall application (~120-160 UI states). This is the consumer mobile-first app for discovering local businesses, earning rewards, joining events, playing games, and engaging with their borough and high street.

## Sections

### Auth & Onboarding Flow

Welcome Screen: Logo, hero visuals, borough activity preview, rewards preview, event/gamification preview
Buttons: Login, Create Account, Continue as Guest

Login Screen: Email/Phone + Password, Social Login (Google, Apple), Forgot Password

OTP Verification: 6-digit input, timer, resend

Create Account: First/Last Name, Email, Phone, Password, Google/Apple options

Onboarding:
1. Profile Setup (Photo, Birthday, Gender, Borough)
2. Interest Selection (Restaurants, Fashion, Beauty, Fitness, Gaming, Electronics, Events, Family)
3. Location Permission
4. Borough Selection (Cards with activity previews)
5. Completion → Enter Dashboard

### Home Dashboard
**Route:** `/customer`

Header: Name, Points Balance, Borough, Loyalty Level, Notifications
Quick Actions: Discover Nearby, Scan QR, View Rewards, Join Event
Feed: Nearby Offers, Borough Events, Trending Promotions, Reward Opportunities, Gamification
Bottom Navigation: Home, Discover, Rewards, Events, Profile

### Discover
**Route:** `/customer/discover`

Tabs: Nearby, Trending, Recommended, New Businesses, Borough Favorites
Filters: Distance, Category, Rating, Promotions, Rewards
Search: Businesses, Promotions, Events, Boroughs
Business Cards: Logo, Name, Category, Distance, Borough, Active Offers, Rewards, Rating, Open/Closed

### Business Storefront
**Route:** `/customer/businesses/[id]`

Header: Logo, Name, Category, Borough, Rating, Contact, Hours, Status
Tabs: Storefront, Products, Services, Promotions, Events, Rewards, Reviews, About
Actions: Follow, Save, Redeem Offer, Join Event, Collect Reward, Scan QR, Share, Contact, Book Service

### Promotions
**Route:** `/customer/promotions`

Tabs: Flash Deals, Daily Deals, Seasonal, Borough Promotions, Loyalty Offers, Saved, Expiring Soon
Cards: Title, Business, Discount, Location, Expiry Time, Type Badge
Actions: Claim Offer, Save, Share, Redeem Now, Scan QR

### Rewards
**Route:** `/customer/rewards`

Dashboard: Points Balance, Active Rewards, Loyalty Memberships, Redeemable Offers, Expiry Alerts
Tabs: My Points, Available, Redeemed, Loyalty Memberships, Expiring
Reward Types: Points, Coupons, Reward Codes, Gift Vouchers, Loyalty Rewards, Event Rewards, QR Rewards, Gamification Rewards
Actions: Redeem, Save, Transfer, Use QR, View History

### Events
**Route:** `/customer/events`

Tabs: Nearby, Trending, Borough Events, Saved, Joined
Cards: Image, Title, Business, Date/Time, Borough, Available Spots
Actions: Join, Save, Share, Scan QR, Get Directions, Add to Calendar

### Gamification
**Route:** `/customer/games`

Sections: Spin Wheel, Reward Drops, Challenges, Leaderboards, Unlock Games
Actions: Play Now, Claim Prize, View Challenges, Invite Friends

### Local Mall
**Route:** `/customer/local-mall`

Sections: Borough Activity, High Street Campaigns, Trending Businesses, Local Campaigns, Community Events
Actions: Explore Borough, Join Campaign, Follow High Street, Participate in Events

### Wallet
**Route:** `/customer/wallet`

Tabs: Coupons, Vouchers, QR Codes, Saved Offers, Reward History
Actions: Redeem, Transfer, Download QR, Share

### QR Scanner
**Route:** `/customer/scan`

Scan: Storefront QR, Reward QR, Event QR, Promotion QR
Flow: Scan → Open/Validate → Collect Reward or Join → Save to Wallet

### Notifications
**Route:** `/customer/notifications`

Tabs: All, Rewards, Events, Promotions, Borough Activity
Types: Reward Won, Reward Expiring, New Campaign, Event Reminder, Borough Update, Flash Deal
Actions: Open, Dismiss, Mark as Read, Save Offer, Redeem

### Profile & Settings
**Route:** `/customer/profile`

Sections: Personal Info, Saved Businesses, Joined Events, Redeemed Offers, Loyalty Status

Settings: Notification Preferences (Push, Reward Alerts, Event Reminders, Borough Activity, Nearby Promotions), Privacy (Location, Data, QR Permissions), Security (Password, 2FA, Login Activity)

Interests Management: Add/remove categories

Borough Change: Switch borough, browse boroughs

Help & Support: FAQ, Contact Support, Report Issue

## Empty States
- No Rewards — "Start playing to earn rewards!" with Play Now CTA
- No Saved Businesses — "Discover businesses and save them here"
- No Events Joined — "Find events in your borough"
- No Nearby Promotions — "Check back soon for new offers"
- No Gamification Available — "Games coming to your borough soon"

## Success States
- Reward Redeemed: Celebration animation, updated balance, next reward suggestions
- Event Joined: Confirmation, QR ticket, event reminders, related events
- Offer Claimed: Success animation, points earned, related offers
- QR Scan Success: Reward unlocked, campaign joined, business discovered
- Booking Confirmed: Summary, QR code, reminder options

## Error States
- Invalid QR — "This QR code is invalid or expired"
- Redemption Failed — "This reward has already been redeemed"
- Event Full — "This event is at full capacity"
- Expired Offer — "This offer has expired. Check similar offers."
- Network Error — "Connection lost. Check your internet and retry."

## API Endpoints Required

```
POST   /auth/customer/register           — Register
POST   /auth/customer/login              — Login
PUT    /customer/onboarding              — Complete onboarding
GET    /customer/home                    — Personalized dashboard feed
GET    /customer/discover                — Discover businesses
GET    /customer/discover/nearby         — Nearby businesses
GET    /customer/discover/search         — Search businesses
GET    /customer/businesses/:id          — Business storefront
GET    /customer/promotions              — Active promotions
POST   /customer/promotions/:id/redeem   — Redeem promotion
POST   /customer/promotions/:id/save     — Save promotion
GET    /customer/rewards                 — Reward wallet
POST   /customer/rewards/:id/redeem      — Redeem reward
GET    /customer/rewards/history         — Reward history
GET    /customer/events                  — Event list
POST   /customer/events/:id/join         — Join event
GET    /customer/games                   — Available games
POST   /customer/games/play              — Play a game
POST   /customer/games/:id/claim         — Claim game reward
GET    /customer/local-mall              — Local mall feed
GET    /customer/wallet                  — Digital wallet
POST   /customer/wallet/transfer         — Transfer voucher
GET    /customer/notifications           — Notifications
PUT    /customer/notifications/:id/read  — Mark as read
PUT    /customer/profile                 — Update profile
PUT    /customer/settings                — Update settings
POST   /customer/qr/scan                 — Process QR scan
```

## Key UI Components
- Canvas-based Plucko game with physics
- Reward win celebration (confetti + animation)
- QR scanner overlay with torch
- Business card with horizontal scroll
- Promotion countdown timer
- Event calendar with RSVP status
- Wallet card stack with swipe
- Bottom tab navigation (mobile)
- Pull-to-refresh on feeds
- Skeleton loading placeholders
- Push notification permission prompt
- Location permission explainer
- Category interest pills
- Borough selector with activity preview
