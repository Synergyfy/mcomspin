'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Crown,
  Package,
  CheckCircle2,
  Gem,
} from 'lucide-react';
import {
  useAdminPlans,
  useCreateAdminPlan,
  useUpdateAdminPlan,
  useDeleteAdminPlan,
} from '@/services/admin';

/* ─── Shared UI ─── */
const Card = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
    {title && <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-6">{title}</h3>}
    {children}
  </div>
);

const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'neutral' | 'green' | 'red' | 'yellow' | 'blue' }) => {
  const styles = {
    neutral: 'bg-stone-100 text-stone-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[variant]}`}>{children}</span>;
};

const inputCls =
  'w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400';

const QUOTA_KEYS = [
  { key: 'maxActiveGames', label: 'Max Active Games' },
  { key: 'maxActiveCampaigns', label: 'Max Active Campaigns' },
  { key: 'maxRewards', label: 'Max Rewards' },
  { key: 'monthlyPlaysAllowance', label: 'Monthly Plays Allowance' },
  { key: 'maxGameSessions', label: 'Max Game Sessions' },
  { key: 'maxTeamMembers', label: 'Max Team Members' },
];

const FLAG_KEYS = [
  { key: 'canScheduleCampaigns', label: 'Schedule Campaigns' },
  { key: 'hasAdvancedAnalytics', label: 'Advanced Analytics' },
  { key: 'canCreateRewardFromScratch', label: 'Create Rewards From Scratch' },
];

interface PlanDraft {
  name: string;
  description: string;
  isFree: boolean;
  monthlyPrice: string;
  quarterlyPrice: string;
  annualPrice: string;
  features: string[];
  quotas: Record<string, string>;
  flags: Record<string, boolean>;
  isActive: boolean;
  isDefault: boolean;
}

const emptyDraft = (): PlanDraft => ({
  name: '',
  description: '',
  isFree: false,
  monthlyPrice: '',
  quarterlyPrice: '',
  annualPrice: '',
  features: [],
  quotas: {},
  flags: {},
  isActive: true,
  isDefault: false,
});

function planError(err: Error): string | null {
  const data = (err as unknown as { response?: { data?: { message?: string } } })?.response?.data;
  return data?.message ?? null;
}

export const PlanManagementControl = () => {
  const plansQuery = useAdminPlans();
  const createPlan = useCreateAdminPlan();
  const updatePlan = useUpdateAdminPlan();
  const deletePlan = useDeleteAdminPlan();

  const plans = plansQuery.data?.data ?? plansQuery.data ?? [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PlanRecord | null>(null);
  const [draft, setDraft] = useState<PlanDraft>(emptyDraft());
  const [featureInput, setFeatureInput] = useState('');

  interface PlanRecord {
    id: string;
    name: string;
    description?: string;
    isFree?: boolean;
    monthlyPrice?: number;
    quarterlyPrice?: number;
    annualPrice?: number;
    features?: string[];
    configuration?: { quotas?: Record<string, number>; featureFlags?: Record<string, boolean> };
    isActive?: boolean;
    isDefault?: boolean;
  }

  const openCreate = () => {
    setEditing(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  };

  const openEdit = (plan: PlanRecord) => {
    const config = plan.configuration ?? {};
    const quotas: Record<string, string> = {};
    Object.entries(config.quotas ?? {}).forEach(([k, v]) => {
      quotas[k] = v === -1 ? '' : String(v);
    });
    const flags: Record<string, boolean> = {};
    Object.entries(config.featureFlags ?? {}).forEach(([k, v]) => {
      flags[k] = Boolean(v);
    });
    setEditing(plan);
    setDraft({
      name: plan.name ?? '',
      description: plan.description ?? '',
      isFree: plan.isFree ?? false,
      monthlyPrice: plan.monthlyPrice != null ? String(plan.monthlyPrice) : '',
      quarterlyPrice: plan.quarterlyPrice != null ? String(plan.quarterlyPrice) : '',
      annualPrice: plan.annualPrice != null ? String(plan.annualPrice) : '',
      features: plan.features ? [...plan.features] : [],
      quotas,
      flags,
      isActive: plan.isActive ?? true,
      isDefault: plan.isDefault ?? false,
    });
    setModalOpen(true);
  };

  const buildPayload = () => {
    const quotas: Record<string, number> = {};
    Object.entries(draft.quotas).forEach(([k, v]) => {
      const trimmed = v.trim();
      quotas[k] = trimmed === '' ? -1 : parseInt(trimmed, 10);
    });
    return {
      name: draft.name.trim(),
      description: draft.description.trim() || undefined,
      isFree: draft.isFree,
      monthlyPrice: draft.monthlyPrice.trim() ? parseFloat(draft.monthlyPrice) : undefined,
      quarterlyPrice: draft.quarterlyPrice.trim() ? parseFloat(draft.quarterlyPrice) : undefined,
      annualPrice: draft.annualPrice.trim() ? parseFloat(draft.annualPrice) : undefined,
      features: draft.features.length ? draft.features : undefined,
      configuration: {
        quotas,
        featureFlags: draft.flags,
      },
      isActive: draft.isActive,
      isDefault: draft.isDefault,
    };
  };

  const handleSave = () => {
    if (!draft.name.trim()) {
      alert('Plan name is required');
      return;
    }
    const payload = buildPayload();
    const done = () => setModalOpen(false);
    if (editing) {
      updatePlan.mutate({ id: editing.id, ...payload }, { onSuccess: done, onError: (err: Error) => alert(planError(err) || 'Failed to update plan') });
    } else {
      createPlan.mutate(payload, { onSuccess: done, onError: (err: Error) => alert(planError(err) || 'Failed to create plan') });
    }
  };

  const setQuota = (key: string, value: string) =>
    setDraft((p) => ({ ...p, quotas: { ...p.quotas, [key]: value } }));

  const addFeature = () => {
    const v = featureInput.trim();
    if (v && !draft.features.includes(v)) {
      setDraft((p) => ({ ...p, features: [...p.features, v] }));
      setFeatureInput('');
    }
  };

  const isBusy = createPlan.isPending || updatePlan.isPending || deletePlan.isPending;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Plan &amp; Package Management</h2>
          <p className="text-[12px] text-stone-500 mt-1">Configure subscription tiers, pricing, quotas and feature flags for the platform.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#f97316] text-white text-[11px] font-bold px-4 py-2.5 rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Create Plan
        </button>
      </div>

      {plansQuery.isLoading ? (
        <div className="flex items-center justify-center py-12 text-stone-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading plans...
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <div className="text-center py-10 text-stone-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold text-stone-600">No plans configured yet</p>
            <p className="text-[12px] mt-1">Create your first plan to get started.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan: PlanRecord) => {
            const config = plan.configuration ?? {};
            const quotas = config.quotas ?? {};
            const flagCount = Object.values(config.featureFlags ?? {}).filter(Boolean).length;
            return (
              <div key={plan.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {plan.isDefault ? <Crown className="w-4 h-4 text-[#f97316]" /> : <Gem className="w-4 h-4 text-stone-300" />}
                    <div>
                      <h4 className="font-bold text-stone-900">{plan.name}</h4>
                      {plan.isFree && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-bold">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(plan)} className="p-1.5 bg-stone-50 rounded-lg hover:bg-orange-50 hover:text-[#f97316] transition-all" title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete plan "${plan.name}"?`)) deletePlan.mutate(plan.id);
                      }}
                      className="p-1.5 bg-stone-50 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold text-stone-900">{plan.isFree ? 'Free' : `£${plan.monthlyPrice ?? 0}`}</span>
                  {!plan.isFree && <span className="text-[10px] text-stone-400">/mo</span>}
                </div>
                {plan.description && <p className="text-[11px] text-stone-500 mb-3">{plan.description}</p>}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant={plan.isActive ? 'green' : 'red'}>{plan.isActive ? 'Active' : 'Inactive'}</Badge>
                  {plan.isDefault && <Badge variant="yellow">Default</Badge>}
                  {flagCount > 0 && <Badge variant="blue">{flagCount} flags</Badge>}
                </div>
                {Object.keys(quotas).length > 0 && (
                  <div className="border-t border-stone-100 pt-3">
                    <div className="text-[9px] font-bold text-stone-400 uppercase mb-1.5">Quotas</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(quotas).map(([k, v]) => {
                        if (v === undefined || typeof v === 'boolean') return null;
                        return (
                          <span key={k} className="px-1.5 py-0.5 bg-stone-50 text-stone-500 rounded text-[9px]">
                            {k.replace(/^max/, '')}: {v === -1 ? '∞' : String(v)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Create/Edit Modal ─── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-bold text-lg">{editing ? `Edit ${editing.name}` : 'Create Plan'}</h3>
                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-xl transition-all">
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {/* General */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">General</h4>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Plan Name</label>
                    <input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Spin Starter" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Description</label>
                    <textarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Tier description and summary" className={`${inputCls} resize-none`} />
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-700">
                      <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft((p) => ({ ...p, isActive: e.target.checked }))} className="accent-stone-800" />
                      Active
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-700">
                      <input type="checkbox" checked={draft.isDefault} onChange={(e) => setDraft((p) => ({ ...p, isDefault: e.target.checked }))} className="accent-[#f97316]" />
                      Default Plan
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-green-700">
                      <input type="checkbox" checked={draft.isFree} onChange={(e) => setDraft((p) => ({ ...p, isFree: e.target.checked, monthlyPrice: e.target.checked ? '' : p.monthlyPrice }))} className="accent-green-600" />
                      Free
                    </label>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Pricing (£ GBP)</h4>
                    {draft.isFree && <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-bold">Free — no pricing</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Monthly</label>
                      <input type="number" min="0" step="0.01" disabled={draft.isFree} value={draft.monthlyPrice} onChange={(e) => setDraft((p) => ({ ...p, monthlyPrice: e.target.value }))} placeholder={draft.isFree ? 'Free' : '29.99'} className={`${inputCls} ${draft.isFree ? 'opacity-40 cursor-not-allowed' : ''}`} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Quarterly</label>
                      <input type="number" min="0" step="0.01" disabled={draft.isFree} value={draft.quarterlyPrice} onChange={(e) => setDraft((p) => ({ ...p, quarterlyPrice: e.target.value }))} placeholder={draft.isFree ? 'Free' : '79.99'} className={`${inputCls} ${draft.isFree ? 'opacity-40 cursor-not-allowed' : ''}`} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Annual</label>
                      <input type="number" min="0" step="0.01" disabled={draft.isFree} value={draft.annualPrice} onChange={(e) => setDraft((p) => ({ ...p, annualPrice: e.target.value }))} placeholder={draft.isFree ? 'Free' : '299.99'} className={`${inputCls} ${draft.isFree ? 'opacity-40 cursor-not-allowed' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Quotas */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Quotas <span className="text-stone-300 normal-case">(blank = unlimited)</span></h4>
                  <div className="grid grid-cols-2 gap-4">
                    {QUOTA_KEYS.map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">{label}</label>
                        <input type="number" min="-1" value={draft.quotas[key] ?? ''} onChange={(e) => setQuota(key, e.target.value)} placeholder="∞ unlimited" className={inputCls} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Flags */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Feature Flags</h4>
                  {FLAG_KEYS.map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between rounded-lg border border-stone-100 p-3 cursor-pointer">
                      <span className="text-xs font-bold text-stone-700">{label}</span>
                      <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${draft.flags[key] ? 'bg-[#f97316]' : 'bg-stone-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${draft.flags[key] ? 'translate-x-4' : ''}`} />
                      </div>
                    </label>
                  ))}
                </div>

                {/* Features list */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Features (Display)</h4>
                  <div className="space-y-2">
                    {draft.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <input value={f} onChange={(e) => setDraft((p) => ({ ...p, features: p.features.map((x, xi) => (xi === i ? e.target.value : x)) }))} className={`${inputCls} flex-1`} />
                        <button onClick={() => setDraft((p) => ({ ...p, features: p.features.filter((_, xi) => xi !== i) }))} className="p-1.5 text-stone-400 hover:text-red-500 transition-all">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }} placeholder="Add a feature..." className={`${inputCls} flex-1`} />
                      <button onClick={addFeature} className="px-3 py-2 bg-[#1a1a1a] text-white rounded-lg text-[10px] font-bold hover:bg-[#f97316] transition-all"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-stone-100 text-stone-600 rounded-xl text-xs font-bold hover:bg-stone-200 transition-all">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={isBusy}
                  className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#f97316] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editing ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
