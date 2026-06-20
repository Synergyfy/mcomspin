import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardService } from './admin-dashboard.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('AdminDashboardService', () => {
  let service: AdminDashboardService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminDashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminDashboardService>(AdminDashboardService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should return aggregated KPIs', async () => {
    mockPrisma.business.count.mockResolvedValueOnce(10);
    mockPrisma.business.count.mockResolvedValueOnce(8);
    mockPrisma.user.count.mockResolvedValueOnce(500);
    mockPrisma.campaign.count.mockResolvedValueOnce(25);
    mockPrisma.campaign.count.mockResolvedValueOnce(5);
    mockPrisma.gameSession.count.mockResolvedValueOnce(1200);
    mockPrisma.customerReward.count.mockResolvedValueOnce(300);
    mockPrisma.rewardRedemption.count.mockResolvedValueOnce(150);

    const result = await service.getDashboard();

    expect(result).toEqual({
      totalBusinesses: 10,
      activeBusinesses: 8,
      totalCustomers: 500,
      totalCampaigns: 25,
      activeCampaigns: 5,
      totalPlays: 1200,
      rewardsIssued: 300,
      rewardsRedeemed: 150,
      redemptionRate: 50,
    });
  });

  it('should return 0 redemption rate when no rewards issued', async () => {
    mockPrisma.business.count.mockResolvedValue(0);
    mockPrisma.business.count.mockResolvedValue(0);
    mockPrisma.user.count.mockResolvedValue(0);
    mockPrisma.campaign.count.mockResolvedValue(0);
    mockPrisma.campaign.count.mockResolvedValue(0);
    mockPrisma.gameSession.count.mockResolvedValue(0);
    mockPrisma.customerReward.count.mockResolvedValue(0);
    mockPrisma.rewardRedemption.count.mockResolvedValue(0);

    const result = await service.getDashboard();
    expect(result.redemptionRate).toBe(0);
  });
});
