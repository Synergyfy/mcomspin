'use client';

import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export interface PlanVariantConfig {
  quotas?: Record<string, number>;
  featureFlags?: Record<string, boolean>;
}

export interface ActiveMembership {
  id: string;
  userId: string;
  isActive: boolean;
  isTrial: boolean;
  startDate: string;
  expiresAt: string;
  endDate: string;
  planVariant: {
    id: string;
    features: string[];
    configuration: PlanVariantConfig;
    tierLevel: {
      id: string;
      name: 'STANDARD' | 'PRO' | 'PRO_PLUS';
      durationDays?: number | null;
      isCalendarYear: boolean;
    };
    plan: {
      id: string;
      name: string;
      slug: string;
      description?: string;
    };
  };
  price: {
    id: string;
    amount: number;
    currency: string;
  };
}

export function useBusinessMembership() {
  const query = useQuery<{ membership: ActiveMembership | null; isUnified: boolean }>({
    queryKey: ['business', 'membership'],
    queryFn: async () => {
      const res = await api.get('/business/membership');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const membership = query.data?.membership ?? null;

  // Active validation: Must be marked isActive AND not passed expiration timestamp
  const now = new Date();
  const isNotExpired = membership ? new Date(membership.expiresAt) > now : false;
  const isPlanActive = Boolean(membership?.isActive && isNotExpired);

  const tierName = isPlanActive ? membership?.planVariant?.tierLevel?.name ?? null : null;
  const planName = isPlanActive ? membership?.planVariant?.plan?.name ?? null : null;

  const daysRemaining = membership && isPlanActive
    ? Math.max(0, Math.ceil((new Date(membership.expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const featureFlags = (membership?.planVariant?.configuration?.featureFlags ?? {}) as Record<string, boolean>;
  const quotas = (membership?.planVariant?.configuration?.quotas ?? {}) as Record<string, number>;

  const hasFeature = (flagKey: string): boolean => {
    if (!isPlanActive) return false;
    return Boolean(featureFlags[flagKey]);
  };

  const checkQuota = (quotaKey: string, currentCount: number) => {
    if (!isPlanActive) {
      return { allowed: false, max: 0, current: currentCount, isUnlimited: false };
    }
    const max = quotas[quotaKey] ?? 0;
    if (max === -1) {
      return { allowed: true, max: -1, current: currentCount, isUnlimited: true };
    }
    return {
      allowed: currentCount < max,
      max,
      current: currentCount,
      isUnlimited: false,
    };
  };

  return {
    ...query,
    membership,
    isPlanActive,
    isExpired: Boolean(membership && !isNotExpired),
    tierName,
    planName,
    daysRemaining,
    featureFlags,
    quotas,
    hasFeature,
    checkQuota,
  };
}
