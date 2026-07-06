# Step 3: MCOMSpin Admin Panel

## Overview
Build the lean 10-section admin panel for the MCOMSpin gamified reward platform. This gives SuperAdmin full control over games, campaigns, businesses, rewards, customers, redemptions, partners, and platform settings.

## Sections

### 1. Dashboard (Overview)
**Route:** `/admin`

KPI Cards:
- Total Businesses (active count, trend)
- Total Customers (registered count)
- Total Campaigns (active/running)
- Total Plays (ball drops across all games)
- Rewards Issued (total won)
- Rewards Redeemed (total used)
- Redemption Rate (%)
- Revenue Generated (if integrated)

Widgets:
- Recent Activity Feed (live stream of plays, wins, redemptions)
- Quick Action Buttons (Create Campaign, Add Reward, Add Business, View Analytics)

### 2. Games Management
**Route:** `/admin/games`

Game Cards:
- MCOMSpin Ball Drop (ACTIVE / MAINTENANCE / DISABLED)
- Future game slots (Spin Wheel, Scratch Card, Mystery Box — COMING SOON)

Ball Drop Configuration:
- Ball Speed (Slow / Medium / Fast)
- Physics Strength (slider)
- Box Options (2 / 4 / 6 / 8)
- Shuffle Settings (enable/disable, duration)
- Sound & Animation toggles
- Global Game Status toggle

### 3. Campaigns
**Route:** `/admin/campaigns`

Table Columns:
- Campaign Name, Business, Status, Game Type, Start/End Date, Plays, Rewards Issued

Filters: Active, Draft, Scheduled, Completed, Suspended

Actions: Create, Edit, Duplicate, Suspend, Delete

Campaign Detail (popup/drawer):
- Information (name, description, banner, eligibility rules, daily/weekly play limits)
- Reward Rules (attached rewards, inventory, probability)
- Analytics (plays, wins, redemptions)

### 4. Rewards
**Route:** `/admin/rewards`

Table Columns: Reward Name, Business, Quantity, Remaining, Status, Expiry

Types: Discount, Voucher, Product, Service, Cashback, Loyalty Points, Mystery Reward

Actions: Create, Edit, Suspend, Delete

Reward Detail: Image, Name, Description, Terms, Expiry, Quantity, Probability

### 5. Businesses
**Route:** `/admin/businesses`

Table Columns: Business Name, Industry, Status, Campaigns, Customers, Join Date

Actions: Approve, Suspend, Activate, Delete

Profile Tabs: Information, Campaigns, Rewards, Customers, Analytics

Special: Assign Account Manager, Assign Consultant

### 6. Customers
**Route:** `/admin/customers`

Table Columns: Name, Email, Mobile, Rewards Won, Rewards Redeemed, Status

Actions: View Profile, Suspend, Activate

Profile Tabs: Details, Rewards Wallet, Activity History, Redemptions

### 7. Redemptions
**Route:** `/admin/redemptions`

Dashboard Cards: Pending, Redeemed, Expired, Failed

Table Columns: Customer, Business, Reward, Redemption Date, Status

Actions: Approve, Reject, View Details

### 8. Partners
**Route:** `/admin/partners`

Partner Types: Agents, Consultants, Account Managers

Partner Cards per role with total counts

Table Columns: Name, Role, Assigned Businesses, Status

Actions: Assign Business, Remove Business, Suspend Partner, View Performance

Profile Tabs: Information, Assigned Businesses, Performance, Commissions

### 9. Analytics
**Route:** `/admin/analytics`

Cards: Total Plays, Unique Players, Rewards Issued, Rewards Redeemed, Businesses Active, Campaigns Active

Charts: Daily/Weekly/Monthly Plays, Top Businesses, Top Campaigns, Top Rewards

Export: PDF, Excel, CSV

### 10. Settings
**Route:** `/admin/settings`

Sections:
- General: Platform Name, Logo, Support Email, Support Phone
- Game: Default Ball Speed, Default Shuffle Duration, Default Box Count
- Reward: Default Expiry, Default Inventory Rules
- Notification: Email, SMS, Push config
- Security: Password Rules, Login Rules, Fraud Rules
- API: MCOM Mall integration keys, webhooks

## API Endpoints Required

```
GET    /admin/dashboard          — Aggregated dashboard KPIs
GET    /admin/games              — Game list and configs
PUT    /admin/games/:id          — Update game configuration
GET    /admin/campaigns          — Campaign list with filters
POST   /admin/campaigns          — Create campaign
PUT    /admin/campaigns/:id      — Update campaign
DELETE /admin/campaigns/:id      — Delete campaign
GET    /admin/rewards            — Reward list
POST   /admin/rewards            — Create reward
PUT    /admin/rewards/:id        — Update reward
DELETE /admin/rewards/:id        — Delete reward
GET    /admin/businesses         — Business list
PUT    /admin/businesses/:id     — Approve/suspend/activate
GET    /admin/businesses/:id     — Business profile detail
GET    /admin/customers          — Customer list
GET    /admin/customers/:id      — Customer profile
PUT    /admin/customers/:id      — Suspend/activate
GET    /admin/redemptions        — Redemption list
PUT    /admin/redemptions/:id    — Approve/reject
GET    /admin/partners           — Partner list
POST   /admin/partners           — Create partner
PUT    /admin/partners/:id       — Update partner
GET    /admin/analytics          — Analytics data
GET    /admin/settings           — Get settings
PUT    /admin/settings           — Update settings
```

## Key UI Components
- Data tables with sorting, filtering, pagination
- Status badges (color-coded)
- Confirmation modals for destructive actions
- Inline editing for quick updates
- Chart components for analytics (Recharts)
- Mobile-responsive sidebar layout
- Search with debounce across all list views
