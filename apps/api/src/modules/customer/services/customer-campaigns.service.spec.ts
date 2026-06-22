import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CustomerCampaignsService } from './customer-campaigns.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('CustomerCampaignsService', () => {
  let service: CustomerCampaignsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerCampaignsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerCampaignsService>(CustomerCampaignsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated campaigns', async () => {
      mockPrisma.campaign.findMany.mockResolvedValue([{ id: 'camp-1', name: 'Test', businesses: [], rewards: [], _count: { rewards: 0 } }]);
      mockPrisma.campaign.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return campaign detail', async () => {
      mockPrisma.campaign.findFirst.mockResolvedValue({ id: 'camp-1', name: 'Test', businesses: [], rewards: [], targets: [] });

      const result = await service.findOne('camp-1');

      expect(result.name).toBe('Test');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.campaign.findFirst.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
