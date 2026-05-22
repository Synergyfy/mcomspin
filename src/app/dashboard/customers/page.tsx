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
} from 'recharts';
import { Crown, AlertTriangle, Sparkles, Users, TrendingUp, Target, RefreshCw } from 'lucide-react';

const getSegmentIcon = (iconName: string) => {
  switch (iconName) {
    case 'crown':
      return <Crown className="w-5 h-5 text-white" />;
    case 'alert':
      return <AlertTriangle className="w-5 h-5 text-white" />;
    case 'sparkles':
      return <Sparkles className="w-5 h-5 text-white" />;
    default:
      return null;
  }
};

const engagementDistribution = [
  { score: '0-1', count: 42 },
  { score: '2-3', count: 189 },
  { score: '4-5', count: 624 },
  { score: '6-7', count: 1480 },
  { score: '8-9', count: 1892 },
  { score: '10', count: 665 },
];

const customers = [
  { name: 'Lucia Fernández', email: 'lucia.f@meridian.co', score: 9.2, interactions: 142, lastActive: '2 hours ago', status: 'Active' },
  { name: 'Kenji Watanabe', email: 'k.watanabe@novapeak.jp', score: 8.7, interactions: 98, lastActive: '5 hours ago', status: 'Active' },
  { name: 'Arianna Bianchi', email: 'a.bianchi@solara.it', score: 7.8, interactions: 76, lastActive: '1 day ago', status: 'Active' },
  { name: 'Marcus Oduya', email: 'm.oduya@cascade.ng', score: 7.1, interactions: 63, lastActive: '1 day ago', status: 'Active' },
  { name: 'Priya Chakrabarti', email: 'priya.c@engage.in', score: 5.4, interactions: 34, lastActive: '4 days ago', status: 'At Risk' },
  { name: 'Tomás Herrera', email: 't.herrera@latam.mx', score: 4.2, interactions: 21, lastActive: '1 week ago', status: 'At Risk' },
  { name: 'Chloe Whitmore', email: 'c.whitmore@brand.co', score: 8.9, interactions: 12, lastActive: '3 hours ago', status: 'New' },
  { name: 'Yuki Tanaka', email: 'y.tanaka@fresh.jp', score: 6.8, interactions: 8, lastActive: '12 hours ago', status: 'New' },
];

const segments = [
  { label: 'High Value', count: 892, color: 'from-[#f97316] to-[#fb923c]', icon: 'crown', description: 'LTV above $120, engaged weekly' },
  { label: 'At Risk', count: 156, color: 'from-[#ef4444] to-[#f87171]', icon: 'alert', description: 'No activity in 7+ days, declining score' },
  { label: 'New', count: 347, color: 'from-[#3b82f6] to-[#60a5fa]', icon: 'sparkles', description: 'Joined in the last 30 days' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'At Risk':
      return 'bg-red-50 text-red-500 border border-red-200';
    case 'New':
      return 'bg-blue-50 text-blue-600 border border-blue-200';
    default:
      return 'bg-stone-100 text-stone-600 border border-stone-200';
  }
};

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Customers</p>
          <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Customer Management</h1>
          <p className="text-[#888] text-[13px] mt-1">Monitor engagement, segment audiences, and track customer health.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-[#e5e5e5] text-[13px] w-64 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Customers', value: '4,892', icon: <Users className="w-4 h-4 text-[#f97316]" /> },
          { label: 'Active This Week', value: '1,247', icon: <TrendingUp className="w-4 h-4 text-[#f97316]" /> },
          { label: 'Avg Engagement Score', value: '7.4/10', icon: <Target className="w-4 h-4 text-[#f97316]" /> },
          { label: 'Repeat Rate', value: '34%', icon: <RefreshCw className="w-4 h-4 text-[#f97316]" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-[#eee] shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#888] text-[13px]">{stat.label}</p>
              {stat.icon}
            </div>
            <p className="text-[24px] font-display font-bold text-[#1a1a1a] leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Directory</p>
        <h2 className="text-lg font-display font-semibold text-[#1a1a1a] mb-5">All Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                {['Name', 'Email', 'Engagement', 'Interactions', 'Last Active', 'Status'].map((h) => (
                  <th key={h} className="pb-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider whitespace-nowrap pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c, i) => (
                <tr key={i} className="border-b border-[#f8f8f8] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="py-3.5 text-[13px] font-semibold text-[#1a1a1a] whitespace-nowrap pr-4">{c.name}</td>
                  <td className="py-3.5 text-[13px] text-[#666] whitespace-nowrap pr-4">{c.email}</td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${c.score * 10}%`,
                            background: c.score >= 7 ? '#22c55e' : c.score >= 5 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                      <span className="text-[12px] text-[#666] font-medium w-8">{c.score}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-[13px] text-[#555] pr-4">{c.interactions}</td>
                  <td className="py-3.5 text-[13px] text-[#999] whitespace-nowrap pr-4">{c.lastActive}</td>
                  <td className="py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Segments + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Segments</p>
          <h2 className="text-lg font-display font-semibold text-[#1a1a1a] mb-4">Customer Segments</h2>
          <div className="space-y-4">
            {segments.map((seg) => (
              <div key={seg.label} className="bg-white rounded-2xl border border-[#eee] shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${seg.color} flex items-center justify-center shadow-sm`}>
                    {getSegmentIcon(seg.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-display font-semibold text-[#1a1a1a]">{seg.label}</h3>
                      <span className="text-[20px] font-display font-bold text-[#1a1a1a]">{seg.count.toLocaleString()}</span>
                    </div>
                    <p className="text-[12px] text-[#999] mt-0.5">{seg.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Distribution */}
        <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Distribution</p>
          <h2 className="text-lg font-display font-semibold text-[#1a1a1a] mb-5">Engagement Score Breakdown</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementDistribution} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="score" tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                  formatter={(value: any) => [value ? value.toLocaleString() : '', 'Customers']}
                />
                <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
