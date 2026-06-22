import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
  });

  const mockContext = (user: any, permissionsMeta?: string[]) => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(permissionsMeta);
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as any;
  };

  it('should allow access when no permissions required', () => {
    const ctx = mockContext({ permissions: ['business:read'] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow access when user has all required permissions', () => {
    const ctx = mockContext(
      { permissions: ['business:read', 'business:write'] },
      ['business:read'],
    );
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should deny access when user lacks permission', () => {
    const ctx = mockContext(
      { permissions: ['business:read'] },
      ['business:delete'],
    );
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should throw if no user', () => {
    const ctx = mockContext(null, ['business:read']);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
