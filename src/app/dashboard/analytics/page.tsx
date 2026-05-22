'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const engagementRevenueData = [
  { month: 'Jan', engagement: 3200, revenue: 8400 },
  { month: 'Feb', engagement: 3800, revenue: 9200 },
  { month: 'Mar', engagement: 4100, revenue: 10800 },
  { month: 'Apr', engagement: 3600, revenue: 9600 },
  { month: 'May', engagement: 4800, revenue: 12400 },
  { month: 'Jun', engagement: 5200, revenue: 13800 },
  { month: 'Jul', engagement: 4900, revenue: 14200 },
  { month: 'Aug', engagement: 5600, revenue: 15600 },
  { month: 'Sep', engagement: 6100, revenue: 16200 },
  { month: 'Oct', engagement: 5800, revenue: 15800 },
  { month: 'Nov', engagement: 6400, revenue: 17400 },
  { month: 'Dec', engagement: 7200, revenue: 19200 },
];

const campaignROIData = [
  { campaign: 'Summer Spin', roi: 340 },
  { campaign: 'Referral Boost', roi: 280 },
  { campaign: 'Flash Rewards', roi: 420 },
  { campaign: 'Partner Push', roi: 190 },
  { campaign: 'Loyalty Drive', roi: 310 },
];

const partnerData = [
  { partner: 'Meridian Digital', leads: 482, revenue: '$42,100', conversion: '28.4%', trend: '+12%' },
  { partner: 'Solara Media', leads: 367, revenue: '$31,800', conversion: '22.1%', trend: '+8%' },
  { partner: 'NovaPeak Inc.', leads: 291, revenue: '$26,400', conversion: '19.7%', trend: '+3%' },
  { partner: 'Cascade Partners', leads: 198, revenue: '$18,200', conversion: '16.2%', trend: '-2%' },
];

const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom'] as const;

export default function AnalyticsPage() {
  const [activeRange, setActiveRange] = useState<string>('Last 30 days');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Analytics</p>
          <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Performance Overview</h1>
          <p className="text-[#888] text-[13px] mt-1">Track engagement, revenue, and campaign performance across all channels.</p>
        </div>
        <div className="flex items-center bg-white rounded-xl border border-[#eee] shadow-sm p-1 gap-1">
          {dateRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                activeRange === range
                  ? 'bg-[#f97316] text-white shadow-sm'
                  : 'text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Revenue', value: '$162,890', change: '+24%', positive: true },
          { label: 'Avg Conversion', value: '22.4%', change: '+3.1%', positive: true },
          { label: 'Customer LTV', value: '$84.20', change: '+11%', positive: true },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <p className="text-[#888] text-[13px] mb-1">{card.label}</p>
            <div className="flex items-end gap-3">
              <span className="text-[28px] font-display font-bold text-[#1a1a1a] leading-none">{card.value}</span>
              <span className={`text-[13px] font-semibold px-2 py-0.5 rounded-full ${
                card.positive
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-500'
              }`}>
                {card.change}
              </span>
            </div>
            <div className="mt-4 h-1 bg-[#f5f5f5] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Area Chart */}
      <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Performance Trend</p>
            <h2 className="text-lg font-display font-semibold text-[#1a1a1a]">Engagement vs Revenue</h2>
          </div>
          <div className="flex items-center gap-4 text-[12px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
              Engagement
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a3a3a3]" />
              Revenue
            </span>
          </div>
        </div>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementRevenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                }}
              />
              <Area type="monotone" dataKey="engagement" stroke="#f97316" strokeWidth={2.5} fill="url(#engagementGrad)" />
              <Area type="monotone" dataKey="revenue" stroke="#a3a3a3" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign ROI + Partner Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign ROI */}
        <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Campaign Performance</p>
          <h2 className="text-lg font-display font-semibold text-[#1a1a1a] mb-5">ROI by Campaign</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignROIData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="campaign" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'ROI']}
                />
                <Bar dataKey="roi" fill="#f97316" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Partner Performance Table */}
        <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Partner Network</p>
          <h2 className="text-lg font-display font-semibold text-[#1a1a1a] mb-5">Partner Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f0f0f0]">
                  {['Partner', 'Leads', 'Revenue', 'Conv.', 'Trend'].map((h) => (
                    <th key={h} className="pb-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partnerData.map((row, i) => (
                  <tr key={i} className="border-b border-[#f8f8f8] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="py-3.5 text-[13px] font-semibold text-[#1a1a1a]">{row.partner}</td>
                    <td className="py-3.5 text-[13px] text-[#555]">{row.leads}</td>
                    <td className="py-3.5 text-[13px] text-[#555] font-medium">{row.revenue}</td>
                    <td className="py-3.5 text-[13px] text-[#555]">{row.conversion}</td>
                    <td className="py-3.5">
                      <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                        row.trend.startsWith('+')
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-500'
                      }`}>
                        {row.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
