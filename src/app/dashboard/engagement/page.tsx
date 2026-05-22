'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/* ─── Campaign data ─── */
interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'paused';
  startDate: string;
  endDate: string;
  engagement: number;
  conversion: number;
  description: string;
}

const initialCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Lead Blitz',
    status: 'active',
    startDate: 'May 1, 2026',
    endDate: 'Jul 31, 2026',
    engagement: 8420,
    conversion: 24.3,
    description: 'High-intensity lead generation push targeting summer foot traffic and seasonal buyers.',
  },
  {
    id: '2',
    name: 'Partner Spotlight Q3',
    status: 'active',
    startDate: 'Jun 1, 2026',
    endDate: 'Sep 30, 2026',
    engagement: 5890,
    conversion: 19.7,
    description: 'Rotating weekly partner highlights with boosted reward allocation and premium placement.',
  },
  {
    id: '3',
    name: 'Stock Clearance Drive',
    status: 'draft',
    startDate: 'Jul 15, 2026',
    endDate: 'Aug 15, 2026',
    engagement: 0,
    conversion: 0,
    description: 'Surplus inventory liquidation through gamified engagement — reward excess stock as prizes.',
  },
  {
    id: '4',
    name: 'Holiday Engagement Push',
    status: 'paused',
    startDate: 'Nov 20, 2026',
    endDate: 'Jan 5, 2027',
    engagement: 3210,
    conversion: 31.2,
    description: 'Festive campaign with holiday-themed rewards, partner bundles, and increased spin frequency.',
  },
];

/* ─── Chart data ─── */
const performanceData = [
  { name: 'Summer Lead Blitz', engagement: 8420, conversions: 2046, color: '#f97316' },
  { name: 'Partner Spotlight Q3', engagement: 5890, conversions: 1160, color: '#fb923c' },
  { name: 'Stock Clearance', engagement: 0, conversions: 0, color: '#fdba74' },
  { name: 'Holiday Push', engagement: 3210, conversions: 1001, color: '#fed7aa' },
];

/* ─── Probability sectors ─── */
interface RewardSector {
  id: string;
  name: string;
  allocation: number;
  color: string;
}

const initialSectors: RewardSector[] = [
  { id: '1', name: 'Vouchers & Discounts', allocation: 40, color: '#f97316' },
  { id: '2', name: 'Product Rewards', allocation: 25, color: '#fb923c' },
  { id: '3', name: 'Experience Passes', allocation: 20, color: '#fdba74' },
  { id: '4', name: 'Partner Credits', allocation: 15, color: '#fed7aa' },
];

/* ─── Automation toggles ─── */
interface AutomationToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const initialToggles: AutomationToggle[] = [
  { id: '1', name: 'Auto-rotate Partners', description: 'Cycle spotlight partners weekly based on performance scores', enabled: true },
  { id: '2', name: 'Smart Reward Balancing', description: 'Dynamically adjust reward probabilities to optimize redemption rates', enabled: true },
  { id: '3', name: 'Peak Hour Boosting', description: 'Increase engagement triggers during high-traffic periods automatically', enabled: false },
  { id: '4', name: 'Duplicate Lead Filtering', description: 'Block repeat entries from the same user within configurable windows', enabled: true },
];

/* ─── Status badge styles ─── */
const statusStyles = {
  active: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  draft: 'bg-amber-50 text-amber-600 border border-amber-200',
  paused: 'bg-stone-100 text-stone-600 border border-stone-200',
};

/* ─── Custom Tooltip ─── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white rounded-xl border border-[#eee] shadow-lg p-3 min-w-[160px]">
      <p className="text-[11px] font-bold text-[#888] mb-2">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center justify-between gap-4 text-[12px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[#666] capitalize">{entry.dataKey}</span>
          </span>
          <span className="font-bold text-[#1a1a1a]">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function EngagementEngine() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [sectors, setSectors] = useState<RewardSector[]>(initialSectors);
  const [toggles, setToggles] = useState<AutomationToggle[]>(initialToggles);

  const handleTogglePause = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        if (c.status === 'active') return { ...c, status: 'paused' as const };
        if (c.status === 'paused') return { ...c, status: 'active' as const };
        return c;
      })
    );
  };

  const handleSliderChange = (id: string, val: number) => {
    setSectors(prev => prev.map(s => (s.id === id ? { ...s, allocation: val } : s)));
  };

  const handleToggleAutomation = (id: string) => {
    setToggles(prev => prev.map(t => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  };

  const totalAllocation = sectors.reduce((sum, s) => sum + s.allocation, 0);

  return (
    <div className="space-y-8">

      {/* ═══ Page Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
            Engagement Engine
          </span>
          <h1 className="text-2xl font-display font-bold text-[#1a1a1a] mt-1">
            Campaign Management
          </h1>
          <p className="text-[#888] text-[13px] mt-1">
            Configure gamification campaigns, reward probabilities, and automation rules
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#f97316] text-white px-5 py-2.5 rounded-xl text-[12px] font-bold hover:bg-[#ea580c] transition-colors duration-200 shadow-sm hover:shadow-md self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Campaign
        </button>
      </div>

      {/* ═══ Campaign Cards Grid ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 hover:shadow-md hover:border-[#f97316]/15 transition-all duration-300 group"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-display font-semibold text-[#1a1a1a] group-hover:text-[#f97316] transition-colors truncate">
                  {campaign.name}
                </h3>
                <p className="text-[12px] text-[#888] mt-1 leading-relaxed line-clamp-2">
                  {campaign.description}
                </p>
              </div>
              <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyles[campaign.status]}`}>
                {campaign.status}
              </span>
            </div>

            {/* Date range */}
            <div className="flex items-center gap-2 text-[11px] text-[#888] mb-4">
              <svg className="w-3.5 h-3.5 text-[#ccc]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>{campaign.startDate}</span>
              <span className="text-[#ddd]">→</span>
              <span>{campaign.endDate}</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#fafaf9] rounded-xl p-3 border border-[#f5f5f3]">
                <p className="text-[10px] text-[#888] font-medium uppercase tracking-wider">Engagement</p>
                <p className="text-lg font-display font-bold text-[#1a1a1a] mt-0.5">
                  {campaign.engagement > 0 ? campaign.engagement.toLocaleString() : '—'}
                </p>
              </div>
              <div className="bg-[#fafaf9] rounded-xl p-3 border border-[#f5f5f3]">
                <p className="text-[10px] text-[#888] font-medium uppercase tracking-wider">Conversion</p>
                <p className="text-lg font-display font-bold text-[#1a1a1a] mt-0.5">
                  {campaign.conversion > 0 ? `${campaign.conversion}%` : '—'}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-[#f5f5f3]">
              <button className="flex-1 text-center text-[11px] font-semibold text-[#1a1a1a] bg-[#f5f5f3] hover:bg-[#eee] py-2.5 rounded-xl transition-colors duration-200">
                Edit
              </button>
              {campaign.status !== 'draft' && (
                <button
                  onClick={() => handleTogglePause(campaign.id)}
                  className={`flex-1 text-center text-[11px] font-semibold py-2.5 rounded-xl transition-colors duration-200 ${
                    campaign.status === 'active'
                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                      : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {campaign.status === 'active' ? 'Pause' : 'Resume'}
                </button>
              )}
              {campaign.status === 'draft' && (
                <button className="flex-1 text-center text-[11px] font-semibold text-[#f97316] bg-[#f97316]/[0.06] hover:bg-[#f97316]/[0.12] py-2.5 rounded-xl transition-colors duration-200 border border-[#f97316]/20">
                  Launch
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Middle Section: Probability + Chart ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Probability Configuration Panel — 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-[15px] font-display font-semibold text-[#1a1a1a]">
              Reward Probability
            </h2>
            <p className="text-[12px] text-[#888] mt-0.5">
              Configure sector allocation for the engagement wheel
            </p>
          </div>

          <div className="space-y-5">
            {sectors.map((sector) => (
              <div key={sector.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                    <span className="text-[12px] font-medium text-[#1a1a1a]">{sector.name}</span>
                  </div>
                  <span className="text-[12px] font-bold text-[#1a1a1a] bg-[#f5f5f3] px-2 py-0.5 rounded-md min-w-[42px] text-center">
                    {sector.allocation}%
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-[#f5f5f3] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${sector.allocation}%`,
                        backgroundColor: sector.color,
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sector.allocation}
                    onChange={(e) => handleSliderChange(sector.id, parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total allocation indicator */}
          <div className={`mt-6 p-3 rounded-xl border flex items-center justify-between text-[12px] ${
            totalAllocation === 100
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            <span className="font-medium">Total Allocation</span>
            <span className="font-bold">{totalAllocation}%{totalAllocation !== 100 && ' — needs adjustment'}</span>
          </div>

          {/* Visual breakdown */}
          <div className="mt-5 flex gap-0.5 h-3 rounded-full overflow-hidden">
            {sectors.map((sector) => (
              <div
                key={sector.id}
                className="transition-all duration-500"
                style={{
                  width: `${(sector.allocation / Math.max(totalAllocation, 1)) * 100}%`,
                  backgroundColor: sector.color,
                }}
              />
            ))}
          </div>
        </div>

        {/* Campaign Performance Chart — 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-[15px] font-display font-semibold text-[#1a1a1a]">
              Campaign Performance
            </h2>
            <p className="text-[12px] text-[#888] mt-0.5">
              Engagement and conversion comparison across active campaigns
            </p>
          </div>

          <div className="h-[300px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#aaa' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#aaa' }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="engagement" name="Engagement" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`eng-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Bar dataKey="conversions" name="Conversions" radius={[6, 6, 0, 0]} maxBarSize={48} fill="#1a1a1a" opacity={0.15}>
                  {performanceData.map((_, index) => (
                    <Cell key={`conv-${index}`} fill="#1a1a1a" opacity={0.12} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#f5f5f3]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#888]">
              <span className="w-3 h-3 rounded bg-[#f97316]" />
              <span>Engagement</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#888]">
              <span className="w-3 h-3 rounded bg-[#1a1a1a]/[0.12]" />
              <span>Conversions</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Engagement Automation Toggles ═══ */}
      <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[15px] font-display font-semibold text-[#1a1a1a]">
              Engagement Automation
            </h2>
            <p className="text-[12px] text-[#888] mt-0.5">
              Toggle intelligent automation rules for your campaigns
            </p>
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase bg-[#f97316]/[0.06] px-3 py-1.5 rounded-full">
            {toggles.filter(t => t.enabled).length} of {toggles.length} active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {toggles.map((toggle) => (
            <div
              key={toggle.id}
              className={`p-5 rounded-xl border transition-all duration-300 ${
                toggle.enabled
                  ? 'bg-[#fafaf9] border-[#f97316]/20'
                  : 'bg-white border-[#eee]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-semibold text-[#1a1a1a]">{toggle.name}</h3>
                  <p className="text-[11px] text-[#888] mt-1 leading-relaxed">{toggle.description}</p>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => handleToggleAutomation(toggle.id)}
                  className={`shrink-0 relative w-11 h-6 rounded-full transition-colors duration-300 ${
                    toggle.enabled ? 'bg-[#f97316]' : 'bg-[#ddd]'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      toggle.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {toggle.enabled && (
                <div className="mt-3 pt-3 border-t border-[#f97316]/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-semibold text-emerald-600">Running</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
