import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface PlanConfiguration {
  quotas?: Record<string, number>;
  featureFlags?: Record<string, boolean>;
}

export interface ExternalPlan {
  id: string;
  name: string;
  description?: string | null;
  isFree?: boolean;
  monthlyPrice?: number;
  quarterlyPrice?: number;
  annualPrice?: number;
  type?: 'STANDARD' | 'TRIAL' | 'SEASONAL';
  features?: string[];
  configuration?: PlanConfiguration;
  isActive?: boolean;
  isDefault?: boolean;
  trialDuration?: number;
  seasonId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePlanInput {
  name: string;
  description?: string;
  isFree?: boolean;
  monthlyPrice?: number;
  quarterlyPrice?: number;
  annualPrice?: number;
  type?: 'STANDARD' | 'TRIAL' | 'SEASONAL';
  features?: string[];
  configuration?: PlanConfiguration;
  isActive?: boolean;
  isDefault?: boolean;
  trialDuration?: number;
  seasonId?: string;
}

export interface UpdatePlanInput extends Partial<CreatePlanInput> {}

const SPIN_QUOTA_FIELDS: Array<{ key: string; label: string; unlimited?: boolean }> = [
  { key: 'maxActiveGames', label: 'Max active games', unlimited: true },
  { key: 'maxActiveCampaigns', label: 'Max active campaigns', unlimited: true },
  { key: 'maxRewards', label: 'Max rewards', unlimited: true },
  { key: 'monthlyPlaysAllowance', label: 'Monthly plays allowance', unlimited: true },
  { key: 'maxGameSessions', label: 'Max game sessions', unlimited: true },
  { key: 'maxTeamMembers', label: 'Max team members', unlimited: true },
];

const SPIN_FEATURE_FLAG_FIELDS: Array<{ key: string; label: string }> = [
  { key: 'canScheduleCampaigns', label: 'Schedule campaigns ahead of time' },
  { key: 'hasAdvancedAnalytics', label: 'Advanced analytics' },
  { key: 'canCreateRewardFromScratch', label: 'Create rewards from scratch' },
];

@Injectable()
export class SystemService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlans(): Promise<ExternalPlan[]> {
    const plans = await this.prisma.subscriptionPlan.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return plans.map((plan) => this.serialize(plan));
  }

  async getPlanById(id: string): Promise<ExternalPlan> {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Plan "${id}" not found`);
    return this.serialize(plan);
  }

  async createPlan(input: CreatePlanInput): Promise<ExternalPlan> {
    const configuration = input.configuration ?? {};
    const isFree = input.isFree ?? false;
    const monthlyPrice = isFree ? 0 : this.roundPrice(input.monthlyPrice);
    const isDefault = input.isDefault ?? false;

    if (isDefault) {
      await this.clearDefaultPlan();
    }

    try {
      const created = await this.prisma.subscriptionPlan.create({
        data: {
          name: input.name,
          description: input.description ?? null,
          isFree,
          price: new Prisma.Decimal(monthlyPrice),
          currency: 'GBP',
          interval: 'month',
features: {
        ...configuration,
        isDefault,
        quarterlyPrice: input.quarterlyPrice !== undefined ? this.roundPrice(input.quarterlyPrice) : undefined,
        annualPrice: input.annualPrice !== undefined ? this.roundPrice(input.annualPrice) : undefined,
        type: input.type ?? (isFree ? 'TRIAL' : 'STANDARD'),
        trialDuration: input.trialDuration ?? undefined,
      } as Prisma.InputJsonValue,
          maxStaff: configuration.quotas?.maxTeamMembers ?? 0,
          maxLocations: 1,
          maxProducts: 0,
          maxCampaigns: configuration.quotas?.maxActiveCampaigns ?? 0,
          isActive: input.isActive ?? true,
          sortOrder: 0,
        },
      });
      return this.serialize(created);
    } catch (err) {
      this.throwForPrisma(err);
    }
  }

  async updatePlan(id: string, input: UpdatePlanInput): Promise<ExternalPlan> {
    const existing = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Plan "${id}" not found`);

    const existingConfig = ((existing.features ?? {}) as PlanConfiguration & {
      isDefault?: boolean;
      quarterlyPrice?: number;
      annualPrice?: number;
      type?: string;
      trialDuration?: number;
    }) ?? {};

    if (input.isDefault === true) {
      await this.clearDefaultPlan(id);
    }

    const nextIsFree = input.isFree !== undefined ? input.isFree : existing.isFree;
    const data: Prisma.SubscriptionPlanUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description ?? null;
    if (input.isFree !== undefined) data.isFree = input.isFree;
    if (input.monthlyPrice !== undefined) data.price = new Prisma.Decimal(nextIsFree ? 0 : this.roundPrice(input.monthlyPrice));
    if (input.isActive !== undefined) data.isActive = input.isActive;

    const nextConfig = { ...existingConfig };
    let configChanged = false;
    if (input.configuration !== undefined) {
      if (input.configuration.quotas !== undefined) {
        nextConfig.quotas = { ...(nextConfig.quotas ?? {}), ...input.configuration.quotas };
      }
      if (input.configuration.featureFlags !== undefined) {
        nextConfig.featureFlags = { ...(nextConfig.featureFlags ?? {}), ...input.configuration.featureFlags };
      }
      configChanged = true;
    }
    if (input.isDefault !== undefined && existingConfig.isDefault !== input.isDefault) {
      nextConfig.isDefault = input.isDefault;
      configChanged = true;
    }
    if (input.quarterlyPrice !== undefined) {
      nextConfig.quarterlyPrice = this.roundPrice(input.quarterlyPrice);
      configChanged = true;
    }
    if (input.annualPrice !== undefined) {
      nextConfig.annualPrice = this.roundPrice(input.annualPrice);
      configChanged = true;
    }
    if (input.type !== undefined) {
      nextConfig.type = input.type;
      configChanged = true;
    }
    if (input.trialDuration !== undefined) {
      nextConfig.trialDuration = input.trialDuration;
      configChanged = true;
    }
    if (configChanged) data.features = nextConfig as Prisma.InputJsonValue;
    if (nextConfig.quotas?.maxTeamMembers !== undefined) data.maxStaff = nextConfig.quotas.maxTeamMembers;
    if (nextConfig.quotas?.maxActiveCampaigns !== undefined) data.maxCampaigns = nextConfig.quotas.maxActiveCampaigns;

    try {
      const updated = await this.prisma.subscriptionPlan.update({ where: { id }, data });
      return this.serialize(updated);
    } catch (err) {
      this.throwForPrisma(err);
    }
  }

  async deletePlan(id: string): Promise<void> {
    try {
      await this.prisma.subscriptionPlan.delete({ where: { id } });
    } catch (err) {
      this.throwForPrisma(err);
    }
  }

  getPlanSchema() {
    return {
      quotas: SPIN_QUOTA_FIELDS.map(({ key, label, unlimited }) => ({
        key,
        label,
        type: 'number' as const,
        unlimited: unlimited ?? false,
      })),
      featureFlags: SPIN_FEATURE_FLAG_FIELDS.map(({ key, label }) => ({
        key,
        label,
        type: 'boolean' as const,
      })),
    };
  }

  getSeasons() {
    return [];
  }

  private roundPrice(value?: number): number {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return 0;
    return Math.round(Number(value) * 100) / 100;
  }

  private async clearDefaultPlan(excludeId?: string): Promise<void> {
    const where: Prisma.SubscriptionPlanWhereInput = { features: { path: ['isDefault'], equals: true } };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    await this.prisma.subscriptionPlan.updateMany({
      where,
      data: { features: { path: ['isDefault'], set: false } as unknown as Prisma.InputJsonValue },
    });
  }

  private serialize(plan: {
    id: string;
    name: string;
    description: string | null;
    isFree: boolean;
    price: Prisma.Decimal;
    isActive: boolean;
    features: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }): ExternalPlan {
    const config = ((plan.features ?? {}) as PlanConfiguration & {
      isDefault?: boolean;
      quarterlyPrice?: number;
      annualPrice?: number;
      type?: string;
      trialDuration?: number;
    }) ?? {};
    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      isFree: plan.isFree,
      monthlyPrice: Number(plan.price),
      quarterlyPrice: config.quarterlyPrice,
      annualPrice: config.annualPrice,
      type: (config.type ?? (plan.isFree ? 'TRIAL' : 'STANDARD')) as ExternalPlan['type'],
      trialDuration: config.trialDuration,
      configuration: {
        quotas: config.quotas ?? {},
        featureFlags: config.featureFlags ?? {},
      },
      isActive: plan.isActive,
      isDefault: config.isDefault ?? false,
      created_at: plan.createdAt.toISOString(),
      updated_at: plan.updatedAt.toISOString(),
    };
  }

  private throwForPrisma(err: unknown): never {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new ConflictException('A plan with this name already exists');
      }
      if (err.code === 'P2025') {
        throw new NotFoundException('Plan not found');
      }
    }
    throw err;
  }
}
