import { Test, TestingModule } from '@nestjs/testing';
import { CustomerNotificationsService } from './customer-notifications.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma } from '../../../../test/mocks';

describe('CustomerNotificationsService', () => {
  let service: CustomerNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerNotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerNotificationsService>(CustomerNotificationsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated notifications', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([{ id: 'n-1', title: 'Welcome', isRead: false }]);
      mockPrisma.notification.count.mockResolvedValue(1);

      const result = await service.findAll('cust-1', {});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.markAsRead('cust-1', 'n-1');

      expect(result.message).toBe('Notification marked as read');
    });
  });
});
