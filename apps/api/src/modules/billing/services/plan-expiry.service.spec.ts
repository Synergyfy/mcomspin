import { PlanExpiryService } from './plan-expiry.service';

describe('PlanExpiryService', () => {
  let service: PlanExpiryService;

  beforeEach(() => {
    service = new PlanExpiryService();
  });

  it('should add 90 days correctly for standard expiry', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const expiry = service.standardExpiry(start);
    expect(expiry.toISOString()).toBe('2026-04-01T00:00:00.000Z');
  });

  it('should add 180 days correctly for pro expiry', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const expiry = service.proExpiry(start);
    expect(expiry.toISOString()).toBe('2026-06-30T00:00:00.000Z');
  });

  it('should add 1 calendar year for pro plus expiry', () => {
    const start = new Date('2026-05-15T12:00:00Z');
    const expiry = service.proPlusExpiry(start);
    expect(expiry.toISOString()).toBe('2027-05-15T12:00:00.000Z');
  });

  it('should clamp leap day (Feb 29) to Feb 28 in non-leap target year', () => {
    const leapDay = new Date('2028-02-29T10:00:00Z');
    const expiry = service.proPlusExpiry(leapDay);
    expect(expiry.toISOString()).toBe('2029-02-28T10:00:00.000Z');
  });
});
