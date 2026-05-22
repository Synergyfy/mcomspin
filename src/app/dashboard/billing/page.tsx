'use client';

import React from 'react';

const invoices = [
  { id: 'INV-2026-004', date: 'May 15, 2026', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-003', date: 'Apr 15, 2026', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-002', date: 'Mar 15, 2026', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-001', date: 'Feb 15, 2026', amount: '$149.00', status: 'Paid' },
];

export default function BillingPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Billing</p>
        <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Plans & Usage Control</h1>
        <p className="text-[#888] text-[13px] mt-1">Manage your enterprise subscription tier, check API quotas, and download historic invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Current Plan & Quotas */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Plan Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Plan Card */}
            <div className="bg-[#1a1a1a] text-white rounded-2xl border border-stone-850 p-6 flex flex-col justify-between relative overflow-hidden shadow-md">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-[#f97316]/10 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[0.15em] bg-[#f97316] text-white px-2.5 py-0.5 rounded-full uppercase">Current Plan</span>
                  <span className="text-[#888] text-[12px] font-semibold">Renews Jun 15</span>
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">Growth Partner</h2>
                  <p className="text-[#888] text-[12px] mt-1">Controlled gamification & multi-storefront routing.</p>
                </div>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-display font-bold">$299</span>
                  <span className="text-[#888] text-[12px]">/ month</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-[#f97316] hover:bg-[#ea580c] text-white py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.12em] transition-all relative z-10 shadow-lg shadow-[#f97316]/10">
                Upgrade Workspace Plan
              </button>
            </div>

            {/* Plan Features Checklist */}
            <div className="bg-white rounded-2xl border border-[#eee] p-6 space-y-4">
              <h3 className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-[0.08em]">Features Included</h3>
              <ul className="space-y-3">
                {[
                  'Up to 15 active gamification campaigns',
                  'Universal checkout storefront embeds',
                  'Ecosystem collaborative partner pool',
                  'Automated priority lead routing rules',
                  'Fintech-grade enterprise security controls',
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-[13px] text-[#555] font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Usage Quotas */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-base font-display font-semibold text-[#1a1a1a]">Usage Metrics</h2>
              <p className="text-[#888] text-[12px] mt-0.5">Your monthly consumption across active infrastructure layers.</p>
            </div>
            
            <div className="space-y-5">
              {[
                { label: 'Ecosystem API Calls', current: '8,420', limit: '10,000', percentage: 84 },
                { label: 'Active Storefront Campaigns', current: '8', limit: '15', percentage: 53 },
                { label: 'Cloud Storage Usage', current: '2.4 GB', limit: '5.0 GB', percentage: 48 },
              ].map((quota) => (
                <div key={quota.label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[12px] font-bold text-[#1a1a1a]">{quota.label}</span>
                    <span className="text-[12px] font-semibold text-[#666]">
                      {quota.current} <span className="text-[#bbb]">/</span> {quota.limit}
                    </span>
                  </div>
                  <div className="h-2 bg-[#f5f5f3] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        quota.percentage > 80 ? 'bg-[#f97316]' : 'bg-[#1a1a1a]'
                      }`}
                      style={{ width: `${quota.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Payment & Invoice History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-4">
            <h3 className="text-base font-display font-semibold text-[#1a1a1a]">Payment Card</h3>
            <div className="p-4 rounded-xl border border-[#eee] bg-[#fafaf9] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#1a1a1a] text-white p-2.5 rounded-lg font-mono text-[11px] font-bold uppercase tracking-wider">
                  Visa
                </div>
                <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-[#1a1a1a]">•••• 4242</p>
                  <p className="text-[10px] text-[#bbb] font-semibold">Expires 12/27</p>
                </div>
              </div>
              <button className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#f97316] hover:text-[#ea580c] transition-colors">
                Update
              </button>
            </div>
          </div>

          {/* Invoice History */}
          <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 space-y-4">
            <h3 className="text-base font-display font-semibold text-[#1a1a1a]">Invoice History</h3>
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-3 border-b border-[#f5f5f3] last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-bold text-[#1a1a1a]">{inv.id}</p>
                    <p className="text-[10px] text-[#bbb] font-semibold">{inv.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] font-bold text-[#1a1a1a]">{inv.amount}</span>
                    <button className="p-1.5 hover:bg-[#f5f5f3] rounded-lg text-stone-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
