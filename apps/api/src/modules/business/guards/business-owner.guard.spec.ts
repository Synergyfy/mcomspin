import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BusinessOwnerGuard } from './business-owner.guard';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma, mockBusiness } from '../../../../test/mocks';

describe('BusinessOwnerGuard', () => {
  let guard: BusinessOwnerGuard;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessOwnerGuard,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    guard = module.get<BusinessOwnerGuard>(BusinessOwnerGuard);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  const mockContext = (user: any, params: any = {}) => {
    const req = { user, params, body: {}, query: {} };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as any;
  };

  it('should allow SuperAdmin', async () => {
    const ctx = mockContext({ id: 'admin-1', roles: ['SuperAdmin'] });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('should auto-resolve business for owner', async () => {
    mockPrisma.business.findFirst.mockResolvedValue(mockBusiness);
    const ctx = mockContext({ id: 'user-1', roles: ['BusinessOwner'] });
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    const req = ctx.switchToHttp().getRequest();
    expect(req.businessId).toBe('biz-1');
  });

  it('should throw if no business found for non-SuperAdmin', async () => {
    mockPrisma.business.findFirst.mockResolvedValue(null);
    const ctx = mockContext({ id: 'user-2', roles: ['BusinessOwner'] });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('should verify staff access to business', async () => {
    mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);
    mockPrisma.businessStaff.findFirst.mockResolvedValue({
      id: 'staff-1',
      role: 'Manager',
      permissions: {},
    });
    const ctx = mockContext({ id: 'staff-user', roles: ['Staff'] }, { businessId: 'biz-1' });
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    const req = ctx.switchToHttp().getRequest();
    expect(req.staffRole).toBe('Manager');
  });

  it('should throw ForbiddenException for unauthorized user', async () => {
    mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);
    mockPrisma.businessStaff.findFirst.mockResolvedValue(null);
    const ctx = mockContext({ id: 'other-user', roles: ['Customer'] }, { businessId: 'biz-1' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });
});
