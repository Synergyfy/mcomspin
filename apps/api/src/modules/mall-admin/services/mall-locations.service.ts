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
export class MallLocationsService {
  constructor(private prisma: PrismaService) {}

  async getBoroughs() {
    return this.prisma.borough.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { highStreets: true } } },
    });
  }

  async getBorough(id: string) {
    const borough = await this.prisma.borough.findUnique({
      where: { id },
      include: { highStreets: true },
    });
    if (!borough) throw new NotFoundException('Borough not found');
    return borough;
  }

  async createBorough(dto: { name: string; description?: string; region?: string; isActive?: boolean }) {
    const slug = slugify(dto.name);
    return this.prisma.borough.create({ data: { ...dto, slug } });
  }

  async updateBorough(id: string, dto: { name?: string; description?: string; region?: string; isActive?: boolean }) {
    const borough = await this.prisma.borough.findUnique({ where: { id } });
    if (!borough) throw new NotFoundException('Borough not found');
    const data: any = { ...dto };
    if (dto.name) data.slug = slugify(dto.name);
    return this.prisma.borough.update({ where: { id }, data });
  }

  async deleteBorough(id: string) {
    const borough = await this.prisma.borough.findUnique({ where: { id } });
    if (!borough) throw new NotFoundException('Borough not found');
    return this.prisma.borough.update({ where: { id }, data: { isActive: false } });
  }

  async getBoroughBusinesses(boroughId: string, query: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = query;
    const where = { businessLocations: { some: { highStreet: { boroughId } } }, deletedAt: null };

    const [items, total] = await Promise.all([
      this.prisma.business.findMany({ where: where as any, skip: (page - 1) * limit, take: limit }),
      this.prisma.business.count({ where: where as any }),
    ]);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getBoroughAnalytics(boroughId: string) {
    return this.prisma.business.count({
      where: { businessLocations: { some: { highStreet: { boroughId } } }, deletedAt: null } as any,
    });
  }

  async getHighStreets() {
    return this.prisma.highStreet.findMany({
      orderBy: { name: 'asc' },
      include: { borough: true, _count: { select: { storefrontClusters: true } } },
    });
  }

  async getHighStreet(id: string) {
    const hs = await this.prisma.highStreet.findUnique({
      where: { id },
      include: { borough: true, storefrontClusters: true },
    });
    if (!hs) throw new NotFoundException('High street not found');
    return hs;
  }

  async createHighStreet(dto: { name: string; boroughId: string; description?: string; isActive?: boolean }) {
    const slug = slugify(dto.name);
    return this.prisma.highStreet.create({ data: { ...dto, slug } });
  }

  async updateHighStreet(id: string, dto: { name?: string; description?: string; isActive?: boolean }) {
    const hs = await this.prisma.highStreet.findUnique({ where: { id } });
    if (!hs) throw new NotFoundException('High street not found');
    const data: any = { ...dto };
    if (dto.name) data.slug = slugify(dto.name);
    return this.prisma.highStreet.update({ where: { id }, data });
  }

  async deleteHighStreet(id: string) {
    const hs = await this.prisma.highStreet.findUnique({ where: { id } });
    if (!hs) throw new NotFoundException('High street not found');
    return this.prisma.highStreet.update({ where: { id }, data: { isActive: false } });
  }

  async getHighStreetBusinesses(highStreetId: string) {
    return this.prisma.business.findMany({
      where: { businessLocations: { some: { highStreetId } }, deletedAt: null } as any,
    });
  }
}
