import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class MallMarketplaceService {
  constructor(private prisma: PrismaService) {}

  async getStorefronts(query: { search?: string; boroughId?: string; category?: string; membershipTier?: string; page?: number; limit?: number }) {
    const { search, boroughId, page = 1, limit = 20 } = query;
    const where: any = { deletedAt: null };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (boroughId) where.businessLocations = { some: { highStreet: { boroughId } } };

    const [items, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        include: {
          storefront: { select: { isActive: true, isFeatured: true } },
          verification: { select: { status: true } },
          membership: { select: { tier: true } },
          businessLocations: { include: { highStreet: { include: { borough: true } } } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.business.count({ where }),
    ]);

    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateStorefront(businessId: string, dto: { isFeatured?: boolean; isActive?: boolean }) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');

    if (dto.isFeatured !== undefined || dto.isActive !== undefined) {
      const storefrontData: any = {};
      if (dto.isFeatured !== undefined) storefrontData.isFeatured = dto.isFeatured;
      if (dto.isActive !== undefined) storefrontData.isActive = dto.isActive;
      await this.prisma.storefront.updateMany({
        where: { businessId },
        data: storefrontData,
      });
    }
    return { message: 'Storefront updated' };
  }

  async getCategories() {
    return this.prisma.businessCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { businesses: true } } },
    });
  }

  async createCategory(dto: { name: string; description?: string; parentId?: string; icon?: string }) {
    const slug = slugify(dto.name);
    const data: any = { name: dto.name, slug };
    if (dto.description) data.description = dto.description;
    if (dto.icon) data.imageUrl = dto.icon;
    return this.prisma.businessCategory.create({ data });
  }

  async updateCategory(id: string, dto: { name?: string; description?: string; icon?: string; isActive?: boolean }) {
    const category = await this.prisma.businessCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    const data: any = { ...dto };
    if (dto.name) data.slug = slugify(dto.name);
    return this.prisma.businessCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.businessCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return this.prisma.businessCategory.update({ where: { id }, data: { isActive: false } });
  }

  async getApprovals(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const where = { verification: { status: { in: ['Pending', 'Unverified'] } } };

    const [items, total] = await Promise.all([
      this.prisma.business.findMany({
        where: where as any,
        include: { verification: true, owner: { select: { firstName: true, lastName: true, email: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.business.count({ where: where as any }),
    ]);

    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async approveBusiness(businessId: string, action: 'approve' | 'reject', userId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');

    const status = action === 'approve' ? 'Verified' : 'Rejected';
    await this.prisma.businessVerification.upsert({
      where: { businessId },
      create: { businessId, status: status as any, verifiedBy: userId, verifiedAt: new Date() },
      update: { status: status as any, verifiedBy: userId, verifiedAt: new Date() },
    });
    return { message: `Business ${action}d successfully` };
  }
}
