import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CustomerBusinessesService } from './customer-businesses.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('CustomerBusinessesService', () => {
  let service: CustomerBusinessesService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerBusinessesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerBusinessesService>(CustomerBusinessesService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return business profile with campaigns and rewards', async () => {
      mockPrisma.business.findFirst.mockResolvedValue({
        id: 'biz-1', name: 'Test Business', slug: 'test',
        locations: [], businessLocations: [], hours: [],
        campaigns: [], rewards: [], storefront: null,
        _count: { interestSignals: 10 },
      });

      const result = await service.findOne('biz-1');

      expect(result.name).toBe('Test Business');
      expect(result._count.interestSignals).toBe(10);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.business.findFirst.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('follow', () => {
    it('should follow a business', async () => {
      mockPrisma.business.findFirst.mockResolvedValue({ id: 'biz-1', isActive: true, deletedAt: null });
      mockPrisma.interestSignal.findFirst.mockResolvedValue(null);
      mockPrisma.interestSignal.create.mockResolvedValue({});

      const result = await service.follow('cust-1', 'biz-1');

      expect(result.followed).toBe(true);
    });

    it('should unfollow if already following', async () => {
      mockPrisma.business.findFirst.mockResolvedValue({ id: 'biz-1', isActive: true, deletedAt: null });
      mockPrisma.interestSignal.findFirst.mockResolvedValue({ id: 'sig-1' });
      mockPrisma.interestSignal.delete.mockResolvedValue({});

      const result = await service.follow('cust-1', 'biz-1');

      expect(result.followed).toBe(false);
    });

    it('should throw if business not found', async () => {
      mockPrisma.business.findFirst.mockResolvedValue(null);
      await expect(service.follow('cust-1', 'bad')).rejects.toThrow(NotFoundException);
    });
  });
});
