import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CustomerGameService } from './customer-game.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('CustomerGameService', () => {
  let service: CustomerGameService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerGameService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerGameService>(CustomerGameService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('checkEligibility', () => {
    it('should return eligible when under limits', async () => {
      mockPrisma.game.findFirst.mockResolvedValue({ id: 'game-1', name: 'Ball Drop', type: 'BallDrop' });
      mockPrisma.gameSession.count.mockResolvedValueOnce(2).mockResolvedValueOnce(10);

      const result = await service.checkEligibility('cust-1', 'game-1');

      expect(result.eligible).toBe(true);
      expect(result.limits.daily.used).toBe(2);
      expect(result.limits.weekly.used).toBe(10);
    });

    it('should return not eligible when daily limit reached', async () => {
      mockPrisma.game.findFirst.mockResolvedValue({ id: 'game-1', name: 'Ball Drop', type: 'BallDrop' });
      mockPrisma.gameSession.count.mockResolvedValueOnce(5).mockResolvedValueOnce(5);

      const result = await service.checkEligibility('cust-1', 'game-1');

      expect(result.eligible).toBe(false);
    });

    it('should throw if no active game', async () => {
      mockPrisma.game.findFirst.mockResolvedValue(null);
      await expect(service.checkEligibility('cust-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('startGame', () => {
    it('should start a game session and return boxes', async () => {
      mockPrisma.game.findFirst.mockResolvedValue({ id: 'game-1', name: 'Ball Drop', type: 'BallDrop' });
      mockPrisma.gameSession.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
      mockPrisma.gameConfig.findFirst.mockResolvedValue({ id: 'cfg-1', gameId: 'game-1', config: [{ index: 0, hasReward: true, rewardId: 'rw-1' }] });
      mockPrisma.gameSession.create.mockResolvedValue({ id: 'sess-1', startedAt: new Date(), config: { gameId: 'game-1' } });

      const result = await service.startGame('cust-1', { gameId: 'game-1' });

      expect(result).toHaveProperty('sessionId');
      expect(result).toHaveProperty('boxes');
      expect(mockPrisma.gameSession.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if not eligible', async () => {
      mockPrisma.game.findFirst.mockResolvedValue({ id: 'game-1', name: 'Ball Drop', type: 'BallDrop' });
      mockPrisma.gameSession.count.mockResolvedValueOnce(5);

      await expect(service.startGame('cust-1', { gameId: 'game-1' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('processDrop', () => {
    it('should process a winning drop', async () => {
      mockPrisma.gameSession.findFirst.mockResolvedValue({
        id: 'sess-1', customerId: 'cust-1', endedAt: null,
        config: { name: 'Ball Drop' },
        metadata: { boxes: [{ index: 0, hasReward: true, rewardId: 'rw-1' }] },
      });
      mockPrisma.reward.findUnique.mockResolvedValue({ id: 'rw-1', name: 'Free Coffee', type: 'Voucher', value: 5 });
      mockPrisma.gameSession.update.mockResolvedValue({});
      mockPrisma.customerActivityLog.create.mockResolvedValue({});

      const result: any = await service.processDrop('cust-1', { sessionId: 'sess-1', boxIndex: 0 });

      expect(result.isWin).toBe(true);
      expect(result.reward.name).toBe('Free Coffee');
    });

    it('should process a losing drop', async () => {
      mockPrisma.gameSession.findFirst.mockResolvedValue({
        id: 'sess-1', customerId: 'cust-1', endedAt: null,
        config: { name: 'Ball Drop' },
        metadata: { boxes: [{ index: 0, hasReward: false, label: 'Try Again' }] },
      });
      mockPrisma.gameSession.update.mockResolvedValue({});
      mockPrisma.customerActivityLog.create.mockResolvedValue({});

      const result: any = await service.processDrop('cust-1', { sessionId: 'sess-1', boxIndex: 0 });

      expect(result.isWin).toBe(false);
      expect(result.reward).toBeNull();
    });

    it('should throw on invalid session', async () => {
      mockPrisma.gameSession.findFirst.mockResolvedValue(null);
      await expect(service.processDrop('cust-1', { sessionId: 'bad', boxIndex: 0 })).rejects.toThrow(NotFoundException);
    });

    it('should throw on invalid box index', async () => {
      mockPrisma.gameSession.findFirst.mockResolvedValue({
        id: 'sess-1', customerId: 'cust-1', endedAt: null,
        config: { name: 'Ball Drop' },
        metadata: { boxes: [{ index: 0, hasReward: false }] },
      });

      await expect(service.processDrop('cust-1', { sessionId: 'sess-1', boxIndex: 99 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('claimReward', () => {
    it('should claim reward and return QR data', async () => {
      mockPrisma.gameSession.findFirst.mockResolvedValue({
        id: 'sess-1', customerId: 'cust-1', isWin: true, endedAt: new Date(),
        reward: { id: 'rw-1', name: 'Free Coffee', type: 'Voucher', value: 5 },
      });
      mockPrisma.customerReward.findFirst.mockResolvedValue(null);
      mockPrisma.customerReward.create.mockResolvedValue({ id: 'cr-1', reward: { name: 'Free Coffee' }, expiresAt: new Date() });

      const result: any = await service.claimReward('cust-1', { sessionId: 'sess-1' });

      expect(result).toHaveProperty('qrData');
      expect(result).toHaveProperty('reward');
    });

    it('should throw if no winning session', async () => {
      mockPrisma.gameSession.findFirst.mockResolvedValue(null);
      await expect(service.claimReward('cust-1', { sessionId: 'bad' })).rejects.toThrow(NotFoundException);
    });
  });
});
