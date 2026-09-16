import { Injectable } from '@nestjs/common';

@Injectable()
export class PlanExpiryService {
  addDays(start: Date, days: number): Date {
    const result = new Date(start);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  }

  addCalendarYear(start: Date): Date {
    const result = new Date(start);
    const targetYear = result.getUTCFullYear() + 1;
    const month = result.getUTCMonth();
    const day = result.getUTCDate();

    // Clamp to last day of month when original day doesn't exist in target year (Feb 29 -> Feb 28)
    const lastDay = new Date(Date.UTC(targetYear, month + 1, 0)).getUTCDate();
    result.setUTCFullYear(targetYear, month, Math.min(day, lastDay));
    return result;
  }

  standardExpiry(start: Date): Date {
    return this.addDays(start, 90);
  }

  proExpiry(start: Date): Date {
    return this.addDays(start, 180);
  }

  proPlusExpiry(start: Date): Date {
    return this.addCalendarYear(start);
  }
}
