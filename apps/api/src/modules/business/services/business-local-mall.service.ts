import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CampaignType, PartnershipStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePartnershipRequestDto } from '../dto/create-partnership-request.dto';
import { UpdatePartnershipDto } from '../dto/update-partnership.dto';
import { CreateSharedCampaignDto } from '../dto/create-shared-campaign.dto';
import { UpdateVisibilityDto } from '../dto/update-visibility.dto';
import { CreateVisibilityBoostDto, BoostDuration } from '../dto/create-visibility-boost.dto';
import { ActivateBusinessDto } from '../dto/activate-business.dto';
import { JoinClusterDto } from '../dto/join-cluster.dto';
import { CreateExpoBoothDto } from '../dto/create-expo-booth.dto';

@Injectable()
export class BusinessLocalMallService {
  constructor(private prisma: PrismaService) {}

  async getHighStreet(businessId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId },
      include: {
        businessLocations: {
          where: { isActive: true },
          include: { highStreet: { include: { borough: true } } },
        },
      },
    });
    if (!business) throw new NotFoundException('Business not found');

    const highStreet = business.businessLocations[0]?.highStreet;
    if (!highStreet) return { highStreet: null, businesses: [], activity: [] };

    const businesses = await this.prisma.business.findMany({
      where: {
        isActive: true,
        businessLocations: { some: { highStreetId: highStreet.id, isActive: true } },
      },
      include: {
        businessCategoryAssignments: { include: { category: true } },
        _count: { select: { promotions: { where: { status: 'Active' } } } },
      },
    });

    const activity = await this.prisma.campaign.findMany({
      where: {
        status: 'Active',
        targets: { some: { boroughId: highStreet.boroughId } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return { highStreet, businesses, activity, totalBusinesses: businesses.length };
  }

  async getMap(businessId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId },
      include: { businessLocations: { where: { isActive: true }, include: { highStreet: true } } },
    });
    if (!business) throw new NotFoundException('Business not found');

    const highStreet = business.businessLocations[0]?.highStreet;
    if (!highStreet) return { businesses: [] };

    const businesses = await this.prisma.business.findMany({
      where: {
        isActive: true,
        businessLocations: { some: { highStreetId: highStreet.id, isActive: true } },
      },
      include: {
        businessLocations: { where: { isActive: true } },
        businessCategoryAssignments: { include: { category: true } },
        promotions: { where: { status: 'Active' }, select: { id: true, name: true, type: true } },
      },
    });

    return { businesses };
  }

  async getPartnerships(businessId: string) {
    const [initiated, received] = await Promise.all([
      this.prisma.partnership.findMany({
        where: { initiatorId: businessId, deletedAt: null },
        include: { partner: { select: { id: true, name: true, logoUrl: true, slug: true } } },
      }),
      this.prisma.partnership.findMany({
        where: { partnerId: businessId, deletedAt: null },
        include: { initiator: { select: { id: true, name: true, logoUrl: true, slug: true } } },
      }),
    ]);

    const requests = await this.prisma.partnershipRequest.findMany({
      where: { targetId: businessId, status: 'pending' },
    });

    const suggested = await this.findSuggestedPartners(businessId);

    return { partnerships: [...initiated, ...received], requests, suggested };
  }

  private async findSuggestedPartners(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        businessLocations: { where: { isActive: true } },
        businessCategoryAssignments: true,
      },
    });
    if (!business) return [];

    const existingPartnerIds = await this.prisma.partnership.findMany({
      where: {
        OR: [{ initiatorId: businessId }, { partnerId: businessId }],
        deletedAt: null,
      },
      select: { initiatorId: true, partnerId: true },
    });
    const excludeIds = new Set([
      businessId,
      ...existingPartnerIds.flatMap((p) => [p.initiatorId, p.partnerId]),
    ]);

    const categoryIds = business.businessCategoryAssignments.map((a) => a.categoryId);
    const highStreetIds = business.businessLocations
      .map((l) => l.highStreetId)
      .filter((id): id is string => id !== null);

    return this.prisma.business.findMany({
      where: {
        isActive: true,
        id: { notIn: [...excludeIds] },
        OR: [
          { businessCategoryAssignments: { some: { categoryId: { in: categoryIds } } } },
          ...(highStreetIds.length > 0
            ? [{ businessLocations: { some: { highStreetId: { in: highStreetIds } } } }]
            : []),
        ],
      },
      take: 10,
      select: { id: true, name: true, logoUrl: true, slug: true, description: true },
    });
  }

  async requestPartnership(businessId: string, dto: CreatePartnershipRequestDto) {
    if (dto.targetBusinessId === businessId) {
      throw new BadRequestException('Cannot request partnership with yourself');
    }

    const [target, requester] = await Promise.all([
      this.prisma.business.findUnique({ where: { id: dto.targetBusinessId } }),
      this.prisma.business.findUnique({
        where: { id: businessId },
        include: { owner: { select: { firstName: true, lastName: true, email: true } } },
      }),
    ]);
    if (!target) throw new NotFoundException('Target business not found');
    if (!requester) throw new NotFoundException('Requester business not found');

    const existing = await this.prisma.partnershipRequest.findFirst({
      where: { targetId: dto.targetBusinessId, requesterId: businessId, status: 'pending' },
    });
    if (existing) throw new ConflictException('Partnership request already sent');

    const partnerCheck = await this.prisma.partnership.findFirst({
      where: {
        OR: [
          { initiatorId: businessId, partnerId: dto.targetBusinessId },
          { initiatorId: dto.targetBusinessId, partnerId: businessId },
        ],
        deletedAt: null,
      },
    });
    if (partnerCheck) throw new ConflictException('Partnership already exists');

    return this.prisma.partnershipRequest.create({
      data: {
        targetId: dto.targetBusinessId,
        requesterId: businessId,
        requesterName: `${requester.owner.firstName} ${requester.owner.lastName}`.trim(),
        requesterEmail: requester.owner.email,
        message: dto.message,
        partnershipType: dto.partnershipType,
      },
    });
  }

  async updatePartnership(businessId: string, id: string, dto: UpdatePartnershipDto) {
    const partnership = await this.prisma.partnership.findFirst({
      where: {
        id,
        OR: [{ initiatorId: businessId }, { partnerId: businessId }],
        deletedAt: null,
      },
    });
    if (!partnership) throw new NotFoundException('Partnership not found');

    if (dto.status === 'Active') {
      return this.prisma.partnership.update({
        where: { id },
        data: { status: PartnershipStatus.Active, startedAt: new Date(), terms: dto.terms },
      });
    }
    if (dto.status === 'Declined') {
      return this.prisma.partnership.update({
        where: { id },
        data: { status: PartnershipStatus.Declined, endedAt: new Date() },
      });
    }
    if (dto.status === 'Suspended') {
      return this.prisma.partnership.update({
        where: { id },
        data: { status: PartnershipStatus.Suspended, endedAt: new Date() },
      });
    }
    return this.prisma.partnership.update({
      where: { id },
      data: { status: dto.status as PartnershipStatus, terms: dto.terms },
    });
  }

  async removePartnership(businessId: string, id: string) {
    const partnership = await this.prisma.partnership.findFirst({
      where: {
        id,
        OR: [{ initiatorId: businessId }, { partnerId: businessId }],
        deletedAt: null,
      },
    });
    if (!partnership) throw new NotFoundException('Partnership not found');

    await this.prisma.partnership.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'Suspended' },
    });
  }

  async getSharedCampaigns(businessId: string) {
    return this.prisma.sharedCampaign.findMany({
      where: {
        partnership: {
          OR: [{ initiatorId: businessId }, { partnerId: businessId }],
          deletedAt: null,
        },
      },
      include: {
        campaign: true,
        partnership: {
          select: { id: true, initiatorId: true, partnerId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSharedCampaign(businessId: string, dto: CreateSharedCampaignDto) {
    const partnership = await this.prisma.partnership.findFirst({
      where: {
        OR: [
          { initiatorId: businessId, partnerId: dto.partnerBusinessId },
          { initiatorId: dto.partnerBusinessId, partnerId: businessId },
        ],
        status: PartnershipStatus.Active,
        deletedAt: null,
      },
    });
    if (!partnership) throw new BadRequestException('No active partnership with this business');

    return this.prisma.$transaction(async (tx) => {
      const campaign = await tx.campaign.create({
        data: {
          name: dto.name,
          description: dto.description,
          type: CampaignType.SharedPartnership,
          status: 'Draft',
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          metadata: dto.offerDetails,
          businesses: {
            create: [
              { businessId },
              { businessId: dto.partnerBusinessId },
            ],
          },
        },
      });

      await tx.sharedCampaign.create({
        data: {
          campaignId: campaign.id,
          partnershipId: partnership.id,
          contribution: dto.contribution,
        },
      });

      return tx.campaign.findUnique({
        where: { id: campaign.id },
        include: { businesses: true },
      });
    });
  }

  async getVisibility(businessId: string) {
    const [score, boosts] = await Promise.all([
      this.prisma.visibilityScore.findUnique({ where: { businessId } }),
      this.prisma.visibilityBoost.findMany({
        where: { businessId, isActive: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { score: score || { overall: 0, search: 0, social: 0, directory: 0, reviews: 0, engagement: 0 }, boosts };
  }

  async updateVisibility(businessId: string, dto: UpdateVisibilityDto) {
    const score = await this.prisma.visibilityScore.upsert({
      where: { businessId },
      create: { businessId },
      update: { metadata: dto.metadata },
    });

    await this.prisma.storefront.updateMany({
      where: { businessId },
      data: { isFeatured: dto.featured ?? undefined },
    });

    return score;
  }

  async createVisibilityBoost(businessId: string, dto: CreateVisibilityBoostDto) {
    const durationMap: Record<string, number> = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    const durationMs = durationMap[dto.duration];
    if (!durationMs) throw new BadRequestException('Invalid duration');

    return this.prisma.visibilityBoost.create({
      data: {
        businessId,
        type: dto.boostType,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + durationMs),
        isActive: true,
      },
    });
  }

  async getCommunity(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { businessLocations: { where: { isActive: true } } },
    });
    if (!business) throw new NotFoundException('Business not found');

    const activations = await this.prisma.businessActivation.findMany({
      where: { customerId: business.ownerId },
      include: { business: { select: { id: true, name: true, logoUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const suggestedBusinesses = await this.prisma.business.findMany({
      where: { isActive: true, id: { not: businessId } },
      take: 10,
    });

    const requests = await this.prisma.interestSignal.findMany({
      where: { businessId, signalType: 'recommend' },
      take: 20,
    });

    return { activations, suggestedBusinesses, requests };
  }

  async activateBusiness(businessId: string, dto: ActivateBusinessDto) {
    const target = await this.prisma.business.findUnique({ where: { id: dto.targetBusinessId } });
    if (!target) throw new NotFoundException('Business not found');

    const existing = await this.prisma.businessActivation.findUnique({
      where: { businessId_customerId: { businessId: dto.targetBusinessId, customerId: businessId } },
    });
    if (existing) throw new ConflictException('Business already activated');

    const activation = await this.prisma.$transaction(async (tx) => {
      const act = await tx.businessActivation.create({
        data: {
          businessId: dto.targetBusinessId,
          customerId: businessId,
          message: dto.message,
          status: 'approved',
          rewardAwarded: false,
        },
      });

      const reward = await tx.activationReward.findFirst({
        where: { businessId: dto.targetBusinessId, isActive: true },
      });
      if (reward) {
        await tx.customerReward.create({
          data: {
            customerId: businessId,
            rewardId: reward.rewardId,
            metadata: { source: 'activation', activationId: act.id },
          },
        });
      }

      return act;
    });

    return activation;
  }

  async getClusters(businessId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId },
      include: { businessLocations: { where: { isActive: true }, include: { highStreet: true } } },
    });
    if (!business) throw new NotFoundException('Business not found');

    const highStreetId = business.businessLocations[0]?.highStreetId;
    if (!highStreetId) return { clusters: [] };

    const clusters = await this.prisma.storefrontCluster.findMany({
      where: { highStreetId, isActive: true },
      include: {
        _count: { select: { locations: { where: { businessId: { not: null } } } } },
      },
    });

    return {
      clusters: clusters.map((c) => ({
        ...c,
        businessCount: c._count.locations,
        _count: undefined,
      })),
    };
  }

  async joinCluster(businessId: string, dto: JoinClusterDto) {
    const cluster = await this.prisma.storefrontCluster.findUnique({
      where: { id: dto.clusterId },
    });
    if (!cluster) throw new NotFoundException('Cluster not found');

    const existing = await this.prisma.location.findFirst({
      where: { businessId, storefrontClusterId: dto.clusterId },
    });
    if (existing) throw new ConflictException('Already in this cluster');

    await this.prisma.location.updateMany({
      where: { businessId, isPrimary: true },
      data: { storefrontClusterId: dto.clusterId },
    });

    return { message: 'Joined cluster successfully' };
  }

  async getExpo(businessId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId },
      include: { businessLocations: { where: { isActive: true } } },
    });
    if (!business) throw new NotFoundException('Business not found');

    const expos = await this.prisma.expo.findMany({
      where: {
        event: {
          startDate: { gte: new Date() },
          status: { in: ['Published', 'Ongoing'] },
        },
      },
      include: {
        event: { select: { id: true, name: true, startDate: true, endDate: true, status: true } },
        booths: {
          where: { OR: [{ isBooked: false }, { businessId }] },
          include: { participation: { where: { businessId }, select: { status: true } } },
        },
      },
      orderBy: { event: { startDate: 'asc' } },
      take: 20,
    });

    return { expos };
  }

  async createExpoBooth(businessId: string, dto: CreateExpoBoothDto) {
    const expo = await this.prisma.expo.findUnique({
      where: { id: dto.expoId },
      include: { booths: { where: { isBooked: false } } },
    });
    if (!expo) throw new NotFoundException('Expo not found');

    const existingBooth = await this.prisma.expoBooth.findFirst({
      where: { expoId: dto.expoId, businessId },
    });
    if (existingBooth) throw new ConflictException('You already have a booth in this expo');

    const booth = await this.prisma.expoBooth.create({
      data: {
        expoId: dto.expoId,
        businessId,
        name: dto.name,
        description: dto.description,
        isBooked: true,
        metadata: { featuredProducts: dto.featuredProducts },
      },
    });

    await this.prisma.expoParticipation.create({
      data: {
        expoBoothId: booth.id,
        businessId,
        status: 'confirmed',
        customizations: dto.customizations,
      },
    });

    return this.prisma.expoBooth.findUnique({
      where: { id: booth.id },
      include: { participation: true },
    });
  }

  async getHub(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        businessLocations: {
          where: { isActive: true, isPrimary: true },
          include: { highStreet: { include: { borough: true } } },
        },
      },
    });
    if (!business) throw new NotFoundException('Business not found');

    const primaryLocation = business.businessLocations[0];
    const communityGroups = await this.prisma.communityGroup.findMany({
      where: {
        OR: [
          { boroughId: primaryLocation?.highStreet?.boroughId },
          { highStreetId: primaryLocation?.highStreetId },
        ],
        isActive: true,
      },
    });

    return {
      hub: primaryLocation?.highStreet
        ? { id: primaryLocation.highStreet.id, name: primaryLocation.highStreet.name, borough: primaryLocation.highStreet.borough }
        : null,
      communityGroups,
      supportContacts: [
        { role: 'Community Manager', contact: 'community@mcom.com' },
        { role: 'Support', contact: 'support@mcom.com' },
      ],
    };
  }

  async getNotifications(businessId: string, query: { page?: number; limit?: string }) {
    const page = query.page || 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const ownerId = (await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    }))?.ownerId;

    const where: any = { type: 'Community' };
    if (ownerId) where.userId = ownerId;

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
