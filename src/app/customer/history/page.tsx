'use client';

import React from 'react';

export default function HistoryPage() {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Activity History</h1>
        <p className="text-[#888] text-sm">A full log of your rewards, spins, and redemptions.</p>
      </div>
      <div className="bg-white rounded-3xl border border-[#eee] p-12 text-center">
        <p className="text-[#bbb] font-bold uppercase tracking-widest text-[11px]">No activity history recorded.</p>
      </div>
    </div>
  );
}
