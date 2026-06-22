import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { mockPrisma, mockJwtService, mockConfigService } from '../../../test/mocks';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register and set cookies', async () => {
      const result = { accessToken: 'at', refreshToken: 'rt', user: { id: '1', email: 'a@b.com', roles: [] } };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      const res = { cookie: jest.fn(), clearCookie: jest.fn() } as any;
      const output = await controller.register(
        { email: 'a@b.com', password: 'pass123', firstName: 'A', lastName: 'B' },
        res,
      );

      expect(output).toEqual(result);
      expect(res.cookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('login', () => {
    it('should login and set cookies', async () => {
      const result = { accessToken: 'at', refreshToken: 'rt', user: { id: '1', email: 'a@b.com', roles: [] } };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      const res = { cookie: jest.fn() } as any;
      const output = await controller.login({ email: 'a@b.com', password: 'pass123' }, res);

      expect(output).toEqual(result);
      expect(res.cookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const result = { accessToken: 'at2', refreshToken: 'rt2', user: { id: '1', email: 'a@b.com', roles: [] } };
      jest.spyOn(authService, 'refresh').mockResolvedValue(result);

      const res = { cookie: jest.fn() } as any;
      const output = await controller.refresh({ refreshToken: 'old-rt' }, res);

      expect(output).toEqual(result);
    });
  });

  describe('logout', () => {
    it('should clear cookies and call service', async () => {
      jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      const req = { cookies: { refreshToken: 'rt' } } as any;
      const res = { clearCookie: jest.fn() } as any;
      const output = await controller.logout('user-1', req, res);

      expect(output).toEqual({ message: 'Logged out successfully' });
      expect(res.clearCookie).toHaveBeenCalledTimes(2);
    });
  });
});
