import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import { InviteStaffDto } from '../dto/invite-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';

@Injectable()
export class BusinessStaffService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string) {
    return this.prisma.businessStaff.findMany({
      where: { businessId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
      orderBy: { invitedAt: 'desc' },
    });
  }

  async invite(businessId: string, dto: InviteStaffDto) {
    let user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      const nameParts = dto.name.trim().split(/\s+/);
      const firstName = nameParts[0] || dto.email.split('@')[0];
      const lastName = nameParts.slice(1).join(' ') || '';
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const passwordHash = await bcrypt.hash(tempPassword, 12);
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName,
          lastName,
          roles: { create: { role: { connect: { name: 'Staff' as any } } } },
        },
      });

      const staffRecord = await this.prisma.businessStaff.create({
        data: {
          businessId,
          userId: user.id,
          role: dto.role,
          permissions: dto.permissions,
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      });

      return {
        staff: staffRecord,
        tempPassword,
        message: 'Staff created. Share the temporary password with them securely.',
      };
    }

    const existing = await this.prisma.businessStaff.findFirst({
      where: { businessId, userId: user.id },
    });
    if (existing) throw new ConflictException('Staff member already exists');

    const staffRecord = await this.prisma.businessStaff.create({
      data: {
        businessId,
        userId: user.id,
        role: dto.role,
        permissions: dto.permissions,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return { staff: staffRecord, tempPassword: null, message: 'Staff added from existing user.' };
  }

  async update(businessId: string, id: string, dto: UpdateStaffDto) {
    const staff = await this.prisma.businessStaff.findFirst({
      where: { id, businessId },
    });
    if (!staff) throw new NotFoundException('Staff member not found');

    return this.prisma.businessStaff.update({
      where: { id },
      data: {
        role: dto.role,
        permissions: dto.permissions,
        isActive: dto.isActive,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async remove(businessId: string, id: string) {
    const staff = await this.prisma.businessStaff.findFirst({
      where: { id, businessId },
    });
    if (!staff) throw new NotFoundException('Staff member not found');

    await this.prisma.businessStaff.delete({ where: { id } });
  }
}
