'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Zap,
  Rocket,
  Shield,
  CheckCircle2,
  Lock,
  Loader2,
  AlertCircle,
  CreditCard,
  Wallet,
  ArrowRight,
  Check,
  X,
  Calendar,
  Sparkles,
} from 'lucide-react';

import api from '@/services/api';

interface ActiveMembership {
  id: string;
  isActive: boolean;
  isTrial: boolean;
  startDate: string;
  expiresAt: string;
  endDate: string;
  planVariant: {
    id: string;
    features: string[];
    configuration: {
      quotas?: Record<string, number>;
      featureFlags?: Record<string, boolean>;
    };
    plan: {
      id: string;
      name: string;
      description?: string;
    };
    tierLevel: {
      name: 'STANDARD' | 'PRO' | 'PRO_PLUS';
      durationDays?: number | null;
      isCalendarYear: boolean;
    };
  };
  price: {
    amount: number;
    currency: string;
  };
}

interface PlanVariant {
  id: string;
  features: string[];
  configuration: {
    quotas?: Record<string, number>;
    featureFlags?: Record<string, boolean>;
  };
  tierLevel: {
    name: 'STANDARD' | 'PRO' | 'PRO_PLUS';
  };
  prices: Array<{
    id: string;
    amount: number;
    currency: string;
  }>;
}

interface UnifiedPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  variants: PlanVariant[];
}

export default function BusinessMembershipPage() {
  const [membershipData, setMembershipData] = useState<ActiveMembership | null>(null);
  const [plans, setPlans] = useState<UnifiedPlan[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<'STANDARD' | 'PRO' | 'PRO_PLUS'>('PRO');
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutVariant, setCheckoutVariant] = useState<{ planName: string; variant: PlanVariant; price: number } | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<'mcom_wallet' | 'stripe' | 'paypal'>('mcom_wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [memRes, plansRes] = await Promise.all([
        api.get('/business/membership'),
        api.get('/business/membership/plans'),
      ]);

      const memData = memRes.data?.data ?? memRes.data;
      setMembershipData(memData.membership || null);

      const plansData = plansRes.data?.data ?? plansRes.data;
      setPlans(Array.isArray(plansData) ? plansData : plansData?.data || []);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInitiateAndVerify = async () => {
    if (!checkoutVariant) return;
    setIsProcessing(true);
    setMsg(null);

    try {
      // 1. Initiate
      const initRes = await api.post('/business/membership/initiate-payment', {
        provider: paymentProvider,
        planVariantId: checkoutVariant.variant.id,
      });

      const initData = initRes.data?.data ?? initRes.data;

      const transactionId = initData.transactionId || initData.orderId || initData.clientSecret;
      const holdId = initData.holdId;

      if (paymentProvider === 'paypal' && initData.approvalUrl) {
        window.location.href = initData.approvalUrl;
        return;
      }

      // 2. Verify / Capture
      await api.post('/business/membership/verify-payment', {
        provider: paymentProvider,
        planVariantId: checkoutVariant.variant.id,
        holdId,
        transactionId,
      });

      setMsg({ type: 'success', text: 'Membership activated successfully!' });
      setCheckoutVariant(null);
      fetchData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.error?.message || err.response?.data?.message || err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const activeVariant = membershipData?.planVariant;
  const activePlanName = activeVariant?.plan?.name ?? 'Free Tier';
  const activeTierLabel = activeVariant?.tierLevel?.name === 'PRO_PLUS' ? 'Pro+ (1 Calendar Year)' : activeVariant?.tierLevel?.name === 'PRO' ? 'Pro (180 Days)' : activeVariant?.tierLevel?.name === 'STANDARD' ? 'Standard (90 Days)' : 'Free';
  const activeExpiry = membershipData?.expiresAt ? new Date(membershipData.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 font-sans">
      {/* ─── 1. ACTIVE MEMBERSHIP HEADER BANNER ─── */}
      <div className="bg-[#1a1a1a] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-stone-800">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#f97316] font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Your Active Subscription
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              {activePlanName} · <span className="text-[#f97316]">{activeTierLabel}</span>
            </h1>
            <p className="text-xs text-stone-400 flex items-center gap-4">
              <span>Renews on <strong className="text-white">{activeExpiry}</strong></span>
              <span>•</span>
              <span>Billing Cycle: <strong className="text-white">{activeTierLabel} · Billed Once</strong></span>
            </p>
          </div>
          {!membershipData && (
            <div className="bg-[#f97316]/10 border border-[#f97316]/30 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#f97316]" />
              <div className="text-xs">
                <p className="font-bold text-white">Free Plan Active</p>
                <p className="text-stone-400">Upgrade to unlock advanced listings, custom branding & analytics.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <AlertCircle className="w-4 h-4" /> {msg.text}
        </div>
      )}

      {/* ─── 2. YOUR PLAN PRIVILEGES MATRIX ─── */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h2 className="font-black text-lg text-stone-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#f97316]" /> Your Plan Privileges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-green-50/60 border border-green-100 space-y-1">
            <div className="flex items-center gap-2 text-green-700 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Active Quotas & Benefits
            </div>
            <p className="text-stone-600">Listings Allowance: <strong>{activeVariant?.configuration?.quotas?.maxListings ?? 5}</strong></p>
            <p className="text-stone-600">Search Placement: <strong>{activeVariant?.configuration?.featureFlags?.priorityInSearch ? 'Priority Boosted' : 'Standard'}</strong></p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <Lock className="w-4 h-4" /> Locked Privileges
            </div>
            <p className="text-stone-600">Custom Branding: {activeVariant?.configuration?.featureFlags?.allowCustomBranding ? 'Unlocked' : 'Requires Pro/Pro+'}</p>
            <p className="text-stone-600">Realtime Analytics: {activeVariant?.configuration?.featureFlags?.advancedAnalytics ? 'Unlocked' : 'Requires Pro+'}</p>
          </div>
        </div>
      </div>

      {/* ─── 3. DURATION SELECTOR (VARIANT TABS) ─── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-stone-900">Select Plan Commitment Duration</h2>
            <p className="text-xs text-stone-500">Choose commitment duration to view matching pricing across plans.</p>
          </div>

          <div className="flex bg-stone-100 p-1.5 rounded-2xl gap-1">
            <button
              onClick={() => setSelectedDuration('STANDARD')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${selectedDuration === 'STANDARD' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Standard (90d)
            </button>
            <button
              onClick={() => setSelectedDuration('PRO')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${selectedDuration === 'PRO' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              <Rocket className="w-3.5 h-3.5 text-[#f97316]" /> Pro (180d)
            </button>
            <button
              onClick={() => setSelectedDuration('PRO_PLUS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${selectedDuration === 'PRO_PLUS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              <Crown className="w-3.5 h-3.5 text-yellow-500" /> Pro+ (1yr)
            </button>
          </div>
        </div>

        {/* ─── 4. PLAN CARDS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const variant = plan.variants.find((v) => v.tierLevel.name === selectedDuration);
            if (!variant) return null;

            const activePrice = variant.prices[0];
            const priceVal = activePrice ? Number(activePrice.amount) : 0;
            const isCurrent = activeVariant?.id === variant.id;

            return (
              <div key={plan.id} className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between relative transition-all ${isCurrent ? 'border-[#f97316] ring-2 ring-[#f97316]/20' : 'border-stone-200 hover:border-stone-400'}`}>
                {isCurrent && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-[#f97316] text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                    Active Tier
                  </span>
                )}
                <div>
                  <h3 className="font-black text-xl text-stone-900">{plan.name}</h3>
                  <p className="text-xs text-stone-500 mt-1">{plan.description || 'Commercial Package'}</p>

                  <div className="my-6">
                    <div className="text-3xl font-black text-stone-900">£{priceVal.toFixed(2)}</div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {selectedDuration === 'PRO_PLUS' ? '1 year access · billed once' : selectedDuration === 'PRO' ? '180 days access · billed once' : '90 days access · billed once'}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-stone-100 pt-4 mb-6">
                    {variant.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={isCurrent}
                  onClick={() => setCheckoutVariant({ planName: plan.name, variant, price: priceVal })}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${isCurrent ? 'bg-stone-100 text-stone-400 cursor-not-allowed' : 'bg-[#1a1a1a] hover:bg-[#f97316] text-white shadow-sm'}`}
                >
                  {isCurrent ? 'Active Tier' : `Subscribe · £${priceVal.toFixed(2)}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 5. IN-PLACE CHECKOUT MODAL / CLIENT ─── */}
      <AnimatePresence>
        {checkoutVariant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-black text-lg text-stone-900">In-Place Checkout</h3>
                  <p className="text-xs text-stone-500">{checkoutVariant.planName} · {checkoutVariant.variant.tierLevel.name}</p>
                </div>
                <button onClick={() => setCheckoutVariant(null)} className="p-2 hover:bg-stone-100 rounded-xl">
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl flex items-center justify-between text-xs font-bold text-stone-800">
                <span>Total Due Billed Once:</span>
                <span className="text-lg font-black text-stone-900">£{checkoutVariant.price.toFixed(2)}</span>
              </div>

              {/* Payment Rail Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-stone-400 tracking-widest block">Select MCOM Payment Rail</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentProvider('mcom_wallet')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${paymentProvider === 'mcom_wallet' ? 'border-[#f97316] bg-[#f97316]/5 ring-2 ring-[#f97316]/20' : 'border-stone-200'}`}
                  >
                    <Wallet className="w-5 h-5 text-[#f97316] mb-2" />
                    <span className="text-xs font-bold block">MCOM Wallet</span>
                    <span className="text-[9px] text-stone-400">Hold & Capture</span>
                  </button>

                  <button
                    onClick={() => setPaymentProvider('stripe')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${paymentProvider === 'stripe' ? 'border-[#f97316] bg-[#f97316]/5 ring-2 ring-[#f97316]/20' : 'border-stone-200'}`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-600 mb-2" />
                    <span className="text-xs font-bold block">Card (Stripe)</span>
                    <span className="text-[9px] text-stone-400">Centralized</span>
                  </button>

                  <button
                    onClick={() => setPaymentProvider('paypal')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${paymentProvider === 'paypal' ? 'border-[#f97316] bg-[#f97316]/5 ring-2 ring-[#f97316]/20' : 'border-stone-200'}`}
                  >
                    <ArrowRight className="w-5 h-5 text-blue-500 mb-2" />
                    <span className="text-xs font-bold block">PayPal</span>
                    <span className="text-[9px] text-stone-400">Redirect</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleInitiateAndVerify}
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#1a1a1a] hover:bg-[#f97316] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm & Activate Membership
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
