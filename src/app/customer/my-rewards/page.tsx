'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerStore, CustomerReward } from '@/store/customer-store';
import { 
  Gift, 
  Clock, 
  Search, 
  ChevronRight, 
  Sparkles,
  Ticket,
  ExternalLink,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function MyRewardsPage() {
  const { wallet } = useCustomerStore();
  const [filter, setFilter] = useState<'all' | 'unclaimed' | 'featured' | 'expiring'>('all');
  const [selectedReward, setSelectedReward] = useState<CustomerReward | null>(null);

  // Filter logic based on the architecture doc requirements:
  const filteredRewards = wallet.filter(reward => {
    if (filter === 'unclaimed') return reward.status === 'active';
    return true; 
  });

  return (
    <div className="space-y-8 pb-20 text-left bg-stone-50/20 min-h-screen">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left px-1">
        <div className="space-y-1">
          <p className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Inventory</p>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight uppercase">My Rewards</h1>
          <p className="text-stone-500 text-sm max-w-md font-medium">
            Manage your collection of unclaimed prizes and exclusive partner offers.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 bg-white border border-stone-100 rounded-[2rem] px-8 py-5 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Total</p>
            <p className="text-2xl font-black text-stone-900 leading-tight">{wallet.length}</p>
          </div>
          <div className="w-px h-10 bg-stone-100" />
          <div className="text-center">
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Active</p>
            <p className="text-2xl font-black text-orange-500 leading-tight">{wallet.filter(r => r.status === 'active').length}</p>
          </div>
        </div>
      </header>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-white border border-stone-100 p-2 rounded-2xl shadow-sm overflow-x-auto w-full sm:w-auto custom-scrollbar gap-1">
          {(['all', 'unclaimed', 'expiring', 'featured'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === tab 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {tab === 'unclaimed' ? 'Available' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
          <input 
            type="text" 
            placeholder="Search rewards..." 
            className="w-full pl-11 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold placeholder:text-stone-300 text-stone-900"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={reward.id}
                onClick={() => setSelectedReward(reward)}
                className="group relative bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer overflow-hidden flex flex-col justify-between aspect-[4/5] sm:aspect-auto sm:min-h-[320px]"
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="space-y-4 relative z-10 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black bg-stone-50 text-stone-400 px-3 py-1.5 rounded-xl border border-stone-100 uppercase tracking-widest">
                      {reward.provider}
                    </span>
                    {reward.status === 'active' && (
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-stone-900 leading-tight group-hover:text-orange-600 transition-colors uppercase">
                      {reward.title}
                    </h3>
                    <p className="text-stone-500 text-sm font-medium leading-relaxed line-clamp-2">
                      {reward.details}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 space-y-4 pt-6 text-left border-t border-stone-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Expires in 12d</span>
                    </div>
                    <div className="text-xl font-black text-stone-900 tracking-tighter">
                      {reward.value}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/customer/redeem?rewardId=${reward.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-stone-900 hover:bg-orange-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-200"
                  >
                    Redeem Reward
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Status Overlay for Redeemed */}
                {reward.status === 'redeemed' && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center">
                    <span className="border-4 border-stone-200 text-stone-300 font-black text-3xl px-8 py-3 rounded-2xl uppercase tracking-tighter -rotate-12 opacity-80">
                      Claimed
                    </span>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 bg-white border border-stone-100 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-4 text-center shadow-sm"
            >
              <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center">
                <Gift className="w-10 h-10 text-stone-200" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-stone-900 uppercase">No rewards found</h3>
                <p className="text-stone-400 text-sm font-medium">Try adjusting your filters or play a game to win!</p>
              </div>
              <button 
                onClick={() => setFilter('all')}
                className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline mt-2"
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
            className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100 relative text-left"
            >
              {/* Modal Header/Art */}
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 p-8 flex flex-col justify-end relative overflow-hidden">
                <Sparkles className="absolute top-4 right-8 w-24 h-24 text-white/20" />
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">Exclusive Partner Offer</span>
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedReward.provider}</h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-10 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-3xl font-black text-stone-900 leading-tight uppercase tracking-tighter">{selectedReward.title}</h3>
                    <div className="text-3xl font-black text-orange-500 tracking-tighter whitespace-nowrap">{selectedReward.value}</div>
                  </div>
                  <p className="text-stone-500 text-sm font-medium leading-relaxed">
                    {selectedReward.details}
                  </p>
                </div>

                {/* Vault Key Section */}
                <div className="bg-stone-50 border border-stone-100 rounded-[2.5rem] p-8 flex flex-col items-center gap-6 shadow-inner">
                  <div className="w-40 h-40 bg-white border border-stone-100 rounded-[2rem] p-6 flex items-center justify-center shadow-sm">
                    {/* Simulated QR */}
                    <div className="grid grid-cols-6 gap-1.5 w-full h-full opacity-80">
                      {[...Array(36)].map((_, i) => (
                        <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-stone-900' : 'bg-white'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em]">Vault Access Code</p>
                    <p className="text-3xl font-mono font-black text-stone-900 tracking-tight">{selectedReward.code}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href={`/customer/redeem?rewardId=${selectedReward.id}`}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 text-center flex items-center justify-center gap-2"
                  >
                    Redeem Reward
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 border border-stone-100 hover:border-stone-900 text-stone-900 py-5 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] transition-all"
                  >
                    Close
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-stone-300 uppercase tracking-widest">
                  <Ticket className="w-3.5 h-3.5" />
                  Valid at all participating locations
                </div>
              </div>
              <button 
                onClick={() => setSelectedReward(null)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-orange-500 transition-all z-20"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured/Promotion Section */}
      <section className="bg-white border border-stone-100 rounded-[3rem] p-10 md:p-16 relative overflow-hidden text-left shadow-sm">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/[0.03] to-transparent pointer-events-none" />
        
        <div className="max-w-xl space-y-8 relative z-10">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-orange-500" />
            <span className="text-[11px] font-black tracking-[0.3em] text-orange-500 uppercase">Curated Selection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900 leading-[0.9] tracking-tighter uppercase italic">
            Unlock the VIP <br />Experience.
          </h2>
          <p className="text-stone-500 text-base font-medium leading-relaxed">
            Our premium partners are releasing limited-edition vouchers for the upcoming City Festival. Stay active to increase your reveal priority.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-stone-900 hover:bg-orange-500 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-stone-200 active:scale-95">
              Explore Featured
            </button>
            <button className="flex items-center gap-2 px-8 py-5 text-[11px] font-black text-stone-900 uppercase tracking-[0.2em] hover:text-orange-500 transition-colors">
              View Calendar
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Floating Background Elements */}
        <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 space-y-12 opacity-5">
           <Gift className="w-32 h-32 text-stone-900" />
           <Sparkles className="w-24 h-24 text-stone-900 -translate-x-12" />
        </div>
      </section>
    </div>
  );
}
