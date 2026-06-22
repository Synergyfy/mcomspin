import { Test, TestingModule } from '@nestjs/testing';
import { CustomerSettingsService } from './customer-settings.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma, mockUser } from '../../../../test/mocks';

describe('CustomerSettingsService', () => {
  let service: CustomerSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerSettingsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerSettingsService>(CustomerSettingsService);
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should update notification preferences', async () => {
      mockPrisma.notificationPreference.upsert.mockResolvedValue({});
      mockPrisma.notificationPreference.findMany.mockResolvedValue([{ type: 'Promotional', channel: 'Email', enabled: true }]);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.update('cust-1', {
        notificationPrefs: [{ type: 'Promotional', channel: 'Email', enabled: true }],
      });

      expect(result.notificationPrefs).toHaveLength(1);
      expect(mockPrisma.notificationPreference.upsert).toHaveBeenCalled();
    });

    it('should update language and privacy in metadata', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, metadata: {} });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.notificationPreference.findMany.mockResolvedValue([]);

      await service.update('cust-1', { language: 'en', privacy: { showProfile: true } });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ metadata: { language: 'en', privacy: { showProfile: true } } }) }),
      );
    });
  });
});
