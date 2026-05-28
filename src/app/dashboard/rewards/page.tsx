'use client';

import { useState } from 'react';
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

/* ─── Types & Config ─── */
type RewardType = 
  | 'Coupon' 
  | 'Discount' 
  | 'Free service' 
  | 'Product' 
  | 'Ticket' 
  | 'Gift card' 
  | 'Spare capacity' 
  | 'Access stock';

interface Reward {
  id: string;
  name: string;
  type: RewardType;
  quantity: number;
  expiryDate: string | null;
  visibilityStatus: 'Visible' | 'Hidden';
  activeStatus: 'Active' | 'Paused';
  description: string;
  value?: string;
}

const rewardTypeConfig: Record<RewardType, { bg: string; text: string; icon: any; tooltip: string }> = {
  'Coupon':         { bg: 'bg-pink-50',    text: 'text-pink-600',    icon: Tag, tooltip: 'Unique codes for one-time or multi-use claims.' },
  'Discount':       { bg: 'bg-orange-50',  text: 'text-orange-600',  icon: Percent, tooltip: 'Percentage or fixed amount off a total purchase.' },
  'Free service':   { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: Sparkles, tooltip: 'Full complimentary services (e.g., Free Haircut).' },
  'Product':        { bg: 'bg-blue-50',    text: 'text-blue-600',    icon: Package, tooltip: 'Physical items from your inventory.' },
  'Ticket':         { bg: 'bg-violet-50', text: 'text-violet-600', icon: Ticket, tooltip: 'Access to events, classes, or special sessions.' },
  'Gift card':      { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: Gift, tooltip: 'Store credit that can be spent later.' },
  'Spare capacity': { bg: 'bg-teal-50',    text: 'text-teal-600',    icon: RefreshCw, tooltip: 'Unfilled slots (e.g., "Empty slot at 4pm").' },
  'Access stock':   { bg: 'bg-indigo-50',  text: 'text-indigo-600',  icon: Layers, tooltip: 'End-of-line or surplus items you want to move.' },
};

/* ─── Mock Data ─── */
const initialRewards: Reward[] = [
  { 
    id: '1', 
    name: '20% Off All Services', 
    type: 'Discount', 
    quantity: 500, 
    expiryDate: '2026-12-31', 
    visibilityStatus: 'Visible', 
    activeStatus: 'Active',
    description: 'A store-wide discount for new customers.'
  },
  { 
    id: '2', 
    name: 'Free Beard Trim', 
    type: 'Free service', 
    quantity: 50, 
    expiryDate: '2026-06-15', 
    visibilityStatus: 'Visible', 
    activeStatus: 'Active',
    description: 'Complimentary beard trim with any haircut.'
  },
  { 
    id: '3', 
    name: 'VIP Event Access', 
    type: 'Ticket', 
    quantity: 10, 
    expiryDate: '2026-07-20', 
    visibilityStatus: 'Hidden', 
    activeStatus: 'Paused',
    description: 'Exclusive tickets to the Summer Style Gala.'
  },
  { 
    id: '4', 
    name: 'Excess Hair Product Stock', 
    type: 'Access stock', 
    quantity: 85, 
    expiryDate: null, 
    visibilityStatus: 'Visible', 
    activeStatus: 'Active',
    description: 'Moving old inventory through the reward pool.'
  },
  { 
    id: '5', 
    name: 'Last Minute Slot - 4PM Today', 
    type: 'Spare capacity', 
    quantity: 1, 
    expiryDate: '2026-05-28', 
    visibilityStatus: 'Visible', 
    activeStatus: 'Active',
    description: 'Filling empty slots to maximize daily revenue.'
  },
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
  const [rewardsList, setRewardsList] = useState<Reward[]>(initialRewards);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Coupon' as RewardType,
    quantity: '',
    expiryDate: '',
    visibilityStatus: 'Visible' as 'Visible' | 'Hidden',
    activeStatus: 'Active' as 'Active' | 'Paused',
    description: ''
  });

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    const newReward: Reward = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      type: formData.type,
      quantity: parseInt(formData.quantity) || 0,
      expiryDate: formData.expiryDate || null,
      visibilityStatus: formData.visibilityStatus,
      activeStatus: formData.activeStatus,
      description: formData.description
    };
    setRewardsList([newReward, ...rewardsList]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      type: 'Coupon',
      quantity: '',
      expiryDate: '',
      visibilityStatus: 'Visible',
      activeStatus: 'Active',
      description: ''
    });
  };

  // Filtered list
  const filteredRewards = rewardsList.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredRewards.map((reward) => {
          const config = rewardTypeConfig[reward.type];
          const Icon = config.icon;
          
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
                  <button className="p-2 text-[#ccc] hover:text-[#1a1a1a] transition-colors rounded-lg hover:bg-[#f5f5f3]">
                    {reward.visibilityStatus === 'Visible' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button className="p-2 text-[#ccc] hover:text-[#1a1a1a] transition-colors rounded-lg hover:bg-[#f5f5f3]">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex-1">
                <h3 className="text-[17px] font-display font-bold text-[#1a1a1a] group-hover:text-[#f97316] transition-colors leading-tight mb-2">
                  {reward.name}
                </h3>
                <p className="text-[13px] text-[#888] line-clamp-2 leading-relaxed mb-4">
                  {reward.description}
                </p>
              </div>

              {/* Metrics Section */}
              <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-[#fafaf9] rounded-2xl border border-[#f5f5f3]">
                <div>
                  <p className="text-[9px] font-bold text-[#bbb] uppercase tracking-wider mb-1">Quantity</p>
                  <p className="text-[14px] font-display font-bold text-[#1a1a1a]">{reward.quantity}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#bbb] uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${reward.activeStatus === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-[#bbb]'}`} />
                    <p className="text-[12px] font-semibold text-[#1a1a1a]">{reward.activeStatus}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between pt-4 border-t border-[#f5f5f3] mt-auto">
                <div className="flex items-center gap-1.5 text-[#aaa]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">
                    {reward.expiryDate ? `Expires: ${reward.expiryDate}` : 'Permanent Asset'}
                  </span>
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${reward.visibilityStatus === 'Visible' ? 'text-blue-500 bg-blue-50' : 'text-[#888] bg-[#f0f0f0]'}`}>
                  {reward.visibilityStatus}
                </div>
              </div>
            </div>
          );
        })}

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
          { label: 'Total Inventory', value: rewardsList.reduce((acc, curr) => acc + curr.quantity, 0).toString(), icon: Package, color: 'text-indigo-500' },
          { label: 'Expiring Soon', value: '2', icon: Clock, color: 'text-red-500' },
        ].map((stat, i) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reward Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Reward Name
                    <Tooltip text="The public name of your reward as it appears to customers (e.g., 'Free Latte', '20% Discount')." />
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter a catchy name..."
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#fcfcfb] border border-[#eee] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all"
                  />
                </div>

                {/* Reward Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Category
                    <Tooltip text="Classify your reward. This helps the system determine the best gamification strategy." />
                  </label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as RewardType})}
                    className="w-full bg-[#fcfcfb] border border-[#eee] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all appearance-none cursor-pointer"
                  >
                    {Object.keys(rewardTypeConfig).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Quantity / Stock
                    <Tooltip text="How many of these rewards are available to be won in total?" />
                  </label>
                  <input 
                    required
                    type="number" 
                    placeholder="e.g. 100"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    className="w-full bg-[#fcfcfb] border border-[#eee] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all"
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Expiry Date
                    <Tooltip text="Optional. When should this reward stop being available? Leave empty for permanent assets." />
                  </label>
                  <input 
                    type="date" 
                    value={formData.expiryDate}
                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full bg-[#fcfcfb] border border-[#eee] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all"
                  />
                </div>

                {/* Visibility */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Visibility
                    <Tooltip text="Visible rewards can be seen by customers in their potential prize pool. Hidden rewards are surprise wins." />
                  </label>
                  <div className="flex bg-[#f5f5f3] p-1 rounded-xl">
                    {(['Visible', 'Hidden'] as const).map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setFormData({...formData, visibilityStatus: v})}
                        className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${formData.visibilityStatus === v ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-[#888] hover:text-[#666]'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Campaign Status
                    <Tooltip text="Active rewards are live and can be won. Paused rewards are temporarily disabled." />
                  </label>
                  <div className="flex bg-[#f5f5f3] p-1 rounded-xl">
                    {(['Active', 'Paused'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, activeStatus: s})}
                        className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${formData.activeStatus === s ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-[#888] hover:text-[#666]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center">
                    Detailed Description
                    <Tooltip text="Briefly describe the reward and any terms (e.g., 'Valid for dine-in only')." />
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-[13px] font-bold text-[#666] hover:text-[#1a1a1a] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#1a1a1a] text-white px-8 py-3 rounded-2xl font-bold text-[13px] hover:bg-[#333] transition-all shadow-xl active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Create Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
