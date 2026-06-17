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
  Gift,
  X
} from 'lucide-react';

export default function RewardWalletPage() {
  const { wallet, redeemReward } = useCustomerStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'redeemed' | 'expired' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReward, setSelectedReward] = useState<CustomerReward | null>(null);

  // Filtering and Searching
  const filteredWallet = wallet.filter(item => {
    // Note: Step 12 specifically mentions Active, Used (Redeemed), Expired, and Saved.
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCount = wallet.filter(w => w.status === 'active').length;
  const redeemedCount = wallet.filter(w => w.status === 'redeemed').length;

  return (
    <div className="space-y-8 pb-20 text-left bg-stone-50/20 min-h-screen">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight uppercase">My Winnings</h1>
          <p className="text-stone-500 text-sm max-w-md font-medium">
            Every reward you win is automatically stored here. Nothing disappears—ever.
          </p>
        </div>

        {/* Wallet Stats Card */}
        <div className="flex items-center gap-6 bg-white border border-stone-100 rounded-[2rem] px-8 py-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shadow-inner">
              <Gift className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Available</p>
              <p className="text-2xl font-black text-stone-900 leading-tight">{activeCount}</p>
            </div>
          </div>
          <div className="w-px h-12 bg-stone-100" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center">
              <History className="w-6 h-6 text-stone-300" />
            </div>
            <div>
              <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Used</p>
              <p className="text-2xl font-black text-stone-900 leading-tight">{redeemedCount}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-white border border-stone-100 p-2 rounded-2xl shadow-sm w-full lg:w-auto overflow-x-auto custom-scrollbar gap-1">
          {(['all', 'active', 'redeemed', 'expired', 'saved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === tab 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {tab === 'all' ? 'All Rewards' : 
               tab === 'active' ? 'Active' : 
               tab === 'redeemed' ? 'Used' :
               tab === 'expired' ? 'Expired' : 'Saved'}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
          <input 
            type="text" 
            placeholder="Search your rewards..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold placeholder:text-stone-300 text-stone-900"
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
                <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 pointer-events-none ${
                  item.status === 'expired' ? 'bg-stone-300' :
                  item.type === 'voucher' ? 'bg-orange-400' :
                  item.type === 'product' ? 'bg-blue-400' :
                  'bg-orange-300'
                }`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white border border-stone-100 rounded-lg flex items-center justify-center font-bold text-[11px] text-stone-900 shadow-sm">
                        {item.provider.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{item.provider}</span>
                    </div>
                    {item.status === 'active' ? (
                      <QrCode className="w-5 h-5 text-orange-500" />
                    ) : item.status === 'expired' ? (
                      <Clock className="w-5 h-5 text-stone-300" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-orange-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-bold text-stone-900 leading-tight group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-stone-500 line-clamp-2 leading-relaxed font-medium">
                      {item.details}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 border-t border-stone-50 pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Vault Code</span>
                    <span className="text-[13px] font-mono font-bold text-stone-900 tracking-tight">{item.code}</span>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    item.status === 'active' 
                      ? 'bg-stone-900 text-white group-hover:bg-orange-500 shadow-md group-hover:shadow-orange-500/20' 
                      : 'bg-stone-50 text-stone-300'
                  }`}>
                    {item.status === 'active' ? 'View Pass' : 
                     item.status === 'expired' ? 'Expired' : 'Used'}
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
            className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100 relative text-center"
            >
              {/* Card Top Branding */}
              <div className="bg-stone-50/50 p-8 border-b border-stone-100 space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-white border border-stone-100 rounded-2xl shadow-sm flex items-center justify-center font-display font-black text-xl text-stone-900">
                    {selectedReward.provider.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">{selectedReward.provider}</p>
                  <h3 className="text-2xl font-black text-stone-900 uppercase italic tracking-tighter">{selectedReward.title}</h3>
                </div>
              </div>

              {/* QR Code Section (The "Vault" Reveal) */}
              <div className="p-10 space-y-8">
                <div className="relative group mx-auto w-48 h-48">
                  <div className="absolute inset-0 bg-orange-500/5 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all" />
                  <div className="relative bg-white border-2 border-stone-50 rounded-[2.5rem] p-6 shadow-inner flex items-center justify-center">
                    {/* Simulated High-Fidelity QR */}
                    <div className="grid grid-cols-7 gap-1 w-full h-full opacity-80">
                      {[...Array(49)].map((_, i) => (
                        <div key={i} className={`rounded-sm ${
                          i === 0 || i === 6 || i === 42 || i === 48 || i % 4 === 0 || i % 9 === 0
                            ? 'bg-stone-900' 
                            : 'bg-white'
                        }`} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Digital Vault Key</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono font-black text-stone-900 tracking-tight">{selectedReward.code}</span>
                    <button className="p-2 hover:bg-stone-50 rounded-lg transition-colors text-stone-300 hover:text-orange-500">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Redemption Actions */}
                <div className="space-y-4 pt-4">
                  {selectedReward.status === 'active' ? (
                    <>
                      <Link
                        href={`/customer/redeem?rewardId=${selectedReward.id}`}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4.5 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        Redeem at Storefront
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <p className="text-[10px] text-stone-400 font-bold leading-relaxed uppercase tracking-wider">
                        Present this pass during checkout. <br /> Valid until {selectedReward.expiry}.
                      </p>
                    </>
                  ) : (
                    <div className="space-y-4">
                       <div className="bg-emerald-50 text-emerald-600 py-4.5 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] border border-emerald-100 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Asset Redeemed
                      </div>
                      <Link 
                        href="/customer/history"
                        className="block text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
                      >
                        View Transaction Record
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Handle */}
              <button 
                onClick={() => setSelectedReward(null)}
                className="absolute top-6 right-6 p-2 text-stone-300 hover:text-orange-500 transition-colors"
              >
                <X className="w-6 h-6" />
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
