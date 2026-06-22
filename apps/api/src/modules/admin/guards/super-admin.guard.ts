import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../common/constants/roles.constant';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('No user found');

    const hasSuperAdmin = user.roles?.includes(Role.SuperAdmin);
    if (!hasSuperAdmin) throw new ForbiddenException('SuperAdmin access required');
    return true;
  }
}
