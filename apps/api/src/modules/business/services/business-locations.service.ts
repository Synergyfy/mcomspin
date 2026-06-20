import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';

@Injectable()
export class BusinessLocationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string) {
    return this.prisma.businessLocation.findMany({
      where: { businessId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(businessId: string, dto: CreateLocationDto) {
    return this.prisma.businessLocation.create({
      data: {
        businessId,
        name: dto.name,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        postcode: dto.postcode,
        latitude: dto.latitude,
        longitude: dto.longitude,
        isPrimary: dto.isPrimary,
        metadata: dto.metadata,
      },
    });
  }

  async update(businessId: string, id: string, dto: UpdateLocationDto) {
    const location = await this.prisma.businessLocation.findFirst({
      where: { id, businessId, deletedAt: null },
    });
    if (!location) throw new NotFoundException('Location not found');

    return this.prisma.businessLocation.update({
      where: { id },
      data: dto,
    });
  }

  async remove(businessId: string, id: string) {
    const location = await this.prisma.businessLocation.findFirst({
      where: { id, businessId, deletedAt: null },
    });
    if (!location) throw new NotFoundException('Location not found');

    await this.prisma.businessLocation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
