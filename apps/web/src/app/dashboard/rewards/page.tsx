'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useBusinessRewards, 
  useCreateBusinessReward, 
  useUpdateBusinessReward,
  useDeleteBusinessReward,
} from '@/services/business';
import { 
  Gift, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  Search, 
  Plus, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit3,
  Filter,
  ArrowUpRight,
  Package,
  Ticket,
  Percent,
  Zap,
  Tag,
  Calendar,
  Layers,
  X,
  Info,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

const rewardTypeConfig: Record<string, { bg: string; text: string; icon: any; tooltip: string }> = {
  'Discount':       { bg: 'bg-orange-50',  text: 'text-orange-600',  icon: Percent, tooltip: 'Percentage or fixed amount off a total purchase.' },
  'Voucher':        { bg: 'bg-pink-50',    text: 'text-pink-600',    icon: Tag, tooltip: 'Unique codes for one-time or multi-use claims.' },
  'FreeProduct':    { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: Sparkles, tooltip: 'Full complimentary services (e.g., Free Haircut).' },
  'Cashback':       { bg: 'bg-amber-50',   text: 'text-amber-600',  icon: Gift, tooltip: 'Store credit that can be spent later.' },
  'Points':         { bg: 'bg-violet-50',  text: 'text-violet-600', icon: Zap, tooltip: 'Loyalty points added to customer accounts.' },
};

/* Frontend display labels mapped to backend enum values */
const rewardTypeOptions = [
  { label: 'Discount', value: 'Discount' },
  { label: 'Coupon / Voucher', value: 'Voucher' },
  { label: 'Free Product / Service', value: 'FreeProduct' },
  { label: 'Gift Card / Cashback', value: 'Cashback' },
  { label: 'Loyalty Points', value: 'Points' },
];

/* ─── UI Components ─── */
const Badge = ({ children, colorClass }: { children: React.ReactNode, colorClass: string }) => (
  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${colorClass}`}>
    {children}
  </span>
);

const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-1.5">
    <HelpCircle className="w-3.5 h-3.5 text-[#ccc] cursor-help group-hover:text-[#f97316] transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1a1a1a] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1a1a1a]" />
    </div>
  </div>
);

export default function RewardsAssetsPage() {
  const queryClient = useQueryClient();
  const { data: rewardsData, isLoading, isError } = useBusinessRewards();
  const createReward = useCreateBusinessReward();
  const updateReward = useUpdateBusinessReward();
  const deleteReward = useDeleteBusinessReward();
  const rewardsList: any[] = (rewardsData as any[]) ?? [];
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Discount',
    value: '',
    totalStock: '100',
    description: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({ name: '', type: 'Discount', value: '', totalStock: '100', description: '' });
    setFormError(null);
    setFieldErrors({});
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Reward name is required.';
    if (formData.value && (isNaN(Number(formData.value)) || Number(formData.value) < 0)) {
      errors.value = 'Must be a valid positive number.';
    }
    const stock = parseInt(formData.totalStock);
    if (isNaN(stock) || stock < 0) errors.totalStock = 'Must be a valid number (0 or more).';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    createReward.mutate(
      {
        name: formData.name.trim(),
        type: formData.type,
        value: formData.value || '0',
        totalStock: parseInt(formData.totalStock) || 0,
        description: formData.description.trim() || undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['business', 'rewards'] });
          setIsModalOpen(false);
          resetForm();
          setToast({ type: 'success', message: 'Reward created successfully!' });
          setTimeout(() => setToast(null), 3000);
        },
        onError: (err: any) => {
          const details = err?.response?.data?.error?.details;
          if (Array.isArray(details)) {
            const fieldErrMap: Record<string, string> = {};
            details.forEach((d: any) => {
              if (d.field && d.constraints) fieldErrMap[d.field] = d.constraints.join('. ');
            });
            if (Object.keys(fieldErrMap).length > 0) {
              setFieldErrors(fieldErrMap);
              return;
            }
          }
          const msg =
            details?.map((d: any) => d.constraints?.join(', ')).filter(Boolean).join('; ') ||
            err?.response?.data?.error?.message ||
            err?.message ||
            'Failed to create reward. Check the form and try again.';
          setFormError(msg);
        },
      },
    );
  };

  // Filtered list
  const filteredRewards = rewardsList.filter((r: any) => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && rewardsList.length === 0) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
              Business Inventory
            </span>
            <h1 className="text-3xl font-display font-bold text-[#1a1a1a] mt-1">
              Rewards & Assets
            </h1>
            <p className="text-[#888] text-[14px] mt-1 max-w-xl">
              Submit your coupons, stock, and services. The platform handles the distribution through your gamification campaigns.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#f97316] text-white px-5 py-3 rounded-2xl font-bold text-[13px] hover:bg-[#ea6c10] transition-all shadow-lg shadow-orange-500/20 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Reward Asset
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[32px] border border-[#eee] p-6 shadow-sm animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#f0f0f0] rounded-xl" />
                <div className="w-16 h-6 bg-[#f0f0f0] rounded-full" />
              </div>
              <div className="h-5 w-32 bg-[#f0f0f0] rounded mb-2" />
              <div className="h-3 w-24 bg-[#f0f0f0] rounded mb-4" />
              <div className="h-8 w-full bg-[#f0f0f0] rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 relative">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
            Business Inventory
          </span>
          <h1 className="text-3xl font-display font-bold text-[#1a1a1a] mt-1">
            Rewards & Assets
          </h1>
          <p className="text-[#888] text-[14px] mt-1 max-w-xl">
            Submit your coupons, stock, and services. The platform handles the distribution through your gamification campaigns.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#f97316] text-white px-5 py-3 rounded-2xl font-bold text-[13px] hover:bg-[#ea6c10] transition-all shadow-lg shadow-orange-500/20 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Reward Asset
        </button>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] group-focus-within:text-[#f97316] transition-colors" />
          <input 
            type="text" 
            placeholder="Search rewards by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#eee] rounded-2xl pl-11 pr-4 py-3.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-[#eee] px-5 py-3.5 rounded-2xl text-[13px] font-semibold text-[#666] hover:bg-[#fafaf9] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* ── Reward Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRewards.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 bg-[#f5f5f3] rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-[#ccc]" />
            </div>
            <p className="text-[17px] font-bold text-[#1a1a1a]">No rewards yet</p>
            <p className="text-[13px] text-[#888] mt-1">Create your first reward to get started.</p>
          </div>
        ) : (
          filteredRewards.map((reward: any) => {
            const inv = reward.inventories?.[0];
            const config = rewardTypeConfig[reward.type] ?? rewardTypeConfig['Voucher'];
            const Icon = config.icon;
            const isActive = reward.isActive !== false;
            
            return (
              <div 
                key={reward.id} 
                className="bg-white rounded-[24px] border border-[#eee] p-6 hover:shadow-xl hover:shadow-black/5 hover:border-[#f97316]/30 transition-all duration-500 group relative flex flex-col"
              >
                {/* Status Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-xl ${config.bg} ${config.text} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge colorClass={`${config.bg} ${config.text}`}>
                      {reward.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateReward.mutate({ id: reward.id, isActive: !isActive })}
                      className="p-2 text-[#ccc] hover:text-[#1a1a1a] transition-colors rounded-lg hover:bg-[#f5f5f3]"
                    >
                      {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Delete this reward?')) deleteReward.mutate(reward.id);
                      }}
                      className="p-2 text-[#ccc] hover:text-red-500 transition-colors rounded-lg hover:bg-[#f5f5f3]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Info */}
                <div className="flex-1">
                  <h3 className="text-[17px] font-display font-bold text-[#1a1a1a] group-hover:text-[#f97316] transition-colors leading-tight mb-2">
                    {reward.name}
                  </h3>
                  <p className="text-[13px] text-[#888] line-clamp-2 leading-relaxed mb-4">
                    {reward.description || 'No description'}
                  </p>
                </div>

                {/* Metrics Section */}
                <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-[#fafaf9] rounded-2xl border border-[#f5f5f3]">
                  <div>
                    <p className="text-[9px] font-bold text-[#bbb] uppercase tracking-wider mb-1">In Stock</p>
                    <p className="text-[14px] font-display font-bold text-[#1a1a1a]">
                      {inv ? inv.totalStock - inv.usedStock : 0} / {inv?.totalStock ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[#bbb] uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-[#bbb]'}`} />
                      <p className="text-[12px] font-semibold text-[#1a1a1a]">{isActive ? 'Active' : 'Paused'}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f5f5f3] mt-auto">
                  <div className="flex items-center gap-1.5 text-[#aaa]">
                    <span className="text-[11px] font-medium">
                      £{Number(reward.value).toFixed(2)} {reward.currency || 'GBP'}
                    </span>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${isActive ? 'text-emerald-600 bg-emerald-50' : 'text-[#888] bg-[#f0f0f0]'}`}>
                    {isActive ? 'Live' : 'Paused'}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Empty State / Add New Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#fafaf9] rounded-[24px] border-2 border-dashed border-[#eee] p-8 flex flex-col items-center justify-center text-center group hover:border-[#f97316]/30 hover:bg-white transition-all duration-500"
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#eee] text-[#ccc] group-hover:text-[#f97316] group-hover:border-[#f97316]/20 flex items-center justify-center mb-4 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-[15px] font-bold text-[#888] group-hover:text-[#1a1a1a] transition-colors">Add New Asset</h4>
          <p className="text-[12px] text-[#bbb] mt-1 max-w-[180px]">Expand your reward pool to drive more engagement</p>
        </button>
      </div>

      {/* ── Quick Stats Footer ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 border-t border-[#eee]">
        {[
          { label: 'Visible Assets', value: '4', icon: Eye, color: 'text-blue-500' },
          { label: 'Paused Rewards', value: '1', icon: EyeOff, color: 'text-amber-500' },
          { label: 'Total Inventory', value: rewardsList.reduce((acc: any, curr: any) => acc + curr.quantity, 0).toString(), icon: Package, color: 'text-indigo-500' },
          { label: 'Expiring Soon', value: '2', icon: Clock, color: 'text-red-500' },
        ].map((stat: any, i: any) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#eee] flex items-center justify-center shrink-0">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[15px] font-display font-bold text-[#1a1a1a] leading-none">{stat.value}</p>
              <p className="text-[11px] font-medium text-[#aaa] mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[200] px-5 py-3 rounded-2xl shadow-2xl text-[13px] font-bold flex items-center gap-2.5 animate-in slide-in-from-right-4 fade-in duration-300 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Info className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* ═══════════════════════════════════════
          ADD REWARD MODAL
      ═══════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#f5f5f3] flex items-center justify-between bg-[#fafaf9]/50">
              <div>
                <h2 className="text-xl font-display font-bold text-[#1a1a1a]">Create Reward Asset</h2>
                <p className="text-[12px] text-[#888] mt-0.5">Fill in the details to add a new reward to your catalog.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-[#bbb] hover:text-[#1a1a1a] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddReward} className="p-8">
              {formError && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-[13px] text-red-700 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reward Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Reward Name *
                    <Tooltip text="The public name of your reward as it appears to customers." />
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 20% Discount, Free Latte"
                    value={formData.name}
                    onChange={e => { setFormData({...formData, name: e.target.value}); setFieldErrors(prev => ({...prev, name: ''})); }}
                    className={`w-full bg-[#fcfcfb] border rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.name ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-[#eee] focus:ring-[#f97316]/20 focus:border-[#f97316]'
                    }`}
                  />
                  {fieldErrors.name && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.name}</p>}
                </div>

                {/* Reward Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Category *
                    <Tooltip text="The reward category determines how it's displayed and distributed." />
                  </label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[#fcfcfb] border border-[#eee] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all appearance-none cursor-pointer"
                  >
                    {rewardTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Value / Amount */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Value (£)
                    <Tooltip text="The monetary value of this reward (e.g. 10 for £10 discount)." />
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    placeholder="e.g. 10.00"
                    value={formData.value}
                    onChange={e => { setFormData({...formData, value: e.target.value}); setFieldErrors(prev => ({...prev, value: ''})); }}
                    className={`w-full bg-[#fcfcfb] border rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.value ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-[#eee] focus:ring-[#f97316]/20 focus:border-[#f97316]'
                    }`}
                  />
                  {fieldErrors.value && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.value}</p>}
                </div>

                {/* Total Stock */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Total Stock *
                    <Tooltip text="How many of this reward are available to be won?" />
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="e.g. 100"
                    value={formData.totalStock}
                    onChange={e => { setFormData({...formData, totalStock: e.target.value}); setFieldErrors(prev => ({...prev, totalStock: ''})); }}
                    className={`w-full bg-[#fcfcfb] border rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.totalStock ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-[#eee] focus:ring-[#f97316]/20 focus:border-[#f97316]'
                    }`}
                  />
                  {fieldErrors.totalStock && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.totalStock}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Description
                    <Tooltip text="Briefly describe the reward and any terms." />
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Describe your reward asset..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#fcfcfb] border border-[#eee] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-[#f5f5f3]">
                <button 
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-6 py-3 text-[13px] font-bold text-[#666] hover:text-[#1a1a1a] transition-colors"
                  disabled={createReward.isPending}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createReward.isPending}
                  className="bg-[#1a1a1a] text-white px-8 py-3 rounded-2xl font-bold text-[13px] hover:bg-[#333] transition-all shadow-xl active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createReward.isPending ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {createReward.isPending ? 'Creating...' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
