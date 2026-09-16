import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  REQUIRE_ACTIVE_PLAN_KEY,
  REQUIRE_FEATURE_KEY,
  REQUIRE_QUOTA_KEY,
} from '../decorators/plan-capability.decorator';
import { PlanCapabilityService } from '../../modules/billing/services/plan-capability.service';
import { Role } from '../constants/roles.constant';

@Injectable()
export class PlanCapabilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly planCapabilityService: PlanCapabilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new ForbiddenException('User authentication required');

    // SuperAdmin bypasses plan restrictions
    if (user.roles?.includes(Role.SuperAdmin)) {
      return true;
    }

    const businessId = request.businessId || request.business?.id;

    // Check 1: Require Active Plan
    const requireActivePlan = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_ACTIVE_PLAN_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Check 2: Require Feature
    const requiredFeature = this.reflector.getAllAndOverride<string>(
      REQUIRE_FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Check 3: Require Quota
    const requiredQuota = this.reflector.getAllAndOverride<string>(
      REQUIRE_QUOTA_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no plan capability decorator is specified, allow through
    if (!requireActivePlan && !requiredFeature && !requiredQuota) {
      return true;
    }

    // 1. Validate Active Non-Expired Plan
    if (requireActivePlan) {
      const result = await this.planCapabilityService.requireActivePlan(user.id);
      if (!result.allowed) {
        throw new ForbiddenException(result.reason);
      }
    }

    // 2. Validate Feature Capability
    if (requiredFeature) {
      const result = await this.planCapabilityService.requireFeature(user.id, requiredFeature);
      if (!result.allowed) {
        throw new ForbiddenException(result.reason);
      }
    }

    // 3. Validate Quota Limit
    if (requiredQuota) {
      if (!businessId) {
        throw new ForbiddenException('Business context required to evaluate plan quota');
      }
      const result = await this.planCapabilityService.requireQuota(user.id, businessId, requiredQuota);
      if (!result.allowed) {
        throw new ForbiddenException(result.reason);
      }
    }

    return true;
  }
}
