import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerEventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; type?: string; borough?: string }) {
    const { page = 1, limit = 20, type, borough } = query;
    const where: any = { status: 'Published', startDate: { gte: new Date() }, deletedAt: null };
    if (type) where.type = type;
    if (borough) where.location = { borough: { name: { equals: borough, mode: 'insensitive' } } };

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: {
          _count: { select: { registrations: true } },
          location: { select: { label: true, addressLine1: true, city: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startDate: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id, deletedAt: null },
      include: {
        _count: { select: { registrations: true } },
        location: true,
      },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async join(eventId: string, customerId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId, deletedAt: null } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.status !== 'Published') throw new NotFoundException('Event is not open for registration');
    if (event.capacity && event.registeredCount >= event.capacity) {
      throw new ConflictException('Event is at full capacity');
    }

    const existing = await this.prisma.eventRegistration.findUnique({
      where: { eventId_customerId: { eventId, customerId } },
    });
    if (existing) throw new ConflictException('Already registered for this event');

    const [registration] = await this.prisma.$transaction([
      this.prisma.eventRegistration.create({
        data: { eventId, customerId, status: 'confirmed' },
      }),
      this.prisma.event.update({
        where: { id: eventId },
        data: { registeredCount: { increment: 1 } },
      }),
    ]);
    return registration;
  }
}
