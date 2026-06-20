import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../constants/roles.constant';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const mockContext = (user: any, rolesMeta?: Role[]) => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(rolesMeta);
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as any;
  };

  it('should allow access when no roles required', () => {
    const ctx = mockContext({ roles: ['Customer'] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow access when user has required role', () => {
    const ctx = mockContext({ roles: ['SuperAdmin'] }, [Role.SuperAdmin]);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should deny access when user lacks role', () => {
    const ctx = mockContext({ roles: ['Customer'] }, [Role.SuperAdmin]);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should throw if no user', () => {
    const ctx = mockContext(null, [Role.Customer]);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
