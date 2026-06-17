'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Settings, 
  PlayCircle, 
  PauseCircle, 
  BarChart3, 
  Gamepad2, 
  Gift, 
  ShieldCheck,
  TrendingUp,
  Users,
  Clock,
  MoreVertical
} from 'lucide-react';

export default function CampaignDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [status, setStatus] = useState<'Active' | 'Paused'>('Active');

  const tabs = ['Overview', 'Rules', 'Rewards', 'Performance'];

  return (
    <div className="bg-stone-50 min-h-screen pb-24 text-stone-900 font-sans">
      <header className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 z-50 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 hover:bg-orange-500 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-black text-lg uppercase tracking-widest text-stone-900">Campaign Details</h1>
      </header>
      <main className="px-6 pt-8 max-w-4xl mx-auto animate-fade-in-up">
        
        {/* Campaign Hero Card */}
        <div className="relative w-full h-48 md:h-64 rounded-[2rem] overflow-hidden mb-8 shadow-sm group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 mix-blend-overlay z-10" />
          <div className="absolute inset-0 bg-black/30 z-10" />
          {/* Placeholder for banner image */}
          <div className="absolute inset-0 bg-stone-200" />
          
          <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
            <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
              <Gamepad2 className="w-3 h-3" /> Ball Drop
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md uppercase tracking-tighter">Winter Spin 2024</h2>
            <p className="text-white/90 font-medium max-w-lg line-clamp-2">Drop the ball and win big this winter! Exclusive rewards for all our loyal customers.</p>
          </div>

          {/* Quick Action FAB */}
          <button 
            onClick={() => setStatus(status === 'Active' ? 'Paused' : 'Active')}
            className="absolute top-4 right-4 z-30 bg-white text-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            {status === 'Active' ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 border-b border-stone-200 pb-px sticky top-[72px] bg-stone-50 z-40 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab 
                  ? 'text-orange-500' 
                  : 'text-stone-400 hover:text-stone-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-stack-md animate-fade-in-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-2 flex items-center gap-1"><Gamepad2 className="w-3 h-3"/> Total Plays</span>
                <span className="text-3xl font-display font-black text-primary">12.4k</span>
                <span className="text-green-500 text-xs font-bold block mt-1">+14% this week</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-2 flex items-center gap-1"><Users className="w-3 h-3"/> Unique Users</span>
                <span className="text-3xl font-display font-black text-on-surface">8.1k</span>
                <span className="text-on-surface-variant text-xs font-medium block mt-1">65% returning</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-2 flex items-center gap-1"><Gift className="w-3 h-3"/> Rewards Won</span>
                <span className="text-3xl font-display font-black text-tertiary">2.3k</span>
                <span className="text-on-surface-variant text-xs font-medium block mt-1">18.5% win rate</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest block mb-2 flex items-center gap-1"><Clock className="w-3 h-3"/> Avg. Time</span>
                <span className="text-3xl font-display font-black text-on-surface">42s</span>
                <span className="text-green-500 text-xs font-bold block mt-1">+5s engagement</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
              <h3 className="font-display font-bold text-lg mb-4 text-on-surface">Live Activity Stream</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-outline-variant/20 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      U{i}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-on-surface">User_{Math.floor(Math.random() * 9000) + 1000} played</p>
                      <p className="text-xs text-on-surface-variant">Won: 10% OFF Coupon</p>
                    </div>
                    <span className="text-xs text-on-surface-variant font-medium">Just now</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === 'Rules' && (
          <div className="space-y-stack-md animate-fade-in-up">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Game Mechanics
                </h3>
                <button className="text-primary text-sm font-bold hover:underline">Edit</button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg">
                  <span className="font-semibold text-on-surface-variant">Base Win Probability</span>
                  <span className="font-black text-primary text-lg">30%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg">
                  <span className="font-semibold text-on-surface-variant">Daily Drop Limit</span>
                  <span className="font-black text-on-surface text-lg">500</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg">
                  <span className="font-semibold text-on-surface-variant">Cooldown Period</span>
                  <span className="font-black text-on-surface text-lg">24h</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REWARDS TAB */}
        {activeTab === 'Rewards' && (
          <div className="space-y-stack-md animate-fade-in-up">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" /> Active Pegboard Slots
                </h3>
                <button className="text-primary text-sm font-bold hover:underline">Manage Inventory</button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 border border-outline-variant/30 rounded-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary" />
                  <div className="flex-1 pl-2">
                    <h4 className="font-bold text-on-surface">10% OFF Coupon</h4>
                    <div className="w-full bg-surface-container h-1.5 rounded-full mt-2">
                      <div className="bg-tertiary h-full rounded-full w-[80%]" />
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">800 / 1000 claimed</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-lg text-on-surface">60%</span>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Win Rate</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border border-outline-variant/30 rounded-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                  <div className="flex-1 pl-2">
                    <h4 className="font-bold text-on-surface">Free Dessert</h4>
                    <div className="w-full bg-surface-container h-1.5 rounded-full mt-2">
                      <div className="bg-primary h-full rounded-full w-[45%]" />
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">225 / 500 claimed</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-lg text-on-surface">30%</span>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Win Rate</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border border-amber-300 bg-amber-50/50 rounded-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500" />
                  <div className="flex-1 pl-2">
                    <h4 className="font-bold text-amber-900 flex items-center gap-1">
                      GRAND JACKPOT <ShieldCheck className="w-3 h-3" />
                    </h4>
                    <div className="w-full bg-amber-200/50 h-1.5 rounded-full mt-2">
                      <div className="bg-amber-500 h-full rounded-full w-[10%]" />
                    </div>
                    <p className="text-xs text-amber-700/80 mt-1">5 / 50 claimed</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-lg text-amber-600">10%</span>
                    <span className="text-[10px] uppercase font-bold text-amber-700/60 tracking-wider">Win Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'Performance' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2 uppercase tracking-widest">
                  <BarChart3 className="w-5 h-5 text-orange-500" /> Engagement Funnel
                </h3>
                <select className="bg-stone-50 border border-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-xl p-3 outline-none text-stone-900">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>All Time</option>
                </select>
              </div>

              <div className="space-y-8">
                {/* Funnel Visualization */}
                <div className="flex items-end justify-between h-48 px-4 gap-4">
                  {[
                    { label: 'Impressions', val: 15000, h: 'h-full', color: 'bg-stone-200' },
                    { label: 'Plays', val: 12400, h: 'h-[82%]', color: 'bg-orange-500' },
                    { label: 'Conversions', val: 10168, h: 'h-[67%]', color: 'bg-stone-900' },
                  ].map((stage, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 min-w-[60px] h-full justify-end">
                      <div className={`w-full ${stage.color} ${stage.h} rounded-t-xl transition-all hover:opacity-90`} />
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-4 text-center">{stage.label}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 divide-x divide-stone-100 text-center border-t border-stone-100 pt-6">
                  <div>
                    <span className="block text-2xl font-bold text-stone-900">15k</span>
                    <span className="text-[9px] uppercase font-bold text-stone-400 tracking-widest">Impressions</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-orange-500">12.4k</span>
                    <span className="text-[9px] uppercase font-bold text-stone-400 tracking-widest">Plays</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-stone-900">82%</span>
                    <span className="text-[9px] uppercase font-bold text-stone-400 tracking-widest">Conversion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
