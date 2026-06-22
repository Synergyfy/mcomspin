import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdminCampaignsService } from './admin-campaigns.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma, mockCampaign } from '../../../../test/mocks';

describe('AdminCampaignsService', () => {
  let service: AdminCampaignsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminCampaignsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminCampaignsService>(AdminCampaignsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated campaigns', async () => {
      mockPrisma.campaign.findMany.mockResolvedValue([mockCampaign]);
      mockPrisma.campaign.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrisma.campaign.findMany.mockResolvedValue([]);
      mockPrisma.campaign.count.mockResolvedValue(0);

      await service.findAll({ status: 'Active' });

      expect(mockPrisma.campaign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: 'Active' }) }),
      );
    });
  });

  describe('findOne', () => {
    it('should return campaign with relations', async () => {
      mockPrisma.campaign.findUnique.mockResolvedValue(mockCampaign);

      const result = await service.findOne('camp-1');
      expect(result).toEqual(mockCampaign);
    });

    it('should throw when not found', async () => {
      mockPrisma.campaign.findUnique.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a campaign', async () => {
      const dto = {
        name: 'New Campaign',
        type: 'Seasonal' as any,
        status: 'Draft' as any,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
      };
      mockPrisma.campaign.create.mockResolvedValue(mockCampaign);

      const result = await service.create(dto);
      expect(result).toEqual(mockCampaign);
      expect(mockPrisma.campaign.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing campaign', async () => {
      mockPrisma.campaign.findUnique.mockResolvedValue(mockCampaign);
      mockPrisma.campaign.update.mockResolvedValue({ ...mockCampaign, name: 'Updated' });

      const result = await service.update('camp-1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw when not found', async () => {
      mockPrisma.campaign.findUnique.mockResolvedValue(null);
      await expect(service.update('bad-id', { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft-delete a campaign', async () => {
      mockPrisma.campaign.findUnique.mockResolvedValue(mockCampaign);
      mockPrisma.campaign.update.mockResolvedValue(mockCampaign);

      await service.remove('camp-1');
      expect(mockPrisma.campaign.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ deletedAt: expect.any(Date) }) }),
      );
    });

    it('should throw when not found', async () => {
      mockPrisma.campaign.findUnique.mockResolvedValue(null);
      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
