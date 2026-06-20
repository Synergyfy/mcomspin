import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomerRewardsService } from './customer-rewards.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('CustomerRewardsService', () => {
  let service: CustomerRewardsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRewardsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerRewardsService>(CustomerRewardsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation((cb: any) => cb(mockPrisma));
  });

  describe('findAll', () => {
    it('should return categorized rewards', async () => {
      const now = new Date();
      const future = new Date(now.getTime() + 86400000);
      mockPrisma.customerReward.findMany.mockResolvedValue([
        { id: 'cr-1', customerId: 'cust-1', rewardId: 'rw-1', earnedAt: now, expiresAt: future, usedAt: null, reward: { id: 'rw-1', name: 'Active Reward', inventories: [] } },
        { id: 'cr-2', customerId: 'cust-1', rewardId: 'rw-2', earnedAt: now, expiresAt: null, usedAt: now, reward: { id: 'rw-2', name: 'Used Reward', inventories: [] } },
        { id: 'cr-3', customerId: 'cust-1', rewardId: 'rw-3', earnedAt: now, expiresAt: new Date(now.getTime() - 86400000), usedAt: null, reward: { id: 'rw-3', name: 'Expired Reward', inventories: [] } },
      ]);

      const result = await service.findAll('cust-1');

      expect(result.available).toHaveLength(1);
      expect(result.redeemed).toHaveLength(1);
      expect(result.expired).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return reward detail with QR code', async () => {
      mockPrisma.customerReward.findFirst.mockResolvedValue({
        id: 'cr-1', customerId: 'cust-1', earnedAt: new Date(), expiresAt: null, usedAt: null,
        reward: { id: 'rw-1', name: 'Free Coffee', inventories: [{ business: { id: 'biz-1', name: 'Biz', logoUrl: null } }] },
      });

      const result = await service.findOne('cust-1', 'cr-1');

      expect(result).toHaveProperty('qrData');
      expect(result).toHaveProperty('voucherCode');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.customerReward.findFirst.mockResolvedValue(null);
      await expect(service.findOne('cust-1', 'bad')).rejects.toThrow(NotFoundException);
    });
  });

  describe('redeem', () => {
    it('should redeem an available reward', async () => {
      mockPrisma.customerReward.findFirst.mockResolvedValue({
        id: 'cr-1', customerId: 'cust-1', rewardId: 'rw-1', usedAt: null, expiresAt: null,
        reward: { id: 'rw-1', name: 'Free Coffee', inventories: [{ businessId: 'biz-1', id: 'inv-1' }] },
      });

      const result = await service.redeem('cust-1', { rewardId: 'cr-1', method: 'code' as any });

      expect(result).toHaveProperty('code');
      expect(result.method).toBe('code');
    });

    it('should throw on already redeemed reward', async () => {
      mockPrisma.customerReward.findFirst.mockResolvedValue({
        id: 'cr-1', usedAt: new Date(), expiresAt: null,
        reward: { inventories: [] },
      });

      await expect(service.redeem('cust-1', { rewardId: 'cr-1', method: 'qr' as any })).rejects.toThrow(BadRequestException);
    });

    it('should throw on expired reward', async () => {
      const past = new Date(Date.now() - 86400000);
      mockPrisma.customerReward.findFirst.mockResolvedValue({
        id: 'cr-1', usedAt: null, expiresAt: past,
        reward: { inventories: [] },
      });

      await expect(service.redeem('cust-1', { rewardId: 'cr-1', method: 'qr' as any })).rejects.toThrow(BadRequestException);
    });
  });

  describe('history', () => {
    it('should return redemption history', async () => {
      mockPrisma.rewardRedemption.findMany.mockResolvedValue([{ id: 'rr-1', reward: { name: 'Used' } }]);

      const result = await service.history('cust-1');

      expect(result).toHaveLength(1);
    });
  });
});
