# Step 13: Stitch UI Generation

## Overview
Plan and execute the generation of all UI screens using Stitch AI. Each screen should follow the brand spec, be mobile-first responsive, and include all states (loading, empty, error, success).

## Brand Reference
From `brand-spec.md`:
- `--bg`: oklch(100% 0 0) — Pure White
- `--surface`: oklch(98% 0.005 70) — Off-white/Cream
- `--fg`: oklch(20% 0.02 70) — Deep Charcoal
- `--muted`: oklch(60% 0.01 70) — Soft Grey
- `--border`: oklch(90% 0.01 70) — Light Grey
- `--accent`: oklch(65% 0.20 45) — Brand Orange

Typography: SF Pro Display / SF Pro Text (system font stack)
Radius: 12px soft precise
Layout: Modern minimal/luxury, large whitespace, thin hairlines

## Generation Order

### Batch 1 — MCOMSpin Core (Priority)
1. Admin Login Screen
2. Admin Dashboard (KPI cards, activity feed)
3. Admin Campaigns List + Create
4. Admin Rewards List + Create
5. Admin Businesses List + Detail
6. Admin Customers List + Detail
7. Admin Redemptions + Scanner
8. Admin Partners + Analytics
9. Admin Settings
10. Business Landing Page
11. Business Signup Wizard (10 steps)
12. Business Dashboard (KPIs, quick actions)
13. Business Campaign Manager
14. Business Rewards Manager
15. Business Ball Drop Game Config
16. Business Customers List + Detail
17. Business Redemption Scanner
18. Business Analytics Dashboard
19. Business Notifications
20. Business Staff Management
21. Business Billing
22. Business Settings
23. Customer Onboarding (5 steps)
24. Customer Home Dashboard
25. Customer Ball Drop Game
26. Customer Rewards Wallet
27. Customer Redemption
28. Customer Campaigns List
29. Customer Business Profile
30. Customer Activity History
31. Customer Notifications
32. Customer Profile & Settings

### Batch 2 — MCOM Mall Admin
33. Admin Login (with OTP modal)
34. Admin Dashboard Home (live map, KPI grid, activity feed, quick actions)
35. Marketplace Dashboard Home
36. Store List Management (advanced table with bulk actions)
37. Store Profile Details (tabbed)
38. Store Edit Screen (sections)
39. Category Management (list + hierarchy builder)
40. Approval Center (queue + review)
41. Featured Store Management (placement board)
42. Visibility Management (overview + boost)
43. Search & Discovery Management
44. Marketplace Analytics (charts + heatmaps)
45. Marketplace Moderation Center
46. Marketplace Settings
47. High Street Management Dashboard
48. High Street Activation Flow (5-step wizard)
49. Borough Management Dashboard
50. Borough Detail (tabbed)
51. Business Management Dashboard
52. Business Verification Screen
53. Customer Management Dashboard
54. Campaign Management Dashboard
55. Campaign Creation Flow (7 steps)
56. Promotions Management Dashboard
57. Gamification Management Dashboard
58. QLinks Management Dashboard
59. Expo & Promo Dashboard
60. Rewards & Loyalty Dashboard
61. Membership Management Dashboard
62. Audits & Visibility Dashboard
63. Analytics & Reporting Dashboard
64. Community & High Street Activity Dashboard
65. Notifications & Communication Dashboard
66. Automation Systems Dashboard
67. Moderation & Compliance Dashboard
68. Billing & Financial Oversight Dashboard
69. Team & Staff Management Dashboard
70. System Settings Dashboard
71. Support & Resolution Center

### Batch 3 — MCOM Mall Business (Local Mall)
72. Local Mall Entry Screen
73. Local Mall Onboarding Intro
74. Business Participation Status
75. Borough & High Street Assignment
76. Sublocation Setup
77. My High Street Overview (map + list)
78. High Street Map View (interactive)
79. Storefront Cluster View
80. Borough Activity Feed
81. High Street Rankings
82. Business Discovery (tabs + filters)
83. Business Profile Preview
84. Community Activation Center
85. Business Interest Signals
86. Partnerships Home (tabs)
87. Partnership Matches (compatibility)
88. Request Partnership Flow
89. Active Partnerships
90. Share Exchange Home
91. Shared Campaign Builder
92. Shared Audience Settings
93. Visibility Home (score + controls)
94. Visibility Settings
95. Boost Visibility Flow
96. Rotator & Featured Settings
97. Expo Hub
98. Virtual Booth Setup
99. Event & Demo Management
100. Hub Participation
101. Account Manager Support
102. Notifications Center (Local Mall)
103. Messages Center
104. Search & Filter (Local Mall)

### Batch 4 — MCOM Mall Customer
105. Welcome Screen
106. Login Screen
107. OTP Verification Screen
108. Create Account Screen
109. Account Success Screen
110. Profile Setup (onboarding step 1)
111. Interest Selection (onboarding step 2)
112. Location Permission (onboarding step 3)
113. Borough Selection (onboarding step 4)
114. Onboarding Completion
115. Customer Home Dashboard
116. Discover Home (tabs + feed)
117. Search Results
118. Filter Panel
119. Business Storefront (tabbed)
120. Products Screen
121. Product Details
122. Services Screen
123. Service Details
124. Promotions Home (tabs)
125. Promotion Details
126. Promotion Redemption
127. Rewards Dashboard
128. Reward Details
129. Reward Redemption
130. Reward History
131. Events Home (tabs)
132. Event Details
133. Event Registration
134. Joined Events
135. Event QR Entry
136. Gamification Home
137. Spin Wheel Screen
138. Reward Drops
139. Challenge Screen
140. Leaderboard
141. Prize Claim
142. Local Mall Home
143. Borough Activity
144. High Street Campaign
145. Community Challenges
146. QR Scanner
147. QR Result
148. Wallet Screen
149. Notifications Center
150. Profile Screen
151. Edit Profile
152. Settings Screen
153. Help & Support

## Stitch Prompt Template

Each screen prompt should follow this structure:

```
Create a [screen name] for the MCOM [ecosystem name].

Style: Modern, clean, operational, Apple + Stripe dashboard aesthetic.
White backgrounds, orange (#f97316) highlights, black typography, rounded cards (12px), clean spacing.

Design Feel: [specific feel for this screen - e.g., "live marketplace operations center"]

Layout: [description of layout - e.g., "Left sidebar navigation, top header bar, main content area"]

Content:
- [List all UI elements, cards, tables, buttons, charts needed]

States to design:
- Default/loaded state
- Empty state (if applicable)
- Loading skeleton state
- Error state (if applicable)
- Mobile responsive view

Mobile-first: Ensure all layouts collapse to single-column on mobile.
```

## Screen Output Format
Each screen should produce:
1. HTML file with embedded CSS
2. PNG screenshot
3. Component breakdown for React implementation

## Design System Components (Reusable)
- Card (with title, children, optional processing overlay)
- Badge (neutral, green, red, yellow, blue variants)
- KPI Metric Card (value, label, trend, mini chart)
- Data Table (sortable, filterable, with bulk actions)
- Status Badge (colored by status)
- Search Bar (with debounce)
- Filter Panel (sidebar or dropdown)
- Modal/Drawer
- Multi-step Wizard
- Tab Container
- Form Group (label, input, helper text, error)
- Toast Notification (success, error, warning, info)
- Skeleton Loader
- Empty State (illustration, text, CTA button)
- Avatar (with status indicator)
- Confirmation Dialog
- Progress Bar/Stepper
- Chart Widget (Recharts integration)
- Live Activity Feed Item
- Business Card (logo, name, category, distance, actions)
- Reward Card (image, title, points, expiry, redeem button)
- Event Card (image, title, date, location, join button)
- Map Pin Tooltip
- QR Code Display/Scanner
