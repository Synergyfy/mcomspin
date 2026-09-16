'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { useBusinessMembership } from '../../hooks/use-business-membership';

interface FeatureGateProps {
  feature: string;
  title?: string;
  description?: string;
  requiredTier?: 'STANDARD' | 'PRO' | 'PRO_PLUS';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  title = 'Premium Feature Locked',
  description,
  requiredTier = 'PRO',
  children,
  fallback,
}) => {
  const { hasFeature, isPlanActive, isExpired, tierName, isLoading } = useBusinessMembership();

  if (isLoading) {
    return <div className="animate-pulse bg-stone-100 rounded-2xl h-48 w-full" />;
  }

  const isUnlocked = hasFeature(feature);

  if (isUnlocked) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const tierLabel = requiredTier === 'PRO_PLUS' ? 'Pro+' : requiredTier === 'PRO' ? 'Pro' : 'Standard';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-b from-stone-50/80 to-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner">
        {isExpired ? <ShieldAlert className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
      </div>

      <h3 className="mt-4 text-base font-bold text-stone-900">
        {isExpired ? 'Subscription Expired' : title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-stone-500">
        {description ??
          (isExpired
            ? 'Your membership duration has ended. Renew your plan to regain access to this capability.'
            : `This capability is available on the ${tierLabel} plan. Upgrade to unlock realtime analytics, priority boosts, and full platform power.`)}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-800 hover:shadow"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          {isExpired ? 'Renew Membership' : `Upgrade to ${tierLabel}`}
          <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
        </Link>
      </div>

      {tierName && (
        <div className="mt-4 text-[10px] text-stone-400">
          Current Plan: <span className="font-semibold text-stone-600">{tierName}</span>
        </div>
      )}
    </div>
  );
};
