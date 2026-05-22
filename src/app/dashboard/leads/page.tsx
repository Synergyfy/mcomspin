'use client';

import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const pipelineSteps = [
  {
    title: 'New Captured',
    count: 12,
    color: 'bg-orange-500',
    leads: [
      { name: 'Alessandro Rossi', email: 'a.rossi@outlook.it', campaign: 'Summer Spin', time: '10m ago', partner: 'Meridian Apparel' },
      { name: 'Yuki Tanaka', email: 'y.tanaka@sony.co.jp', campaign: 'Flash Rewards', time: '35m ago', partner: 'Vantage Electronics' },
      { name: 'Sofia Alvarez', email: 'sofia.alv@gmail.com', campaign: 'Partner Spotlight', time: '1h ago', partner: 'Elara Wellness' },
    ],
  },
  {
    title: 'Engaged/Contacted',
    count: 8,
    color: 'bg-emerald-500',
    leads: [
      { name: 'Marcus Vance', email: 'mvance@vance-legal.com', campaign: 'Summer Spin', time: '2h ago', partner: 'Soleil Dining Group' },
      { name: 'Kaelen O\'Connor', email: 'kaelen@dublintech.ie', campaign: 'Referral Boost', time: '4h ago', partner: 'Meridian Apparel' },
    ],
  },
  {
    title: 'Qualified Lead',
    count: 5,
    color: 'bg-blue-500',
    leads: [
      { name: 'Elisa Bianchi', email: 'e.bianchi@milano.it', campaign: 'Loyalty Drive', time: '5h ago', partner: 'Elara Wellness' },
    ],
  },
  {
    title: 'Converted Partner',
    count: 3,
    color: 'bg-purple-500',
    leads: [
      { name: 'Kenji Sato', email: 'kenji.sato@kyoto.jp', campaign: 'Partner Push', time: '1d ago', partner: 'Vantage Electronics' },
    ],
  },
];

const mockLeadsData = [
  { name: 'Alessandro Rossi', email: 'a.rossi@outlook.it', campaign: 'Summer Spin', partner: 'Meridian Apparel', status: 'New', date: 'May 21, 2026' },
  { name: 'Yuki Tanaka', email: 'y.tanaka@sony.co.jp', campaign: 'Flash Rewards', partner: 'Vantage Electronics', status: 'New', date: 'May 21, 2026' },
  { name: 'Sofia Alvarez', email: 'sofia.alv@gmail.com', campaign: 'Partner Spotlight', partner: 'Elara Wellness', status: 'New', date: 'May 21, 2026' },
  { name: 'Marcus Vance', email: 'mvance@vance-legal.com', campaign: 'Summer Spin', partner: 'Soleil Dining Group', status: 'Engaged', date: 'May 21, 2026' },
  { name: 'Kaelen O\'Connor', email: 'kaelen@dublintech.ie', campaign: 'Referral Boost', partner: 'Meridian Apparel', status: 'Engaged', date: 'May 21, 2026' },
  { name: 'Elisa Bianchi', email: 'e.bianchi@milano.it', campaign: 'Loyalty Drive', partner: 'Elara Wellness', status: 'Qualified', date: 'May 20, 2026' },
  { name: 'Kenji Sato', email: 'kenji.sato@kyoto.jp', campaign: 'Partner Push', partner: 'Vantage Electronics', status: 'Converted', date: 'May 20, 2026' },
  { name: 'Lucia Miller', email: 'lucia.m@gmail.com', campaign: 'Summer Spin', partner: 'Soleil Dining Group', status: 'Converted', date: 'May 19, 2026' },
];

const funnelData = [
  { name: 'New Leads', value: 1927, fill: '#f97316' },
  { name: 'Contacted', value: 1240, fill: '#fb923c' },
  { name: 'Qualified', value: 892, fill: '#fdba74' },
  { name: 'Converted', value: 634, fill: '#fed7aa' },
];

export default function LeadsPage() {
  const [routingRules, setRoutingRules] = useState([
    { id: 'spotlight', name: 'Route to spotlight partner', desc: 'Sends standard leads to the active weekly partner.', enabled: true },
    { id: 'high-val', name: 'High-value leads to Meridian', desc: 'Directs premium tier leads straight to clothing rewards.', enabled: true },
    { id: 'spa-interest', name: 'Spa interest to Elara', desc: 'Routes wellness-focused leads to treatment offers.', enabled: false },
  ]);

  const toggleRule = (id: string) => {
    setRoutingRules(prev =>
      prev.map(rule => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">CRM</p>
        <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Leads & Intelligent Routing</h1>
        <p className="text-[#888] text-[13px] mt-1">Capture leads from gamified wheels and automatically route them to partner CRM networks.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {[
          { label: 'Total Leads Captured', value: '1,927', change: '+14.2%', positive: true },
          { label: 'New Today', value: '47', change: '+8.3%', positive: true },
          { label: 'Qualified Leads', value: '892', change: '+11.7%', positive: true },
          { label: 'Converted Partners', value: '634', change: '+15.1%', positive: true },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <p className="text-[#888] text-[12px] mb-1 font-semibold">{card.label}</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-2xl font-display font-bold text-[#1a1a1a]">{card.value}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                card.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
              }`}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Pipeline & Funnel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kanban Board */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Lead Pipeline Stage</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {pipelineSteps.map((step) => (
              <div key={step.title} className="bg-stone-50 rounded-2xl border border-[#eee] p-4 space-y-3 flex flex-col h-[320px]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#1a1a1a] truncate">{step.title}</span>
                  <span className="text-[11px] bg-white border border-[#eee] text-[#666] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {step.count}
                  </span>
                </div>
                <div className={`h-1 rounded-full ${step.color}`} />
                
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {step.leads.map((lead) => (
                    <div key={lead.email} className="bg-white rounded-xl border border-[#eee] p-3 shadow-sm hover:border-[#f97316]/30 transition-all space-y-2">
                      <div className="space-y-0.5">
                        <span className="text-[12px] font-bold text-[#1a1a1a] block truncate">{lead.name}</span>
                        <span className="text-[10px] text-[#888] block truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#f5f5f3] pt-2">
                        <span className="text-[9px] bg-stone-100 text-stone-600 font-bold px-1.5 py-0.5 rounded uppercase">
                          {lead.campaign}
                        </span>
                        <span className="text-[9px] text-[#bbb] font-medium">{lead.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Conversion Funnel</h2>
            <p className="text-[#888] text-[12px] mt-0.5">Pipeline efficiency from capture to partner conversion.</p>
          </div>
          <div className="h-[210px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lead Table & Routing Rules Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-4">
          <h2 className="text-base font-display font-semibold text-[#1a1a1a]">All Captured Leads</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f0f0f0]">
                  {['Name', 'Email', 'Origin Campaign', 'Assigned Partner', 'Status', 'Date'].map((h) => (
                    <th key={h} className="pb-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockLeadsData.map((row) => (
                  <tr key={row.email} className="border-b border-[#f8f8f8] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="py-3.5 text-[13px] font-bold text-[#1a1a1a]">{row.name}</td>
                    <td className="py-3.5 text-[13px] text-[#555]">{row.email}</td>
                    <td className="py-3.5 text-[12px] font-medium text-[#1a1a1a]">{row.campaign}</td>
                    <td className="py-3.5 text-[12px] text-[#666]">{row.partner}</td>
                    <td className="py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        row.status === 'New' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                        row.status === 'Engaged' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        row.status === 'Qualified' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-purple-50 text-purple-600 border border-purple-100'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[12px] text-[#888]">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Routing Rules */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Lead Routing Rules</h2>
            <p className="text-[#888] text-[12px] mt-0.5">Automate routing configurations to partners.</p>
          </div>
          <div className="space-y-4">
            {routingRules.map((rule) => (
              <div key={rule.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-[#eee] bg-[#fafaf9] hover:border-[#f97316]/10 transition-colors">
                <div className="space-y-1">
                  <p className="text-[13px] font-semibold text-[#1a1a1a]">{rule.name}</p>
                  <p className="text-[#888] text-[11px] leading-relaxed">{rule.desc}</p>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    rule.enabled ? 'bg-[#f97316]' : 'bg-[#e2e2e0]'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                    rule.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
