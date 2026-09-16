import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ACTIVE_PLAN_KEY = 'require_active_plan';
export const REQUIRE_FEATURE_KEY = 'require_feature';
export const REQUIRE_QUOTA_KEY = 'require_quota';

/** Requires the business owner to have an active, non-expired membership (STANDARD, PRO, or PRO_PLUS). */
export const RequireActivePlan = () => SetMetadata(REQUIRE_ACTIVE_PLAN_KEY, true);

/** Requires a specific boolean feature flag to be enabled in the active plan configuration. */
export const RequireFeature = (featureKey: string) => SetMetadata(REQUIRE_FEATURE_KEY, featureKey);

/** Requires the business to have available quota (e.g. maxActiveGames, maxActiveCampaigns, maxRewards, maxTeamMembers). */
export const RequireQuota = (quotaKey: string) => SetMetadata(REQUIRE_QUOTA_KEY, quotaKey);
