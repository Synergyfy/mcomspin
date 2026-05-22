'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Gift, Sparkles, Clock, RefreshCw } from 'lucide-react';

/* ─── mock data ─── */
const stats = [
  { label: 'Total Rewards', value: '156', icon: 'gift', delta: '+8 this week', color: 'bg-orange-50 text-orange-600' },
  { label: 'Active', value: '98', icon: 'sparkles', delta: '63% of total', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Expiring Soon', value: '12', icon: 'clock', delta: 'Next 14 days', color: 'bg-amber-50 text-amber-600' },
  { label: 'Redeemed Today', value: '34', icon: 'refresh', delta: '+12% vs yesterday', color: 'bg-violet-50 text-violet-600' },
];

const getIcon = (type: string, className = "w-5 h-5") => {
  switch (type) {
    case 'gift': return <Gift className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    case 'clock': return <Clock className={className} />;
    case 'refresh': return <RefreshCw className={className} />;
    default: return null;
  }
};

const rewardTypes: Record<string, { bg: string; text: string }> = {
  Voucher:      { bg: 'bg-orange-50',  text: 'text-orange-600' },
  Appointment:  { bg: 'bg-sky-50',     text: 'text-sky-600' },
  Product:      { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  Coupon:       { bg: 'bg-pink-50',    text: 'text-pink-600' },
  'Event Ticket': { bg: 'bg-violet-50', text: 'text-violet-600' },
  Service:      { bg: 'bg-teal-50',    text: 'text-teal-600' },
};

const rewards = [
  { name: '$50 Styling Voucher',  type: 'Voucher',      stock: 45,  maxStock: 100, expires: 'Jul 15, 2026', redeemed: 55 },
  { name: 'Premium Spa Session',  type: 'Appointment',  stock: 12,  maxStock: 40,  expires: 'Aug 1, 2026',  redeemed: 28 },
  { name: 'Wireless Charger',     type: 'Product',      stock: 89,  maxStock: 120, expires: null,           redeemed: 31 },
  { name: '20% Off Dining',       type: 'Coupon',       stock: 200, maxStock: 500, expires: 'Jun 30, 2026', redeemed: 300 },
  { name: 'Concert Tickets x2',   type: 'Event Ticket', stock: 8,   maxStock: 30,  expires: 'Jul 20, 2026', redeemed: 22 },
  { name: 'Free Consultation',    type: 'Service',      stock: 30,  maxStock: 60,  expires: 'Sep 1, 2026',  redeemed: 30 },
];

const redemptionData = [
  { day: 'Mon', count: 22 },
  { day: 'Tue', count: 31 },
  { day: 'Wed', count: 18 },
  { day: 'Thu', count: 42 },
  { day: 'Fri', count: 37 },
  { day: 'Sat', count: 28 },
  { day: 'Sun', count: 34 },
];

const typeOptions = ['Voucher', 'Appointment', 'Product', 'Coupon', 'Event Ticket', 'Service'];

/* ─── component ─── */
export default function RewardsPage() {
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Voucher');
  const [formValue, setFormValue] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formExpiry, setFormExpiry] = useState('');
  const [formDesc, setFormDesc] = useState('');

  return (
    <div className="min-h-screen bg-[#fafaf9] px-4 py-10 sm:px-8 lg:px-12">
      {/* ── header ── */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Rewards &amp; Inventory</p>
        <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Manage Your Reward Catalog</h1>
        <p className="text-[#888] text-[13px] mt-1">Track stock levels, monitor redemptions, and add new rewards to your engagement pool.</p>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              {getIcon(s.icon)}
            </span>
            <div>
              <p className="text-[#888] text-[11px] font-semibold tracking-wide uppercase">{s.label}</p>
              <p className="text-2xl font-display font-bold text-[#1a1a1a] mt-0.5">{s.value}</p>
              <p className="text-[#aaa] text-[12px] mt-0.5">{s.delta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── reward inventory grid ── */}
      <div className="mb-8">
        <h2 className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-4">Reward Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rewards.map((r) => {
            const pct = Math.round((r.stock / r.maxStock) * 100);
            const barColor = pct > 50 ? 'bg-emerald-400' : pct > 20 ? 'bg-amber-400' : 'bg-red-400';
            const badge = rewardTypes[r.type] ?? { bg: 'bg-stone-100', text: 'text-stone-600' };
            return (
              <div key={r.name} className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group">
                {/* top row */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} mb-2`}>
                      {r.type}
                    </span>
                    <h3 className="text-[15px] font-display font-semibold text-[#1a1a1a] truncate">{r.name}</h3>
                  </div>
                </div>

                {/* stock bar */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#888]">Stock</span>
                    <span className="font-semibold text-[#1a1a1a]">{r.stock} / {r.maxStock}</span>
                  </div>
                  <div className="w-full h-2 bg-[#f3f3f0] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* meta */}
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#888]">
                    {r.expires ? `Expires ${r.expires}` : 'No expiry'}
                  </span>
                  <span className="text-[#888]">{r.redeemed} redeemed</span>
                </div>

                {/* actions */}
                <div className="flex gap-2 mt-auto pt-2 border-t border-[#f3f3f0]">
                  <button className="flex-1 text-[12px] font-semibold text-[#f97316] bg-orange-50 rounded-lg py-2 hover:bg-orange-100 transition-colors cursor-pointer">
                    Edit
                  </button>
                  <button className="flex-1 text-[12px] font-semibold text-red-500 bg-red-50 rounded-lg py-2 hover:bg-red-100 transition-colors cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── bottom row: form + chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* upload form */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <h2 className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-5">Add New Reward</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* name */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-wide">Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Spa Gift Card"
                className="rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition"
              />
            </div>
            {/* type */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-wide">Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-[14px] text-[#1a1a1a] bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition appearance-none cursor-pointer"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {/* value */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-wide">Value ($)</label>
              <input
                type="text"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="50.00"
                className="rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition"
              />
            </div>
            {/* stock */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-wide">Stock Quantity</label>
              <input
                type="number"
                value={formStock}
                onChange={(e) => setFormStock(e.target.value)}
                placeholder="100"
                className="rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition"
              />
            </div>
            {/* expiry */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-wide">Expiry Date</label>
              <input
                type="date"
                value={formExpiry}
                onChange={(e) => setFormExpiry(e.target.value)}
                className="rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-[14px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition"
              />
            </div>
            {/* description — full width */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-wide">Description</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
                placeholder="Short description of the reward…"
                className="rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder:text-[#ccc] resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition"
              />
            </div>
          </div>

          <button className="mt-5 w-full sm:w-auto px-8 py-3 bg-[#f97316] text-white text-[13px] font-bold tracking-wide rounded-xl hover:bg-[#ea6c10] active:scale-[.98] transition-all shadow-sm cursor-pointer">
            Add Reward
          </button>
        </div>

        {/* redemption chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#eee] shadow-sm p-6 flex flex-col">
          <h2 className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Redemption Analytics</h2>
          <p className="text-[#888] text-[12px] mb-4">Past 7 days</p>

          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={redemptionData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,.06)' }}
                  labelStyle={{ fontWeight: 700, color: '#1a1a1a' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#fff', stroke: '#f97316', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#f97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
