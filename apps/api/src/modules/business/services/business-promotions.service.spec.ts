import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPromotionsService } from './business-promotions.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('BusinessPromotionsService', () => {
  let service: BusinessPromotionsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessPromotionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BusinessPromotionsService>(BusinessPromotionsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('getSummary', () => {
    it('should return KPIs', async () => {
      mockPrisma.promotion.count.mockResolvedValue(3);
      mockPrisma.event.count.mockResolvedValue(1);
      mockPrisma.campaign.count.mockResolvedValue(2);
      mockPrisma.promotionRedemption.count.mockResolvedValue(15);
      mockPrisma.gameSession.count.mockResolvedValue(100);
      mockPrisma.qLink.count.mockResolvedValue(5);
      mockPrisma.voucher.count.mockResolvedValue(8);

      const result = await service.getSummary('biz-1');
      expect(result.activePromotions).toBe(3);
      expect(result.activeEvents).toBe(1);
      expect(result.totalRedemptions).toBe(15);
      expect(result.totalPlays).toBe(100);
      expect(result.qrCount).toBe(5);
      expect(result.voucherCount).toBe(8);
    });
  });

  describe('getPromotions', () => {
    it('should return paginated promotions', async () => {
      mockPrisma.promotion.findMany.mockResolvedValue([
        { id: 'promo-1', name: 'Summer Sale', _count: { redemptions: 0, products: 0 } },
      ]);
      mockPrisma.promotion.count.mockResolvedValue(1);

      const result = await service.getPromotions('biz-1', {});
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrisma.promotion.findMany.mockResolvedValue([]);
      mockPrisma.promotion.count.mockResolvedValue(0);

      await service.getPromotions('biz-1', { status: 'Active' });
      expect(mockPrisma.promotion.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'Active' }),
        }),
      );
    });
  });

  describe('createPromotion', () => {
    it('should create a promotion', async () => {
      mockPrisma.promotion.create.mockResolvedValue({ id: 'promo-1', name: 'Test' });

      const result = await service.createPromotion('biz-1', {
        name: 'Test Promotion',
        type: 'FlashDeal' as any,
        startDate: '2026-07-01',
        endDate: '2026-07-31',
        isFeatured: true,
      });
      expect(result.id).toBe('promo-1');
      expect(mockPrisma.promotion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ name: 'Test Promotion', status: 'Draft', isFeatured: true }),
        }),
      );
    });
  });

  describe('updatePromotion', () => {
    it('should update existing promotion', async () => {
      mockPrisma.promotion.findFirst.mockResolvedValue({ id: 'promo-1', businessId: 'biz-1' });
      mockPrisma.promotion.update.mockResolvedValue({ id: 'promo-1', name: 'Updated' });

      const result = await service.updatePromotion('biz-1', 'promo-1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw when not found', async () => {
      mockPrisma.promotion.findFirst.mockResolvedValue(null);
      await expect(service.updatePromotion('biz-1', 'bogus', {})).rejects.toThrow('Promotion not found');
    });
  });

  describe('createVoucher', () => {
    it('should create voucher with generated code', async () => {
      mockPrisma.voucher.create.mockResolvedValue({ id: 'vch-1', code: 'TEST123' });

      const result = await service.createVoucher('biz-1', {
        title: '10% Off',
        type: 'discount',
        value: '10.00',
      });
      expect(result.id).toBe('vch-1');
      expect(mockPrisma.voucher.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            value: 10,
            status: 'Active',
          }),
        }),
      );
    });
  });

  describe('generateQrCode', () => {
    it('should create a QLink', async () => {
      mockPrisma.qLink.create.mockResolvedValue({ id: 'qr-1', code: 'QR-ABC' });

      const result = await service.generateQrCode('biz-1', {
        type: 'Storefront',
        label: 'Store QR',
      });
      expect(result.id).toBe('qr-1');
      expect(mockPrisma.qLink.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            businessId: 'biz-1',
            type: 'Storefront',
            label: 'Store QR',
          }),
        }),
      );
    });
  });
});
