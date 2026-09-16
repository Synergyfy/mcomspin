import { Injectable } from '@nestjs/common';
import { SystemService, CreatePlanDto, UpdateVariantPriceDto } from '../../system/system.service';

@Injectable()
export class AdminPlansService {
  constructor(private readonly systemService: SystemService) {}

  listPlans() {
    return this.systemService.listUnifiedPlans();
  }

  getPlan(id: string) {
    return this.systemService.getUnifiedPlan(id);
  }

  createPlan(input: CreatePlanDto) {
    return this.systemService.createUnifiedPlan(input);
  }

  repriceVariant(variantId: string, input: UpdateVariantPriceDto) {
    return this.systemService.repriceVariant(variantId, input);
  }
}
