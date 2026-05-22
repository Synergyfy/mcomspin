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
  Legend,
} from 'recharts';

/* ─── Mock Data ─── */
const rotationSlots = [
  {
    week: 1,
    partner: 'Meridian Apparel',
    status: 'Current',
    leads: 312,
    priority: 40,
    description: 'Premium lifestyle clothing & accessories',
  },
  {
    week: 2,
    partner: 'Elara Wellness',
    status: 'Upcoming',
    leads: 0,
    priority: 25,
    description: 'Spa treatments, wellness retreats & subscriptions',
  },
  {
    week: 3,
    partner: 'Vantage Electronics',
    status: 'Scheduled',
    leads: 0,
    priority: 20,
    description: 'Consumer tech, gadgets & smart-home devices',
  },
  {
    week: 4,
    partner: 'Soleil Dining Group',
    status: 'Scheduled',
    leads: 0,
    priority: 15,
    description: 'Fine dining, catering & culinary experiences',
  },
];

const historicalData = [
  { month: 'Jan', Meridian: 289, Elara: 198, Vantage: 156, Soleil: 210 },
  { month: 'Feb', Meridian: 312, Elara: 221, Vantage: 178, Soleil: 195 },
  { month: 'Mar', Meridian: 345, Elara: 244, Vantage: 201, Soleil: 230 },
  { month: 'Apr', Meridian: 298, Elara: 267, Vantage: 189, Soleil: 256 },
  { month: 'May', Meridian: 367, Elara: 234, Vantage: 212, Soleil: 241 },
  { month: 'Jun', Meridian: 401, Elara: 289, Vantage: 234, Soleil: 278 },
];

const CHART_COLORS = {
  Meridian: '#f97316',
  Elara: '#10b981',
  Vantage: '#6366f1',
  Soleil: '#f59e0b',
};

export default function CampaignRotationsPage() {
  const [weights, setWeights] = useState<Record<string, number>>({
    'Meridian Apparel': 40,
    'Elara Wellness': 25,
    'Vantage Electronics': 20,
    'Soleil Dining Group': 15,
  });

  const [cycleLength, setCycleLength] = useState('Monthly');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [boostPercent, setBoostPercent] = useState(25);

  const handleWeightChange = (partner: string, value: number) => {
    setWeights((prev) => ({ ...prev, [partner]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
          Campaign Rotations
        </p>
        <h1 className="text-2xl font-display font-bold text-[#1a1a1a] mt-1">
          Rotation Management
        </h1>
        <p className="text-[#888] text-[13px] mt-1">
          Manage your rotating partner spotlight schedule, lead routing priorities, and cycle settings.
        </p>
      </div>

      {/* ─── Current Rotation Status Bar ─── */}
      <div className="bg-gradient-to-r from-[#f97316]/[0.06] to-transparent rounded-2xl border border-[#f97316]/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#f97316] rounded-full animate-pulse shadow-[0_0_12px_rgba(249,115,22,0.4)]" />
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] text-[#f97316] uppercase">
                Current Week Spotlight
              </p>
              <p className="text-[16px] font-display font-bold text-[#1a1a1a]">
                Meridian Apparel
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-[#eee]" />

          <div className="flex items-center gap-6 text-[13px]">
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] text-[#888] uppercase">
                Progress
              </p>
              <p className="font-semibold text-[#1a1a1a]">Week 2 of 4</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] text-[#888] uppercase">
                Rotation Cycle
              </p>
              <p className="font-semibold text-[#1a1a1a]">Monthly</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] text-[#888] uppercase">
                Next Advance
              </p>
              <p className="font-semibold text-[#f97316]">5 days</p>
            </div>
          </div>

          <div className="sm:ml-auto">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-full text-[11px] font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Active Cycle
            </span>
          </div>
        </div>
      </div>

      {/* ─── Main Grid: Timeline + Priority Routing ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rotation Schedule Timeline */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
                Rotation Schedule
              </p>
              <h2 className="text-[17px] font-display font-bold text-[#1a1a1a] mt-0.5">
                Spotlight Timeline
              </h2>
            </div>
            <span className="text-[11px] text-[#888] bg-[#f5f5f3] px-3 py-1.5 rounded-lg font-medium">
              4-Week Cycle
            </span>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-8">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-[#eee]" />

            <div className="space-y-1">
              {rotationSlots.map((slot, i) => {
                const isCurrent = slot.status === 'Current';
                const isUpcoming = slot.status === 'Upcoming';
                return (
                  <div
                    key={slot.week}
                    className={`relative p-5 rounded-xl border transition-all duration-200 ${
                      isCurrent
                        ? 'border-[#f97316] bg-[#f97316]/[0.04] shadow-sm'
                        : 'border-[#eee] bg-white hover:bg-[#fafaf9]'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-8 top-6 w-[22px] h-[22px] rounded-full border-[3px] flex items-center justify-center ${
                        isCurrent
                          ? 'border-[#f97316] bg-[#f97316]'
                          : isUpcoming
                          ? 'border-[#f97316]/40 bg-white'
                          : 'border-[#ddd] bg-white'
                      }`}
                    >
                      {isCurrent && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold tracking-[0.12em] text-[#888] uppercase">
                            Week {slot.week}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isCurrent
                                ? 'bg-[#f97316] text-white'
                                : isUpcoming
                                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                : 'bg-stone-100 text-stone-600 border border-stone-200'
                            }`}
                          >
                            {slot.status}
                          </span>
                        </div>
                        <h3 className="text-[15px] font-display font-bold text-[#1a1a1a]">
                          {slot.partner}
                        </h3>
                        <p className="text-[12px] text-[#888] mt-0.5">{slot.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-[12px]">
                        <div className="text-center">
                          <p className="text-[9px] font-bold tracking-[0.1em] text-[#aaa] uppercase">
                            Routing
                          </p>
                          <p className="font-bold text-[#1a1a1a]">{slot.priority}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-bold tracking-[0.1em] text-[#aaa] uppercase">
                            Leads
                          </p>
                          <p className="font-bold text-[#1a1a1a]">
                            {isCurrent ? slot.leads : '—'}
                          </p>
                        </div>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isCurrent ? 'bg-[#f97316]/10 text-[#f97316]' : 'bg-[#f5f5f3] text-[#aaa]'
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lead Priority Routing Config */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
              Lead Routing
            </p>
            <h2 className="text-[17px] font-display font-bold text-[#1a1a1a] mt-0.5">
              Priority Weights
            </h2>
            <p className="text-[12px] text-[#888] mt-1">
              Configure how incoming leads are distributed across partners during the active rotation.
            </p>
          </div>

          <div className="space-y-5">
            {Object.entries(weights).map(([partner, weight]) => {
              const colors: Record<string, string> = {
                'Meridian Apparel': '#f97316',
                'Elara Wellness': '#10b981',
                'Vantage Electronics': '#6366f1',
                'Soleil Dining Group': '#f59e0b',
              };
              const color = colors[partner] || '#f97316';
              return (
                <div key={partner} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[13px] font-semibold text-[#1a1a1a]">{partner}</span>
                    </div>
                    <span className="text-[13px] font-bold" style={{ color }}>
                      {weight}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-[#f0f0ee] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${weight}%`, backgroundColor: color }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={weight}
                      onChange={(e) => handleWeightChange(partner, Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total check */}
          <div className="mt-6 p-4 rounded-xl bg-[#fafaf9] border border-[#eee]">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#888]">Total Weight</span>
              <span
                className={`font-bold ${
                  Object.values(weights).reduce((a, b) => a + b, 0) === 100
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {Object.values(weights).reduce((a, b) => a + b, 0)}%
              </span>
            </div>
            {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
              <p className="text-[11px] text-amber-600 mt-1.5">
                Weights should total 100% for balanced distribution.
              </p>
            )}
          </div>

          {/* Quick actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() =>
                setWeights({
                  'Meridian Apparel': 25,
                  'Elara Wellness': 25,
                  'Vantage Electronics': 25,
                  'Soleil Dining Group': 25,
                })
              }
              className="flex-1 text-[11px] font-bold text-[#888] bg-[#f5f5f3] hover:bg-[#eee] px-3 py-2.5 rounded-xl transition-colors"
            >
              Equalize
            </button>
            <button
              onClick={() =>
                setWeights({
                  'Meridian Apparel': 60,
                  'Elara Wellness': 15,
                  'Vantage Electronics': 15,
                  'Soleil Dining Group': 10,
                })
              }
              className="flex-1 text-[11px] font-bold text-[#f97316] bg-[#f97316]/[0.06] hover:bg-[#f97316]/[0.12] px-3 py-2.5 rounded-xl transition-colors"
            >
              Boost Spotlight
            </button>
          </div>
        </div>
      </div>

      {/* ─── Historical Performance Chart ─── */}
      <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
              Historical Performance
            </p>
            <h2 className="text-[17px] font-display font-bold text-[#1a1a1a] mt-0.5">
              Cross-Rotation Comparison
            </h2>
          </div>
          <div className="flex gap-2">
            {['6M', '3M', '1M'].map((range) => (
              <button
                key={range}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  range === '6M'
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-[#888] bg-[#f5f5f3] hover:bg-[#eee]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#888' }}
                axisLine={{ stroke: '#eee' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#888' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #eee',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="Meridian" fill={CHART_COLORS.Meridian} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Elara" fill={CHART_COLORS.Elara} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Vantage" fill={CHART_COLORS.Vantage} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Soleil" fill={CHART_COLORS.Soleil} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Rotation Settings Panel ─── */}
      <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
        <div className="mb-6">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
            Configuration
          </p>
          <h2 className="text-[17px] font-display font-bold text-[#1a1a1a] mt-0.5">
            Rotation Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cycle Length */}
          <div className="space-y-3">
            <label className="text-[12px] font-semibold text-[#1a1a1a]">Cycle Length</label>
            <select
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className="w-full bg-[#fafaf9] border border-[#eee] rounded-xl px-4 py-3 text-[13px] text-[#1a1a1a] font-medium focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all appearance-none cursor-pointer"
            >
              <option>Weekly</option>
              <option>Biweekly</option>
              <option>Monthly</option>
            </select>
            <p className="text-[11px] text-[#aaa]">
              Duration each partner stays in the spotlight position.
            </p>
          </div>

          {/* Auto-Advance */}
          <div className="space-y-3">
            <label className="text-[12px] font-semibold text-[#1a1a1a]">Auto-Advance</label>
            <div
              className="flex items-center justify-between bg-[#fafaf9] border border-[#eee] rounded-xl px-4 py-3 cursor-pointer"
              onClick={() => setAutoAdvance(!autoAdvance)}
            >
              <span className="text-[13px] text-[#1a1a1a] font-medium">
                {autoAdvance ? 'Enabled' : 'Disabled'}
              </span>
              <div
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${
                  autoAdvance ? 'bg-[#f97316]' : 'bg-[#ddd]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    autoAdvance ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#aaa]">
              Automatically rotate to the next partner when the cycle ends.
            </p>
          </div>

          {/* Spotlight Boost */}
          <div className="space-y-3">
            <label className="text-[12px] font-semibold text-[#1a1a1a]">
              Spotlight Boost
            </label>
            <div className="bg-[#fafaf9] border border-[#eee] rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-[#1a1a1a] font-medium">{boostPercent}%</span>
                <span className="text-[11px] text-[#f97316] font-bold">+{boostPercent}% priority</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={boostPercent}
                onChange={(e) => setBoostPercent(Number(e.target.value))}
                className="w-full h-1.5 bg-[#eee] rounded-full appearance-none cursor-pointer accent-[#f97316]"
              />
            </div>
            <p className="text-[11px] text-[#aaa]">
              Extra routing priority given to the current spotlight partner.
            </p>
          </div>
        </div>

        {/* Save bar */}
        <div className="mt-8 pt-6 border-t border-[#eee] flex items-center justify-between">
          <p className="text-[12px] text-[#aaa]">
            Changes auto-save. Last updated 2 minutes ago.
          </p>
          <button className="text-[12px] font-bold bg-[#1a1a1a] text-white px-6 py-2.5 rounded-xl hover:bg-[#f97316] transition-colors">
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
}
