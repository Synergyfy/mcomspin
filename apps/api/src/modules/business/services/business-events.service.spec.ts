import { Test, TestingModule } from '@nestjs/testing';
import { BusinessEventsService } from './business-events.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('BusinessEventsService', () => {
  let service: BusinessEventsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessEventsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BusinessEventsService>(BusinessEventsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should return paginated events', async () => {
      mockPrisma.event.findMany.mockResolvedValue([
        { id: 'evt-1', name: 'Summer Workshop', _count: { registrations: 5, checkIns: 2 } },
      ]);
      mockPrisma.event.count.mockResolvedValue(1);

      const result = await service.getEvents('biz-1', {});
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrisma.event.findMany.mockResolvedValue([]);
      mockPrisma.event.count.mockResolvedValue(0);

      await service.getEvents('biz-1', { status: 'Published' });
      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'Published' }),
        }),
      );
    });
  });

  describe('createEvent', () => {
    it('should create an event with slug', async () => {
      mockPrisma.event.create.mockResolvedValue({ id: 'evt-1', name: 'Grand Opening' });

      const result = await service.createEvent('biz-1', {
        name: 'Grand Opening',
        type: 'Launch' as any,
        startDate: '2026-08-01',
        endDate: '2026-08-01',
      });
      expect(result.id).toBe('evt-1');
      expect(mockPrisma.event.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Grand Opening',
            slug: 'grand-opening',
            status: 'Draft',
          }),
        }),
      );
    });
  });

  describe('updateEvent', () => {
    it('should update existing event', async () => {
      mockPrisma.event.findFirst.mockResolvedValue({ id: 'evt-1', organizerId: 'biz-1', organizerType: 'business' });
      mockPrisma.event.update.mockResolvedValue({ id: 'evt-1', name: 'Updated' });

      const result = await service.updateEvent('biz-1', 'evt-1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw when not found', async () => {
      mockPrisma.event.findFirst.mockResolvedValue(null);
      await expect(service.updateEvent('biz-1', 'bogus', {})).rejects.toThrow('Event not found');
    });
  });

  describe('checkIn', () => {
    it('should check in a registration', async () => {
      mockPrisma.event.findFirst.mockResolvedValue({ id: 'evt-1', organizerId: 'biz-1', organizerType: 'business' });
      mockPrisma.eventRegistration.findUnique.mockResolvedValue({ id: 'reg-1', customerId: 'cust-1' });
      mockPrisma.eventCheckIn.findUnique.mockResolvedValue(null);
      mockPrisma.eventCheckIn.create.mockResolvedValue({ id: 'ci-1' });

      const result = await service.checkIn('biz-1', 'evt-1', 'reg-1') as any;
      expect(result.id).toBe('ci-1');
    });

    it('should return existing check-in if already done', async () => {
      mockPrisma.event.findFirst.mockResolvedValue({ id: 'evt-1', organizerId: 'biz-1' });
      mockPrisma.eventRegistration.findUnique.mockResolvedValue({ id: 'reg-1', customerId: 'cust-1' });
      mockPrisma.eventCheckIn.findUnique.mockResolvedValue({ id: 'ci-1', checkedInAt: new Date() });

      const result = await service.checkIn('biz-1', 'evt-1', 'reg-1') as any;
      expect(result.checkIn.id).toBe('ci-1');
      expect(result.message).toBe('Already checked in');
    });

    it('should throw for missing event', async () => {
      mockPrisma.event.findFirst.mockResolvedValue(null);
      await expect(service.checkIn('biz-1', 'bogus', 'reg-1')).rejects.toThrow('Event not found');
    });
  });
});
