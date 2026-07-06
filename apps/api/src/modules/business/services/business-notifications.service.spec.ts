import { Test, TestingModule } from '@nestjs/testing';
import { BusinessNotificationsService } from './business-notifications.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('BusinessNotificationsService', () => {
  let service: BusinessNotificationsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessNotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BusinessNotificationsService>(BusinessNotificationsService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should send notifications to all unique customers', async () => {
    mockPrisma.gameSession.findMany.mockResolvedValue([
      { customerId: 'cust-1' },
      { customerId: 'cust-2' },
      { customerId: 'cust-1' },
    ]);
    mockPrisma.notification.createMany.mockResolvedValue({ count: 2 });

    const result = await service.send('biz-1', {
      title: 'New Reward',
      message: 'You won a discount!',
      channels: ['Email' as any],
    });

    expect(result.sent).toBe(3);
    expect(mockPrisma.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ userId: 'cust-1', title: 'New Reward' }),
        expect.objectContaining({ userId: 'cust-2' }),
      ]),
    });
  });

  it('should return 0 sent when no customers', async () => {
    mockPrisma.gameSession.findMany.mockResolvedValue([]);

    const result = await service.send('biz-1', {
      title: 'Test',
      message: 'Test message',
      channels: ['Email' as any],
    });

    expect(result.sent).toBe(0);
    expect(mockPrisma.notification.createMany).not.toHaveBeenCalled();
  });
});
