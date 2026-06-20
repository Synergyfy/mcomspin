import { Test, TestingModule } from '@nestjs/testing';
import { CustomerDiscoverService } from './customer-discover.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('CustomerDiscoverService', () => {
  let service: CustomerDiscoverService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerDiscoverService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerDiscoverService>(CustomerDiscoverService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('discover', () => {
    it('should discover campaigns by default', async () => {
      mockPrisma.campaign.findMany.mockResolvedValue([{ id: 'camp-1', name: 'Campaign' }]);
      mockPrisma.campaign.count.mockResolvedValue(1);

      const result = await service.discover({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should discover businesses when type=businesses', async () => {
      mockPrisma.business.findMany.mockResolvedValue([{ id: 'biz-1', name: 'Biz' }]);
      mockPrisma.business.count.mockResolvedValue(1);

      const result = await service.discover({ type: 'businesses' });

      expect(result.data).toHaveLength(1);
    });

    it('should discover rewards when type=rewards', async () => {
      mockPrisma.reward.findMany.mockResolvedValue([{ id: 'rw-1', name: 'Reward', inventories: [] }]);
      mockPrisma.reward.count.mockResolvedValue(1);

      const result = await service.discover({ type: 'rewards' });

      expect(result.data).toHaveLength(1);
    });

    it('should apply search and pagination', async () => {
      mockPrisma.campaign.findMany.mockResolvedValue([]);
      mockPrisma.campaign.count.mockResolvedValue(0);

      const result = await service.discover({ search: 'test', page: 2, limit: 10 });

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(10);
    });
  });
});
