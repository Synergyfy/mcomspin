import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSalesSettingsService } from './business-sales-settings.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('BusinessSalesSettingsService', () => {
  let service: BusinessSalesSettingsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessSalesSettingsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BusinessSalesSettingsService>(BusinessSalesSettingsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('getActivationDashboard', () => {
    it('should return activations and leaderboard', async () => {
      mockPrisma.businessActivation.findMany.mockResolvedValue([
        { id: 'act-1', business: { id: 'b-1', name: 'Cafe', logoUrl: null } },
      ]);
      mockPrisma.businessActivation.groupBy.mockResolvedValue([
        { customerId: 'u-1', _count: { id: 5 } },
      ]);

      const result = await service.getActivationDashboard('biz-1');
      expect(result.activations).toHaveLength(1);
      expect(result.leaderboard).toHaveLength(1);
    });
  });

  describe('registerBusiness', () => {
    it('should create business and activation', async () => {
      mockPrisma.borough.findFirst.mockResolvedValue({ id: 'boro-1', name: 'Central' });
      mockPrisma.business.create.mockResolvedValue({ id: 'new-biz', name: 'New Shop' });
      mockPrisma.businessActivation.create.mockResolvedValue({ id: 'act-1' });

      const result = await service.registerBusiness('biz-1', {
        name: 'New Shop',
        postcode: 'EC1 1AA',
        phone: '07700000000',
        borough: 'Central',
        category: 'Retail',
      });
      expect(result.id).toBe('new-biz');
      expect(mockPrisma.business.create).toHaveBeenCalled();
    });
  });

  describe('getAnalytics', () => {
    it('should return metrics and trends', async () => {
      mockPrisma.analyticsEvent.count.mockResolvedValue(100);
      mockPrisma.eventRegistration.count.mockResolvedValue(25);
      mockPrisma.qLinkScan.count.mockResolvedValue(50);
      mockPrisma.voucher.count.mockResolvedValue(10);
      mockPrisma.analyticsAggregation.findMany.mockResolvedValue([
        { metric: 'views', value: 100, periodStart: new Date() },
      ]);

      const result = await service.getAnalytics('biz-1', {});
      expect(result.metrics.promotionViews).toBe(100);
      expect(result.metrics.eventRegistrations).toBe(25);
      expect(result.trends).toHaveLength(1);
    });
  });

  describe('getAutomations', () => {
    it('should return automation rules', async () => {
      mockPrisma.automationRule.findMany.mockResolvedValue([
        { id: 'auto-1', name: 'Weekly Promo', triggers: [], actions: [], _count: { logs: 3 } },
      ]);

      const result = await service.getAutomations('biz-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('createAutomation', () => {
    it('should create automation rule with trigger and action', async () => {
      mockPrisma.automationRule.create.mockResolvedValue({
        id: 'auto-1',
        name: 'Test Rule',
        triggers: [{ id: 'tr-1' }],
        actions: [{ id: 'ac-1' }],
      });

      const result = await service.createAutomation('biz-1', {
        name: 'Test Rule',
        triggerConfig: { type: 'Schedule', cron: '0 9 * * 1' },
        actionConfig: { type: 'Notification', template: 'weekly_promo' },
      });
      expect(result.id).toBe('auto-1');
      expect(mockPrisma.automationRule.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            businessId: 'biz-1',
            name: 'Test Rule',
          }),
        }),
      );
    });
  });

  describe('getAiSuggestions', () => {
    it('should return data-driven suggestions based on business state', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-1', name: 'Test Biz', metadata: { businessType: 'Restaurant' } });
      mockPrisma.promotion.findMany.mockResolvedValue([
        { id: 'p-1', type: 'Discount', status: 'Active' },
      ]);
      mockPrisma.rewardInventory.findMany.mockResolvedValue([
        { reward: { id: 'r-1', name: 'Free Coffee', isActive: true } },
      ]);
      mockPrisma.gameConfig.findFirst.mockResolvedValue({ id: 'gc-1' });
      mockPrisma.analyticsAggregation.aggregate.mockResolvedValue({ _sum: { value: 100 }, _count: 5 });

      const result = await service.getAiSuggestions('biz-1', {});
      expect(result.suggestions.length).toBeGreaterThanOrEqual(1);
    });

    it('should include category-specific suggestions', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-1', name: 'Test Biz', metadata: { businessType: 'Restaurant' } });
      mockPrisma.promotion.findMany.mockResolvedValue([]);
      mockPrisma.rewardInventory.findMany.mockResolvedValue([]);
      mockPrisma.gameConfig.findFirst.mockResolvedValue(null);
      mockPrisma.analyticsAggregation.aggregate.mockResolvedValue({ _sum: { value: 0 }, _count: 0 });

      const result = await service.getAiSuggestions('biz-1', { category: 'Restaurant' });
      const titles = result.suggestions.map((s: any) => s.title);
      expect(titles).toContain('2-for-1 Lunch');
    });
  });

  describe('getInterestSignals', () => {
    it('should return grouped signals and recent items', async () => {
      mockPrisma.interestSignal.groupBy.mockResolvedValue([
        { signalType: 'view', _count: { id: 10 } },
        { signalType: 'favourite', _count: { id: 3 } },
      ]);
      mockPrisma.interestSignal.findMany.mockResolvedValue([
        { id: 'sig-1', signalType: 'view', business: { id: 'b-1', name: 'Biz' } },
      ]);

      const result = await service.getInterestSignals('biz-1');
      expect(result.signals).toHaveLength(2);
      expect(result.recent).toHaveLength(1);
    });
  });

  describe('getLiveMonitoring', () => {
    it('should return live metrics and recent activity', async () => {
      mockPrisma.promotion.count.mockResolvedValue(3);
      mockPrisma.event.count.mockResolvedValue(1);
      mockPrisma.promotionRedemption.findMany.mockResolvedValue([]);
      mockPrisma.qLinkScan.findMany.mockResolvedValue([]);
      mockPrisma.businessActivation.findMany.mockResolvedValue([]);

      const result = await service.getLiveMonitoring('biz-1');
      expect(result.liveMetrics.activePromotions).toBe(3);
      expect(result.liveMetrics.activeEvents).toBe(1);
    });
  });

  describe('sendSalesNotification', () => {
    it('should create notification for business owner', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-1', ownerId: 'user-1', name: 'Test Biz' });
      mockPrisma.notification.create.mockResolvedValue({
        id: 'notif-1', title: 'Flash Sale', body: '50% off!', type: 'Promotional',
      });

      const result = await service.sendSalesNotification('biz-1', {
        title: 'Flash Sale',
        message: '50% off!',
        channels: ['Push' as any],
      });
      expect(result.id).toBe('notif-1');
      expect(mockPrisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ title: 'Flash Sale', userId: 'user-1' }),
        }),
      );
    });

    it('should throw when business not found', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(null);
      await expect(service.sendSalesNotification('bogus', {} as any)).rejects.toThrow('Business not found');
    });
  });
});
