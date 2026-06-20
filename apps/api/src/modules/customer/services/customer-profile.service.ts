import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerUpdateProfileDto } from '../dto/customer-update-profile.dto';

@Injectable()
export class CustomerProfileService {
  constructor(private prisma: PrismaService) {}

  async update(customerId: string, dto: CustomerUpdateProfileDto) {
    const data: any = {};
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.avatarUrl !== undefined) data.avatarUrl = dto.avatarUrl;

    if (dto.interests || dto.categories) {
      const user = await this.prisma.user.findUnique({
        where: { id: customerId },
        select: { metadata: true },
      });
      const metadata: any = (user?.metadata as Record<string, any>) || {};
      if (dto.interests) metadata.interests = dto.interests;
      if (dto.categories) metadata.categories = dto.categories;
      data.metadata = metadata;
    }

    const updated = await this.prisma.user.update({
      where: { id: customerId },
      data,
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        avatarUrl: true, metadata: true,
      },
    });

    await this.prisma.customerActivityLog.create({
      data: {
        customerId,
        activityType: 'View',
        description: 'Updated profile',
      },
    });

    return updated;
  }
}
