import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

export interface PlanCapabilityCheckResult {
  allowed: boolean;
  reason?: string;
  currentCount?: number;
  maxQuota?: number;
  tierName?: string;
  expiresAt?: Date;
}

@Injectable()
export class PlanCapabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the active and valid membership for a user.
   * A membership is considered active only if isActive is true and expiresAt > now.
   */
  async getActiveMembership(userId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId },
      include: {
        planVariant: {
          include: {
            plan: true,
            tierLevel: true,
          },
        },
        price: true,
      },
    });

    if (!membership) return null;

    const now = new Date();
    const isNotExpired = new Date(membership.expiresAt) > now;
    if (!membership.isActive || !isNotExpired) {
      return null;
    }

    return membership;
  }

  /**
   * Verifies if a user has an active, non-expired plan.
   */
  async requireActivePlan(userId: string): Promise<PlanCapabilityCheckResult> {
    const membership = await this.getActiveMembership(userId);
    if (!membership) {
      return {
        allowed: false,
        reason: 'An active plan (Standard, Pro, or Pro+) is required. Please subscribe or renew your plan to continue.',
      };
    }

    return {
      allowed: true,
      tierName: membership.planVariant.tierLevel.name,
      expiresAt: membership.expiresAt,
    };
  }

  /**
   * Verifies if a user's active plan allows a given boolean feature flag.
   */
  async requireFeature(userId: string, featureKey: string): Promise<PlanCapabilityCheckResult> {
    const membership = await this.getActiveMembership(userId);
    if (!membership) {
      return {
        allowed: false,
        reason: `Feature "${featureKey}" requires an active plan (Standard, Pro, or Pro+).`,
      };
    }

    const config = (membership.planVariant.configuration as any) || {};
    const flags = config.featureFlags || {};

    const isEnabled = Boolean(flags[featureKey]);
    if (!isEnabled) {
      return {
        allowed: false,
        reason: `Your current ${membership.planVariant.tierLevel.name} plan does not include capability: "${featureKey}". Please upgrade your plan.`,
        tierName: membership.planVariant.tierLevel.name,
      };
    }

    return {
      allowed: true,
      tierName: membership.planVariant.tierLevel.name,
      expiresAt: membership.expiresAt,
    };
  }

  /**
   * Verifies if a business has remaining quota for a given resource.
   */
  async requireQuota(userId: string, businessId: string, quotaKey: string): Promise<PlanCapabilityCheckResult> {
    const membership = await this.getActiveMembership(userId);
    if (!membership) {
      return {
        allowed: false,
        reason: `Creating resources requires an active plan (Standard, Pro, or Pro+).`,
      };
    }

    const config = (membership.planVariant.configuration as any) || {};
    const quotas = config.quotas || {};
    const maxQuota = quotas[quotaKey];

    // If quota is undefined, default to 0 (no allowance) unless unlimited is explicit
    const limit = typeof maxQuota === 'number' ? maxQuota : 0;

    // -1 represents unlimited quota
    if (limit === -1) {
      return {
        allowed: true,
        maxQuota: -1,
        tierName: membership.planVariant.tierLevel.name,
      };
    }

    // Count existing resources based on quotaKey
    const currentCount = await this.countCurrentResources(businessId, quotaKey);

    if (currentCount >= limit) {
      return {
        allowed: false,
        currentCount,
        maxQuota: limit,
        reason: `Quota limit reached for ${quotaKey} (${currentCount}/${limit} used). Please upgrade your plan to increase limits.`,
        tierName: membership.planVariant.tierLevel.name,
      };
    }

    return {
      allowed: true,
      currentCount,
      maxQuota: limit,
      tierName: membership.planVariant.tierLevel.name,
    };
  }

  private async countCurrentResources(businessId: string, quotaKey: string): Promise<number> {
    switch (quotaKey) {
      case 'maxActiveGames':
        return this.prisma.gameConfig.count({ where: { businessId } });
      case 'maxActiveCampaigns':
        return this.prisma.campaign.count({
          where: {
            deletedAt: null,
            businesses: { some: { businessId } },
            status: 'Active' as any,
          },
        });
      case 'maxRewards':
        return this.prisma.reward.count({
          where: {
            inventories: { some: { businessId } },
          },
        });
      case 'maxTeamMembers':
        return this.prisma.businessStaff.count({
          where: { businessId, isActive: true },
        });
      case 'maxListings':
      case 'maxProducts':
        return this.prisma.product.count({
          where: {
            deletedAt: null,
            storefront: { businessId },
          },
        });
      case 'maxServices':
        return this.prisma.service.count({
          where: {
            deletedAt: null,
            storefront: { businessId },
          },
        });
      case 'maxLocations':
        return this.prisma.businessLocation.count({ where: { businessId } });
      default:
        return 0;
    }
  }
}
