# Step 5: MCOMSpin Customer Experience

## Overview
Build the full customer journey for MCOMSpin — from discovering campaigns to playing games, winning rewards, redeeming at businesses, and returning for more. This is the consumer-facing mobile-first app.

## Sections

### Section 1 — Customer Landing (Public)
**Route:** `/`

Hero Banner, Featured Campaigns, Featured Businesses, Current Rewards

CTA: Start Playing, Sign Up, Login

Benefits: Play Games, Win Rewards, Save Money, Discover Local Businesses

### Section 2 — Customer Account
**Route:** `/auth`

Sign Up: Name, Phone, Email, Password
Login: Email/Phone + Password, Social Login (Google, Apple)
Forgot Password flow

### Section 3 — Customer Onboarding
**Route:** `/customer/onboarding`

Profile: Photo, Name, Location, Interests

Category Selection: Food, Fashion, Beauty, Retail, Entertainment, Services

### Section 4 — Home Dashboard
**Route:** `/customer`

Header: Name, Points Balance, Borough, Notifications

Quick Actions: Play Now, My Rewards, Wallet, Notifications

Feed: Featured Campaigns, Trending Rewards, Nearby Businesses, Recently Added

### Section 5 — Discover
**Route:** `/customer/discover`

Browse: Category, Business, Location, Popularity, Newest

Search: Campaigns, Businesses, Rewards

Filters: Distance, Category, Reward Type

### Section 6 — Campaigns
**Route:** `/customer/campaigns`

Detail: Campaign Name, Business, Description, Rewards, Expiry Date, Rules

Actions: Play Campaign, Save Campaign, Share Campaign

### Section 7 — Ball Drop Game
**Route:** `/customer/play`

Game Screen: Ball Drop animation, peg physics, reward lane assignment

Flow: Check eligibility → Game preparation → Box shuffle → Ball drop → Win animation → Reward reveal

### Section 8 — Rewards Wallet
**Route:** `/customer/my-rewards`

Categories: Available, Redeemed, Expired

Detail: Reward Name, Business, Expiry Date, Status, QR Code, Voucher Code

Actions: Redeem, View Details, Share

### Section 9 — Redemption
**Route:** `/customer/redeem`

Methods: QR Scan, Voucher Code, Manual Validation

Status: Pending, Redeemed, Expired, Rejected

### Section 10 — Business Profiles
**Route:** `/customer/businesses/[id]`

Info: Logo, Cover, Description, Location, Contact

Content: Active Campaigns, Rewards, Reviews

Actions: Follow, Share, Navigate

### Section 11 — Customer Activity
**Route:** `/customer/history`

Timeline: Games Played, Rewards Won, Rewards Redeemed, Businesses Visited

### Section 12 — Notifications
**Route:** `/customer/notifications`

Types: Reward Won, Reward Expiring, New Campaign, Special Promotion

Channels: In-App, Push, Email, SMS

### Section 13 — Leaderboard & Achievements
**Route:** `/customer/leaderboard`

Leaderboards: Top Players, Most Rewards Won, Most Rewards Redeemed

Achievements: First Win, 10 Rewards Won, 50 Plays, VIP Player

### Section 14 — Referrals
**Route:** `/customer/referrals`

Features: Invite Friends, Referral Code, Referral Link

Tracking: Invites Sent, Friends Joined, Rewards Earned

### Section 15 — Profile
**Route:** `/customer/profile`

Info: Name, Photo, Phone, Email, Location

Preferences: Categories, Notifications, Privacy

### Section 16 — Settings
**Route:** `/customer/settings`

Settings: Notification, Language, Security, Privacy, Password, 2FA

### Section 17 — Support
**Route:** `/customer/support`

Resources: FAQs, Guides, Tutorials

Contact: Chat, Ticket, Email

## API Endpoints Required

```
POST   /auth/customer/register     — Customer registration
POST   /auth/customer/login        — Customer login
GET    /customer/dashboard         — Personalized home feed
GET    /customer/discover          — Browse campaigns/businesses
GET    /customer/campaigns         — Campaign list
GET    /customer/campaigns/:id     — Campaign detail
POST   /customer/games/play        — Initiate game session
POST   /customer/games/drop        — Process ball drop result
GET    /customer/rewards           — Reward wallet
POST   /customer/rewards/redeem    — Redeem reward
GET    /customer/rewards/history   — Redemption history
GET    /customer/activity          — Activity timeline
GET    /customer/businesses/:id    — Business profile
POST   /customer/businesses/:id/follow — Follow business
GET    /customer/notifications     — Notification list
PUT    /customer/notifications/:id — Mark as read
GET    /customer/leaderboard       — Leaderboard data
POST   /customer/referrals         — Create referral
GET    /customer/referrals         — Referral tracking
PUT    /customer/profile           — Update profile
PUT    /customer/settings          — Update settings
```

## Game Flow API

### Play Session Flow
```
1. GET  /customer/games/eligibility — Check daily/weekly limits, purchase requirements
2. POST /customer/games/start      — Start game session, return game config & shuffled boxes
3. POST /customer/games/drop       — Process ball drop: { boxIndex, sessionId }
   → Returns: reward won, reward details, win animation data
4. POST /customer/games/claim      — Claim reward to wallet
```

### Reward Redemption Flow
```
1. GET  /customer/rewards/:id      — Reward details with QR/voucher
2. POST /customer/rewards/redeem   — Redeem: { rewardId, method: 'qr' | 'code' }
   → Returns: validation QR or code
3. POST /business/redeem/validate  — Business scans QR: { code, businessId }
   → Validates and marks as redeemed
```

## Key UI Components
- Canvas-based Plucko ball drop game with physics
- Reward win celebration animation (confetti, particles)
- QR code generation and scanner
- Horizontal scroll cards for discovery
- Pull-to-refresh for feeds
- Skeleton loading states
- Empty states with illustrations and CTAs
- Push notification permission prompts
- Swipeable reward cards
- Real-time game session countdown
