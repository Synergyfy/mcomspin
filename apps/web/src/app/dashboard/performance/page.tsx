'use client';

import React from 'react';
import { useBusinessAnalytics } from '@/services/business';

/* ─── Skeleton card ─── */
function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-[#eee] shadow-sm animate-pulse">
      <div className="h-3 w-24 bg-[#f0f0f0] rounded mb-3" />
      <div className="h-8 w-16 bg-[#f0f0f0] rounded" />
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: analyticsData, isLoading } = useBusinessAnalytics();

  const campaignStats: any[] = (analyticsData as any)?.campaignStats ?? [];
  const popularRewards: any[] = (analyticsData as any)?.popularRewards ?? [];
  const customerMetrics: any[] = (analyticsData as any)?.customerMetrics ?? [];
  const totalCustomers: number = (analyticsData as any)?.totalCustomers ?? 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Analytics &amp; Performance</h2>
          <p className="text-[#888] mt-1">Deep insights into your campaigns, rewards, and customer engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-[#eee] rounded-2xl px-4 py-2.5 text-[13px] font-bold text-[#1a1a1a] outline-none shadow-sm">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 24 Hours</option>
          </select>
        </div>
      </div>

      {/* KPI Section - Campaign Analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : campaignStats.length > 0
          ? campaignStats.map((stat: any, i: any) => (
              <div
                key={i}
                className="bg-white p-6 rounded-[32px] border border-[#eee] shadow-sm relative overflow-hidden group hover:border-[#f97316]/30 transition-all"
              >
                <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-black text-[#1a1a1a]">{stat.value}</h3>
                  {stat.change && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${
                        stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {stat.change}
                      {stat.trend === 'up' ? '↑' : '↓'}
                    </div>
                  )}
                </div>
                <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <svg className="w-24 h-24 text-[#f97316]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
              </div>
            ))
          : (
              <div className="col-span-4 bg-white p-10 rounded-[32px] border border-[#eee] shadow-sm text-center text-[#888]">
                No analytics data yet. Start a campaign to see your stats here.
              </div>
            )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reward Analytics - Most Popular Rewards */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[17px] font-bold text-[#1a1a1a]">Most Popular Rewards</h3>
            <span className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Wins vs Redemptions</span>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="h-3 w-48 bg-[#f0f0f0] rounded" />
                  <div className="h-3 w-full bg-[#f0f0f0] rounded-full" />
                </div>
              ))}
            </div>
          ) : popularRewards.length > 0 ? (
            <div className="space-y-8">
              {popularRewards.map((reward: any, i: any) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[13px] font-bold">
                    <span className="text-[#1a1a1a]">{reward.name}</span>
                    <span className="text-[#888]">{reward.redeemed} / {reward.wins}</span>
                  </div>
                  <div className="h-3 w-full bg-[#f5f5f3] rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full relative"
                      style={{
                        width: reward.wins > 0 ? `${(reward.redeemed / reward.wins) * 100}%` : '0%',
                        backgroundColor: reward.color,
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-[#888]">
              <svg className="w-12 h-12 text-[#ddd] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <p className="text-[13px] font-medium">No reward data yet</p>
              <p className="text-[11px] mt-1">Redemptions will appear here once customers start winning.</p>
            </div>
          )}
        </div>

        {/* Customer Analytics - New vs Returning */}
        <div className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm flex flex-col">
          <h3 className="text-[17px] font-bold text-[#1a1a1a] mb-8">Customer Growth</h3>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Donut total */}
            <div className="w-48 h-48 rounded-full border-[16px] border-[#f5f5f3] relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-[#f97316] border-r-[#f97316] rotate-45" />
              <div className="text-center">
                <p className="text-3xl font-black text-[#1a1a1a]">{totalCustomers.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">Total Customers</p>
              </div>
            </div>

            <div className="w-full mt-10 space-y-4">
              {isLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-14 bg-[#f5f5f3] rounded-2xl animate-pulse" />
                  ))
                : customerMetrics.length > 0
                ? customerMetrics.map((metric: any, i: any) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl border border-[#eee] hover:bg-[#fafaf9] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }} />
                        <span className="text-[13px] font-bold text-[#444]">{metric.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-bold text-[#1a1a1a]">{metric.value}</p>
                        <p className="text-[10px] font-bold text-[#aaa]">{metric.percentage}%</p>
                      </div>
                    </div>
                  ))
                : (
                    <p className="text-center text-[12px] text-[#bbb] py-4">No customer data yet</p>
                  )}
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#f97316]/20 to-transparent rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full -ml-10 -mb-10 blur-xl" />
      </div>
    </div>
  );
}
