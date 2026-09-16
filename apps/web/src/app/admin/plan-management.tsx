'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
  Zap,
  Rocket,
  DollarSign,
  Layers,
} from 'lucide-react';

interface PlanPrice {
  id: string;
  amount: number;
  currency: string;
  isActive: boolean;
}

interface PlanVariant {
  id: string;
  features: string[];
  configuration: {
    quotas?: Record<string, number>;
    featureFlags?: Record<string, boolean>;
  };
  tierLevel: {
    id: string;
    name: 'STANDARD' | 'PRO' | 'PRO_PLUS';
    durationDays?: number | null;
    isCalendarYear: boolean;
  };
  prices: PlanPrice[];
}

interface UnifiedPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  variants: PlanVariant[];
}

const QUOTA_FIELDS = [
  { key: 'maxListings', label: 'Max Listings' },
  { key: 'maxProducts', label: 'Max Products' },
  { key: 'maxServices', label: 'Max Services' },
  { key: 'maxGiftCardTemplates', label: 'Max Gift Card Templates' },
  { key: 'maxCouponTemplates', label: 'Max Coupon Templates' },
  { key: 'maxLoyaltyPrograms', label: 'Max Loyalty Programs' },
  { key: 'maxImagesPerListing', label: 'Max Images Per Listing' },
  { key: 'featuredListingAllowance', label: 'Featured Listing Allowance' },
];

const FLAG_FIELDS = [
  { key: 'priorityInSearch', label: 'Priority Ranking in Search' },
  { key: 'advancedAnalytics', label: 'Realtime Analytics Dashboard' },
  { key: 'dedicatedSupport', label: 'Dedicated Account Manager' },
  { key: 'allowCustomBranding', label: 'Storefront Custom Branding' },
  { key: 'allowGroupCreation', label: 'Automated Circles / Groups' },
];

const inputCls =
  'w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] outline-none transition-all';

export const PlanManagementControl: React.FC = () => {
  const [plans, setPlans] = useState<UnifiedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [repriceModalOpen, setRepriceModalOpen] = useState(false);
  const [repriceVariant, setRepriceVariant] = useState<PlanVariant | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Plan Creation Wizard State (General Info + 3 Variants)
  const [general, setGeneral] = useState({ name: '', slug: '', description: '' });
  const [variantsForm, setVariantsForm] = useState<
    Record<
      'STANDARD' | 'PRO' | 'PRO_PLUS',
      {
        price: string;
        features: string[];
        quotas: Record<string, string>;
        flags: Record<string, boolean>;
      }
    >
  >({
    STANDARD: { price: '49.99', features: ['90 Days Full Access', 'Standard Search Placement'], quotas: { maxListings: '25' }, flags: { priorityInSearch: false } },
    PRO: { price: '89.99', features: ['180 Days Full Access', 'Priority Search Ranking'], quotas: { maxListings: '100' }, flags: { priorityInSearch: true, advancedAnalytics: true } },
    PRO_PLUS: { price: '149.99', features: ['1 Full Calendar Year', 'Top Search Priority', 'Dedicated Support'], quotas: { maxListings: '-1' }, flags: { priorityInSearch: true, advancedAnalytics: true, dedicatedSupport: true } },
  });

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/plans');
      if (!res.ok) throw new Error('Failed to fetch plans');
      const data = await res.json();
      setPlans(data);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async () => {
    if (!general.name || !general.slug) {
      setMsg({ type: 'error', text: 'Name and slug are required' });
      return;
    }
    setIsBusy(true);
    setMsg(null);

    const payload = {
      name: general.name,
      slug: general.slug,
      description: general.description,
      variants: (['STANDARD', 'PRO', 'PRO_PLUS'] as const).map((tier) => {
        const vf = variantsForm[tier];
        const quotasParsed: Record<string, number> = {};
        Object.entries(vf.quotas).forEach(([k, v]) => {
          if (v !== '') quotasParsed[k] = Number(v);
        });
        return {
          tier,
          price: Number(vf.price || 0),
          features: vf.features,
          configuration: {
            quotas: quotasParsed,
            featureFlags: vf.flags,
          },
        };
      }),
    };

    try {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create plan');
      }

      setMsg({ type: 'success', text: 'Plan and 3 variants created successfully!' });
      setModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setIsBusy(false);
    }
  };

  const handleReprice = async () => {
    if (!repriceVariant || !newPrice) return;
    setIsBusy(true);
    try {
      const res = await fetch(`/api/admin/plans/variants/${repriceVariant.id}/prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(newPrice), currency: 'GBP' }),
      });

      if (!res.ok) throw new Error('Repricing failed');
      setMsg({ type: 'success', text: 'Variant price updated immutably' });
      setRepriceModalOpen(false);
      setRepriceVariant(null);
      setNewPrice('');
      fetchPlans();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#f97316]" /> Unified Plan & Variant Architecture
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">Every commercial plan contains 3 standard variants (Standard 90d, Pro 180d, Pro+ 1yr).</p>
        </div>
        <button
          onClick={() => {
            setGeneral({ name: '', slug: '', description: '' });
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#f97316] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Plan (3 Variants)
        </button>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {msg.text}
        </div>
      )}

      {/* Plans List */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-12 text-center">
          <Layers className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-stone-600">No plans created yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="font-black text-lg text-stone-900">{plan.name}</h3>
                  <p className="text-xs text-stone-400 font-mono">slug: {plan.slug}</p>
                  {plan.description && <p className="text-xs text-stone-600 mt-1">{plan.description}</p>}
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Active Plan
                </span>
              </div>

              {/* 3 Side-by-side Variant Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {plan.variants.map((v) => {
                  const activePrice = v.prices[0];
                  const tierName = v.tierLevel.name;
                  const label = tierName === 'PRO_PLUS' ? 'Pro+ (1 Calendar Year)' : tierName === 'PRO' ? 'Pro (180 Days)' : 'Standard (90 Days)';
                  return (
                    <div key={v.id} className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-stone-800">{label}</span>
                          <button
                            onClick={() => {
                              setRepriceVariant(v);
                              setNewPrice(activePrice ? String(activePrice.amount) : '');
                              setRepriceModalOpen(true);
                            }}
                            className="p-1 hover:bg-stone-200 rounded text-stone-500 hover:text-stone-900 text-[10px] font-bold flex items-center gap-1"
                          >
                            <DollarSign className="w-3 h-3" /> Reprice
                          </button>
                        </div>
                        <div className="text-xl font-black text-stone-900 mb-3">
                          £{activePrice ? Number(activePrice.amount).toFixed(2) : '0.00'}
                        </div>

                        {v.features.length > 0 && (
                          <div className="space-y-1 mb-3">
                            {v.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                                <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" /> {f}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] font-mono text-stone-400 border-t border-stone-200/60 pt-2 mt-2">
                        Variant ID: {v.id.slice(0, 8)}...
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Create Plan Wizard Modal ─── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-bold text-lg">Create Plan & 3 Variants</h3>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-xl transition-all">
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {/* Step 1: General Info */}
                <div className="space-y-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Step 1: General Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Plan Name</label>
                      <input
                        value={general.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGeneral({ name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), description: general.description });
                        }}
                        placeholder="e.g. Gold Plan"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Slug</label>
                      <input value={general.slug} onChange={(e) => setGeneral({ ...general, slug: e.target.value })} placeholder="gold-plan" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Description</label>
                    <textarea value={general.description} onChange={(e) => setGeneral({ ...general, description: e.target.value })} rows={2} placeholder="Commercial plan description" className={`${inputCls} resize-none`} />
                  </div>
                </div>

                {/* Step 2: 3 Side-by-side Variant Columns */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Step 2: Variant Configuration (3 Tiers)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['STANDARD', 'PRO', 'PRO_PLUS'] as const).map((tier) => {
                      const vf = variantsForm[tier];
                      const title = tier === 'STANDARD' ? 'Standard (90 Days)' : tier === 'PRO' ? 'Pro (180 Days)' : 'Pro+ (1 Year)';
                      return (
                        <div key={tier} className="bg-stone-50/50 p-4 rounded-xl border border-stone-200 space-y-4">
                          <div className="font-bold text-xs text-stone-800 border-b pb-2 border-stone-200">{title}</div>
                          <div>
                            <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Price (£ GBP)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={vf.price}
                              onChange={(e) => setVariantsForm((prev) => ({ ...prev, [tier]: { ...prev[tier], price: e.target.value } }))}
                              className={inputCls}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Quotas (-1 for Unlimited)</label>
                            <div className="space-y-2">
                              {QUOTA_FIELDS.map(({ key, label }) => (
                                <div key={key} className="flex items-center justify-between gap-2 text-[11px]">
                                  <span className="text-stone-600">{label}</span>
                                  <input
                                    type="number"
                                    value={vf.quotas[key] ?? ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setVariantsForm((prev) => ({
                                        ...prev,
                                        [tier]: { ...prev[tier], quotas: { ...prev[tier].quotas, [key]: val } },
                                      }));
                                    }}
                                    className="w-16 px-1.5 py-0.5 text-right bg-white border rounded text-[11px]"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Feature Flags</label>
                            <div className="space-y-1.5">
                              {FLAG_FIELDS.map(({ key, label }) => (
                                <label key={key} className="flex items-center justify-between text-[11px] text-stone-600 cursor-pointer">
                                  <span>{label}</span>
                                  <input
                                    type="checkbox"
                                    checked={!!vf.flags[key]}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setVariantsForm((prev) => ({
                                        ...prev,
                                        [tier]: { ...prev[tier], flags: { ...prev[tier].flags, [key]: checked } },
                                      }));
                                    }}
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-stone-100 text-stone-600 rounded-xl text-xs font-bold">Cancel</button>
                <button
                  onClick={handleCreatePlan}
                  disabled={isBusy}
                  className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#f97316] text-white rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {isBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Plan & 3 Variants
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reprice Modal */}
      <AnimatePresence>
        {repriceModalOpen && repriceVariant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
              <h3 className="font-bold text-lg text-stone-900">Reprice Variant Immutably</h3>
              <p className="text-xs text-stone-500">Old price records are retained for existing subscribers. A new price row will be created with effectiveFrom = now().</p>
              <div>
                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">New Amount (£ GBP)</label>
                <input type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className={inputCls} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setRepriceModalOpen(false)} className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-xs font-bold">Cancel</button>
                <button onClick={handleReprice} disabled={isBusy} className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#f97316] text-white rounded-xl text-xs font-bold flex items-center gap-2">
                  {isBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm Price
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
