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
import { mockPrisma, mockUser, mockConfigService } from './mocks';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('Auth Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: typeof mockPrisma;
  let jwtService: JwtService;
  let configService: ConfigService;
  let validToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
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

    validToken = jwtService.sign(
      { sub: 'user-1', email: 'test@test.com', roles: ['Customer'], permissions: [] },
      { secret: configService.get('JWT_ACCESS_SECRET'), expiresIn: '15m' },
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ id: 'new-id', email: 'new@test.com' });

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'new@test.com', password: 'password123', firstName: 'New', lastName: 'User' })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
          expect(res.body.data.user.email).toBe('new@test.com');
        });
    });

    it('should return 409 if email exists', () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing', email: 'existing@test.com' });

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'existing@test.com', password: 'password123', firstName: 'Ex', lastName: 'User' })
        .expect(409)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('CONFLICT');
        });
    });

    it('should return 400 for invalid payload', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'not-an-email', password: '12' })
        .expect(400)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error.code).toBe('VALIDATION_ERROR');
        });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        passwordHash: 'hashed-password',
        isActive: true,
        roles: [{ role: { name: 'Customer', permissions: [] } }],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'test@test.com', password: 'password123' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data.user.email).toBe('test@test.com');
        });
    });

    it('should return 401 for invalid credentials', () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        passwordHash: 'hashed-password',
        isActive: true,
        roles: [{ role: { name: 'Customer', permissions: [] } }],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'test@test.com', password: 'wr0ng!' })
        .expect(401);
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .expect(401);
    });

    it('should return profile with valid token', () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.email).toBe('test@test.com');
        });
    });
  });
});
