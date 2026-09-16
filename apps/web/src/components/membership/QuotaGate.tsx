'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useBusinessMembership } from '../../hooks/use-business-membership';

interface QuotaGateProps {
  quotaKey: string;
  currentCount: number;
  label?: string;
  children: (props: {
    allowed: boolean;
    max: number;
    current: number;
    isUnlimited: boolean;
    remaining: number;
  }) => React.ReactNode;
}

export const QuotaGate: React.FC<QuotaGateProps> = ({
  quotaKey,
  currentCount,
  children,
}) => {
  const { checkQuota, isPlanActive } = useBusinessMembership();
  const { allowed, max, current, isUnlimited } = checkQuota(quotaKey, currentCount);

  const remaining = isUnlimited ? Infinity : Math.max(0, max - current);

  return <>{children({ allowed, max, current, isUnlimited, remaining })}</>;
};

export const QuotaPill: React.FC<{ quotaKey: string; currentCount: number; label?: string }> = ({
  quotaKey,
  currentCount,
  label,
}) => {
  const { checkQuota } = useBusinessMembership();
  const { allowed, max, current, isUnlimited } = checkQuota(quotaKey, currentCount);

  if (isUnlimited) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Sparkles className="w-3 h-3" /> Unlimited {label}
      </span>
    );
  }

  const isNearLimit = max > 0 && current >= max * 0.8;
  const isAtLimit = !allowed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
        isAtLimit
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : isNearLimit
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-stone-50 text-stone-600 border-stone-200'
      }`}
    >
      {isAtLimit && <AlertCircle className="w-3 h-3 text-rose-500" />}
      {label ? `${label}: ` : ''}
      <strong>{current}</strong> / {max}
      {isAtLimit && (
        <Link href="/dashboard/billing" className="ml-1 underline font-semibold text-rose-600 hover:text-rose-800">
          Upgrade
        </Link>
      )}
    </span>
  );
};
