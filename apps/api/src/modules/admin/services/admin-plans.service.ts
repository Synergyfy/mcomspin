import { Injectable } from '@nestjs/common';
import { SystemService, CreatePlanInput, UpdatePlanInput } from '../../system/system.service';

@Injectable()
export class AdminPlansService {
  constructor(private readonly systemService: SystemService) {}

  listPlans() {
    return this.systemService.getPlans();
  }

  getPlan(id: string) {
    return this.systemService.getPlanById(id);
  }

  createPlan(input: CreatePlanInput) {
    return this.systemService.createPlan(input);
  }

  updatePlan(id: string, input: UpdatePlanInput) {
    return this.systemService.updatePlan(id, input);
  }

  deletePlan(id: string) {
    return this.systemService.deletePlan(id);
  }
}
