import { Test, TestingModule } from '@nestjs/testing';
import { BusinessLocalMallService } from './business-local-mall.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('BusinessLocalMallService', () => {
  let service: BusinessLocalMallService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessLocalMallService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BusinessLocalMallService>(BusinessLocalMallService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('getHighStreet', () => {
    it('should return high street overview', async () => {
      mockPrisma.business.findFirst.mockResolvedValue({
        id: 'biz-1',
        businessLocations: [{
          highStreet: {
            id: 'hs-1',
            name: 'Main Street',
            borough: { id: 'boro-1', name: 'Test Borough' },
          },
        }],
      });
      mockPrisma.business.findMany.mockResolvedValue([
        { id: 'biz-2', name: 'Partner Biz', _count: { promotions: 2 } },
      ]);
      mockPrisma.campaign.findMany.mockResolvedValue([{ id: 'camp-1', name: 'Boro Campaign' }]);

      const result = await service.getHighStreet('biz-1');
      expect(result.highStreet!.name).toBe('Main Street');
      expect(result.totalBusinesses).toBe(1);
      expect(result.activity).toHaveLength(1);
    });

    it('should return null highStreet when no location', async () => {
      mockPrisma.business.findFirst.mockResolvedValue({ id: 'biz-1', businessLocations: [] });
      const result = await service.getHighStreet('biz-1');
      expect(result.highStreet).toBeNull();
    });

    it('should throw NotFoundException for missing business', async () => {
      mockPrisma.business.findFirst.mockResolvedValue(null);
      await expect(service.getHighStreet('bogus')).rejects.toThrow('Business not found');
    });
  });

  describe('getPartnerships', () => {
    it('should return partnerships, requests, and suggestions', async () => {
      mockPrisma.partnership.findMany.mockResolvedValueOnce([{ id: 'p-1', partner: { id: 'biz-2' } }]);
      mockPrisma.partnership.findMany.mockResolvedValueOnce([]);
      mockPrisma.partnershipRequest.findMany.mockResolvedValue([{ id: 'pr-1' }]);
      mockPrisma.business.findUnique.mockResolvedValue({
        id: 'biz-1',
        businessLocations: [{ highStreetId: 'hs-1' }],
        businessCategoryAssignments: [{ categoryId: 'cat-1' }],
      });
      mockPrisma.partnership.findMany.mockResolvedValueOnce([]);
      mockPrisma.business.findMany.mockResolvedValue([{ id: 'biz-3', name: 'Suggestion' }]);

      const result = await service.getPartnerships('biz-1');
      expect(result.partnerships).toHaveLength(1);
      expect(result.requests).toHaveLength(1);
      expect(result.suggested).toHaveLength(1);
    });
  });

  describe('requestPartnership', () => {
    it('should create a partnership request', async () => {
      mockPrisma.business.findUnique.mockResolvedValueOnce({ id: 'biz-2', name: 'Target' });
      mockPrisma.business.findUnique.mockResolvedValueOnce({
        id: 'biz-1',
        owner: { firstName: 'Test', lastName: 'User', email: 'owner@test.com' },
      });
      mockPrisma.partnershipRequest.findFirst.mockResolvedValue(null);
      mockPrisma.partnership.findFirst.mockResolvedValue(null);
      mockPrisma.partnershipRequest.create.mockResolvedValue({ id: 'pr-1' });

      const result = await service.requestPartnership('biz-1', {
        targetBusinessId: 'biz-2',
        partnershipType: 'cross-promotion',
        message: 'Let\'s collaborate',
      });
      expect(result.id).toBe('pr-1');
    });

    it('should reject self-partnership', async () => {
      await expect(service.requestPartnership('biz-1', {
        targetBusinessId: 'biz-1',
        partnershipType: 'cross-promotion',
      })).rejects.toThrow('Cannot request partnership with yourself');
    });

    it('should reject duplicate request', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-2' });
      mockPrisma.partnershipRequest.findFirst.mockResolvedValue({ id: 'existing' });
      await expect(service.requestPartnership('biz-1', {
        targetBusinessId: 'biz-2',
        partnershipType: 'cross-promotion',
      })).rejects.toThrow('Partnership request already sent');
    });
  });

  describe('updatePartnership', () => {
    it('should activate a partnership', async () => {
      mockPrisma.partnership.findFirst.mockResolvedValue({ id: 'p-1', initiatorId: 'biz-1' });
      mockPrisma.partnership.update.mockResolvedValue({ id: 'p-1', status: 'Active' });

      const result = await service.updatePartnership('biz-1', 'p-1', { status: 'Active' });
      expect(result.status).toBe('Active');
    });

    it('should throw NotFound for unknown partnership', async () => {
      mockPrisma.partnership.findFirst.mockResolvedValue(null);
      await expect(service.updatePartnership('biz-1', 'bogus', { status: 'Active' })).rejects.toThrow('Partnership not found');
    });
  });

  describe('createSharedCampaign', () => {
    it('should create shared campaign with active partnership', async () => {
      mockPrisma.partnership.findFirst.mockResolvedValue({ id: 'part-1', initiatorId: 'biz-1', partnerId: 'biz-2' });
      mockPrisma.campaign.create.mockResolvedValue({ id: 'camp-1' });
      mockPrisma.sharedCampaign.create.mockResolvedValue({ id: 'sc-1' });
      mockPrisma.campaign.findUnique.mockResolvedValue({ id: 'camp-1', businesses: [] });

      const result = await service.createSharedCampaign('biz-1', {
        partnerBusinessId: 'biz-2',
        campaignType: 'Joint discount',
        name: 'Summer Deal',
        startDate: '2026-07-01',
        endDate: '2026-07-31',
      });
      expect(result!.id).toBe('camp-1');
    });

    it('should reject without active partnership', async () => {
      mockPrisma.partnership.findFirst.mockResolvedValue(null);
      await expect(service.createSharedCampaign('biz-1', {
        partnerBusinessId: 'biz-2',
        campaignType: 'Joint discount',
        name: 'Test',
        startDate: '2026-07-01',
        endDate: '2026-07-31',
      })).rejects.toThrow('No active partnership with this business');
    });
  });

  describe('createVisibilityBoost', () => {
    it('should create boost with correct duration', async () => {
      mockPrisma.visibilityBoost.create.mockResolvedValue({ id: 'vb-1', type: 'borough_boost' });

      const result = await service.createVisibilityBoost('biz-1', {
        boostType: 'borough_boost' as any,
        duration: '7d' as any,
      });
      expect(result.id).toBe('vb-1');
    });

    it('should reject invalid duration', async () => {
      await expect(service.createVisibilityBoost('biz-1', {
        boostType: 'borough_boost' as any,
        duration: 'invalid' as any,
      })).rejects.toThrow('Invalid duration');
    });
  });

  describe('getClusters', () => {
    it('should return clusters for business high street', async () => {
      mockPrisma.business.findFirst.mockResolvedValue({
        id: 'biz-1',
        businessLocations: [{ highStreetId: 'hs-1' }],
      });
      mockPrisma.storefrontCluster.findMany.mockResolvedValue([
        { id: 'cl-1', name: 'Market Plaza', _count: { locations: 2 } },
      ]);

      const result = await service.getClusters('biz-1');
      expect(result.clusters).toHaveLength(1);
      expect(result.clusters[0].businessCount).toBe(2);
    });

    it('should return empty when no high street', async () => {
      mockPrisma.business.findFirst.mockResolvedValue({
        id: 'biz-1',
        businessLocations: [],
      });
      const result = await service.getClusters('biz-1');
      expect(result.clusters).toEqual([]);
    });
  });

  describe('activateBusiness', () => {
    it('should activate business and award reward', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-2', name: 'Target' });
      mockPrisma.businessActivation.findUnique.mockResolvedValue(null);
      mockPrisma.businessActivation.create.mockResolvedValue({ id: 'act-1', businessId: 'biz-2', status: 'approved' });
      mockPrisma.activationReward.findFirst.mockResolvedValue({ id: 'ar-1', businessId: 'biz-2', rewardId: 'r-1', isActive: true });
      mockPrisma.customerReward.create.mockResolvedValue({ id: 'cr-1' });

      const result = await service.activateBusiness('biz-1', { targetBusinessId: 'biz-2', message: 'Great biz!' });
      expect(result.id).toBe('act-1');
      expect(mockPrisma.businessActivation.create).toHaveBeenCalled();
      expect(mockPrisma.customerReward.create).toHaveBeenCalled();
    });

    it('should activate without reward when none available', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-2', name: 'Target' });
      mockPrisma.businessActivation.findUnique.mockResolvedValue(null);
      mockPrisma.businessActivation.create.mockResolvedValue({ id: 'act-2', businessId: 'biz-2', status: 'approved' });
      mockPrisma.activationReward.findFirst.mockResolvedValue(null);

      const result = await service.activateBusiness('biz-1', { targetBusinessId: 'biz-2' });
      expect(result.id).toBe('act-2');
      expect(mockPrisma.customerReward.create).not.toHaveBeenCalled();
    });

    it('should throw NotFound for missing business', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(null);
      await expect(service.activateBusiness('biz-1', { targetBusinessId: 'bogus' })).rejects.toThrow('Business not found');
    });

    it('should throw Conflict for already activated', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-2', name: 'Target' });
      mockPrisma.businessActivation.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(service.activateBusiness('biz-1', { targetBusinessId: 'biz-2' })).rejects.toThrow('Business already activated');
    });
  });

  describe('getHub', () => {
    it('should return hub info', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({
        id: 'biz-1',
        businessLocations: [{
          highStreet: { id: 'hs-1', name: 'Main St', borough: { id: 'b-1', name: 'Central' } },
        }],
      });
      mockPrisma.communityGroup.findMany.mockResolvedValue([{ id: 'cg-1', name: 'Central Biz Group' }]);

      const result = await service.getHub('biz-1');
      expect(result.hub!.name).toBe('Main St');
      expect(result.communityGroups).toHaveLength(1);
      expect(result.supportContacts).toHaveLength(2);
    });

    it('should return null hub when no location', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-1', businessLocations: [] });
      mockPrisma.communityGroup.findMany.mockResolvedValue([]);

      const result = await service.getHub('biz-1');
      expect(result.hub).toBeNull();
    });
  });
});
