import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockPrisma, mockUser } from '../../../test/mocks';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return current user profile', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
      const result = await controller.getProfile('user-1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update and return user', async () => {
      const updated = { ...mockUser, firstName: 'Updated' };
      jest.spyOn(usersService, 'update').mockResolvedValue(updated as any);
      const result = await controller.updateProfile('user-1', { firstName: 'Updated' });
      expect(result.firstName).toBe('Updated');
    });
  });

  describe('findOne', () => {
    it('should find user by id (admin)', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
      const result = await controller.findOne('user-1');
      expect(result).toEqual(mockUser);
    });
  });
});
