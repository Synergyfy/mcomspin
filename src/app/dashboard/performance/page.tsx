'use client';

import React from 'react';

export default function AnalyticsPage() {
  const campaignStats = [
    { label: 'Total Plays', value: '12,482', change: '+12%', trend: 'up' },
    { label: 'Total Wins', value: '3,120', change: '+5%', trend: 'up' },
    { label: 'Redemptions', value: '2,840', change: '+18%', trend: 'up' },
    { label: 'Redemption Rate', value: '91%', change: '+2%', trend: 'up' },
  ];

  const popularRewards = [
    { name: 'Free Coffee Voucher', wins: 1200, redeemed: 1150, color: '#f97316' },
    { name: '20% Discount Meal', wins: 850, redeemed: 720, color: '#fb923c' },
    { name: 'Buy 1 Get 1 Burger', wins: 640, redeemed: 600, color: '#fdba74' },
    { name: 'Free Side Dish', wins: 430, redeemed: 370, color: '#fed7aa' },
  ];

  const customerMetrics = [
    { label: 'New Customers', value: '842', percentage: 65, color: '#f97316' },
    { label: 'Returning Customers', value: '453', percentage: 35, color: '#1a1a1a' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Analytics & Performance</h2>
          <p className="text-[#888] mt-1">Deep insights into your campaigns, rewards, and customer engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-[#eee] rounded-2xl px-4 py-2.5 text-[13px] font-bold text-[#1a1a1a] outline-none shadow-sm">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 24 Hours</option>
            <option>Custom Range</option>
          </select>
          <button className="px-5 py-2.5 bg-[#1a1a1a] text-white rounded-2xl text-[13px] font-bold hover:bg-[#f97316] transition-all">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Section - Campaign Analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {campaignStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-[#eee] shadow-sm relative overflow-hidden group hover:border-[#f97316]/30 transition-all">
            <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-black text-[#1a1a1a]">{stat.value}</h3>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${
                stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? '↑' : '↓'}
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <svg className="w-24 h-24 text-[#f97316]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reward Analytics - Most Popular Rewards */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[17px] font-bold text-[#1a1a1a]">Most Popular Rewards</h3>
            <span className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Wins vs Redemptions</span>
          </div>
          
          <div className="space-y-8">
            {popularRewards.map((reward, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[13px] font-bold">
                  <span className="text-[#1a1a1a]">{reward.name}</span>
                  <span className="text-[#888]">{reward.redeemed} / {reward.wins}</span>
                </div>
                <div className="h-3 w-full bg-[#f5f5f3] rounded-full overflow-hidden flex">
                  <div 
                    className="h-full rounded-full relative" 
                    style={{ width: `${(reward.redeemed / reward.wins) * 100}%`, backgroundColor: reward.color }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-[#fafaf9] rounded-3xl border border-[#eee] border-dashed text-center">
            <p className="text-[13px] text-[#888]">
              <span className="font-bold text-[#f97316]">Pro Tip:</span> Your "Free Coffee" has the highest engagement. Consider running a weekend-specific campaign for this reward.
            </p>
          </div>
        </div>

        {/* Customer Analytics - New vs Returning */}
        <div className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm flex flex-col">
          <h3 className="text-[17px] font-bold text-[#1a1a1a] mb-8">Customer Growth</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Simple CSS Donut Chart Mockup */}
            <div className="w-48 h-48 rounded-full border-[16px] border-[#f5f5f3] relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-[#f97316] border-r-[#f97316] rotate-45" />
              <div className="text-center">
                <p className="text-3xl font-black text-[#1a1a1a]">1,295</p>
                <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">Total Customers</p>
              </div>
            </div>

            <div className="w-full mt-10 space-y-4">
              {customerMetrics.map((metric, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-[#eee] hover:bg-[#fafaf9] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }} />
                    <span className="text-[13px] font-bold text-[#444]">{metric.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-[#1a1a1a]">{metric.value}</p>
                    <p className="text-[10px] font-bold text-[#aaa]">{metric.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics Placeholder */}
      <div className="bg-[#1a1a1a] rounded-[40px] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold mb-2">Revenue Analytics</h3>
            <p className="text-white/60 text-[14px]">
              Connect your POS or payment provider to track direct ROI from your MCOMSpin campaigns.
            </p>
          </div>
          <button className="px-8 py-4 bg-[#f97316] text-white rounded-2xl font-bold hover:bg-[#ea580c] transition-all shadow-xl shadow-[#f97316]/20">
            Coming Soon: Connect Payments
          </button>
        </div>
        
        {/* Background graphics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#f97316]/20 to-transparent rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full -ml-10 -mb-10 blur-xl" />
      </div>
    </div>
  );
}
