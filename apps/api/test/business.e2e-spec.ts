import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '../src/common/pipes/validation.pipe';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { mockPrisma, mockUser, mockBusiness } from './mocks';

jest.mock('bcryptjs');

describe('Business Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: typeof mockPrisma;
  let jwtService: JwtService;
  let configService: ConfigService;
  let bizOwnerToken: string;
  let customerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor());
    await app.init();

    prisma = moduleFixture.get(PrismaService);
    jwtService = moduleFixture.get(JwtService);
    configService = moduleFixture.get(ConfigService);

    bizOwnerToken = jwtService.sign(
      { sub: 'biz-owner-1', email: 'owner@test.com', roles: ['BusinessOwner'], permissions: [] },
      { secret: configService.get('JWT_ACCESS_SECRET'), expiresIn: '15m' },
    );

    customerToken = jwtService.sign(
      { sub: 'cust-1', email: 'customer@test.com', roles: ['Customer'], permissions: [] },
      { secret: configService.get('JWT_ACCESS_SECRET'), expiresIn: '15m' },
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/business/register', () => {
    it('should register a business account', () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      mockPrisma.user.create.mockResolvedValue({ id: 'new-user', email: 'newbiz@test.com' });
      mockPrisma.business.create.mockResolvedValue({ id: 'new-biz', name: 'New Biz' });
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        id: 'new-user',
        email: 'newbiz@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });

      return request(app.getHttpServer())
        .post('/api/v1/auth/business/register')
        .send({
          businessName: 'New Biz',
          contactName: 'John',
          email: 'newbiz@test.com',
          password: 'password123',
          businessType: 'Restaurant',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data.business.name).toBe('New Biz');
        });
    });

    it('should return 409 if email exists', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      return request(app.getHttpServer())
        .post('/api/v1/auth/business/register')
        .send({
          businessName: 'Duplicate',
          contactName: 'John',
          email: 'test@test.com',
          password: 'password123',
          businessType: 'Retail',
        })
        .expect(409);
    });
  });

  describe('GET /api/v1/dashboard/summary', () => {
    it('should return dashboard summary for business owner', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.campaign.count.mockResolvedValue(3);
      mockPrisma.customerReward.count.mockResolvedValue(50);
      mockPrisma.rewardRedemption.count.mockResolvedValue(20);
      mockPrisma.gameSession.count.mockResolvedValue(200);
      mockPrisma.gameSession.groupBy.mockResolvedValue([{ customerId: 'c1' }, { customerId: 'c2' }]);
      mockPrisma.gameSession.findMany.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.activeCampaigns).toBe(3);
          expect(res.body.data.totalPlays).toBe(200);
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/dashboard/summary')
        .expect(401);
    });
  });

  describe('GET /api/v1/business/profile', () => {
    it('should return business profile', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);

      return request(app.getHttpServer())
        .get('/api/v1/business/profile')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.name).toBe('Test Business');
        });
    });
  });

  describe('PUT /api/v1/business/redemptions/:id/approve', () => {
    it('should approve a redemption', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.customerReward.findUnique.mockResolvedValue({
        id: 'cr-1',
        usedAt: null,
        reward: { inventories: [{ businessId: 'biz-1' }] },
      });
      mockPrisma.customerReward.update.mockResolvedValue({ id: 'cr-1', usedAt: new Date() });

      return request(app.getHttpServer())
        .put('/api/v1/business/redemptions/cr-1/approve')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .expect(200);
    });
  });

  // ── Doc 7: Local Mall e2e tests ──

  describe('GET /api/v1/business/local-mall/high-street', () => {
    it('should return high street overview', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValueOnce(mockBusiness);
      mockPrisma.business.findFirst.mockResolvedValueOnce({
        ...mockBusiness,
        businessLocations: [{ highStreet: { id: 'hs-1', name: 'Main St', borough: { id: 'b-1', name: 'Central' } } }],
      });
      mockPrisma.business.findMany.mockResolvedValue([]);
      mockPrisma.campaign.findMany.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/api/v1/business/local-mall/high-street')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.highStreet.name).toBe('Main St');
        });
    });
  });

  describe('POST /api/v1/business/local-mall/partnerships/request', () => {
    it('should send a partnership request', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-2', name: 'Target' });
      mockPrisma.business.findUnique.mockResolvedValue({
        id: 'biz-1', name: 'Test Business',
        owner: { firstName: 'Test', lastName: 'User', email: 'owner@test.com' },
      });
      mockPrisma.partnershipRequest.findFirst.mockResolvedValue(null);
      mockPrisma.partnership.findFirst.mockResolvedValue(null);
      mockPrisma.partnershipRequest.create.mockResolvedValue({ id: 'pr-1', status: 'pending' });

      return request(app.getHttpServer())
        .post('/api/v1/business/local-mall/partnerships/request')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({ targetBusinessId: 'biz-2', partnershipType: 'cross-promotion', message: 'Hi' })
        .expect(201);
    });

    it('should reject self-request', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);

      return request(app.getHttpServer())
        .post('/api/v1/business/local-mall/partnerships/request')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({ targetBusinessId: 'biz-1', partnershipType: 'cross-promotion' })
        .expect(400);
    });
  });

  describe('PUT /api/v1/business/local-mall/visibility', () => {
    it('should update visibility', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.visibilityScore.upsert.mockResolvedValue({ businessId: 'biz-1', overall: 75 });
      mockPrisma.storefront.updateMany.mockResolvedValue({ count: 1 });

      return request(app.getHttpServer())
        .put('/api/v1/business/local-mall/visibility')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({ featured: true })
        .expect(200);
    });
  });

  describe('POST /api/v1/business/local-mall/visibility/boost', () => {
    it('should create a visibility boost', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.visibilityBoost.create.mockResolvedValue({ id: 'vb-1', type: 'borough_boost', isActive: true });

      return request(app.getHttpServer())
        .post('/api/v1/business/local-mall/visibility/boost')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({ boostType: 'borough_boost', duration: '7d' })
        .expect(201);
    });
  });

  // ── Doc 8: Sales & Promotions e2e tests ──

  describe('GET /api/v1/dashboard/sales/summary', () => {
    it('should return sales KPIs', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.promotion.count.mockResolvedValue(3);
      mockPrisma.event.count.mockResolvedValue(2);
      mockPrisma.campaign.count.mockResolvedValue(1);
      mockPrisma.promotionRedemption.count.mockResolvedValue(10);
      mockPrisma.gameSession.count.mockResolvedValue(50);
      mockPrisma.qLink.count.mockResolvedValue(4);
      mockPrisma.voucher.count.mockResolvedValue(6);

      return request(app.getHttpServer())
        .get('/api/v1/dashboard/sales/summary')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.activePromotions).toBe(3);
          expect(res.body.data.totalPlays).toBe(50);
        });
    });
  });

  describe('POST /api/v1/dashboard/sales/promotions', () => {
    it('should create a promotion', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.promotion.create.mockResolvedValue({ id: 'promo-1', name: 'Test Promo', status: 'Draft' });

      return request(app.getHttpServer())
        .post('/api/v1/dashboard/sales/promotions')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({
          name: 'Test Promo',
          type: 'FlashDeal',
          startDate: '2026-07-01',
          endDate: '2026-07-15',
          isFeatured: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.name).toBe('Test Promo');
        });
    });
  });

  describe('POST /api/v1/dashboard/sales/events', () => {
    it('should create an event', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.event.create.mockResolvedValue({ id: 'evt-1', name: 'Grand Opening', status: 'Draft' });

      return request(app.getHttpServer())
        .post('/api/v1/dashboard/sales/events')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({
          name: 'Grand Opening',
          type: 'Launch',
          startDate: '2026-08-01T10:00:00Z',
          endDate: '2026-08-01T18:00:00Z',
        })
        .expect(201);
    });
  });

  describe('POST /api/v1/dashboard/sales/events/:id/check-in', () => {
    it('should check in a registration', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.event.findFirst.mockResolvedValue({ id: 'evt-1', organizerId: 'biz-1', organizerType: 'business' });
      mockPrisma.eventRegistration.findUnique.mockResolvedValue({ id: 'reg-1', customerId: 'cust-1' });
      mockPrisma.eventCheckIn.findUnique.mockResolvedValue(null);
      mockPrisma.eventCheckIn.create.mockResolvedValue({ id: 'ci-1' });

      return request(app.getHttpServer())
        .post('/api/v1/dashboard/sales/events/evt-1/check-in')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({ registrationId: 'reg-1' })
        .expect(201);
    });
  });

  describe('POST /api/v1/dashboard/sales/gamification', () => {
    it('should create a game config', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.game.findFirst.mockResolvedValue({ id: 'g-1', name: 'Spin Wheel', type: 'SpinWheel' });
      mockPrisma.gameConfig.create.mockResolvedValue({ id: 'gc-1', game: { id: 'g-1' } });

      return request(app.getHttpServer())
        .post('/api/v1/dashboard/sales/gamification')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({ gameType: 'SpinWheel', name: 'Summer Spin' })
        .expect(201);
    });
  });

  describe('POST /api/v1/dashboard/sales/qr/generate', () => {
    it('should generate a QR code', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.qLink.create.mockResolvedValue({ id: 'qr-1', code: 'QR-ABC', isActive: true });

      return request(app.getHttpServer())
        .post('/api/v1/dashboard/sales/qr/generate')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({ type: 'Storefront', label: 'Store QR' })
        .expect(201);
    });
  });

  describe('GET /api/v1/dashboard/sales/analytics', () => {
    it('should return analytics', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.analyticsEvent.count.mockResolvedValue(50);
      mockPrisma.eventRegistration.count.mockResolvedValue(10);
      mockPrisma.qLinkScan.count.mockResolvedValue(25);
      mockPrisma.voucher.count.mockResolvedValue(5);
      mockPrisma.analyticsAggregation.findMany.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/api/v1/dashboard/sales/analytics')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.metrics.promotionViews).toBe(50);
        });
    });
  });

  describe('POST /api/v1/dashboard/sales/ai/suggest', () => {
    it('should return AI suggestions', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);

      return request(app.getHttpServer())
        .post('/api/v1/dashboard/sales/ai/suggest')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({ category: 'Restaurant' })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.suggestions.length).toBeGreaterThanOrEqual(5);
        });
    });
  });

  describe('GET /api/v1/dashboard/sales/interest', () => {
    it('should return interest signals', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.interestSignal.groupBy.mockResolvedValue([
        { signalType: 'view', _count: { id: 10 } },
      ]);
      mockPrisma.interestSignal.findMany.mockResolvedValue([
        { id: 'sig-1', signalType: 'view', business: { id: 'b-1', name: 'Biz' } },
      ]);

      return request(app.getHttpServer())
        .get('/api/v1/dashboard/sales/interest')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.signals).toHaveLength(1);
        });
    });
  });

  describe('GET /api/v1/dashboard/sales/live', () => {
    it('should return live monitoring data', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.promotion.count.mockResolvedValue(3);
      mockPrisma.event.count.mockResolvedValue(1);
      mockPrisma.promotionRedemption.findMany.mockResolvedValue([]);
      mockPrisma.qLinkScan.findMany.mockResolvedValue([]);
      mockPrisma.businessActivation.findMany.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/api/v1/dashboard/sales/live')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.liveMetrics.activePromotions).toBe(3);
        });
    });
  });

  describe('POST /api/v1/dashboard/sales/notifications', () => {
    it('should send a sales notification', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'biz-owner-1', email: 'owner@test.com',
        roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
      });
      mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
      mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);
      mockPrisma.notification.create.mockResolvedValue({
        id: 'notif-1', title: 'Flash Sale', body: '50% off today!', type: 'Promotional',
      });

      return request(app.getHttpServer())
        .post('/api/v1/dashboard/sales/notifications')
        .set('Authorization', `Bearer ${bizOwnerToken}`)
        .send({ title: 'Flash Sale', message: '50% off today!', channels: ['Push'] })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.title).toBe('Flash Sale');
        });
    });
  });
});
