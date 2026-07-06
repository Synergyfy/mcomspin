import { Test, TestingModule } from '@nestjs/testing';
import { CustomerActivityService } from './customer-activity.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('CustomerActivityService', () => {
  let service: CustomerActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerActivityService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerActivityService>(CustomerActivityService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated activity log', async () => {
      mockPrisma.customerActivityLog.findMany.mockResolvedValue([
        { id: 'a-1', activityType: 'Redeem', description: 'Redeemed Free Coffee', createdAt: new Date() },
      ]);
      mockPrisma.customerActivityLog.count.mockResolvedValue(1);

      const result = await service.findAll('cust-1', {});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });
});
