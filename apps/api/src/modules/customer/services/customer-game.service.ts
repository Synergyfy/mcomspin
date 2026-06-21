import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerGameStartDto } from '../dto/customer-game-start.dto';
import { CustomerGameDropDto } from '../dto/customer-game-drop.dto';
import { CustomerGameClaimDto } from '../dto/customer-game-claim.dto';

@Injectable()
export class CustomerGameService {
  constructor(private prisma: PrismaService) {}

  async checkEligibility(customerId: string, gameId?: string, campaignId?: string) {
    const game = gameId
      ? await this.prisma.game.findFirst({ where: { id: gameId, isActive: true, deletedAt: null } })
      : await this.prisma.game.findFirst({ where: { type: 'BallDrop', isActive: true, deletedAt: null } });
    if (!game) throw new NotFoundException('No active game found');

    // Resolve which business owns this campaign so we can read the right GameConfig limits
    let configLimits: { daily: number; weekly: number } = { daily: 5, weekly: 20 };
    try {
      let gameConfigQuery: any = { gameId: game.id, isActive: true };
      if (campaignId) {
        const campaignBusiness = await this.prisma.campaignBusiness.findFirst({
          where: { campaignId },
          select: { businessId: true },
        });
        if (campaignBusiness?.businessId) {
          gameConfigQuery = { ...gameConfigQuery, businessId: campaignBusiness.businessId };
        }
      }
      const gameConfig = await this.prisma.gameConfig.findFirst({
        where: gameConfigQuery,
        orderBy: { createdAt: 'desc' },
      });
      if (gameConfig) {
        const cfg = gameConfig.config as any;
        if (cfg?.limits) {
          configLimits = {
            daily: Number(cfg.limits.daily) || 5,
            weekly: Number(cfg.limits.weekly) || 20,
          };
        }
      }
    } catch {
      // fall back to defaults
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayPlays = await this.prisma.gameSession.count({
      where: { customerId, gameId: game.id, startedAt: { gte: today, lt: todayEnd } },
    });

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekPlays = await this.prisma.gameSession.count({
      where: { customerId, gameId: game.id, startedAt: { gte: weekStart } },
    });

    let campaignPlays = 0;
    let maxPlaysPerCustomer: number | null = null;
    if (campaignId) {
      const gameCampaign = await this.prisma.gameCampaign.findUnique({
        where: { gameId_campaignId: { gameId: game.id, campaignId } },
      });
      if (gameCampaign) {
        // maxPlaysPerCustomer defaults to 1 in the DB schema — only enforce if explicitly > 0
        const rawMax = gameCampaign.maxPlaysPerCustomer;
        maxPlaysPerCustomer = rawMax != null && rawMax > 0 ? rawMax : null;
        campaignPlays = await this.prisma.gameSession.count({
          where: { customerId, gameId: game.id, metadata: { path: ['campaignId'], equals: campaignId } },
        });
      }
    }

    const dailyLimit = configLimits.daily;
    const weeklyLimit = configLimits.weekly;

    return {
      eligible: todayPlays < dailyLimit && weekPlays < weeklyLimit && (!maxPlaysPerCustomer || campaignPlays < maxPlaysPerCustomer),
      game: { id: game.id, name: game.name, type: game.type },
      limits: {
        daily: { used: todayPlays, max: dailyLimit },
        weekly: { used: weekPlays, max: weeklyLimit },
        campaign: maxPlaysPerCustomer ? { used: campaignPlays, max: maxPlaysPerCustomer } : null,
      },
    };
  }

  async startGame(customerId: string, dto: CustomerGameStartDto) {
    const eligibility = await this.checkEligibility(customerId, dto.gameId, dto.campaignId);
    if (!eligibility.eligible) throw new ForbiddenException('Daily play limit reached');

    const gameId = eligibility.game.id;

    let config = null;
    if (dto.configId) {
      config = await this.prisma.gameConfig.findUnique({ where: { id: dto.configId } });
    } else {
      let campaignBusinessId = null;
      if (dto.campaignId) {
        const campaignBusiness = await this.prisma.campaignBusiness.findFirst({
          where: { campaignId: dto.campaignId },
          select: { businessId: true },
        });
        campaignBusinessId = campaignBusiness?.businessId;
      }

      if (campaignBusinessId) {
        config = await this.prisma.gameConfig.findFirst({
          where: { gameId, businessId: campaignBusinessId, isActive: true },
          orderBy: { createdAt: 'desc' },
        });
      }

      if (!config) {
        config = await this.prisma.gameConfig.findFirst({
          where: { gameId, isActive: true },
          orderBy: { createdAt: 'desc' },
        });
      }
    }
    if (!config) throw new NotFoundException('No active game configuration found');

    const rawConfig = config.config as any;
    const boxList: any[] = Array.isArray(rawConfig)
      ? rawConfig
      : (rawConfig?.boxes ?? this.generateDefaultBoxes());
    const boxes = this.shuffleBoxes(boxList);

    const session = await this.prisma.gameSession.create({
      data: {
        gameId,
        configId: config.id,
        customerId,
        metadata: { campaignId: dto.campaignId, boxes },
      },
    });

    return {
      sessionId: session.id,
      game: { id: config.gameId, config: config.config },
      boxes,
      startedAt: session.startedAt,
    };
  }

  async processDrop(customerId: string, dto: CustomerGameDropDto) {
    const session = await this.prisma.gameSession.findFirst({
      where: { id: dto.sessionId, customerId, endedAt: null },
      include: { config: true },
    });
    if (!session) throw new NotFoundException('Active game session not found');

    const boxes: any[] = (session.metadata as any)?.boxes || [];
    if (dto.boxIndex < 0 || dto.boxIndex >= boxes.length) {
      throw new BadRequestException('Invalid box index');
    }

    const selectedBox = boxes[dto.boxIndex];
    const isWin = selectedBox?.hasReward === true;

    let reward = null;
    if (isWin && selectedBox.rewardId) {
      reward = await this.prisma.reward.findUnique({ where: { id: selectedBox.rewardId } });
    }

    await this.prisma.gameSession.update({
      where: { id: session.id },
      data: {
        isWin,
        rewardId: reward?.id ?? null,
        result: { boxIndex: dto.boxIndex, box: selectedBox },
        endedAt: new Date(),
        score: isWin ? 100 : 0,
      },
    });

    await this.prisma.customerActivityLog.create({
      data: {
        customerId,
        activityType: isWin ? 'Purchase' as any : 'View' as any,
        description: isWin ? `Won ${reward?.name || 'a reward'} in ${session.config?.name || 'Ball Drop'}` : `Played ${session.config?.name || 'Ball Drop'} - no win`,
        entityType: 'GameSession',
        entityId: session.id,
      },
    });

    return {
      sessionId: session.id,
      isWin,
      reward: reward ? { id: reward.id, name: reward.name, type: reward.type, value: reward.value } : null,
      box: selectedBox,
      animation: {
        type: 'ballDrop',
        result: isWin ? 'win' : 'lose',
        landingSlot: dto.boxIndex,
      },
    };
  }

  async claimReward(customerId: string, dto: CustomerGameClaimDto) {
    const session = await this.prisma.gameSession.findFirst({
      where: { id: dto.sessionId, customerId, isWin: true, endedAt: { not: null } },
      include: { reward: true },
    });
    if (!session) throw new NotFoundException('Won game session not found');
    if (!session.reward) throw new BadRequestException('No reward to claim');

    const existing = await this.prisma.customerReward.findFirst({
      where: { customerId, rewardId: session.reward.id, usedAt: null },
    });
    if (existing) throw new BadRequestException('Reward already claimed');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const customerReward = await this.prisma.customerReward.create({
      data: {
        customerId,
        rewardId: session.reward.id,
        expiresAt,
        metadata: { sessionId: session.id },
      },
      include: { reward: true },
    });

    return {
      id: customerReward.id,
      reward: customerReward.reward,
      expiresAt: customerReward.expiresAt,
      qrData: `MCS-REWARD-${customerReward.id}`,
    };
  }

  private shuffleBoxes(config: any[]): any[] {
    const boxes = config.length > 0 ? [...config] : this.generateDefaultBoxes();
    for (let i = boxes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
    }
    return boxes;
  }

  private generateDefaultBoxes() {
    return [
      { index: 0, hasReward: false, label: 'Try Again' },
      { index: 1, hasReward: false, label: 'Better Luck' },
      { index: 2, hasReward: true, label: 'Small Win', rewardType: 'Discount', rewardValue: 5 },
      { index: 3, hasReward: false, label: 'Try Again' },
      { index: 4, hasReward: false, label: 'Almost' },
      { index: 5, hasReward: true, label: 'Big Win', rewardType: 'Voucher', rewardValue: 25 },
      { index: 6, hasReward: false, label: 'Try Again' },
      { index: 7, hasReward: false, label: 'Better Luck' },
    ];
  }
}
