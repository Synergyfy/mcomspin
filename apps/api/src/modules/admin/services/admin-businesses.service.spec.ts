import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdminBusinessesService } from './admin-businesses.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma, mockBusiness } from '../../../../test/mocks';
import { BusinessAction } from '../dto/business-action.dto';

describe('AdminBusinessesService', () => {
  let service: AdminBusinessesService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminBusinessesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminBusinessesService>(AdminBusinessesService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated businesses', async () => {
      mockPrisma.business.findMany.mockResolvedValue([mockBusiness]);
      mockPrisma.business.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should search by name or email', async () => {
      mockPrisma.business.findMany.mockResolvedValue([]);
      mockPrisma.business.count.mockResolvedValue(0);

      await service.findAll({ search: 'test' });

      expect(mockPrisma.business.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.objectContaining({ contains: 'test' }) }),
            ]),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return business with relations', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);

      const result = await service.findOne('biz-1');
      expect(result).toEqual(mockBusiness);
    });

    it('should throw when not found', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should approve business verification', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);
      mockPrisma.businessVerification.upsert.mockResolvedValue({ status: 'Verified' });

      await service.updateStatus('biz-1', { action: BusinessAction.Approve });

      expect(mockPrisma.businessVerification.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { businessId: 'biz-1' }, update: { status: 'Verified' } }),
      );
    });

    it('should suspend business', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);
      mockPrisma.business.update.mockResolvedValue({ ...mockBusiness, isActive: false });

      await service.updateStatus('biz-1', { action: BusinessAction.Suspend });

      expect(mockPrisma.business.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'biz-1' }, data: { isActive: false } }),
      );
    });

    it('should activate business', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);
      mockPrisma.business.update.mockResolvedValue({ ...mockBusiness, isActive: true });

      await service.updateStatus('biz-1', { action: BusinessAction.Activate });

      expect(mockPrisma.business.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'biz-1' }, data: { isActive: true } }),
      );
    });

    it('should throw when business not found', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(null);
      await expect(
        service.updateStatus('bad-id', { action: BusinessAction.Activate }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
