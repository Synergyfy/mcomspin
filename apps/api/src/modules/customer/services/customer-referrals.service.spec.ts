import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CustomerReferralsService } from './customer-referrals.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma, mockUser } from '../../../../test/mocks';

describe('CustomerReferralsService', () => {
  let service: CustomerReferralsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerReferralsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerReferralsService>(CustomerReferralsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a referral invite', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(mockUser);
      mockPrisma.customerActivityLog.create.mockResolvedValue({});

      const result = await service.create('cust-1', { inviteeEmail: 'friend@test.com' });

      expect(result).toHaveProperty('referralCode');
      expect(result.message).toBe('Referral sent successfully');
    });

    it('should throw if invitee already registered', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(service.create('cust-1', { inviteeEmail: 'existing@test.com' })).rejects.toThrow(ConflictException);
    });
  });

  describe('getReferrals', () => {
    it('should return referral tracking data', async () => {
      mockPrisma.customerActivityLog.findMany.mockResolvedValue([
        { activityType: 'Share', entityType: 'Referral', createdAt: new Date(), metadata: { inviteeEmail: 'friend@test.com' } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getReferrals('cust-1');

      expect(result).toHaveProperty('referralCode');
      expect(result.stats.sent).toBe(1);
      expect(result.referrals).toHaveLength(1);
    });
  });
});
