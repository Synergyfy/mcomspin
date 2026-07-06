import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdminRedemptionsService } from './admin-redemptions.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';
import { RedemptionAction } from '../dto/redemption-action.dto';

describe('AdminRedemptionsService', () => {
  let service: AdminRedemptionsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminRedemptionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminRedemptionsService>(AdminRedemptionsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return redemptions with default pagination', async () => {
      mockPrisma.customerReward.findMany.mockResolvedValue([]);
      mockPrisma.customerReward.count.mockResolvedValue(0);

      const result = await service.findAll({});

      expect(result.data).toEqual([]);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
    });
  });

  describe('update', () => {
    it('should approve a redemption by setting usedAt', async () => {
      const mockReward = {
        id: 'cr-1',
        customerId: 'cust-1',
        rewardId: 'rew-1',
        usedAt: null,
        earnedAt: new Date(),
      };
      mockPrisma.customerReward.findUnique.mockResolvedValue(mockReward);
      mockPrisma.customerReward.update.mockResolvedValue({ ...mockReward, usedAt: new Date() });

      const result = await service.update('cr-1', { action: RedemptionAction.Approve });

      expect(mockPrisma.customerReward.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'cr-1' }, data: { usedAt: expect.any(Date) } }),
      );
    });

    it('should reject by returning unchanged', async () => {
      const mockReward = { id: 'cr-1', usedAt: null };
      mockPrisma.customerReward.findUnique.mockResolvedValue(mockReward);

      const result = await service.update('cr-1', { action: RedemptionAction.Reject });

      expect(result).toEqual(mockReward);
    });

    it('should throw when not found', async () => {
      mockPrisma.customerReward.findUnique.mockResolvedValue(null);
      await expect(
        service.update('bad-id', { action: RedemptionAction.Approve }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
