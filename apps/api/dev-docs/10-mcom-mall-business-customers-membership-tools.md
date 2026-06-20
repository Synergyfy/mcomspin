# Step 10: MCOM Mall Business Dashboard — Customers, Membership & Audits, Business Tools

## Overview
Build the three remaining business dashboard sections: Customers (CRM & loyalty), Membership & Audits (growth support), and Business Tools (operational problem solving).

---

## Part A — Customers (~70 screens)

### Customer Overview Dashboard
**Route:** `/dashboard/customers`

Top Cards: Total Customers, Loyalty Members, Returning Customers, Nearby Active Customers, Reward Redemptions, Active Conversations, Event Participants, Customer Satisfaction Score

Quick Actions: Add Reward, Send Promotion, Message Customers, Create Offer, Invite to Event, View Reviews

Live Activity Feed: New customer, reward redeemed, offer claimed, event joined, new review, QR scanned, loyalty upgrade

Customer Filter Bar: Borough, High Street, Loyalty Level, Recent Activity, Reward Activity, Event Participation

### Customer List
Customer Cards: Photo, Name, Loyalty Status, Points Balance, Borough, Last Visit, Total Redemptions, Engagement Level

Actions: Open Profile, Send Message, Allocate Points, Add Reward, Invite to Event, Tag, Save Notes

Search & Filters: Nearby, Returning, Loyalty, Event Participants, Reward Redeemers, Borough, Activity Level

Bulk Actions: Send Promotion, Send Offers, Invite to Event, Allocate Points, Export

### Customer Profile
Header: Name, Loyalty Tier, Points, Borough, Join Date, Engagement Score

Tabs:
- Overview: Visit frequency, favorite offers, preferred categories, last interactions
- Rewards: Points earned, rewards claimed, loyalty milestones
- Events: Joined, attended, saved events
- Activity Timeline: QR scans, storefront visits, reward claims, promotion interactions, event joins
- Notes: Preferences, follow-ups, special requests

### Loyalty Members
Tiers: Bronze, Silver, Gold, Platinum, VIP

Actions: Upgrade Tier, Send Rewards, Send VIP Offers, Invite to Exclusive Events

### Returning Customers
Track repeat engagement, recent activity, repeat redemptions, frequency

Actions: Reward returning customers, send comeback offers, trigger loyalty bonuses

### Nearby Customers
Local activity visibility with actions: Send local promotion, launch nearby offer, trigger flash reward

### Customer Segments
Create segments: VIP, Frequent Visitors, Event Attendees, Reward Users, Nearby, High Spenders, Inactive

### Loyalty & Rewards Dashboard
Active rewards, points issued/redeemed, redemption rate, loyalty growth, expiring rewards

Create Reward Rule: Visit/Purchase/QR scan/Referral/Event/Gamification triggers → Points value → Target audience → Activate

Redemption Offers: Discounts, Free Items, Vouchers, Event Access, Combo Offers, Flash Rewards

Points Allocation: Manual or bulk allocate, automate points, confirm with notification

Reward Campaigns: Active, borough, gamification, event, referral campaigns

### Messages Dashboard
Recent campaigns, sent, scheduled, engagement rates

Tabs: Promotions, Alerts, Offers, Event Invitations, Templates, Scheduled

Create Message: Select type → Choose template → Customize (Title, Text, CTA, Link) → Select Audience → Preview → Send/Schedule

### Reviews & Ratings Dashboard
Overall rating, latest reviews, unanswered, top testimonials, trends

Filters: Positive, Negative, Recent, Borough, Event-related

Actions: Reply, Report, Highlight Testimonial, Offer Resolution

### Customer Insights
Top interests, reward participation, event participation, popular offers, engagement patterns

### QR Customer Interaction Logs
Scans, rewards unlocked, storefront visits, campaign entries

### Customer Notification Settings
Manage push, SMS, email, borough notification preferences

### Customer Engagement Analytics
Redemption rate, repeat customers, event conversion, promotion performance, loyalty engagement

---

## Part B — Membership & Audits

### Membership & Audits Home
**Route:** `/dashboard/membership`

Current Membership Card, Audit Score, Storefront Completion %, Visibility Score, Borough Visibility, Credits Balance, Recommendation Cards

Quick Actions: Upgrade Membership, Run Audit, View Credits, Improve Storefront

### Membership Dashboard
Current Plan, Status, Renewal Date, Included Features, Visibility Level, Active Benefits

Plans: Bronze → Silver → Gold → Platinum (each unlocking more visibility, campaigns, automation, support)

Upgrade Flow: Select Plan → View Benefits → Billing Details → Apply Promo/Voucher → Payment Confirmation → Activated

Renewal: Auto-renew toggle, renew now, change plan

### Vouchers & Credits
Dashboard: Available, Used, Expiring, Bonus, Membership Credits

Tabs: Available, Redeemed, Expired, Promotional, Service Credits

Redemption: Select credit → Choose usage (Promotions, Rotators, Borough Visibility, Events, Storefront Boosts) → Confirm

Purchase Credits: Small, Medium, Large packs

### Audits
Dashboard: Latest Score, Visibility Rating, Engagement Rating, Storefront Completion

Short Audit (3 min): Quick questions → Analysis → Results with recommendations

Full Audit: Business Profile Review → Customer Engagement Review → Promotion Analysis → Borough Visibility Analysis → Final Report with Growth Roadmap

MCOM Audit: Platform-specific optimization review → Visibility opportunities, partnership opportunities, automation suggestions

### Reports
Tabs: Daily, Weekly, Monthly, Campaign, Visibility, Rewards

Export: PDF, CSV, Email

### Business Improvement Recommendations
AI-based suggestions: Improve storefront images, Launch weekend promotion, Activate loyalty, Join borough event, Enable rotators

Each: Expected impact, visibility improvement, setup steps

### Automation
Recurring audits, promotion reminders, visibility boosts, engagement reminders

---

## Part C — Business Tools

### Business Tools Home
**Route:** `/dashboard/tools`

Header: Excess Stock Items, Spare Capacity, Active Campaigns, Push Notifications Sent, Campaign Reach, Nearby Customer Activity

Quick Actions: Mark Excess Stock, Create Instant Offer, Launch Campaign, Send Push Notification

Performance: Stock Cleared, Capacity Filled, Offers Redeemed, Nearby Engagement, Campaign Views, Notification Opens

### Excess Stock
Dashboard: Total Items, Active Clearance, Fast-Moving, Unsold, Promotion Performance

Flow: Mark product → Set quantity/urgency → Set discount (%, fixed, bundle, BOGO) → Select visibility (Storefront, Nearby, Borough, High Street, Rotator, Featured) → Add engagement (Points, Gamification, QR, Loyalty) → Preview → Activate

Analytics: Stock cleared, redemption rate, customer engagement, QR scans

### Spare Capacity
Dashboard: Available, Active Offers, Filled, Engagement, Performance

Types: Empty Seats, Appointment Slots, Classes, Service Downtime, Event Space

Flow: Select type → Set availability → Create quick offer (Title, Discount, Reward, Limited time) → Target audience (Nearby, Loyalty, Borough, Returning, High Street) → Activate

Automation: Lunch offers, happy hour, slow hour deals, empty appointment alerts, weekday promotions

### Campaign Tools
Preset campaign types: Weekend Promo, Seasonal, Borough Promotion, Expo Push, Flash Sale, Loyalty Push, Event Campaign, Clearance

Flow: Select type → Choose preset template → Customize → Set distribution (Storefront, Borough Feed, Push, QR, Rotator, High Street) → Preview → Activate

### Push Notifications
Types: Flash Deal, Reward Alert, Event Reminder, Loyalty Message, Nearby Offer, Borough Promotion

Flow: Select type → Choose template → Customize → Select audience (All, Nearby, Loyalty, Inactive, Borough) → Preview (Lock screen, Push, Mobile) → Send or Schedule

### Business Automation
Types: Recurring Campaign, Clearance Trigger, Slow Hour Trigger, Spare Capacity Trigger, Reward Automation

Conditions: Low traffic, Excess inventory, Slow hours, Empty slots, Low engagement

Actions: Send push, Launch campaign, Apply discount, Generate offer, Reward customers

## API Endpoints Required

```
GET    /dashboard/customers                   — Customer list
GET    /dashboard/customers/:id               — Customer profile
PUT    /dashboard/customers/:id/points        — Allocate points
POST   /dashboard/customers/messages          — Send message
GET    /dashboard/customers/reviews           — Reviews list
POST   /dashboard/customers/reviews/:id/reply — Reply to review
GET    /dashboard/membership                  — Membership details
PUT    /dashboard/membership/upgrade          — Upgrade plan
GET    /dashboard/credits                     — Credit balance
POST   /dashboard/credits/redeem              — Use credits
GET    /dashboard/audits                      — Audit history
POST   /dashboard/audits/run                  — Run audit
GET    /dashboard/audits/recommendations      — Improvement suggestions
GET    /dashboard/tools                       — Tools overview
POST   /dashboard/tools/excess-stock          — Create excess stock offer
POST   /dashboard/tools/spare-capacity        — Create spare capacity offer
POST   /dashboard/tools/notifications         — Send push notification
GET    /dashboard/tools/automations           — Automation list
POST   /dashboard/tools/automations           — Create automation
```

## Key UI Components
- Customer card with avatar, status badge, engagement meter
- Points allocation popup with confirmation
- Message template selector with preview
- Review reply inline editor
- Membership tier comparison table
- Audit score gauge with progress to next level
- Credit balance card with expiry countdown
- Excess stock urgency badge (color-coded)
- Spare capacity calendar grid
- Push notification lock screen preview
- Automation trigger/action flow builder
- Recommendation card with "Apply" button
