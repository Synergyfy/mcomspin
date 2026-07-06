import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BusinessAuthService } from './business-auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma, mockJwtService, mockUser } from '../../../../test/mocks';

jest.mock('bcryptjs');

describe('BusinessAuthService', () => {
  let service: BusinessAuthService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessAuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<BusinessAuthService>(BusinessAuthService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto = {
      businessName: 'Test Biz',
      contactName: 'John',
      email: 'biz@test.com',
      phone: '+1234567890',
      password: 'password123',
      businessType: 'Restaurant' as any,
    };

    it('should register a business and return tokens', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          ...mockUser,
          id: 'user-2',
          email: dto.email,
          roles: [{ role: { name: 'BusinessOwner', permissions: [] } }],
        });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      mockPrisma.user.create.mockResolvedValue({ id: 'user-2', email: dto.email });
      mockPrisma.business.create.mockResolvedValue({ id: 'biz-2', name: dto.businessName });

      const result = await service.register(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('business');
      expect(result.business.name).toBe('Test Biz');
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockPrisma.business.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('verify', () => {
    it('should return verification message', async () => {
      const result = await service.verify({ code: '123456' });
      expect(result).toHaveProperty('message');
    });
  });
});
