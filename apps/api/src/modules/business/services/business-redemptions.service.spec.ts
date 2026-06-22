import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BusinessRedemptionsService } from './business-redemptions.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('BusinessRedemptionsService', () => {
  let service: BusinessRedemptionsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessRedemptionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BusinessRedemptionsService>(BusinessRedemptionsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated redemptions', async () => {
      mockPrisma.customerReward.findMany.mockResolvedValue([]);
      mockPrisma.customerReward.count.mockResolvedValue(0);

      const result = await service.findAll('biz-1', {});

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should filter by pending status', async () => {
      mockPrisma.customerReward.findMany.mockResolvedValue([]);
      mockPrisma.customerReward.count.mockResolvedValue(0);

      await service.findAll('biz-1', { status: 'pending' });

      expect(mockPrisma.customerReward.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ usedAt: null }),
        }),
      );
    });
  });

  describe('approve', () => {
    it('should approve a pending redemption', async () => {
      const customerReward = { id: 'cr-1', usedAt: null, reward: { inventories: [{ businessId: 'biz-1' }] } };
      mockPrisma.customerReward.findUnique.mockResolvedValue(customerReward);
      mockPrisma.customerReward.update.mockResolvedValue({ ...customerReward, usedAt: new Date() });

      const result = await service.approve('biz-1', 'cr-1');

      expect(mockPrisma.customerReward.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'cr-1' }, data: { usedAt: expect.any(Date) } }),
      );
    });

    it('should throw when already redeemed', async () => {
      mockPrisma.customerReward.findUnique.mockResolvedValue({
        id: 'cr-1',
        usedAt: new Date(),
        reward: { inventories: [{ businessId: 'biz-1' }] },
      });

      await expect(service.approve('biz-1', 'cr-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw when not found', async () => {
      mockPrisma.customerReward.findUnique.mockResolvedValue(null);
      await expect(service.approve('biz-1', 'bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
