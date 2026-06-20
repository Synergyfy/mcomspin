import { Test, TestingModule } from '@nestjs/testing';
import { CustomerLeaderboardService } from './customer-leaderboard.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('CustomerLeaderboardService', () => {
  let service: CustomerLeaderboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerLeaderboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerLeaderboardService>(CustomerLeaderboardService);
    jest.clearAllMocks();
  });

  describe('getLeaderboard', () => {
    it('should return top players leaderboard', async () => {
      mockPrisma.gameSession.groupBy.mockResolvedValue([
        { customerId: 'cust-1', _count: { id: 10 }, _sum: { score: 500 } },
      ]);
      mockPrisma.user.findMany.mockResolvedValue([{ id: 'cust-1', firstName: 'Jane', lastName: 'Doe' }]);

      const result: any[] = await service.getLeaderboard('topPlayers', {});

      expect(result).toHaveLength(1);
      expect(result[0].totalScore).toBe(500);
    });

    it('should return most rewards leaderboard', async () => {
      mockPrisma.customerReward.groupBy.mockResolvedValue([
        { customerId: 'cust-1', _count: { id: 15 } },
      ]);
      mockPrisma.user.findMany.mockResolvedValue([{ id: 'cust-1', firstName: 'Jane', lastName: 'Doe' }]);

      const result: any[] = await service.getLeaderboard('mostRewards', {});

      expect(result).toHaveLength(1);
      expect(result[0].count).toBe(15);
    });
  });

  describe('getAchievements', () => {
    it('should return achievement progress', async () => {
      mockPrisma.gameSession.count.mockResolvedValueOnce(10).mockResolvedValueOnce(5);
      mockPrisma.customerReward.count.mockResolvedValue(8);
      mockPrisma.rewardRedemption.count.mockResolvedValue(2);

      const result: any[] = await service.getAchievements('cust-1');

      expect(result).toHaveLength(4);
      expect(result.find((a: any) => a.id === 'first_win').unlocked).toBe(true);
      expect(result.find((a: any) => a.id === 'fifty_plays').unlocked).toBe(false);
      expect(result.find((a: any) => a.id === 'fifty_plays').progress).toBe(10);
    });
  });
});
