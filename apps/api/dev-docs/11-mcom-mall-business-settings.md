# Step 11: MCOM Mall Business Dashboard — Settings

## Overview
Build the simplified business control center. This covers account management, team access, integrations, billing, and account status management — designed to be mobile-first and non-technical.

## Sections

### Settings Home
**Route:** `/dashboard/settings`

Header: Business Name, Account Status, Membership Status, Connected Integrations, Active Team Members, Billing Status

Category Cards: Account Settings, Team Access, Integrations, Billing

Quick Actions: Change Password, Add Team Member, Connect Google, View Invoices

### Account Settings
**Route:** `/dashboard/settings/account`

Overview: Email, Phone, Password Status, Notification Preferences, Login Activity, Account Recovery

Email Management: View current → Enter new email → Verify via OTP/link → Confirmed

Password Management: Current → New → Confirm → Strength indicator → Save

Notification Settings (toggle per type):
- Push Notifications, Promotion Alerts, Reward Notifications
- Event Notifications, Borough Notifications
- Billing Alerts, Staff Activity Alerts
- Frequency controls, Quiet hours

Login & Security: Last Login, Active Devices, Login History, Security Alerts

Actions: Logout Devices, Reset Password, Enable Recovery

### Team Access
**Route:** `/dashboard/settings/team`

Dashboard: Total Members, Managers, Staff, Agents, Pending Invites

Quick Actions: Add Staff, Add Manager, Add Agent, Manage Permissions

Team List (Cards): Name, Role, Email, Status, Last Active

Actions: Edit Role, Suspend Access, Remove User, Resend Invite

Add Team Member Flow:
1. Select Role (Staff, Agent, Manager)
2. Enter Details (Name, Email, Phone)
3. Set Permissions (Promotions, Storefront, Customers, Messages, Billing, Reports)
4. Send Invite → Success

Role Types:
- Staff: Limited operational access
- Agent: Marketing and customer engagement
- Manager: Higher-level business management

Permissions per role: Storefront, Promotions, Customers, Local Mall, Reports, Billing, Settings

### Integrations
**Route:** `/dashboard/settings/integrations`

Dashboard: Connected Services (Google Business, Payment Gateway, Booking Platform)

Google Integration Flow:
1. Connect Google → Authenticate → Select Business Profile → Approve Permissions → Sync Data

Payment Gateway Flow:
1. Select Provider (Stripe, PayPal, Local) → Connect Account → Verify → Success

Booking Tool Flow:
1. Select Platform → Connect Account → Enable Sync → Success

### Billing
**Route:** `/dashboard/settings/billing`

Dashboard: Current Plan, Next Billing Date, Payment Method, Outstanding Balance, Recent Transactions

Quick Actions: Pay Invoice, Download Invoice, Update Payment Method, View Transactions

Payment Methods: Add/Edit/Remove Card, Set Default

Fields: Card Number, Expiry, CVV, Billing Address

Invoices: Number, Date, Amount, Status (Paid/Pending/Failed)
Actions: Download, Retry Payment, View Details

Transaction History: Membership Payments, Credit Purchases, Promotion Payments, Borough Placement Payments
Filters: Date, Type, Status

Billing Notifications: Renewal Reminders, Failed Payment Alerts, Invoice Notifications, Credit Expiry Alerts

### Account Deactivation
**Route:** `/dashboard/settings/deactivate`

Options: Pause Account (temporary), Delete Account (permanent)

Flow: Select action → Confirm Password → Confirm consequences → Status updated

## Empty States

- No Team Members: Illustration + "Add your first team member" CTA
- No Integrations: Illustration + "Connect your first service" CTA
- No Payment Methods: Illustration + "Add a payment method" CTA
- No Invoices: Illustration + "Your invoices will appear here"
- No Notifications Enabled: Illustration + "Enable notifications to stay updated"

## Success States
- Password Updated ✓
- Email Verified ✓
- Team Member Added ✓
- Integration Connected ✓
- Payment Successful ✓

## Error States
- Failed Login: "Incorrect email or password"
- Payment Failure: "Your card was declined. Try another payment method."
- Invalid Card: "Please check your card details"
- Integration Failure: "Connection failed. Please try again."
- Permission Error: "You don't have permission to perform this action"

## API Endpoints Required

```
GET    /business/settings                     — Settings overview
PUT    /business/settings/account/email       — Update email
PUT    /business/settings/account/password    — Update password
GET    /business/settings/account/security    — Security info
POST   /business/settings/account/logout-devices — Logout all devices
GET    /business/settings/notifications       — Notification preferences
PUT    /business/settings/notifications       — Update preferences
GET    /business/settings/team                — Team list
POST   /business/settings/team/invite         — Invite team member
PUT    /business/settings/team/:id            — Update role/permissions
DELETE /business/settings/team/:id            — Remove team member
GET    /business/settings/integrations        — Integration list
POST   /business/settings/integrations/google — Connect Google
POST   /business/settings/integrations/payment — Connect payment gateway
POST   /business/settings/integrations/booking — Connect booking tool
DELETE /business/settings/integrations/:id    — Disconnect integration
GET    /business/settings/billing             — Billing overview
GET    /business/settings/billing/invoices    — Invoice list
GET    /business/settings/billing/transactions — Transaction history
PUT    /business/settings/billing/payment-method — Update payment method
POST   /business/settings/billing/pay-invoice — Pay invoice
POST   /business/settings/deactivate          — Pause or delete account
```

## Key UI Components
- Category card grid with icons
- Toggle switches for notification preferences
- Role selector with permission checkboxes
- Integration connection status cards
- Invoice list with download buttons
- Transaction history with filter chips
- Security alert banners
- Confirmation modals for destructive actions
- Success/error toast notifications
- Skeleton loading for settings sections
