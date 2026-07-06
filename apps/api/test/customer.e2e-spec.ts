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
import { mockPrisma, mockUser } from './mocks';

jest.mock('bcryptjs');

describe('Customer Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: typeof mockPrisma;
  let jwtService: JwtService;
  let configService: ConfigService;
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

    customerToken = jwtService.sign(
      { sub: 'cust-1', email: 'customer@test.com', roles: ['Customer'], permissions: [] },
      { secret: configService.get('JWT_ACCESS_SECRET'), expiresIn: '15m' },
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation((cb: any) => cb(mockPrisma));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/customer/register', () => {
    it('should register a customer account', () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      mockPrisma.user.create.mockResolvedValue({ id: 'new-cust', email: 'new@test.com' });
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        ...mockUser, id: 'new-cust', email: 'new@test.com',
        roles: [{ role: { name: 'Customer' } }],
      });

      return request(app.getHttpServer())
        .post('/api/v1/auth/customer/register')
        .send({ firstName: 'Jane', lastName: 'Doe', email: 'new@test.com', password: 'pass1234' })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
        });
    });

    it('should return 409 if email exists', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      return request(app.getHttpServer())
        .post('/api/v1/auth/customer/register')
        .send({ firstName: 'Jane', lastName: 'Doe', email: 'test@test.com', password: 'pass1234' })
        .expect(409);
    });

    it('should return 400 on missing fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/customer/register')
        .send({ firstName: 'Jane' })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/customer/login', () => {
    it('should login and return tokens', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, roles: [{ role: { name: 'Customer' } }],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      return request(app.getHttpServer())
        .post('/api/v1/auth/customer/login')
        .send({ email: 'test@test.com', password: 'pass1234' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
        });
    });

    it('should return 401 with wrong password', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, roles: [{ role: { name: 'Customer' } }],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      return request(app.getHttpServer())
        .post('/api/v1/auth/customer/login')
        .send({ email: 'test@test.com', password: 'wrong' })
        .expect(401);
    });
  });

  describe('GET /api/v1/customer/dashboard', () => {
    it('should return customer dashboard', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.customerReward.count.mockResolvedValue(3);
      mockPrisma.gameSession.count.mockResolvedValueOnce(10).mockResolvedValueOnce(5);
      mockPrisma.campaign.findMany.mockResolvedValue([]);
      mockPrisma.reward.findMany.mockResolvedValue([]);
      mockPrisma.customerActivityLog.findMany.mockResolvedValue([]);
      mockPrisma.business.findMany.mockResolvedValue([]);
      mockPrisma.pointsTransaction.aggregate.mockResolvedValue({ _sum: { points: 500 } });

      return request(app.getHttpServer())
        .get('/api/v1/customer/dashboard')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.summary.activeRewards).toBe(3);
          expect(res.body.data.summary.totalPoints).toBe(500);
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/customer/dashboard')
        .expect(401);
    });
  });

  describe('GET /api/v1/customer/campaigns', () => {
    it('should return paginated campaigns', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.campaign.findMany.mockResolvedValue([{
        id: 'camp-1', name: 'Test Campaign',
        businesses: [], rewards: [], _count: { rewards: 2 },
      }]);
      mockPrisma.campaign.count.mockResolvedValue(1);

      return request(app.getHttpServer())
        .get('/api/v1/customer/campaigns')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveLength(1);
        });
    });
  });

  describe('GET /api/v1/customer/activity', () => {
    it('should return activity timeline', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.customerActivityLog.findMany.mockResolvedValue([{ id: 'a-1', activityType: 'Redeem', description: 'Test', createdAt: new Date().toISOString() }]);
      mockPrisma.customerActivityLog.count.mockResolvedValue(1);

      return request(app.getHttpServer())
        .get('/api/v1/customer/activity')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveLength(1);
        });
    });
  });

  describe('GET /api/v1/customer/rewards', () => {
    it('should return categorized rewards', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.customerReward.findMany.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/api/v1/customer/rewards')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('available');
          expect(res.body.data).toHaveProperty('redeemed');
          expect(res.body.data).toHaveProperty('expired');
        });
    });
  });

  describe('POST /api/v1/customer/rewards/redeem', () => {
    it('should redeem a reward', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.customerReward.findFirst.mockResolvedValue({
        id: 'cr-1', customerId: 'cust-1', rewardId: 'rw-1', usedAt: null, expiresAt: null,
        reward: { id: 'rw-1', name: 'Free Coffee', inventories: [{ businessId: 'biz-1', id: 'inv-1' }] },
      });

      return request(app.getHttpServer())
        .post('/api/v1/customer/rewards/redeem')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ rewardId: 'cr-1', method: 'code' })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('code');
        });
    });
  });

  describe('GET /api/v1/customer/notifications', () => {
    it('should return notification list', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.notification.findMany.mockResolvedValue([{ id: 'n-1', title: 'Welcome', isRead: false }]);
      mockPrisma.notification.count.mockResolvedValue(1);

      return request(app.getHttpServer())
        .get('/api/v1/customer/notifications')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveLength(1);
        });
    });
  });

  describe('PUT /api/v1/customer/notifications/:id', () => {
    it('should mark notification as read', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 });

      return request(app.getHttpServer())
        .put('/api/v1/customer/notifications/n-1')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.message).toBe('Notification marked as read');
        });
    });
  });
});
