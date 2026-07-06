import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProfileService } from './customer-profile.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { mockPrisma, mockUser } from '../../../../test/mocks';

describe('CustomerProfileService', () => {
  let service: CustomerProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerProfileService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CustomerProfileService>(CustomerProfileService);
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should update customer profile fields', async () => {
      mockPrisma.user.update.mockResolvedValue({ id: 'cust-1', firstName: 'Jane', lastName: 'Doe', email: 'j@t.com', phone: null, avatarUrl: null, metadata: null });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.customerActivityLog.create.mockResolvedValue({});

      const result = await service.update('cust-1', { firstName: 'Jane' });

      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result.firstName).toBe('Jane');
    });

    it('should update interests in metadata', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, metadata: {} });
      mockPrisma.user.update.mockResolvedValue({ id: 'cust-1', metadata: { interests: ['Food', 'Fashion'] } });
      mockPrisma.customerActivityLog.create.mockResolvedValue({});

      await service.update('cust-1', { interests: ['Food', 'Fashion'] });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ metadata: { interests: ['Food', 'Fashion'] } }) }),
      );
    });
  });
});
