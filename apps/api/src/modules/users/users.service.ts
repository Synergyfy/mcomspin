import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        metadata: true,
        roles: {
          select: { role: { select: { name: true } } },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const metadata = (user.metadata ?? {}) as Record<string, any>;
    const permissions = metadata.centralPermissions ?? {};
    const platformSlug = process.env.MCOM_PLATFORM_SLUG || 'spin';
    const hasAccess = permissions[`canAccess_${platformSlug}`] === true || permissions.canAccessSpin === true;

    const { metadata: _, ...userData } = user;
    return {
      ...userData,
      permissions,
      hasAccess,
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
      },
    });
  }
}
