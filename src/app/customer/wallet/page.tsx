'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerStore, CustomerReward } from '@/store/customer-store';
import { 
  Wallet, 
  Search, 
  Filter, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info,
  Ticket,
  Tag,
  Gift
} from 'lucide-react';

export default function RewardWalletPage() {
  const { wallet, redeemReward } = useCustomerStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'redeemed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReward, setSelectedReward] = useState<CustomerReward | null>(null);

  // Filtering and Searching
  const filteredWallet = wallet.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = wallet.filter(w => w.status === 'active').length;
  const redeemedCount = wallet.filter(w => w.status === 'redeemed').length;

  return (
    <div className="space-y-8 pb-20 text-left">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#f97316] uppercase">Secure Vault</p>
          <h1 className="text-3xl font-display font-bold text-[#1a1a1a]">Reward Wallet</h1>
          <p className="text-[#888] text-sm max-w-md">
            Your collection of digital coupons, VIP tickets, and exclusive high street discounts.
          </p>
        </div>

        {/* Wallet Stats Card */}
        <div className="flex items-center gap-6 bg-white border border-[#eee] rounded-[28px] px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-wider">Active</p>
              <p className="text-xl font-display font-bold text-[#1a1a1a]">{activeCount}</p>
            </div>
          </div>
          <div className="w-px h-10 bg-[#eee]" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center">
              <History className="w-5 h-5 text-[#bbb]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-wider">Claimed</p>
              <p className="text-xl font-display font-bold text-[#1a1a1a]">{redeemedCount}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-white border border-[#eee] p-1.5 rounded-2xl shadow-sm w-full lg:w-auto overflow-x-auto">
          {(['all', 'active', 'redeemed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === tab 
                  ? 'bg-[#1a1a1a] text-white shadow-lg' 
                  : 'text-[#888] hover:text-[#1a1a1a] hover:bg-stone-50'
              }`}
            >
              {tab === 'all' ? 'All Assets' : tab === 'active' ? 'Available' : 'Past Rewards'}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
          <input 
            type="text" 
            placeholder="Search providers or rewards..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#eee] rounded-2xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-[#f97316]/5 transition-all font-medium"
          />
        </div>
      </div>

      {/* Wallet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredWallet.length > 0 ? (
            filteredWallet.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id}
                onClick={() => setSelectedReward(item)}
                className={`group relative bg-white border rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between h-[240px] ${
                  item.status === 'redeemed' 
                    ? 'border-[#eee] opacity-60 grayscale-[0.5]' 
                    : 'border-[#eee] hover:border-[#f97316]/30'
                }`}
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 pointer-events-none ${
                  item.type === 'voucher' ? 'bg-orange-500' :
                  item.type === 'product' ? 'bg-blue-500' :
                  'bg-emerald-500'
                }`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-stone-50 border border-[#eee] rounded-lg flex items-center justify-center font-bold text-[11px] text-[#666]">
                        {item.provider.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider">{item.provider}</span>
                    </div>
                    {item.status === 'active' ? (
                      <QrCode className="w-5 h-5 text-[#f97316]" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-bold text-[#1a1a1a] leading-tight group-hover:text-[#f97316] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-[#888] line-clamp-2 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 border-t border-[#f5f5f3] pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#bbb] uppercase tracking-widest">Digital Code</span>
                    <span className="text-[13px] font-mono font-bold text-[#1a1a1a] tracking-tight">{item.code}</span>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    item.status === 'active' 
                      ? 'bg-[#1a1a1a] text-white group-hover:bg-[#f97316]' 
                      : 'bg-stone-100 text-[#bbb]'
                  }`}>
                    {item.status === 'active' ? 'Reveal QR' : 'Redeemed'}
                  </div>
                </div>

                {/* Corner Type Icon */}
                <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                  {item.type === 'voucher' ? <Tag className="w-24 h-24" /> :
                   item.type === 'product' ? <Gift className="w-24 h-24" /> :
                   <Ticket className="w-24 h-24" />}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-32 bg-white border border-[#eee] border-dashed rounded-[48px] flex flex-col items-center justify-center gap-4 text-center"
            >
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                <Wallet className="w-10 h-10 text-[#bbb]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-[#1a1a1a]">No assets found</h3>
                <p className="text-sm text-[#888] max-w-xs mx-auto">Your wallet is looking a bit light. Play some active games to start filling it up!</p>
              </div>
              <button 
                onClick={() => setFilter('all')}
                className="mt-2 bg-[#1a1a1a] hover:bg-[#f97316] text-white px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Show All Rewards
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ASSET DETAIL MODAL (Digital QR Pass) */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1a1a1a]/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-[48px] shadow-2xl overflow-hidden border border-[#eee] relative text-center"
            >
              {/* Card Top Branding */}
              <div className="bg-[#fafaf9] p-8 border-b border-[#eee] space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-white border border-[#eee] rounded-2xl shadow-sm flex items-center justify-center font-display font-bold text-xl text-[#1a1a1a]">
                    {selectedReward.provider.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold text-[#f97316] uppercase tracking-[0.2em]">{selectedReward.provider}</p>
                  <h3 className="text-2xl font-display font-bold text-[#1a1a1a]">{selectedReward.title}</h3>
                </div>
              </div>

              {/* QR Code Section (The "Vault" Reveal) */}
              <div className="p-10 space-y-8">
                <div className="relative group mx-auto w-48 h-48">
                  <div className="absolute inset-0 bg-[#f97316]/10 rounded-[32px] blur-2xl group-hover:blur-3xl transition-all" />
                  <div className="relative bg-white border-2 border-[#f5f5f3] rounded-[32px] p-6 shadow-inner flex items-center justify-center">
                    {/* Simulated High-Fidelity QR */}
                    <div className="grid grid-cols-7 gap-1 w-full h-full">
                      {[...Array(49)].map((_, i) => (
                        <div key={i} className={`rounded-sm ${
                          i === 0 || i === 6 || i === 42 || i === 48 || i % 4 === 0 || i % 9 === 0
                            ? 'bg-[#1a1a1a]' 
                            : 'bg-white'
                        }`} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest">Unique Reward Identifier</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono font-black text-[#1a1a1a] tracking-tight">{selectedReward.code}</span>
                    <button className="p-2 hover:bg-stone-50 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4 text-[#bbb]" />
                    </button>
                  </div>
                </div>

                {/* Redemption Actions */}
                <div className="space-y-4 pt-4">
                  {selectedReward.status === 'active' ? (
                    <>
                      <button
                        onClick={() => {
                          redeemReward(selectedReward.id);
                          setSelectedReward(null);
                        }}
                        className="w-full bg-[#1a1a1a] hover:bg-[#f97316] text-white py-4.5 rounded-[24px] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-stone-200 active:scale-95"
                      >
                        Redeem at Storefront
                      </button>
                      <p className="text-[10px] text-[#bbb] font-medium leading-relaxed">
                        Present this QR code to the business staff during checkout. <br /> Valid until May 2026.
                      </p>
                    </>
                  ) : (
                    <div className="space-y-4">
                       <div className="bg-emerald-50 text-emerald-600 py-4.5 rounded-[24px] text-xs font-bold uppercase tracking-[0.2em] border border-emerald-100 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Successfully Redeemed
                      </div>
                      <Link 
                        href="/customer/history"
                        className="block text-[10px] font-bold text-[#f97316] uppercase tracking-widest hover:underline"
                      >
                        View Redemption Details
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Handle */}
              <button 
                onClick={() => setSelectedReward(null)}
                className="absolute top-6 right-6 p-2 text-[#bbb] hover:text-[#1a1a1a] transition-colors"
              >
                <ChevronRight className="w-6 h-6 rotate-90" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help/Support Section (The "Done-for-you service plus" touch) */}
      <section className="bg-white border border-[#eee] rounded-[48px] p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-20 h-20 bg-orange-50 rounded-[24px] flex items-center justify-center shrink-0">
          <Info className="w-10 h-10 text-[#f97316]" />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-xl font-display font-bold text-[#1a1a1a]">Need help with a reward?</h2>
          <p className="text-sm text-[#888] leading-relaxed">
            If you're having trouble redeeming a voucher or a business isn't listed, our platform support team is here to assist. We ensure every Box Reward experience is seamless for both you and the merchant.
          </p>
        </div>
        <button className="bg-white border border-[#eee] hover:border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm active:scale-95">
          Contact Support
        </button>
      </section>
    </div>
  );
}

// Missing component from previous imports
function History({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
