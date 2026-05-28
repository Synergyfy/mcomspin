'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerStore, CustomerReward } from '@/store/customer-store';
import { 
  Gift, 
  Clock, 
  Zap, 
  Search, 
  Filter, 
  ChevronRight, 
  Sparkles,
  Ticket,
  ExternalLink
} from 'lucide-react';

export default function MyRewardsPage() {
  const { wallet, redeemReward } = useCustomerStore();
  const [filter, setFilter] = useState<'all' | 'unclaimed' | 'featured' | 'expiring'>('all');
  const [selectedReward, setSelectedReward] = useState<CustomerReward | null>(null);

  // Filter logic based on the architecture doc requirements:
  // "Available rewards", "Unclaimed prizes", "Expiring rewards", "Featured offers"
  const filteredRewards = wallet.filter(reward => {
    if (filter === 'unclaimed') return reward.status === 'active';
    // For now, we'll treat all active rewards as available. 
    // In a real scenario, 'expiring' and 'featured' would have specific flags in the store.
    return true; 
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#f97316] uppercase">Inventory</p>
          <h1 className="text-3xl font-display font-bold text-[#1a1a1a]">My Rewards</h1>
          <p className="text-[#888] text-sm max-w-md">
            Manage your collection of unclaimed prizes and exclusive partner offers.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 bg-white border border-[#eee] rounded-2xl px-5 py-3 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-wider">Total</p>
            <p className="text-xl font-display font-bold text-[#1a1a1a]">{wallet.length}</p>
          </div>
          <div className="w-px h-8 bg-[#eee]" />
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-wider">Active</p>
            <p className="text-xl font-display font-bold text-[#f97316]">{wallet.filter(r => r.status === 'active').length}</p>
          </div>
        </div>
      </header>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-white border border-[#eee] p-1 rounded-xl shadow-sm overflow-x-auto w-full sm:w-auto">
          {(['all', 'unclaimed', 'expiring', 'featured'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === tab 
                  ? 'bg-[#1a1a1a] text-white shadow-md' 
                  : 'text-[#888] hover:text-[#1a1a1a] hover:bg-stone-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
          <input 
            type="text" 
            placeholder="Search rewards..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#eee] rounded-xl text-sm focus:outline-none focus:border-[#f97316] transition-all"
          />
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRewards.length > 0 ? (
            filteredRewards.map((reward) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={reward.id}
                onClick={() => setSelectedReward(reward)}
                className="group relative bg-white border border-[#eee] rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#f97316]/30 transition-all cursor-pointer overflow-hidden flex flex-col justify-between aspect-[4/5] sm:aspect-auto sm:min-h-[280px]"
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f97316]/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="space-y-4 relative z-10 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-stone-100 text-[#666] px-2.5 py-1 rounded-lg border border-[#eee] uppercase tracking-wider">
                      {reward.provider}
                    </span>
                    {reward.status === 'active' && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-display font-bold text-[#1a1a1a] leading-tight group-hover:text-[#f97316] transition-colors">
                      {reward.title}
                    </h3>
                    <p className="text-sm text-[#888] line-clamp-2">
                      {reward.details}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 space-y-4 pt-6 text-left">
                  <div className="flex items-center justify-between border-t border-[#f5f5f3] pt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#bbb]" />
                      <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest">Expires in 12d</span>
                    </div>
                    <div className="text-lg font-display font-black text-[#1a1a1a] tracking-tight">
                      {reward.value}
                    </div>
                  </div>
                  
                  <button className="w-full bg-[#1a1a1a] group-hover:bg-[#f97316] text-white py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-md">
                    Claim Reward
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Status Overlay for Redeemed */}
                {reward.status === 'redeemed' && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center rotate-[-12deg]">
                    <span className="border-4 border-stone-300 text-stone-400 font-display font-black text-3xl px-6 py-2 rounded-2xl uppercase tracking-tighter opacity-80">
                      Redeemed
                    </span>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 bg-white border border-[#eee] border-dashed rounded-[40px] flex flex-col items-center justify-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-[#bbb]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-display font-bold text-[#1a1a1a]">No rewards found</h3>
                <p className="text-sm text-[#888]">Try adjusting your filters or play a game to win!</p>
              </div>
              <button 
                onClick={() => setFilter('all')}
                className="text-[11px] font-bold text-[#f97316] uppercase tracking-widest hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1a1a1a]/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-[#eee] relative text-left"
            >
              {/* Modal Header/Art */}
              <div className="h-48 bg-gradient-to-br from-[#1a1a1a] to-[#333] p-8 flex flex-col justify-end relative overflow-hidden">
                <Sparkles className="absolute top-4 right-8 w-24 h-24 text-white/5" />
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-[0.2em]">Partner Offer</span>
                  <h2 className="text-3xl font-display font-bold text-white">{selectedReward.provider}</h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-display font-bold text-[#1a1a1a]">{selectedReward.title}</h3>
                    <div className="text-2xl font-display font-black text-[#f97316]">{selectedReward.value}</div>
                  </div>
                  <p className="text-[#666] leading-relaxed">
                    {selectedReward.details}
                  </p>
                </div>

                {/* QR/Code Section */}
                <div className="bg-[#fafaf9] border border-[#eee] rounded-3xl p-6 flex flex-col items-center gap-4">
                  <div className="w-32 h-32 bg-white border border-[#eee] rounded-2xl p-3 flex items-center justify-center">
                    {/* Simulated QR */}
                    <div className="grid grid-cols-6 gap-1 w-full h-full opacity-80">
                      {[...Array(36)].map((_, i) => (
                        <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-[#1a1a1a]' : 'bg-white'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest">Redemption Code</p>
                    <p className="text-xl font-mono font-bold text-[#1a1a1a] tracking-tighter">{selectedReward.code}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      redeemReward(selectedReward.id);
                      setSelectedReward(null);
                    }}
                    className="flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-lg shadow-orange-500/20"
                  >
                    Redeem Reward
                  </button>
                  <button 
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 border border-[#eee] hover:border-[#1a1a1a] text-[#1a1a1a] py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] transition-all"
                  >
                    Close
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#bbb] uppercase tracking-widest">
                  <Ticket className="w-3.5 h-3.5" />
                  Valid at all participating locations
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured/Promotion Section (Henry's "Featured Offers" Requirement) */}
      <section className="bg-white border border-[#eee] rounded-[40px] p-8 md:p-12 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f97316]/[0.03] to-transparent pointer-events-none" />
        
        <div className="max-w-xl space-y-6 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f97316]" />
            <span className="text-[11px] font-extrabold tracking-[0.2em] text-[#f97316] uppercase">Curated For You</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-[#1a1a1a] leading-tight">
            Unlock the VIP High Street <br />Experience this Weekend.
          </h2>
          <p className="text-[#888] text-sm leading-relaxed">
            Our premium partners are releasing limited-edition vouchers for the upcoming City Festival. Stay active and maintain your streak to increase your reveal priority.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button className="bg-[#1a1a1a] hover:bg-[#f97316] text-white px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-xl active:scale-95">
              Explore Featured
            </button>
            <button className="flex items-center gap-2 px-6 py-4 text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.15em] hover:text-[#f97316] transition-colors">
              View Calendar
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Floating Icons for Background */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 space-y-8 opacity-10">
          <Gift className="w-20 h-20 text-[#1a1a1a]" />
          <Zap className="w-16 h-16 text-[#1a1a1a] translate-x-12" />
          <Sparkles className="w-24 h-24 text-[#1a1a1a] -translate-x-4" />
        </div>
      </section>
    </div>
  );
}
