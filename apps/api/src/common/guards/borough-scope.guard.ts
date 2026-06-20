import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/roles.constant';

export const BOROUGH_SCOPED_KEY = 'boroughScoped';

@Injectable()
export class BoroughScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isScoped = this.reflector.getAllAndOverride<boolean>(BOROUGH_SCOPED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isScoped) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const boroughId = request.params?.boroughId || request.query?.boroughId || request.body?.boroughId;

    if (!user) throw new ForbiddenException('No user found');

    const isSuperAdmin = user.roles?.includes(Role.SuperAdmin);
    if (isSuperAdmin) return true;

    if (user.roles?.includes(Role.BoroughAdmin)) {
      if (!user.boroughId) throw new ForbiddenException('Admin has no borough assigned');
      if (boroughId && user.boroughId !== boroughId) {
        throw new ForbiddenException('Cannot access resources outside your borough');
      }
      return true;
    }

    return true;
  }
}
