export function isMockEnabled(): boolean {
  try {
    return process.env.NEXT_PUBLIC_MOCK_ENABLED === 'true';
  } catch {
    return false;
  }
}

type MockHandler = (params?: Record<string, string>) => { success: true; data: any };

const now = new Date().toISOString();

export const mockUser = {
  id: 'mock-user-1',
  email: 'business@test.com',
  firstName: 'John',
  lastName: 'Doe',
  name: 'John Doe',
  phone: '+1234567890',
  avatarUrl: null,
  isActive: true,
  role: 'BusinessOwner',
  roles: [{ role: { name: 'BusinessOwner', permissions: ['*'] } }],
  businessName: 'Mock Business Ltd',
  business: { id: 'mock-biz-1', name: 'Mock Business Ltd' },
  createdAt: now,
};

const mockBusiness = {
  id: 'mock-biz-1',
  ownerId: 'mock-user-1',
  name: 'Mock Business Ltd',
  slug: 'mock-business',
  description: 'A comprehensive mock business for testing',
  contactEmail: 'business@mock.com',
  contactPhone: '+1234567890',
  website: 'https://mockbusiness.com',
  address: '123 Mock Street, Test City',
  isActive: true,
  isVerified: true,
  businessType: 'Retail',
  logoUrl: null,
  coverUrl: null,
  socialLinks: { instagram: '@mockbiz', facebook: 'mockbiz' },
  settings: { currency: 'GBP', timezone: 'Europe/London' },
  createdAt: now,
  updatedAt: now,
};

const mockLocations = [
  { id: 'loc-1', name: 'Main Store', address: '123 High Street', city: 'London', postcode: 'SW1A 1AA', phone: '+44123456789', isActive: true, latitude: 51.5074, longitude: -0.1278 },
  { id: 'loc-2', name: 'Branch Store', address: '456 Oxford Road', city: 'Manchester', postcode: 'M1 1AA', phone: '+44987654321', isActive: true, latitude: 53.4808, longitude: -2.2426 },
];

const mockStaff = [
  { id: 'staff-1', userId: 'mock-user-2', name: 'Jane Smith', email: 'jane@mock.com', role: 'Manager', isActive: true, invitedAt: now },
  { id: 'staff-2', userId: 'mock-user-3', name: 'Bob Wilson', email: 'bob@mock.com', role: 'Staff', isActive: true, invitedAt: now },
];

const mockCampaigns = [
  { id: 'camp-1', name: 'Summer Sale', description: 'Big summer discounts', type: 'Seasonal', status: 'Active', startDate: now, endDate: new Date(Date.now() + 86400000 * 30).toISOString(), budget: 5000, spent: 1200, impressions: 15000, clicks: 850, isPublic: true, createdAt: now, updatedAt: now },
  { id: 'camp-2', name: 'New Customer Welcome', description: 'Welcome offer for new customers', type: 'Acquisition', status: 'Active', startDate: now, endDate: new Date(Date.now() + 86400000 * 60).toISOString(), budget: 3000, spent: 800, impressions: 8000, clicks: 420, isPublic: true, createdAt: now, updatedAt: now },
];

const mockRewards = [
  { id: 'rew-1', name: 'Free Coffee', description: 'Free coffee on next visit', pointsCost: 50, quantity: 100, redeemed: 23, isActive: true, expiresAt: new Date(Date.now() + 86400000 * 90).toISOString(), createdAt: now },
  { id: 'rew-2', name: '20% Discount', description: '20% off your entire purchase', pointsCost: 200, quantity: 50, redeemed: 12, isActive: true, expiresAt: new Date(Date.now() + 86400000 * 60).toISOString(), createdAt: now },
  { id: 'rew-3', name: 'VIP Access', description: 'Exclusive VIP event access', pointsCost: 500, quantity: 20, redeemed: 3, isActive: true, expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(), createdAt: now },
];

const mockCustomers = [
  { id: 'cust-1', name: 'Alice Johnson', email: 'alice@test.com', phone: '+441111111111', totalSpent: 1250, visitCount: 24, lastVisit: now, points: 340, joinedAt: new Date(Date.now() - 86400000 * 90).toISOString() },
  { id: 'cust-2', name: 'Charlie Brown', email: 'charlie@test.com', phone: '+442222222222', totalSpent: 780, visitCount: 15, lastVisit: now, points: 180, joinedAt: new Date(Date.now() - 86400000 * 45).toISOString() },
];

const mockRedemptions = [
  { id: 'red-1', rewardId: 'rew-1', customerId: 'cust-1', customerName: 'Alice Johnson', rewardName: 'Free Coffee', pointsCost: 50, status: 'Pending', requestedAt: now },
  { id: 'red-2', rewardId: 'rew-2', customerId: 'cust-2', customerName: 'Charlie Brown', rewardName: '20% Discount', pointsCost: 200, status: 'Approved', requestedAt: new Date(Date.now() - 86400000).toISOString(), approvedAt: now },
];

const mockGame = {
  id: 'game-1',
  businessId: 'mock-biz-1',
  name: 'Spin & Win',
  type: 'Plinko',
  isActive: true,
  config: { minDrop: 1, maxDrop: 5, boxCount: 8, multiplierRange: { min: 1, max: 100 } },
  settings: { dailyLimit: 3, cooldownMinutes: 60 },
  createdAt: now,
  updatedAt: now,
};

const mockAnalytics = {
  overview: { totalVisits: 1520, totalCustomers: 342, totalRevenue: 45600, avgOrderValue: 30, conversionRate: 12.5 },
  trends: [
    { date: new Date(Date.now() - 86400000 * 6).toISOString(), visits: 45, revenue: 1350 },
    { date: new Date(Date.now() - 86400000 * 5).toISOString(), visits: 52, revenue: 1560 },
    { date: new Date(Date.now() - 86400000 * 4).toISOString(), visits: 38, revenue: 1140 },
    { date: new Date(Date.now() - 86400000 * 3).toISOString(), visits: 61, revenue: 1830 },
    { date: new Date(Date.now() - 86400000 * 2).toISOString(), visits: 48, revenue: 1440 },
    { date: new Date(Date.now() - 86400000).toISOString(), visits: 55, revenue: 1650 },
    { date: now, visits: 42, revenue: 1260 },
  ],
  topProducts: [
    { name: 'Premium Widget', sales: 120, revenue: 3600 },
    { name: 'Basic Gadget', sales: 85, revenue: 1700 },
    { name: 'Deluxe Bundle', sales: 45, revenue: 2250 },
  ],
};

const mockBilling = {
  subscription: { id: 'sub-1', plan: 'Premium', status: 'Active', price: 49.99, billingPeriod: 'Monthly', nextBillingDate: new Date(Date.now() + 86400000 * 14).toISOString() },
  invoices: [
    { id: 'inv-1', amount: 49.99, status: 'Paid', issuedAt: new Date(Date.now() - 86400000 * 30).toISOString(), paidAt: new Date(Date.now() - 86400000 * 30).toISOString() },
    { id: 'inv-2', amount: 49.99, status: 'Paid', issuedAt: new Date(Date.now() - 86400000 * 60).toISOString(), paidAt: new Date(Date.now() - 86400000 * 60).toISOString() },
  ],
  paymentMethod: { type: 'card', last4: '4242', brand: 'Visa', expMonth: 12, expYear: 2026 },
};

const mockPartnerships = [
  { id: 'part-1', partnerId: 'mock-biz-2', partnerName: 'Partner Cafe', status: 'Active', type: 'CrossPromotion', startedAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: 'part-2', partnerId: 'mock-biz-3', partnerName: 'Tech Store', status: 'Pending', type: 'Referral', requestedAt: now },
];

const mockNotifications = [
  { id: 'notif-1', type: 'info', title: 'New customer milestone', message: 'You reached 500 customers!', read: false, createdAt: now },
  { id: 'notif-2', type: 'alert', title: 'Campaign ending soon', message: 'Summer Sale ends in 3 days', read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'notif-3', type: 'success', title: 'Redemption approved', message: 'Customer redeemed Free Coffee', read: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

const mockAdminDashboard = {
  stats: { totalBusinesses: 245, totalCustomers: 15800, totalRevenue: 1250000, activeCampaigns: 67, pendingVerifications: 12, reportedIssues: 3 },
  recentBusinesses: [
    { id: 'biz-1', name: 'Mock Business Ltd', ownerEmail: 'owner@test.com', status: 'Active', joinedAt: now },
    { id: 'biz-2', name: 'Test Cafe', ownerEmail: 'cafe@test.com', status: 'Pending', joinedAt: now },
  ],
};

const mockAdminBusinesses = [
  { id: 'biz-1', name: 'Mock Business Ltd', ownerEmail: 'business@mock.com', status: 'Active', type: 'Retail', customers: 342, revenue: 45600, joinedAt: now },
  { id: 'biz-2', name: 'Test Cafe', ownerEmail: 'cafe@test.com', status: 'Pending', type: 'Food & Drink', customers: 89, revenue: 12000, joinedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'biz-3', name: 'Tech Store', ownerEmail: 'tech@test.com', status: 'Active', type: 'Technology', customers: 156, revenue: 89000, joinedAt: new Date(Date.now() - 86400000 * 60).toISOString() },
];

const mockCustomerDashboard = {
  points: 450,
  tier: 'Gold',
  nextTier: 'Platinum',
  pointsToNextTier: 50,
  visitCount: 28,
  rewardCount: 5,
  recentActivity: [
    { id: 'act-1', type: 'earn', description: 'Earned 50 points from purchase', amount: 50, createdAt: now },
    { id: 'act-2', type: 'redeem', description: 'Redeemed Free Coffee', amount: -50, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'act-3', type: 'visit', description: 'Visited Mock Business Ltd', amount: 0, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  ],
  businesses: [
    { id: 'mock-biz-1', name: 'Mock Business Ltd', slug: 'mock-business', points: 340, visitCount: 24, lastVisit: now },
    { id: 'mock-biz-2', name: 'Partner Cafe', slug: 'partner-cafe', points: 110, visitCount: 8, lastVisit: new Date(Date.now() - 86400000 * 7).toISOString() },
  ],
};

const mockDiscover = [
  { id: 'biz-1', name: 'Mock Business Ltd', slug: 'mock-business', description: 'A mock business for testing', category: 'Retail', distance: 0.5, rating: 4.5, isFollowing: true, imageUrl: null },
  { id: 'biz-2', name: 'Partner Cafe', slug: 'partner-cafe', description: 'Cozy cafe in town', category: 'Food & Drink', distance: 1.2, rating: 4.2, isFollowing: false, imageUrl: null },
  { id: 'biz-3', name: 'Tech Store', slug: 'tech-store', description: 'Latest gadgets and electronics', category: 'Technology', distance: 2.0, rating: 4.8, isFollowing: false, imageUrl: null },
];

const mockLeaderboard = [
  { rank: 1, customerId: 'cust-1', name: 'Alice Johnson', points: 340, avatarUrl: null },
  { rank: 2, customerId: 'cust-3', name: 'David Miller', points: 280, avatarUrl: null },
  { rank: 3, customerId: 'cust-2', name: 'Charlie Brown', points: 180, avatarUrl: null },
];

const mockAchievements = [
  { id: 'ach-1', name: 'First Visit', description: 'Visited a business for the first time', icon: 'star', earnedAt: new Date(Date.now() - 86400000 * 90).toISOString() },
  { id: 'ach-2', name: 'Loyal Customer', description: 'Visited 10 times', icon: 'heart', earnedAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: 'ach-3', name: 'Reward Hunter', description: 'Redeemed 5 rewards', icon: 'trophy', earnedAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 'ach-4', name: 'Social Butterfly', description: 'Followed 5 businesses', icon: 'users', earnedAt: null },
];

const mockReferrals = [
  { id: 'ref-1', code: 'ALICE2024', referredName: 'Eve Davis', status: 'Converted', reward: 100, createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: 'ref-2', code: 'ALICE2024', referredName: 'Frank Miller', status: 'Pending', reward: 0, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

const mockPromotions = [
  { id: 'promo-1', name: 'Happy Hour', description: '20% off drinks 5-7pm', type: 'Discount', status: 'Active', startDate: now, endDate: new Date(Date.now() + 86400000 * 30).toISOString(), usageLimit: 200, usedCount: 45 },
  { id: 'promo-2', name: 'Loyalty Bonus', description: 'Double points on weekends', type: 'Points', status: 'Active', startDate: now, endDate: new Date(Date.now() + 86400000 * 60).toISOString(), usageLimit: null, usedCount: 78 },
];

const mockVouchers = [
  { id: 'vouch-1', code: 'SAVE10', discount: '10%', status: 'Active', usageLimit: 100, usedCount: 23, expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(), createdAt: now },
  { id: 'vouch-2', code: 'FREESHIP', discount: 'Free Shipping', status: 'Active', usageLimit: 50, usedCount: 12, expiresAt: new Date(Date.now() + 86400000 * 14).toISOString(), createdAt: now },
];

const mockQRCodes = [
  { id: 'qr-1', code: 'MOCK-QR-001', campaignId: 'camp-1', scans: 45, generatedAt: now },
  { id: 'qr-2', code: 'MOCK-QR-002', campaignId: 'camp-2', scans: 23, generatedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

const mockEvents = [
  { id: 'evt-1', name: 'Summer Launch Party', description: 'Celebrate our new collection', date: new Date(Date.now() + 86400000 * 14).toISOString(), location: 'Main Store', capacity: 100, registered: 45, status: 'Upcoming' },
  { id: 'evt-2', name: 'VIP Shopping Night', description: 'Exclusive after-hours shopping', date: new Date(Date.now() + 86400000 * 7).toISOString(), location: 'Main Store', capacity: 30, registered: 22, status: 'Upcoming' },
];

const mockRotators = [
  { id: 'rot-1', name: 'Main Display', location: 'Store Front', status: 'Active', items: ['Product A', 'Product B', 'Product C'], interval: 30 },
  { id: 'rot-2', name: 'Side Window', location: 'Side Display', status: 'Inactive', items: ['Product D', 'Product E'], interval: 15 },
];

const mockAutomations = [
  { id: 'auto-1', name: 'Welcome Series', trigger: 'New Customer', actions: ['Send welcome email', 'Award 50 points'], isActive: true },
  { id: 'auto-2', name: 'Birthday Bonus', trigger: 'Customer Birthday', actions: ['Send birthday voucher', 'Award 100 points'], isActive: true },
];

const mockInterestSignals = [
  { id: 'sig-1', customerName: 'Alice Johnson', signal: 'Viewed rewards page', strength: 75, timestamp: now },
  { id: 'sig-2', customerName: 'Charlie Brown', signal: 'Clicked campaign email', strength: 60, timestamp: new Date(Date.now() - 3600000).toISOString() },
];

const mockLocalMall = {
  highStreet: { name: 'Oxford Street', description: 'Premier shopping destination', rank: 1, totalBusinesses: 45, footfall: 15000 },
  map: { center: { lat: 51.514, lng: -0.144 }, businesses: mockLocations.map(l => ({ id: l.id, name: l.name, lat: l.latitude, lng: l.longitude })) },
  visibility: { score: 72, rank: 15, totalInArea: 45, boosts: [{ id: 'boost-1', type: 'Featured', until: new Date(Date.now() + 86400000 * 7).toISOString() }] },
  community: { groups: [{ id: 'group-1', name: 'Retail Collective', members: 12, isJoined: false }] },
  clusters: [{ id: 'cluster-1', name: 'Fashion District', businesses: 8, description: 'Fashion and apparel stores' }],
  expo: { current: { id: 'expo-1', name: 'Summer Expo 2024', date: new Date(Date.now() + 86400000 * 45).toISOString(), booths: [{ id: 'booth-1', name: 'Booth A-12', price: 299, isAvailable: true }] } },
  hub: { title: 'Local Mall Hub', announcements: [{ id: 'ann-1', title: 'New partnership program launched', body: 'Collaborate with nearby businesses', createdAt: now }] },
};

const r = (data: any) => ({ success: true as const, data });

const handlers: Record<string, Record<string, MockHandler>> = {
  GET: {
    '/users/me': () => r(mockUser),
    '/auth/refresh': () => r({ user: mockUser, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' }),

    '/business/profile': () => r(mockBusiness),
    '/business/settings': () => r(mockBusiness.settings),
    '/business/billing': () => r(mockBilling),
    '/business/locations': () => r(mockLocations),
    '/business/staff': () => r(mockStaff),
    '/business/customers': () => r(mockCustomers),
    '/business/campaigns': () => r(mockCampaigns),
    '/business/rewards': () => r(mockRewards),
    '/business/redemptions': () => r(mockRedemptions),
    '/business/game': () => r(mockGame),
    '/business/analytics': () => r(mockAnalytics),

    '/business/local-mall/high-street': () => r(mockLocalMall.highStreet),
    '/business/local-mall/map': () => r(mockLocalMall.map),
    '/business/local-mall/partnerships': () => r(mockPartnerships),
    '/business/local-mall/share-campaigns': () => r(mockCampaigns),
    '/business/local-mall/visibility': () => r(mockLocalMall.visibility),
    '/business/local-mall/community': () => r(mockLocalMall.community),
    '/business/local-mall/clusters': () => r(mockLocalMall.clusters),
    '/business/local-mall/expo': () => r(mockLocalMall.expo),
    '/business/local-mall/hub': () => r(mockLocalMall.hub),
    '/business/local-mall/notifications': () => r(mockNotifications),

    '/customer/dashboard': () => r(mockCustomerDashboard),
    '/customer/campaigns': () => r(mockCampaigns),
    '/customer/discover': () => r(mockDiscover),
    '/customer/games/eligibility': () => r({ eligible: true, dailyPlaysRemaining: 2, nextPlayAvailableAt: null }),
    '/customer/activity': () => r(mockCustomerDashboard.recentActivity),
    '/customer/notifications': () => r(mockNotifications),
    '/customer/leaderboard': () => r(mockLeaderboard),
    '/customer/leaderboard/achievements': () => r(mockAchievements),
    '/customer/rewards': () => r(mockRewards),
    '/customer/rewards/history': () => r(mockRedemptions),
    '/customer/referrals': () => r(mockReferrals),

    '/admin/dashboard': () => r(mockAdminDashboard),
    '/admin/businesses': () => r(mockAdminBusinesses),
    '/admin/customers': () => r(mockCustomers),
    '/admin/campaigns': () => r(mockCampaigns),
    '/admin/analytics': () => r(mockAnalytics),
    '/admin/games': () => r([mockGame]),
    '/admin/rewards': () => r(mockRewards),
    '/admin/redemptions': () => r(mockRedemptions),
    '/admin/partners': () => r(mockPartnerships),
    '/admin/settings': () => r({ maintenanceMode: false, requireVerification: true, defaultPlan: 'Free', supportEmail: 'support@mcomspin.com' }),

    '/dashboard/summary': () => r({ ...mockAnalytics.overview, recentActivity: mockCustomerDashboard.recentActivity }),
    '/dashboard/sales/summary': () => r(mockAnalytics.overview),
    '/dashboard/sales/promotions': () => r(mockPromotions),
    '/dashboard/sales/vouchers': () => r(mockVouchers),
    '/dashboard/sales/qr': () => r(mockQRCodes),
    '/dashboard/sales/events': () => r(mockEvents),
    '/dashboard/sales/rotators': () => r(mockRotators),
    '/dashboard/sales/gamification': () => r(mockGame),
    '/dashboard/sales/activation': () => r({ isActive: true, registeredBusinesses: 3, totalActivations: 45 }),
    '/dashboard/sales/analytics': () => r(mockAnalytics),
    '/dashboard/sales/automations': () => r(mockAutomations),
    '/dashboard/sales/interest': () => r(mockInterestSignals),
    '/dashboard/sales/live': () => r({ visitors: 12, activeSessions: 5, recentActions: mockInterestSignals }),
  },
  POST: {
    '/auth/login': () => r({ user: mockUser, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' }),
    '/auth/register': () => r({ user: mockUser, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' }),
    '/auth/business/register': () => r({ user: mockUser, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' }),
    '/auth/customer/register': () => r({ user: { ...mockUser, role: 'Customer' }, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' }),
    '/auth/customer/login': () => r({ user: { ...mockUser, role: 'Customer' }, accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' }),
    '/auth/customer/forgot-password': () => r({ message: 'Password reset email sent' }),
    '/auth/customer/reset-password': () => r({ message: 'Password has been reset' }),
    '/auth/logout': () => r({ message: 'Logged out successfully' }),

    '/business/locations': () => r(mockLocations[0]),
    '/business/staff': () => r(mockStaff[0]),
    '/business/campaigns': () => r(mockCampaigns[0]),
    '/business/rewards': () => r(mockRewards[0]),
    '/business/notifications/send': () => r({ sent: true, recipients: 150 }),

    '/business/billing/purchase/initiate': (body?: { provider?: string }) =>
      body?.provider === 'paypal'
        ? r({ orderId: 'MOCK-PAYPAL-ORDER', approvalUrl: 'https://mock-paypal.com/checkout?token=MOCK-PAYPAL-ORDER' })
        : r({ clientSecret: 'pi_mock_secret_xxxxxxxx', type: 'payment' }),
    '/business/billing/purchase/confirm': () =>
      r({ packageName: 'Spin Growth', status: 'active', subscription: mockBilling.subscription }),
    '/business/billing/purchase/capture': () =>
      r({ packageName: 'Spin Growth', status: 'active', subscription: mockBilling.subscription }),

    '/business/local-mall/partnerships/request': () => r({ id: 'part-new', status: 'Pending' }),
    '/business/local-mall/share-campaigns': () => r({ shared: true }),
    '/business/local-mall/visibility/boost': () => r({ boosted: true, until: new Date(Date.now() + 86400000 * 7).toISOString() }),
    '/business/local-mall/community/activate': () => r({ activated: true }),
    '/business/local-mall/clusters/join': () => r({ joined: true }),
    '/business/local-mall/expo/booth': () => r({ id: 'booth-new', name: 'Booth A-12', price: 299, isAvailable: false }),

    '/customer/games/play': () => r({ sessionId: 'game-session-1', boxes: [10, 20, 30, 50, 10, 5, 100, 2], multipliers: [2, 3, 5, 10, 2, 1.5, 20, 1] }),
    '/customer/games/drop': () => r({ result: { boxIndex: 3, multiplier: 10, won: 500 }, remainingPlays: 1 }),
    '/customer/games/claim': () => r({ claimed: true, reward: mockRewards[0] }),
    '/customer/rewards/redeem': () => r({ redemptionId: 'red-new', status: 'Pending' }),
    '/customer/referrals': () => r({ code: 'USER2024', url: 'https://mcomspin.com/ref/USER2024' }),
    '/customer/businesses': () => r({ followed: true }),

    '/admin/campaigns': () => r(mockCampaigns[0]),
    '/admin/rewards': () => r(mockRewards[0]),
    '/admin/partners': () => r(mockPartnerships[0]),

    '/dashboard/sales/promotions': () => r(mockPromotions[0]),
    '/dashboard/sales/vouchers': () => r(mockVouchers[0]),
    '/dashboard/sales/qr/generate': () => r({ code: 'MOCK-QR-NEW', url: 'https://mcomspin.com/q/MOCK-QR-NEW' }),
    '/dashboard/sales/events': () => r(mockEvents[0]),
    '/dashboard/sales/rotators': () => r(mockRotators[0]),
    '/dashboard/sales/gamification': () => r(mockGame),
    '/dashboard/sales/activation/register': () => r({ registered: true, id: 'activation-new' }),
    '/dashboard/sales/automations': () => r(mockAutomations[0]),
    '/dashboard/sales/notifications': () => r({ sent: true }),

    '/uploads': () => r({ url: 'https://mock-cloudinary.com/uploads/mock-file.jpg', publicId: 'mock-file' }),
    '/dashboard/sales/ai/suggest': () => r({ suggestions: ['Run a weekend flash sale', 'Offer bundle discounts', 'Launch referral program'] }),
  },
  PUT: {
    '/business/profile': () => r(mockBusiness),
    '/business/settings': () => r(mockBusiness.settings),
    '/business/game': () => r(mockGame),

    '/business/local-mall/visibility': () => r(mockLocalMall.visibility),

    '/customer/profile': () => r(mockUser),
    '/customer/settings': () => r({ notifications: { email: true, push: true, sms: false } }),

    '/admin/settings': () => r({ updated: true }),
  },
};

function matchPattern(path: string, method: string, body?: any): { success: true; data: any } | null {
  const methodHandlers = handlers[method];
  if (!methodHandlers) return null;

  const exactMatch = methodHandlers[path];
  if (exactMatch) return exactMatch(body);

  for (const [pattern, handler] of Object.entries(methodHandlers)) {
    if (pattern.includes(':id')) {
      const regexStr = '^' + pattern.replace(/:id/g, '[^/]+') + '$';
      const regex = new RegExp(regexStr);
      if (regex.test(path)) return handler(body);
    }
  }

  return null;
}

export function handleMockRequest(method: string, url: string, data?: any): { success: true; data: any } {
  const apiBase = '/api/v1';

  let path = url;

  try {
    path = new URL(path, 'http://localhost').pathname;
  } catch {
  }

  if (path.startsWith(apiBase)) {
    path = path.slice(apiBase.length);
  }

  if (path.endsWith('/follow')) {
    return r({ followed: true });
  }

  const match = matchPattern(path, method, data);
  if (match) return match;

  if (method === 'GET') return r({});
  if (method === 'POST') return r({ success: true, id: 'mock-id' });
  if (method === 'PUT') return r({ updated: true });
  if (method === 'DELETE') return r({ deleted: true });

  return r({ success: true });
}

export function getMockToken(): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: 'mock-user-1',
    email: 'business@test.com',
    roles: ['BusinessOwner'],
    exp: Math.floor(Date.now() / 1000) + 86400 * 365,
    iat: Math.floor(Date.now() / 1000),
    jti: 'mock-jti',
  };
  const encode = (o: object) => btoa(JSON.stringify(o)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${encode(header)}.${encode(payload)}.mock-signature`;
}
