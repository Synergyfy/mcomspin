import { Test, TestingModule } from '@nestjs/testing';
import { BusinessGamificationService } from './business-gamification.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('BusinessGamificationService', () => {
  let service: BusinessGamificationService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessGamificationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BusinessGamificationService>(BusinessGamificationService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('getRotators', () => {
    it('should return paginated rotators', async () => {
      mockPrisma.rotator.findMany.mockResolvedValue([
        { id: 'rot-1', name: 'Summer Promo', items: [], campaign: { id: 'c-1', name: 'C1' } },
      ]);
      mockPrisma.rotator.count.mockResolvedValue(1);

      const result = await service.getRotators('biz-1', {});
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter active rotators', async () => {
      mockPrisma.rotator.findMany.mockResolvedValue([]);
      mockPrisma.rotator.count.mockResolvedValue(0);

      await service.getRotators('biz-1', { status: 'active' });
      expect(mockPrisma.rotator.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        }),
      );
    });
  });

  describe('createRotator', () => {
    it('should create rotator with items', async () => {
      mockPrisma.campaign.create.mockResolvedValue({ id: 'camp-1' });
      mockPrisma.rotator.create.mockResolvedValue({ id: 'rot-1' });
      mockPrisma.rotatorItem.createMany.mockResolvedValue({ count: 1 });
      mockPrisma.rotator.findUnique.mockResolvedValue({ id: 'rot-1', items: [{ id: 'item-1' }] });

      const result = await service.createRotator('biz-1', {
        name: 'My Rotator',
        type: 'product',
        productIds: ['prod-1'],
      });
      expect(result!.id).toBe('rot-1');
      expect(mockPrisma.rotatorItem.createMany).toHaveBeenCalled();
    });
  });

  describe('getGames', () => {
    it('should return game configs', async () => {
      mockPrisma.gameConfig.findMany.mockResolvedValue([
        { id: 'gc-1', game: { id: 'g-1', name: 'Spin Wheel', type: 'SpinWheel' }, _count: { sessions: 10 } },
      ]);

      const result = await service.getGames('biz-1');
      expect(result).toHaveLength(1);
      expect(result[0]._count.sessions).toBe(10);
    });
  });

  describe('createGame', () => {
    it('should create game config with existing game', async () => {
      mockPrisma.game.findFirst.mockResolvedValue({ id: 'g-1', name: 'Spin Wheel', type: 'SpinWheel' });
      mockPrisma.gameConfig.create.mockResolvedValue({ id: 'gc-1', game: { id: 'g-1' } });

      const result = await service.createGame('biz-1', {
        gameType: 'SpinWheel' as any,
        name: 'Summer Spin',
        rules: { maxPlays: 1 },
      });
      expect(result.id).toBe('gc-1');
      expect(mockPrisma.gameConfig.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ gameId: 'g-1', businessId: 'biz-1' }),
        }),
      );
    });

    it('should create game if none exists for type', async () => {
      mockPrisma.game.findFirst.mockResolvedValue(null);
      mockPrisma.game.create.mockResolvedValue({ id: 'g-new', name: 'BallDrop', type: 'BallDrop' });
      mockPrisma.gameConfig.create.mockResolvedValue({ id: 'gc-1', game: { id: 'g-new' } });

      const result = await service.createGame('biz-1', {
        gameType: 'BallDrop' as any,
        name: 'Ball Drop Promo',
      });
      expect(result.id).toBe('gc-1');
      expect(mockPrisma.game.create).toHaveBeenCalled();
    });
  });
});
