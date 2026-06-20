import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  it('should allow access to public routes', () => {
    const getHandler = jest.fn();
    const getClass = jest.fn();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const context = {
      getHandler,
      getClass,
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as any;

    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException for invalid token', () => {
    const err = new UnauthorizedException('Invalid token');
    expect(() => guard.handleRequest(err, null)).toThrow(UnauthorizedException);
  });

  it('should return user for valid token', () => {
    const user = { id: '1', email: 'test@test.com' };
    const result = guard.handleRequest(null, user);
    expect(result).toEqual(user);
  });
});
