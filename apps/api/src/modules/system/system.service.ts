import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Prisma, PlanTierName } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface PlanVariantConfigDto {
  tier: 'STANDARD' | 'PRO' | 'PRO_PLUS';
  price: number;
  features?: string[];
  configuration: {
    quotas?: Record<string, number>;
    featureFlags?: Record<string, boolean>;
    disabledNavIds?: string[];
  };
}

export interface CreatePlanDto {
  name: string;
  slug: string;
  description?: string;
  variants: PlanVariantConfigDto[];
}

export interface UpdateVariantPriceDto {
  amount: number;
  currency?: string;
  stripePriceId?: string;
  paypalPlanId?: string;
}

const SPIN_QUOTA_FIELDS: Array<{ key: string; label: string; unlimited?: boolean }> = [
  { key: 'maxListings', label: 'Max listings', unlimited: true },
  { key: 'allowProductListing', label: 'Allow product listing', unlimited: false },
  { key: 'allowServiceListing', label: 'Allow service listing', unlimited: false },
  { key: 'maxProducts', label: 'Max products', unlimited: true },
  { key: 'maxServices', label: 'Max services', unlimited: true },
  { key: 'maxGiftCardTemplates', label: 'Max gift card templates', unlimited: true },
  { key: 'maxCouponTemplates', label: 'Max coupon templates', unlimited: true },
  { key: 'maxLoyaltyPrograms', label: 'Max loyalty programs', unlimited: true },
  { key: 'maxImagesPerListing', label: 'Max images per listing', unlimited: true },
  { key: 'featuredListingAllowance', label: 'Featured listing allowance', unlimited: true },
  { key: 'maxActiveGames', label: 'Max active games', unlimited: true },
  { key: 'maxActiveCampaigns', label: 'Max active campaigns', unlimited: true },
  { key: 'maxRewards', label: 'Max rewards', unlimited: true },
  { key: 'monthlyPlaysAllowance', label: 'Monthly plays allowance', unlimited: true },
  { key: 'maxGameSessions', label: 'Max game sessions', unlimited: true },
  { key: 'maxTeamMembers', label: 'Max team members', unlimited: true },
];

const SPIN_FEATURE_FLAG_FIELDS: Array<{ key: string; label: string }> = [
  { key: 'priorityInSearch', label: 'Priority ranking in search' },
  { key: 'advancedAnalytics', label: 'Realtime analytics dashboard' },
  { key: 'dedicatedSupport', label: 'Account manager' },
  { key: 'allowCustomBranding', label: 'Storefront custom colors/logos' },
  { key: 'allowGroupCreation', label: 'Automated circles/groups' },
  { key: 'canScheduleCampaigns', label: 'Schedule campaigns ahead of time' },
  { key: 'hasAdvancedAnalytics', label: 'Advanced analytics' },
  { key: 'canCreateRewardFromScratch', label: 'Create rewards from scratch' },
];

@Injectable()
export class SystemService {
  constructor(private readonly prisma: PrismaService) {}

  async listUnifiedPlans() {
    return this.prisma.plan.findMany({
      include: {
        variants: {
          include: {
            tierLevel: true,
            prices: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnifiedPlan(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            tierLevel: true,
            prices: {
              where: { isActive: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });
    if (!plan) throw new NotFoundException(`Plan "${id}" not found`);
    return plan;
  }

  async createUnifiedPlan(dto: CreatePlanDto) {
    this.assertExactlyThreeTiers(dto);

    const existing = await this.prisma.plan.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Plan with slug "${dto.slug}" already exists`);

    // Ensure PlanTierLevels exist
    await this.ensureTierLevelsExist();
    const tierLevels = await this.prisma.planTierLevel.findMany();

    return this.prisma.$transaction(async (tx) => {
      const plan = await tx.plan.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          description: dto.description ?? null,
          isActive: true,
        },
      });

      for (const vDto of dto.variants) {
        const tierLevel = tierLevels.find((t) => t.name === vDto.tier);
        if (!tierLevel) throw new BadRequestException(`Tier level "${vDto.tier}" not found`);

        const variant = await tx.planVariant.create({
          data: {
            planId: plan.id,
            tierLevelId: tierLevel.id,
            features: vDto.features ?? [],
            configuration: vDto.configuration as unknown as Prisma.InputJsonValue,
            isActive: true,
          },
        });

        await tx.planPrice.create({
          data: {
            planVariantId: variant.id,
            amount: new Prisma.Decimal(vDto.price),
            currency: 'GBP',
            isActive: true,
            effectiveFrom: new Date(),
            effectiveTo: null,
          },
        });
      }

      return tx.plan.findUnique({
        where: { id: plan.id },
        include: {
          variants: {
            include: {
              tierLevel: true,
              prices: {
                where: { isActive: true },
              },
            },
          },
        },
      });
    });
  }

  async repriceVariant(variantId: string, dto: UpdateVariantPriceDto) {
    const variant = await this.prisma.planVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundException(`PlanVariant "${variantId}" not found`);

    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      // 1. Deactivate old price rows
      await tx.planPrice.updateMany({
        where: { planVariantId: variantId, isActive: true },
        data: { isActive: false, effectiveTo: now },
      });

      // 2. Insert new active price row
      return tx.planPrice.create({
        data: {
          planVariantId: variantId,
          amount: new Prisma.Decimal(dto.amount),
          currency: dto.currency ?? 'GBP',
          stripePriceId: dto.stripePriceId ?? null,
          paypalPlanId: dto.paypalPlanId ?? null,
          isActive: true,
          effectiveFrom: now,
          effectiveTo: null,
        },
      });
    });
  }

  async resolveActivePrice(id: string) {
    // 1. Try finding by variant ID
    const variant = await this.prisma.planVariant.findUnique({
      where: { id },
      include: {
        plan: true,
        tierLevel: true,
        prices: { where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (variant && variant.prices.length > 0) {
      return { variant, price: variant.prices[0] };
    }

    // 2. Fallback: If id is plan ID, pick STANDARD variant
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            plan: true,
            tierLevel: true,
            prices: { where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
    });

    if (plan && plan.variants.length > 0) {
      const stdVariant = plan.variants.find((v) => v.tierLevel.name === 'STANDARD') ?? plan.variants[0];
      if (stdVariant.prices.length > 0) {
        return { variant: stdVariant, price: stdVariant.prices[0] };
      }
    }

    throw new NotFoundException(`Active price resolution failed for ID "${id}"`);
  }

  async findOneCanonicalPlan(id: string) {
    try {
      const { variant, price } = await this.resolveActivePrice(id);
      const level = variant.tierLevel?.name;
      const label = level === PlanTierName.PRO_PLUS ? 'Pro+' : level === PlanTierName.PRO ? 'Pro' : 'Standard';
      const amount = Number(price.amount);

      return {
        id: variant.id,
        name: `${variant.plan?.name} · ${label}`,
        description: variant.plan?.description ?? null,
        monthlyPrice: amount,
        quarterlyPrice: amount,
        annualPrice: amount,
        features: variant.features ?? [],
        configuration: variant.configuration ?? null,
        isActive: variant.isActive && (variant.plan?.isActive ?? true),
        isDefault: false,
        type: level,
      };
    } catch {
      // Fallback for legacy SubscriptionPlan
      const legacyPlan = await this.prisma.subscriptionPlan.findUnique({ where: { id } });
      if (!legacyPlan) throw new NotFoundException(`Plan "${id}" not found`);

      const config = (legacyPlan.features as any) ?? {};
      return {
        id: legacyPlan.id,
        name: legacyPlan.name,
        description: legacyPlan.description,
        monthlyPrice: Number(legacyPlan.price),
        quarterlyPrice: config.quarterlyPrice ?? Number(legacyPlan.price),
        annualPrice: config.annualPrice ?? Number(legacyPlan.price),
        features: (config.features as string[]) ?? [],
        configuration: {
          quotas: config.quotas ?? {},
          featureFlags: config.featureFlags ?? {},
        },
        isActive: legacyPlan.isActive,
        isDefault: config.isDefault ?? false,
        type: 'STANDARD',
      };
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

  private assertExactlyThreeTiers(dto: CreatePlanDto) {
    if (!dto.variants || dto.variants.length !== 3) {
      throw new BadRequestException('Every plan must be created with exactly 3 variants: STANDARD, PRO, PRO_PLUS');
    }
    const tiers = dto.variants.map((v) => v.tier);
    const hasStandard = tiers.includes('STANDARD');
    const hasPro = tiers.includes('PRO');
    const hasProPlus = tiers.includes('PRO_PLUS');

    if (!hasStandard || !hasPro || !hasProPlus) {
      throw new BadRequestException('Plan variants must include exactly one STANDARD, PRO, and PRO_PLUS tier');
    }
  }

  private async ensureTierLevelsExist() {
    await this.prisma.planTierLevel.upsert({
      where: { name: 'STANDARD' },
      create: { name: 'STANDARD', sortOrder: 1, durationDays: 90, isCalendarYear: false },
      update: { sortOrder: 1, durationDays: 90, isCalendarYear: false },
    });
    await this.prisma.planTierLevel.upsert({
      where: { name: 'PRO' },
      create: { name: 'PRO', sortOrder: 2, durationDays: 180, isCalendarYear: false },
      update: { sortOrder: 2, durationDays: 180, isCalendarYear: false },
    });
    await this.prisma.planTierLevel.upsert({
      where: { name: 'PRO_PLUS' },
      create: { name: 'PRO_PLUS', sortOrder: 3, durationDays: null, isCalendarYear: true },
      update: { sortOrder: 3, durationDays: null, isCalendarYear: true },
    });
  }
}
