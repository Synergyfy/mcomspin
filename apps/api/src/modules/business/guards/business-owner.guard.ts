import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role } from '../../../common/constants/roles.constant';

@Injectable()
export class BusinessOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const businessId = request.params?.businessId || request.body?.businessId || request.query?.businessId;

    if (!user) throw new ForbiddenException('No user found');

    if (user.roles?.includes(Role.SuperAdmin)) return true;

    if (!businessId) {
      const business = await this.prisma.business.findFirst({
        where: { ownerId: user.id, deletedAt: null },
      });
      if (!business) throw new ForbiddenException('No business found for this user');
      request.business = business;
      request.businessId = business.id;
      return true;
    }

    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');

    const isOwner = business.ownerId === user.id;
    if (isOwner) {
      request.business = business;
      request.businessId = business.id;
      return true;
    }

    const isStaff = await this.prisma.businessStaff.findFirst({
      where: { businessId, userId: user.id, isActive: true },
    });
    if (isStaff) {
      request.business = business;
      request.businessId = business.id;
      request.staffRole = isStaff.role;
      request.staffPermissions = isStaff.permissions;
      return true;
    }

    throw new ForbiddenException('Not authorized for this business');
  }
}
