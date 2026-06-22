import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockPrisma, mockJwtService, mockConfigService, mockUser } from '../../../test/mocks';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto = { email: 'new@test.com', password: 'password123', firstName: 'New', lastName: 'User' };

    it('should register a new user and return tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockPrisma.user.create.mockResolvedValue({ id: 'new-id', email: dto.email });
      mockPrisma.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(mockUser);

      const result = await service.register(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ email: dto.email }),
        }),
      );
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const dto = { email: 'test@test.com', password: 'password123' };

    it('should login and return tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should rotate tokens on valid refresh', async () => {
      mockPrisma.session.findUnique.mockResolvedValue({
        id: 'session-1',
        refreshToken: 'refresh-id',
        isRevoked: false,
        expiresAt: new Date(Date.now() + 86400000),
      });
      mockPrisma.session.update.mockResolvedValue({});
      mockJwtService.verify.mockReturnValue({ sub: 'user-1', email: 'test@test.com', jti: 'refresh-id' });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.refresh('valid-token');

      expect(result).toHaveProperty('accessToken');
      expect(mockPrisma.session.update).toHaveBeenCalled();
    });

    it('should throw on revoked token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'user-1', email: 'test@test.com', jti: 'refresh-id' });
      mockPrisma.session.findUnique.mockResolvedValue({ isRevoked: true });

      await expect(service.refresh('revoked-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should revoke specific session', async () => {
      mockPrisma.session.updateMany.mockResolvedValue({ count: 1 });
      await service.logout('user-1', 'refresh-token');
      expect(mockPrisma.session.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { refreshToken: 'refresh-token', userId: 'user-1' } }),
      );
    });

    it('should revoke all sessions when no token provided', async () => {
      mockPrisma.session.updateMany.mockResolvedValue({ count: 3 });
      await service.logout('user-1');
      expect(mockPrisma.session.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1', isRevoked: false } }),
      );
    });
  });
});
