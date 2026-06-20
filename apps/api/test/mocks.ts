const jestFn = () => jest.fn();

function createMockPrisma() {
  const obj: { [key: string]: any } = {
    $transaction: jest.fn((cbOrOps: any) => {
      if (typeof cbOrOps === 'function') return cbOrOps(obj);
      return Promise.resolve(cbOrOps);
    }),
  };
  return obj;
}

const _mockPrisma = createMockPrisma();

Object.assign(_mockPrisma, {
  user: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    delete: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
    updateMany: jestFn(),
  },
  session: {
    findUnique: jestFn(),
    create: jestFn(),
    update: jestFn(),
    updateMany: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  role: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  business: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    delete: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  businessVerification: {
    findUnique: jestFn(),
    upsert: jestFn(),
    create: jestFn(),
    update: jestFn(),
    count: jestFn(),
  },
  businessStaff: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    delete: jestFn(),
    findMany: jestFn(),
  },
  campaign: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  campaignBusiness: {
    create: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  reward: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  rewardInventory: {
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  rewardRedemption: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  customerReward: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
    groupBy: jestFn(),
    aggregate: jestFn(),
  },
  game: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    update: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
    create: jestFn(),
  },
  gameConfig: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  gameSession: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
    groupBy: jestFn(),
  },
  gameCampaign: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    count: jestFn(),
  },
  subscription: {
    findFirst: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  invoice: {
    findMany: jestFn(),
    count: jestFn(),
  },
  notification: {
    create: jestFn(),
    createMany: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
    updateMany: jestFn(),
  },
  notificationPreference: {
    upsert: jestFn(),
    findMany: jestFn(),
    findUnique: jestFn(),
  },
  customerActivityLog: {
    create: jestFn(),
    findMany: jestFn(),
    count: jestFn(),
  },
  interestSignal: {
    findFirst: jestFn(),
    create: jestFn(),
    delete: jestFn(),
    findMany: jestFn(),
    groupBy: jestFn(),
  },
  location: {
    findMany: jestFn(),
    count: jestFn(),
  },
  businessLocation: {
    findUnique: jestFn(),
    findFirst: jestFn(),
    create: jestFn(),
    update: jestFn(),
    findMany: jestFn(),
  },
  storefront: { findFirst: jestFn(), findMany: jestFn(), update: jestFn(), updateMany: jestFn() },
  storefrontCluster: { findMany: jestFn(), findUnique: jestFn(), update: jestFn() },
  storefrontScore: { findUnique: jestFn(), findFirst: jestFn(), upsert: jestFn() },
  highStreet: { findMany: jestFn(), findUnique: jestFn(), findFirst: jestFn() },
  borough: { findMany: jestFn(), findUnique: jestFn(), findFirst: jestFn() },
  loyaltyProgram: { findFirst: jestFn(), findMany: jestFn() },
  loyaltyMembership: { findFirst: jestFn(), findMany: jestFn(), create: jestFn() },
  pointsTransaction: { create: jestFn(), findMany: jestFn(), aggregate: jestFn() },
  voucher: { findUnique: jestFn(), create: jestFn(), findMany: jestFn(), count: jestFn(), update: jestFn() },
  event: { findMany: jestFn(), count: jestFn(), findUnique: jestFn(), findFirst: jestFn(), create: jestFn(), update: jestFn() },
  eventRegistration: { findMany: jestFn(), count: jestFn(), create: jestFn(), findUnique: jestFn() },
  eventCheckIn: { findMany: jestFn(), count: jestFn(), create: jestFn(), findUnique: jestFn() },
  partnership: { findMany: jestFn(), count: jestFn(), create: jestFn(), findUnique: jestFn(), findFirst: jestFn(), update: jestFn(), delete: jestFn() },
  partnershipRequest: { findMany: jestFn(), count: jestFn(), create: jestFn(), findUnique: jestFn(), findFirst: jestFn(), update: jestFn() },
  sharedCampaign: { findMany: jestFn(), count: jestFn(), create: jestFn(), findUnique: jestFn() },
  sharedAudience: { findMany: jestFn(), create: jestFn() },
  audit: { create: jestFn(), findMany: jestFn() },
  analyticsEvent: { create: jestFn(), findMany: jestFn(), count: jestFn() },
  analyticsAggregation: { findMany: jestFn(), create: jestFn(), upsert: jestFn() },
  promotion: { findMany: jestFn(), count: jestFn(), findUnique: jestFn(), findFirst: jestFn(), create: jestFn(), update: jestFn() },
  promotionRedemption: { findMany: jestFn(), count: jestFn(), create: jestFn() },
  rotator: { findMany: jestFn(), count: jestFn(), findUnique: jestFn(), create: jestFn(), update: jestFn() },
  rotatorItem: { findMany: jestFn(), create: jestFn(), createMany: jestFn(), deleteMany: jestFn() },
  visibilityScore: { findUnique: jestFn(), findFirst: jestFn(), upsert: jestFn() },
  visibilityBoost: { findMany: jestFn(), count: jestFn(), create: jestFn(), findUnique: jestFn() },
  expo: { findMany: jestFn(), count: jestFn(), findUnique: jestFn(), findFirst: jestFn() },
  expoBooth: { findMany: jestFn(), count: jestFn(), findUnique: jestFn(), create: jestFn(), update: jestFn() },
  expoParticipation: { findMany: jestFn(), create: jestFn(), findUnique: jestFn() },
  businessActivation: { findMany: jestFn(), count: jestFn(), findUnique: jestFn(), create: jestFn(), groupBy: jestFn() },
  activationReward: { findMany: jestFn(), findFirst: jestFn() },
  automationRule: { findMany: jestFn(), count: jestFn(), findUnique: jestFn(), findFirst: jestFn(), create: jestFn(), update: jestFn() },
  automationTrigger: { findMany: jestFn(), create: jestFn(), deleteMany: jestFn() },
  automationAction: { findMany: jestFn(), create: jestFn(), deleteMany: jestFn() },
  automationLog: { findMany: jestFn(), count: jestFn(), create: jestFn() },
  communityGroup: { findMany: jestFn(), findUnique: jestFn(), findFirst: jestFn() },
  qLink: { findMany: jestFn(), count: jestFn(), create: jestFn(), findUnique: jestFn(), findFirst: jestFn() },
  qLinkScan: { findMany: jestFn(), count: jestFn(), create: jestFn() },
  $connect: jestFn(),
  $disconnect: jestFn(),
  $queryRawUnsafe: jestFn(),
  $executeRawUnsafe: jestFn(),
});

export const mockPrisma: any = _mockPrisma;

export const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn().mockReturnValue({ sub: 'user-1', email: 'test@test.com', jti: 'refresh-id' }),
};

export const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: any) => {
    const config: Record<string, any> = {
      JWT_ACCESS_SECRET: 'test-access-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      UPLOAD_DIR: './test-uploads',
      CORS_ORIGIN: 'http://localhost:5004',
    };
    return config[key] ?? defaultValue;
  }),
};

export const mockUser = {
  id: 'user-1',
  email: 'test@test.com',
  passwordHash: '$2a$12$hashedpassword',
  firstName: 'Test',
  lastName: 'User',
  phone: '+1234567890',
  avatarUrl: null,
  isActive: true,
  createdAt: new Date(),
  roles: [{ role: { name: 'Customer', permissions: [] } }],
};

export const mockBusiness = {
  id: 'biz-1',
  ownerId: 'user-1',
  name: 'Test Business',
  slug: 'test-business',
  description: 'A test business',
  contactEmail: 'biz@test.com',
  contactPhone: '+1234567890',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCampaign = {
  id: 'camp-1',
  name: 'Test Campaign',
  description: 'A test campaign',
  type: 'Seasonal',
  status: 'Active',
  startDate: new Date(),
  endDate: new Date(Date.now() + 86400000),
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
