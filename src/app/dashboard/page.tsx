'use client';

import React, { useState } from 'react';
import { Target, Gift, Users2, Rocket, Building2, ClipboardList, Zap } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ─── Mock 30-day engagement data ─── */
const engagementData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    day: `May ${day}`,
    engagement: Math.floor(600 + Math.random() * 500 + (i * 18)),
    leads: Math.floor(80 + Math.random() * 120 + (i * 4)),
    rewards: Math.floor(40 + Math.random() * 80 + (i * 3)),
  };
});

/* ─── Activity feed ─── */
const activityFeed = [
  { id: 1, type: 'lead', icon: 'target', text: 'New lead captured — Yuki Tanaka via Summer Lead Blitz', time: '2 min ago' },
  { id: 2, type: 'reward', icon: 'gift', text: 'Reward redeemed — £50 Voucher claimed by Marcus Vance', time: '8 min ago' },
  { id: 3, type: 'partner', icon: 'partner', text: 'Partner joined — Orchard & Co. Spas activated', time: '23 min ago' },
  { id: 4, type: 'lead', icon: 'target', text: 'Lead converted — Elena Rostova completed checkout', time: '41 min ago' },
  { id: 5, type: 'campaign', icon: 'campaign', text: 'Campaign started — Partner Spotlight Q3 went live', time: '1 hr ago' },
  { id: 6, type: 'reward', icon: 'gift', text: 'Reward restocked — Premium Wireless Charger ×50 added', time: '2 hr ago' },
  { id: 7, type: 'lead', icon: 'target', text: 'Lead captured — Sophia Sterling via Storefront widget', time: '3 hr ago' },
  { id: 8, type: 'partner', icon: 'partner', text: 'Partner payout processed — Vanguard Fine Dining £2,340', time: '4 hr ago' },
];

const getActivityIcon = (icon: string, className = "w-4 h-4 text-[#888]") => {
  switch (icon) {
    case 'target': return <Target className={`${className} text-[#f97316]`} />;
    case 'gift': return <Gift className={`${className} text-pink-500`} />;
    case 'partner': return <Users2 className={`${className} text-emerald-500`} />;
    case 'campaign': return <Rocket className={`${className} text-blue-500`} />;
    default: return null;
  }
};

/* ─── KPI definitions ─── */
const kpis = [
  {
    label: 'Active Campaigns',
    value: '3',
    change: '+2',
    trend: 'up' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
  {
    label: 'Total Plays',
    value: '12,482',
    change: '+15.4%',
    trend: 'up' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    label: 'Rewards Redeemed',
    value: '847',
    change: '+8.7%',
    trend: 'up' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: 'Customer Engagement',
    value: '22.4%',
    change: '+3.1%',
    trend: 'up' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: 'Reward Inventory',
    value: '156',
    subtext: 'Available',
    change: '',
    trend: 'neutral' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: 'Setup Status',
    value: '80%',
    subtext: 'Optimized',
    change: '+10%',
    trend: 'up' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

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

export default function DashboardOverview() {
  const [chartMetric, setChartMetric] = useState<'engagement' | 'leads' | 'rewards'>('engagement');

  return (
    <div className="space-y-8">

      {/* ═══ Page Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
            Business Dashboard
          </span>
          <h1 className="text-2xl font-display font-bold text-[#1a1a1a] mt-1">
            Overview
          </h1>
          <p className="text-[#888] text-[13px] mt-1">
            Quickly monitor your active campaigns and reward performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Active
          </span>
          <span className="text-[11px] text-[#888] bg-[#f5f5f3] px-3 py-1.5 rounded-full">
            Last updated: just now
          </span>
        </div>
      </div>

      {/* ═══ KPI Row — 6 Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-[#eee] shadow-sm p-5 hover:shadow-md hover:border-[#f97316]/20 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#bbb] group-hover:text-[#f97316] transition-colors duration-300">
                {kpi.icon}
              </span>
              {kpi.change && (
                <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${
                  kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {kpi.trend === 'up' ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                    </svg>
                  )}
                  {kpi.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-display font-bold text-[#1a1a1a] tracking-tight">
              {kpi.value}
            </p>
            <p className="text-[11px] text-[#888] mt-1 font-medium">
              {kpi.label}
              {kpi.subtext && (
                <span className="ml-1.5 text-[#f97316]">· {kpi.subtext}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* ═══ Main Content Grid — Chart + Activity ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Engagement Chart — 8 cols */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-[15px] font-display font-semibold text-[#1a1a1a]">
                Engagement Trends
              </h2>
              <p className="text-[12px] text-[#888] mt-0.5">30-day rolling performance</p>
            </div>
            <div className="flex items-center gap-1 bg-[#f5f5f3] rounded-xl p-1">
              {(['engagement', 'leads', 'rewards'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setChartMetric(metric)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all duration-200 ${
                    chartMetric === metric
                      ? 'bg-white text-[#1a1a1a] shadow-sm'
                      : 'text-[#888] hover:text-[#1a1a1a]'
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[320px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: '#aaa' }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#aaa' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey={chartMetric}
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fill="url(#orangeGradient)"
                  dot={false}
                  activeDot={{ r: 5, stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed — 4 cols */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#eee] shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-display font-semibold text-[#1a1a1a]">
                Recent Activity
              </h2>
              <p className="text-[12px] text-[#888] mt-0.5">Live ecosystem events</p>
            </div>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          <div className="flex-1 space-y-0 overflow-y-auto">
            {activityFeed.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 py-3 group ${
                  idx < activityFeed.length - 1 ? 'border-b border-[#f5f5f3]' : ''
                }`}
              >
                <span className="mt-0.5 shrink-0">{getActivityIcon(item.icon)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1a1a1a] leading-relaxed group-hover:text-[#f97316] transition-colors duration-200">
                    {item.text}
                  </p>
                  <p className="text-[10px] text-[#bbb] mt-1 font-medium">{item.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full text-center text-[11px] font-semibold text-[#f97316] hover:text-[#ea580c] py-2.5 bg-[#f97316]/[0.04] hover:bg-[#f97316]/[0.08] rounded-xl transition-all duration-200">
            View all activity →
          </button>
        </div>
      </div>

      {/* ═══ Quick Actions Row ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            title: 'Add Reward',
            desc: 'Submit new reward assets — vouchers, products, or gift cards',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            ),
            accent: 'bg-orange-50 text-[#f97316]',
          },
          {
            title: 'Request Agent',
            desc: 'Get expert help with setup, branding, and optimization',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            ),
            accent: 'bg-blue-50 text-blue-600',
          },
          {
            title: 'Launch Campaign',
            desc: 'Go live with your currently configured gamification strategy',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            ),
            accent: 'bg-emerald-50 text-emerald-600',
          },
          {
            title: 'Pause Campaign',
            desc: 'Immediately halt active games and reward distribution',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            ),
            accent: 'bg-red-50 text-red-600',
          },
        ].map((action) => (
          <button
            key={action.title}
            className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 text-left hover:shadow-md hover:border-[#f97316]/20 hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className={`w-11 h-11 rounded-xl ${action.accent} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
              {action.icon}
            </div>
            <h3 className="text-[14px] font-display font-semibold text-[#1a1a1a] group-hover:text-[#f97316] transition-colors">
              {action.title}
            </h3>
            <p className="text-[12px] text-[#888] mt-1 leading-relaxed">
              {action.desc}
            </p>
          </button>
        ))}
      </div>

      {/* ═══ Live Ecosystem Mini-Panel ═══ */}
      <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
            Live Ecosystem Status
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Businesses', value: '4', icon: 'business' },
            { label: 'Rewards in Pool', value: '156', icon: 'gift' },
            { label: 'Leads Queued', value: '23', icon: 'leads' },
            { label: 'Automations Running', value: '5', icon: 'automation' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 bg-[#fafaf9] rounded-xl p-4 border border-[#f5f5f3] hover:border-[#f97316]/20 transition-colors duration-200"
            >
              <span className="flex-shrink-0">
                {stat.icon === 'business' ? (
                  <Building2 className="w-5 h-5 text-orange-500" />
                ) : stat.icon === 'gift' ? (
                  <Gift className="w-5 h-5 text-pink-500" />
                ) : stat.icon === 'leads' ? (
                  <ClipboardList className="w-5 h-5 text-blue-500" />
                ) : (
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                )}
              </span>
              <div>
                <p className="text-lg font-display font-bold text-[#1a1a1a]">{stat.value}</p>
                <p className="text-[10px] text-[#888] font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
