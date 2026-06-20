'use client';

import React, { useState } from 'react';
import { useBusinessRedemptions, useApproveRedemption, useRejectRedemption } from '@/services/business';

type RedemptionStatus = 'Pending' | 'Redeemed' | 'Expired' | 'Rejected';

export default function RedemptionsPage() {
  const [activeTab, setActiveTab] = useState<RedemptionStatus>('Pending');
  const [redeemCode, setRedeemCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const { data: redemptionsData, isLoading } = useBusinessRedemptions();
  const approveRedemption = useApproveRedemption();
  const rejectRedemption = useRejectRedemption();

  // Backend returns { data: [...], meta: {...} }
  const redemptions: any[] = (redemptionsData as any)?.data ?? (Array.isArray(redemptionsData) ? redemptionsData : []);

  const stats: Record<RedemptionStatus, number> = {
    Pending: redemptions.filter((r: any) => r.status === 'Pending').length,
    Redeemed: redemptions.filter((r: any) => r.status === 'Redeemed').length,
    Expired: redemptions.filter((r: any) => r.status === 'Expired').length,
    Rejected: redemptions.filter((r: any) => r.status === 'Rejected').length,
  };

  const filteredRedemptions = redemptions.filter((r: any) => r.status === activeTab);

  /* ─── CSV export ─── */
  const handleDownloadCSV = () => {
    const headers = ['ID', 'Customer', 'Reward', 'Code', 'Time', 'Status'];
    const rows = filteredRedemptions.map((r: any) => [
      r.id,
      r.customerName,
      r.rewardName,
      r.code,
      r.timestamp,
      r.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v: any) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redemptions-${activeTab.toLowerCase()}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Redemptions</h2>
          <p className="text-[#888] mt-1">Validate rewards and manage redemption history.</p>
        </div>

        {/* Quick Redemption Action */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Enter Redemption Code..."
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              className="w-full bg-white border border-[#eee] rounded-2xl px-4 py-3 text-[13px] font-medium text-[#1a1a1a] placeholder:text-[#bbb] outline-none focus:border-[#f97316] transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => {
              const match = redemptions.find((r: any) => r.code === redeemCode.toUpperCase() && r.status === 'Pending');
              if (match) approveRedemption.mutate(match.id);
              else alert('No pending redemption found for this code.');
            }}
            className="px-6 py-3 bg-[#f97316] text-white rounded-2xl text-[13px] font-bold hover:bg-[#ea580c] transition-all shadow-lg shadow-[#f97316]/20"
          >
            Redeem
          </button>
          <button
            onClick={() => setShowScanner(true)}
            className="p-3 bg-[#1a1a1a] text-white rounded-2xl hover:bg-[#333] transition-all shadow-lg shadow-black/10"
            title="Scan QR Code"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs / Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['Pending', 'Redeemed', 'Expired', 'Rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-4 rounded-3xl border transition-all text-left relative overflow-hidden group ${
              activeTab === tab
                ? 'bg-white border-[#f97316] shadow-md'
                : 'bg-white border-[#eee] hover:border-[#ddd] shadow-sm'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl mb-3 flex items-center justify-center ${
              activeTab === tab ? 'bg-[#f97316] text-white' : 'bg-[#f5f5f3] text-[#aaa]'
            }`}>
              {tab === 'Pending' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              {tab === 'Redeemed' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
              {tab === 'Expired' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              {tab === 'Rejected' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>}
            </div>
            <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">{tab}</p>
            <p className="text-2xl font-black text-[#1a1a1a] mt-1">
              {isLoading ? '—' : stats[tab]}
            </p>
            {activeTab === tab && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#f97316]/5 rounded-bl-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#f97316] rounded-full" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main List */}
      <div className="bg-white rounded-[32px] border border-[#eee] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-[#eee] flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#1a1a1a]">{activeTab} Log</h3>
          <button
            onClick={handleDownloadCSV}
            className="text-[12px] font-bold text-[#f97316] hover:underline"
          >
            Download CSV
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafaf9] border-b border-[#eee]">
                <th className="px-8 py-4 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Reward / Customer</th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Code</th>
                <th className="px-8 py-4 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Time</th>
                {activeTab === 'Pending' && (
                  <th className="px-8 py-4 text-[11px] font-bold text-[#aaa] uppercase tracking-wider text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f3]">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-8 py-4">
                      <div className="h-4 w-full bg-[#f5f5f3] rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredRedemptions.length > 0 ? (
                filteredRedemptions.map((r: any) => (
                  <tr key={r.id} className="group hover:bg-[#fafaf9] transition-colors">
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-[14px] font-bold text-[#1a1a1a]">{r.rewardName}</p>
                        <p className="text-[12px] text-[#888]">{r.customerName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-[13px] bg-[#f5f5f3] px-2 py-1 rounded text-[#444] font-bold border border-[#eee]">
                        {r.code}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[13px] text-[#888]">{r.timestamp}</td>
                    {activeTab === 'Pending' && (
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approveRedemption.mutate(r.id)}
                            disabled={approveRedemption.isPending}
                            className="px-4 py-1.5 bg-green-500 text-white rounded-xl text-[12px] font-bold hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50"
                          >
                            Redeem
                          </button>
                          <button
                            onClick={() => rejectRedemption.mutate(r.id)}
                            disabled={rejectRedemption.isPending}
                            className="px-4 py-1.5 bg-[#f5f5f3] text-[#666] rounded-xl text-[12px] font-bold hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-[#f5f5f3] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-[15px] font-bold text-[#1a1a1a]">No {activeTab.toLowerCase()} redemptions</p>
                    <p className="text-[13px] text-[#888] mt-1">There&apos;s nothing to see here yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-[#f5f5f3]">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-[#f5f5f3] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredRedemptions.length > 0 ? (
            filteredRedemptions.map((r: any) => (
              <div key={r.id} className="p-5 flex flex-col gap-4 active:bg-[#fafaf9]">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#1a1a1a] leading-tight">{r.rewardName}</p>
                    <p className="text-[13px] text-[#888] mt-1">{r.customerName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Time</p>
                    <p className="text-[13px] font-medium text-[#666] mt-0.5">{r.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 p-3 bg-[#fafaf9] rounded-2xl border border-[#f0f0ee]">
                  <div>
                    <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider mb-1">Redemption Code</p>
                    <span className="font-mono text-[14px] text-[#f97316] font-bold">{r.code}</span>
                  </div>
                  {activeTab === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveRedemption.mutate(r.id)}
                        disabled={approveRedemption.isPending}
                        className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      </button>
                      <button
                        onClick={() => rejectRedemption.mutate(r.id)}
                        disabled={rejectRedemption.isPending}
                        className="w-10 h-10 bg-white text-red-500 border border-red-100 rounded-xl flex items-center justify-center shadow-sm active:scale-95 transition-all disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-[15px] font-bold text-[#1a1a1a]">No {activeTab.toLowerCase()} redemptions</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Scanner Overlay */}
      {showScanner && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="p-6 flex items-center justify-between text-white">
            <h3 className="text-lg font-bold">Scan QR Code</h3>
            <button onClick={() => setShowScanner(false)} className="p-2 bg-white/10 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-full aspect-square border-[4px] border-[#f97316] rounded-[40px] relative shadow-[0_0_100px_rgba(249,115,22,0.3)]">
              <div className="absolute inset-0 border-[2px] border-white/20 rounded-[36px] overflow-hidden">
                <div className="w-full h-1 bg-[#f97316] absolute top-0 left-0 shadow-[0_0_20px_rgba(249,115,22,1)] animate-scan" />
              </div>
            </div>
          </div>
          <div className="p-12 text-center">
            <p className="text-white/60 text-[13px] mb-8">Align the customer&apos;s QR code within the frame to automatically redeem their reward.</p>
            <button className="w-full py-4 bg-white text-black text-[15px] font-bold rounded-[24px]">Flash Off</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(300px); }
          100% { transform: translateY(0); }
        }
        .animate-scan { animation: scan 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
