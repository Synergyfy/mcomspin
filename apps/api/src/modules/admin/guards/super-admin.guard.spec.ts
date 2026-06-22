import { SuperAdminGuard } from './super-admin.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../../../common/constants/roles.constant';

describe('SuperAdminGuard', () => {
  let guard: SuperAdminGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new SuperAdminGuard(reflector);
  });

  const mockContext = (user: any) => ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as any;

  it('should allow SuperAdmin access', () => {
    const ctx = mockContext({ roles: [Role.SuperAdmin] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should deny non-SuperAdmin', () => {
    const ctx = mockContext({ roles: [Role.Customer] });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should throw if no user', () => {
    const ctx = mockContext(null);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
