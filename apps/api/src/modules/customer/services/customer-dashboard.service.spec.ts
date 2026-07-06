import { Test, TestingModule } from '@nestjs/testing';
import { CustomerDashboardService } from './customer-dashboard.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('CustomerDashboardService', () => {
  let service: CustomerDashboardService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerDashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerDashboardService>(CustomerDashboardService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('should return aggregated dashboard data', async () => {
      mockPrisma.customerReward.count.mockResolvedValue(3);
      mockPrisma.gameSession.count.mockResolvedValueOnce(10).mockResolvedValueOnce(5);
      mockPrisma.campaign.findMany.mockResolvedValue([{
        id: 'camp-1', name: 'Test Campaign', businesses: [{ business: { id: 'biz-1', name: 'Biz', logoUrl: null, slug: 'biz' } }],
        _count: { rewards: 2 },
      }]);
      mockPrisma.reward.findMany.mockResolvedValue([]);
      mockPrisma.customerActivityLog.findMany.mockResolvedValue([]);
      mockPrisma.business.findMany.mockResolvedValue([]);
      mockPrisma.pointsTransaction.aggregate.mockResolvedValue({ _sum: { points: 500 } });

      const result = await service.getDashboard('cust-1');

      expect(result.summary.activeRewards).toBe(3);
      expect(result.summary.totalPlays).toBe(10);
      expect(result.summary.totalWins).toBe(5);
      expect(result.summary.totalPoints).toBe(500);
      expect(result.featuredCampaigns).toHaveLength(1);
    });
  });
});
