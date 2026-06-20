import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

@Injectable()
export class BusinessEventsService {
  constructor(private prisma: PrismaService) {}

  async getEvents(
    businessId: string,
    query: { status?: string; type?: string; page?: number; limit?: number },
  ) {
    const { status, type, page = 1, limit = 20 } = query;
    const where: any = {
      organizerId: businessId,
      organizerType: 'business',
      deletedAt: null,
    };
    if (status) where.status = status;
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: { _count: { select: { registrations: true, checkIns: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startDate: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createEvent(businessId: string, dto: CreateEventDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const event = await this.prisma.event.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        type: dto.type,
        status: 'Draft',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isFree: dto.isFree ?? true,
        ticketPrice: dto.ticketPrice ? Number(dto.ticketPrice) : undefined,
        capacity: dto.capacity,
        imageUrl: dto.imageUrl,
        organizerId: businessId,
        organizerType: 'business',
        registrationType: dto.registrationType,
        promotionSettings: dto.promotionSettings,
        location: dto.location
          ? {
              create: {
                addressLine1: dto.location.addressLine1 || '',
                city: dto.location.city || '',
                ...dto.location,
              },
            }
          : undefined,
      },
    });

    return event;
  }

  async updateEvent(businessId: string, id: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findFirst({
      where: { id, organizerId: businessId, organizerType: 'business' },
    });
    if (!event) throw new NotFoundException('Event not found');

    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        ticketPrice: dto.ticketPrice ? Number(dto.ticketPrice) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async checkIn(businessId: string, eventId: string, registrationId?: string) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, organizerId: businessId, organizerType: 'business' },
    });
    if (!event) throw new NotFoundException('Event not found');

    if (registrationId) {
      const registration = await this.prisma.eventRegistration.findUnique({
        where: { id: registrationId },
      });
      if (!registration) throw new NotFoundException('Registration not found');

      const existingCheckIn = await this.prisma.eventCheckIn.findUnique({
        where: { registrationId },
      });
      if (existingCheckIn) return { message: 'Already checked in', checkIn: existingCheckIn };

      return this.prisma.eventCheckIn.create({
        data: {
          eventId,
          registrationId,
          customerId: registration.customerId,
          checkedInAt: new Date(),
        },
      });
    }

    return this.prisma.eventCheckIn.create({
      data: {
        eventId,
        checkedInAt: new Date(),
      },
    });
  }
}
