import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { CustomerAuthService } from './customer-auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma, mockJwtService, mockConfigService, mockUser } from '../../../../test/mocks';

jest.mock('bcryptjs');

describe('CustomerAuthService', () => {
  let service: CustomerAuthService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerAuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CustomerAuthService>(CustomerAuthService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto = { firstName: 'Jane', lastName: 'Doe', email: 'jane@test.com', phone: '+1234567890', password: 'pass1234' };

    it('should register and return tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      mockPrisma.user.create.mockResolvedValue({ id: 'cust-1', email: dto.email });
      mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockUser, id: 'cust-1', email: dto.email, roles: [{ role: { name: 'Customer' } }] });

      const result = await service.register(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const dto = { email: 'jane@test.com', password: 'pass1234' };

    it('should login and return tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, roles: [{ role: { name: 'Customer' } }] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken');
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('should throw if password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, roles: [{ role: { name: 'Customer' } }] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw if user is not customer role', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, roles: [{ role: { name: 'BusinessOwner' } }] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login(dto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('forgotPassword', () => {
    it('should return success message', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.forgotPassword({ email: 'test@test.com' });
      expect(result).toHaveProperty('message');
    });

    it('should return same message even if email not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const result = await service.forgotPassword({ email: 'none@test.com' });
      expect(result).toHaveProperty('message');
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'user-1', type: 'password_reset' });
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed');
      mockPrisma.user.update.mockResolvedValue(mockUser);

      const result = await service.resetPassword({ token: 'valid-token', newPassword: 'newpass123' });
      expect(result.message).toBe('Password reset successfully');
    });

    it('should throw on invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error(); });
      await expect(service.resetPassword({ token: 'bad', newPassword: 'newpass123' })).rejects.toThrow(BadRequestException);
    });
  });
});
