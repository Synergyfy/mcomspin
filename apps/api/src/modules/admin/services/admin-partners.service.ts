import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePartnerDto, PartnerRole } from '../dto/create-partner.dto';
import { UpdatePartnerDto } from '../dto/update-partner.dto';

@Injectable()
export class AdminPartnersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; role?: string }) {
    const { page = 1, limit = 20, role } = query;
    const where: any = {
      deletedAt: null,
    };

    if (role) {
      where.roles = { some: { role: { name: PartnerRole[role as keyof typeof PartnerRole] } } };
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          _count: { select: { ownedBusinesses: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async create(dto: CreatePartnerDto) {
    const roleName = PartnerRole[dto.role as keyof typeof PartnerRole] || dto.role;

    let role = await this.prisma.role.findUnique({ where: { name: roleName as any } });
    if (!role) {
      role = await this.prisma.role.create({
        data: { name: roleName as any, isSystem: true },
      });
    }

    const passwordHash = '';
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        metadata: dto.metadata,
        roles: { create: { roleId: role.id } },
      },
    });

    return user;
  }

  async update(id: string, dto: UpdatePartnerDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Partner not found');

    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        metadata: dto.metadata,
      },
    });
  }
}
