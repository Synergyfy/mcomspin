'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCustomerStore } from '@/store/customer-store';
import { 
  Zap, 
  Flame, 
  Gift, 
  Sparkles,
  Ticket
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { profile, wallet, activity } = useCustomerStore();

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-white border border-[#eee] rounded-3xl p-6 shadow-sm text-left">
        <div className="flex items-center gap-4">
          <img src={profile.avatar} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover border border-[#eee]" />
          <div className="space-y-0.5">
            <p className="text-[#888] text-[12px] font-semibold">Welcome back,</p>
            <h1 className="text-xl font-display font-bold text-[#1a1a1a]">{profile.name || 'Ecosystem Explorer'}</h1>
            <p className="text-[#888] text-[11px]">Rank: Silver Tier • streak score +{profile.totalPoints} points</p>
          </div>
        </div>

        {/* Mini counters */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-[#888] text-[10px] uppercase font-bold tracking-wider">Available Spins</p>
            <p className="text-xl font-display font-extrabold text-[#f97316] mt-0.5">{profile.availableSpins}</p>
          </div>
          <div className="h-6 w-px bg-[#eee]" />
          <div className="text-center">
            <p className="text-[#888] text-[10px] uppercase font-bold tracking-wider">Saved Rewards</p>
            <p className="text-xl font-display font-extrabold text-[#1a1a1a] mt-0.5">
              {wallet.filter(w => w.status === 'active').length}
            </p>
          </div>
          <div className="h-6 w-px bg-[#eee]" />
          <div className="text-center">
            <Link
              href="/customer/active-games"
              className="bg-[#1a1a1a] hover:bg-[#f97316] text-white text-[10px] font-extrabold uppercase tracking-[0.1em] px-4.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              Play Now
            </Link>
          </div>
        </div>
      </div>

      {/* Main Area: Quick Stats & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Summary Cards */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Reward Summary Card */}
             <div className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm space-y-4 text-left">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-[#1a1a1a]">Rewards Awaiting</h3>
                <p className="text-sm text-[#888]">You have {wallet.filter(w => w.status === 'active').length} active rewards in your wallet.</p>
              </div>
              <Link href="/customer/wallet" className="inline-flex text-[11px] font-bold text-[#f97316] uppercase tracking-wider hover:underline">
                View Wallet →
              </Link>
            </div>

            {/* Games Summary Card */}
            <div className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm space-y-4 text-left">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-[#1a1a1a]">Active Games</h3>
                <p className="text-sm text-[#888]">New campaigns are live! Spin and win premium prizes today.</p>
              </div>
              <Link href="/customer/active-games" className="inline-flex text-[11px] font-bold text-blue-500 uppercase tracking-wider hover:underline">
                Explore Games →
              </Link>
            </div>
          </div>

          {/* Featured Offer placeholder */}
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#333] rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4 max-w-md text-left">
              <span className="text-[10px] font-bold bg-[#f97316] px-2 py-1 rounded-md uppercase tracking-wider">Sponsored</span>
              <h2 className="text-2xl font-display font-bold">VIP Fashion Showcase</h2>
              <p className="text-sm text-stone-400">Meridian Apparel is hosting an exclusive reveal. Collect 3 tickets to unlock the VIP pass.</p>
              <button className="bg-white text-[#1a1a1a] px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#f97316] hover:text-white transition-all">
                Learn More
              </button>
            </div>
            <Sparkles className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 text-white/5 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Streaks & Activity */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">Ecosystem Streak</h3>
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-display font-black text-[#1a1a1a]">{profile.streakDays}</div>
              <div className="text-[11px] font-bold text-[#888] uppercase tracking-widest leading-tight">Days<br/>Active</div>
            </div>
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#f97316] w-[70%]" />
            </div>
            <p className="text-[11px] text-[#888] font-medium">Keep going! 3 more days to reach Gold Rank.</p>
          </div>

          {/* Activity History Mini */}
          <div className="bg-white rounded-3xl border border-[#eee] p-6 shadow-sm space-y-4">
            <h3 className="text-[11px] font-bold text-[#888] uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {activity.slice(0, 5).map(act => (
                <div key={act.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-[#fafaf9] rounded-lg border border-[#eee] flex items-center justify-center shrink-0">
                    {act.type === 'redeem' ? (
                      <Ticket className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-[#1a1a1a] leading-tight">{act.description}</p>
                    <p className="text-[9px] text-[#bbb] font-semibold">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/customer/history" className="block text-center text-[10px] font-bold text-[#f97316] uppercase tracking-widest hover:underline pt-2">
              See All History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
