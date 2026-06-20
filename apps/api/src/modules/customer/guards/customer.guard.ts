import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '../../../common/constants/roles.constant';

@Injectable()
export class CustomerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new ForbiddenException('No user found');
    if (!user.roles?.includes(Role.Customer) && !user.roles?.includes(Role.SuperAdmin)) {
      throw new ForbiddenException('Customer access required');
    }
    return true;
  }
}
