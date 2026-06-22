import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateStorefrontProfileDto } from './dto/update-storefront-profile.dto';
import { UpdateOpeningHoursDto } from './dto/update-opening-hours.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SpareCapacityDto } from './dto/spare-capacity.dto';
import { UpdateAppearanceDto } from './dto/update-appearance.dto';
import { ConnectGoogleDto } from './dto/connect-google.dto';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { ClaimBusinessDto } from './dto/claim-business.dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class StorefrontService {
  constructor(private prisma: PrismaService) {}

  private async ensureStorefront(businessId: string) {
    let storefront = await this.prisma.storefront.findUnique({ where: { businessId } });
    if (!storefront) {
      storefront = await this.prisma.storefront.create({
        data: { businessId },
      });
    }
    return storefront;
  }

  async getOverview(businessId: string) {
    const storefront = await this.ensureStorefront(businessId);
    return this.prisma.storefront.findUnique({
      where: { id: storefront.id },
      include: {
        theme: true,
        banners: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        media: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        products: { where: { deletedAt: null }, take: 10, orderBy: { createdAt: 'desc' } },
        services: { where: { status: 'active' }, take: 10, orderBy: { createdAt: 'desc' } },
        business: {
          select: {
            name: true,
            logoUrl: true,
            coverImageUrl: true,
            description: true,
            contactEmail: true,
            contactPhone: true,
            websiteUrl: true,
            verification: { select: { status: true } },
            membership: { select: { tier: true } },
          },
        },
      },
    });
  }

  async updateProfile(businessId: string, dto: UpdateStorefrontProfileDto) {
    const storefront = await this.ensureStorefront(businessId);
    const businessData: Record<string, any> = {};
    const storefrontData: Record<string, any> = {};

    if (dto.name) businessData.name = dto.name;
    if (dto.description) businessData.description = dto.description;
    if (dto.shortDescription) businessData.shortDescription = dto.shortDescription;
    if (dto.contactEmail) businessData.contactEmail = dto.contactEmail;
    if (dto.contactPhone) businessData.contactPhone = dto.contactPhone;
    if (dto.websiteUrl) businessData.websiteUrl = dto.websiteUrl;
    if (dto.socialLinks) businessData.socialLinks = dto.socialLinks;
    if (dto.headline) storefrontData.headline = dto.headline;
    if (dto.tagline) storefrontData.tagline = dto.tagline;
    if (dto.welcomeMessage) storefrontData.welcomeMessage = dto.welcomeMessage;

    if (Object.keys(storefrontData).length > 0) {
      await this.prisma.storefront.update({ where: { id: storefront.id }, data: storefrontData });
    }
    if (Object.keys(businessData).length > 0) {
      await this.prisma.business.update({ where: { id: businessId }, data: businessData });
    }

    return this.getOverview(businessId);
  }

  async uploadLogo(businessId: string, logoUrl: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    return this.prisma.business.update({
      where: { id: businessId },
      data: { logoUrl },
    });
  }

  async uploadCover(businessId: string, coverUrl: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    return this.prisma.business.update({
      where: { id: businessId },
      data: { coverImageUrl: coverUrl },
    });
  }

  async updateHours(businessId: string, dto: UpdateOpeningHoursDto) {
    const storefront = await this.ensureStorefront(businessId);
    if (dto.hours) {
      await this.prisma.business.update({
        where: { id: businessId },
        data: { metadata: { ...(await this.getMetadata(businessId)), hours: dto.hours } },
      });
    }
    return { message: 'Opening hours updated' };
  }

  async updateSocial(businessId: string, dto: UpdateSocialLinksDto) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    return this.prisma.business.update({
      where: { id: businessId },
      data: { socialLinks: dto as any },
    });
  }

  // Products
  async getProducts(businessId: string, query: { status?: string; page?: number; limit?: number }) {
    const storefront = await this.ensureStorefront(businessId);
    const { status, page = 1, limit = 20 } = query;
    const where: any = { storefrontId: storefront.id, deletedAt: null };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createProduct(businessId: string, dto: CreateProductDto) {
    const storefront = await this.ensureStorefront(businessId);
    const slug = dto.slug || slugify(dto.name);
    return this.prisma.product.create({
      data: {
        storefrontId: storefront.id,
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        stock: dto.stock ?? 0,
        lowStockThreshold: dto.lowStockThreshold ?? 5,
        isTrackStock: dto.isTrackStock ?? true,
        allowBackorder: dto.allowBackorder ?? false,
        status: dto.status ?? 'active',
        images: dto.images ? JSON.stringify(dto.images) : undefined,
        attributes: dto.attributes,
        variants: dto.variants,
      },
    });
  }

  async updateProduct(businessId: string, productId: string, dto: UpdateProductDto) {
    const storefront = await this.ensureStorefront(businessId);
    const product = await this.prisma.product.findFirst({
      where: { id: productId, storefrontId: storefront.id, deletedAt: null },
    });
    if (!product) throw new NotFoundException('Product not found');

    const data: any = { ...dto };
    if (dto.images) data.images = JSON.stringify(dto.images);
    if (dto.name && !dto.slug) data.slug = slugify(dto.name);

    return this.prisma.product.update({ where: { id: productId }, data });
  }

  async deleteProduct(businessId: string, productId: string) {
    const storefront = await this.ensureStorefront(businessId);
    const product = await this.prisma.product.findFirst({
      where: { id: productId, storefrontId: storefront.id, deletedAt: null },
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });
  }

  async promoteProduct(businessId: string, productId: string) {
    const storefront = await this.ensureStorefront(businessId);
    const product = await this.prisma.product.findFirst({
      where: { id: productId, storefrontId: storefront.id, deletedAt: null },
    });
    if (!product) throw new NotFoundException('Product not found');

    const existingMeta = (product.metadata as Record<string, any>) || {};
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        metadata: { ...existingMeta, promoted: true, promotedAt: new Date().toISOString() },
      },
    });
  }

  // Services
  async getServices(businessId: string, query: { status?: string; page?: number; limit?: number }) {
    const storefront = await this.ensureStorefront(businessId);
    const { status, page = 1, limit = 20 } = query;
    const where: any = { storefrontId: storefront.id };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { availability: true },
      }),
      this.prisma.service.count({ where }),
    ]);

    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createService(businessId: string, dto: CreateServiceDto) {
    const storefront = await this.ensureStorefront(businessId);
    const slug = dto.slug || slugify(dto.name);
    return this.prisma.service.create({
      data: {
        storefrontId: storefront.id,
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        durationMinutes: dto.durationMinutes,
        isOnlineBooking: dto.isOnlineBooking ?? true,
        maxBookingsPerSlot: dto.maxBookingsPerSlot ?? 1,
        bufferMinutes: dto.bufferMinutes ?? 0,
        status: dto.status ?? 'active',
        images: dto.images ? JSON.stringify(dto.images) : undefined,
      },
    });
  }

  async updateService(businessId: string, serviceId: string, dto: UpdateServiceDto) {
    const storefront = await this.ensureStorefront(businessId);
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, storefrontId: storefront.id },
    });
    if (!service) throw new NotFoundException('Service not found');

    const data: any = { ...dto };
    if (dto.name && !dto.slug) data.slug = slugify(dto.name);
    if (dto.images) data.images = JSON.stringify(dto.images);

    return this.prisma.service.update({ where: { id: serviceId }, data });
  }

  async deleteService(businessId: string, serviceId: string) {
    const storefront = await this.ensureStorefront(businessId);
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, storefrontId: storefront.id },
    });
    if (!service) throw new NotFoundException('Service not found');
    return this.prisma.service.update({
      where: { id: serviceId },
      data: { status: 'archived' },
    });
  }

  async createSpareCapacity(businessId: string, serviceId: string, dto: SpareCapacityDto) {
    const storefront = await this.ensureStorefront(businessId);
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, storefrontId: storefront.id },
    });
    if (!service) throw new NotFoundException('Service not found');

    const date = new Date(dto.date);
    const dayOfWeek = date.getDay();

    const existingAttributes = (service.attributes as Record<string, any>) || {};
    const spareOffers = existingAttributes.spareCapacityOffers || [];

    await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        attributes: {
          ...existingAttributes,
          spareCapacityOffers: [
            ...spareOffers,
            {
              date: dto.date,
              startTime: dto.startTime,
              endTime: dto.endTime,
              discountedPrice: dto.discountedPrice,
              offerTitle: dto.offerTitle,
              offerDescription: dto.offerDescription,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      },
    });

    return this.prisma.serviceAvailability.create({
      data: {
        serviceId,
        dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        capacity: 1,
      },
    });
  }

  // Appearance
  async updateAppearance(businessId: string, dto: UpdateAppearanceDto) {
    const storefront = await this.ensureStorefront(businessId);
    const existingTheme = await this.prisma.storefrontTheme.findUnique({
      where: { storefrontId: storefront.id },
    });

    const themeData: any = {
      themeType: dto.themeType,
      primaryColor: dto.primaryColor,
      secondaryColor: dto.secondaryColor,
      accentColor: dto.accentColor,
      fontFamily: dto.fontFamily,
      borderRadius: dto.borderRadius,
      customCss: dto.customCss,
    };
    Object.keys(themeData).forEach(k => themeData[k] === undefined && delete themeData[k]);

    if (existingTheme) {
      await this.prisma.storefrontTheme.update({
        where: { storefrontId: storefront.id },
        data: themeData,
      });
    } else {
      await this.prisma.storefrontTheme.create({
        data: { storefrontId: storefront.id, ...themeData },
      });
    }

    if (dto.showProducts !== undefined || dto.showServices !== undefined ||
        dto.showRotator !== undefined || dto.showGamification !== undefined) {
      const businessMeta = await this.getMetadata(businessId);
      const displaySettings: any = {};
      if (dto.showProducts !== undefined) displaySettings.showProducts = dto.showProducts;
      if (dto.showServices !== undefined) displaySettings.showServices = dto.showServices;
      if (dto.showRotator !== undefined) displaySettings.showRotator = dto.showRotator;
      if (dto.showGamification !== undefined) displaySettings.showGamification = dto.showGamification;
      await this.prisma.business.update({
        where: { id: businessId },
        data: { metadata: { ...businessMeta, storefrontDisplay: displaySettings } },
      });
    }

    return this.prisma.storefrontTheme.findUnique({ where: { storefrontId: storefront.id } });
  }

  async uploadBanner(businessId: string, imageUrl: string, dto?: { title?: string; linkUrl?: string }) {
    const storefront = await this.ensureStorefront(businessId);
    const maxSort = await this.prisma.storefrontBanner.aggregate({
      where: { storefrontId: storefront.id },
      _max: { sortOrder: true },
    });

    return this.prisma.storefrontBanner.create({
      data: {
        storefrontId: storefront.id,
        imageUrl,
        title: dto?.title,
        linkUrl: dto?.linkUrl,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async applyTheme(businessId: string, themeType: string) {
    const storefront = await this.ensureStorefront(businessId);
    const existingTheme = await this.prisma.storefrontTheme.findUnique({
      where: { storefrontId: storefront.id },
    });

    if (existingTheme) {
      return this.prisma.storefrontTheme.update({
        where: { storefrontId: storefront.id },
        data: { themeType: themeType as any, isActive: true },
      });
    }
    return this.prisma.storefrontTheme.create({
      data: { storefrontId: storefront.id, themeType: themeType as any },
    });
  }

  // Verification
  async getVerification(businessId: string) {
    const [verification, business, claim] = await Promise.all([
      this.prisma.businessVerification.findUnique({ where: { businessId } }),
      this.prisma.business.findUnique({
        where: { id: businessId },
        select: { name: true },
      }),
      this.prisma.businessClaim.findFirst({ where: { businessId } }),
    ]);
    return {
      verification,
      googleConnected: verification?.googleConnected ?? false,
      googlePlaceId: verification?.googlePlaceId,
      claim,
    };
  }

  async connectGoogle(businessId: string, dto: ConnectGoogleDto) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');

    const existing = await this.prisma.businessVerification.findUnique({ where: { businessId } });
    if (existing) {
      return this.prisma.businessVerification.update({
        where: { businessId },
        data: { googlePlaceId: dto.googleBusinessId, googleConnected: true },
      });
    }
    return this.prisma.businessVerification.create({
      data: {
        businessId,
        googlePlaceId: dto.googleBusinessId,
        googleConnected: true,
      },
    });
  }

  async submitVerification(businessId: string, dto: SubmitVerificationDto) {
    const existing = await this.prisma.businessVerification.findUnique({ where: { businessId } });
    if (existing) {
      return this.prisma.businessVerification.update({
        where: { businessId },
        data: {
          status: 'Pending',
          documents: [...(existing.documents as any[] || []), { type: dto.documentType, url: dto.documentUrl, notes: dto.notes }],
        },
      });
    }
    return this.prisma.businessVerification.create({
      data: {
        businessId,
        status: 'Pending',
        documents: [{ type: dto.documentType, url: dto.documentUrl, notes: dto.notes }],
      },
    });
  }

  async claimBusiness(businessId: string, userId: string, dto: ClaimBusinessDto) {
    const targetBusiness = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!targetBusiness) throw new NotFoundException('Business not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.businessClaim.create({
      data: {
        businessId,
        claimerId: userId,
        claimerName: `${user.firstName} ${user.lastName}`,
        claimerEmail: user.email,
        claimerPhone: user.phone,
        status: 'pending',
        metadata: dto.message ? { message: dto.message } : undefined,
      },
    });
  }

  private async getMetadata(businessId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    return (business?.metadata as Record<string, any>) || {};
  }
}
