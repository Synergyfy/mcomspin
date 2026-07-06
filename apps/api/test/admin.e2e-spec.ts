import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '../src/common/pipes/validation.pipe';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { mockPrisma, mockCampaign, mockUser } from './mocks';

describe('Admin Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: typeof mockPrisma;
  let jwtService: JwtService;
  let configService: ConfigService;
  let superAdminToken: string;
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

    superAdminToken = jwtService.sign(
      { sub: 'admin-1', email: 'admin@test.com', roles: ['SuperAdmin'], permissions: ['*'] },
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

  describe('GET /api/v1/admin/dashboard', () => {
    it('should return dashboard KPIs for SuperAdmin', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'admin-1', email: 'admin@test.com',
        roles: [{ role: { name: 'SuperAdmin', permissions: [{ resource: '*', action: '*' }] } }],
      });
      mockPrisma.business.count.mockResolvedValue(15);
      mockPrisma.user.count.mockResolvedValue(1000);
      mockPrisma.campaign.count.mockResolvedValue(30);
      mockPrisma.gameSession.count.mockResolvedValue(5000);
      mockPrisma.customerReward.count.mockResolvedValue(800);
      mockPrisma.rewardRedemption.count.mockResolvedValue(400);

      return request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.totalBusinesses).toBe(15);
          expect(res.body.data.redemptionRate).toBe(50);
        });
    });

    it('should return 403 for non-SuperAdmin', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'cust-1', email: 'customer@test.com',
        roles: [{ role: { name: 'Customer', permissions: [] } }],
      });

      return request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/dashboard')
        .expect(401);
    });
  });

  describe('GET /api/v1/admin/campaigns', () => {
    it('should return paginated campaigns', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'admin-1', email: 'admin@test.com',
        roles: [{ role: { name: 'SuperAdmin', permissions: [{ resource: '*', action: '*' }] } }],
      });
      mockPrisma.campaign.findMany.mockResolvedValue([mockCampaign]);
      mockPrisma.campaign.count.mockResolvedValue(1);

      return request(app.getHttpServer())
        .get('/api/v1/admin/campaigns')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toBeDefined();
          expect(res.body.meta.total).toBe(1);
        });
    });
  });

  describe('POST /api/v1/admin/campaigns', () => {
    it('should create a campaign', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'admin-1', email: 'admin@test.com',
        roles: [{ role: { name: 'SuperAdmin', permissions: [{ resource: '*', action: '*' }] } }],
      });
      mockPrisma.campaign.create.mockResolvedValue(mockCampaign);

      return request(app.getHttpServer())
        .post('/api/v1/admin/campaigns')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          name: 'Test Campaign',
          type: 'Seasonal',
          status: 'Draft',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000).toISOString(),
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.name).toBe('Test Campaign');
        });
    });
  });

  describe('PUT /api/v1/admin/businesses/:id', () => {
    it('should suspend a business', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'admin-1', email: 'admin@test.com',
        roles: [{ role: { name: 'SuperAdmin', permissions: [{ resource: '*', action: '*' }] } }],
      });
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-1', name: 'Test Biz' });
      mockPrisma.business.update.mockResolvedValue({ id: 'biz-1', isActive: false });

      return request(app.getHttpServer())
        .put('/api/v1/admin/businesses/biz-1')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ action: 'suspend' })
        .expect(200);
    });
  });

  describe('GET /api/v1/admin/analytics', () => {
    it('should return analytics data', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, id: 'admin-1', email: 'admin@test.com',
        roles: [{ role: { name: 'SuperAdmin', permissions: [{ resource: '*', action: '*' }] } }],
      });
      mockPrisma.gameSession.count.mockResolvedValue(100);
      mockPrisma.gameSession.groupBy.mockResolvedValue([{ customerId: 'c1' }, { customerId: 'c2' }]);
      mockPrisma.customerReward.count.mockResolvedValue(50);
      mockPrisma.rewardRedemption.count.mockResolvedValue(25);
      mockPrisma.business.count.mockResolvedValue(10);
      mockPrisma.campaign.count.mockResolvedValue(3);
      mockPrisma.business.findMany.mockResolvedValue([]);
      mockPrisma.campaign.findMany.mockResolvedValue([]);
      mockPrisma.reward.findMany.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.cards.totalPlays).toBe(100);
        });
    });
  });
});
