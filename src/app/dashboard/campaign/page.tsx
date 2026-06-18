'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus,
  ChevronRight,
  TrendingUp, 
  Gift,
  Users,
  Award,
  BarChart3,
  MoreVertical
} from 'lucide-react';

export default function CampaignsHome() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Active');

  const tabs = ['Active', 'Draft', 'Scheduled', 'Completed', 'Paused'];

  // Mock Metrics
  const metrics = [
    { label: 'Total Plays', value: '1,200', change: '+12%', icon: BarChart3 },
    { label: 'Unique Players', value: '850', change: '+5%', icon: Users },
    { label: 'Rewards Issued', value: '150', change: '150/500', icon: Gift },
    { label: 'Redemption Rate', value: '24%', change: '+2%', icon: Award },
  ];

  return (
    <div className="bg-stone-50 min-h-screen pb-24 text-stone-900 font-sans">
      <main className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* Header & Metrics */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight uppercase mb-6">Campaign Overview</h1>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {metrics.map((m, i) => (
              <div key={i} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-50 rounded-lg md:rounded-xl flex items-center justify-center">
                    <m.icon className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                  </div>
                  <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${m.change.includes('+') ? 'text-emerald-600' : 'text-stone-400'}`}>
                    {m.change}
                  </span>
                </div>
                <p className="text-[8px] md:text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-0.5 md:mb-1">{m.label}</p>
                <h3 className="text-xl md:text-3xl font-bold text-stone-900">{m.value}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter Cluster */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
            <input 
              className="w-full h-[56px] pl-12 pr-4 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 placeholder:text-stone-300 font-medium transition-all outline-none" 
              placeholder="Search campaigns..." 
              type="text"
            />
          </div>
          
          <div className="bg-white border border-stone-200 p-2 rounded-2xl flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-stone-900 text-white shadow-lg' 
                    : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign List */}
        <div className="space-y-4">
          {/* Campaign Item */}
          <div className="bg-white p-6 rounded-[2rem] border border-stone-100 flex items-center gap-6 group hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-xl">
              WS
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-stone-900 uppercase tracking-tight text-lg">Winter Spin 2024</h4>
              <p className="text-stone-400 text-[10px] font-semibold uppercase tracking-widest">Active • 1,200 Plays</p>
            </div>
            <button 
              onClick={() => router.push('/dashboard/campaign/123')}
              className="px-6 py-3 bg-stone-900 hover:bg-orange-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              View Stats
            </button>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button 
        onClick={() => router.push('/dashboard/campaign/create')}
        className="fixed right-8 bottom-12 w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-[2rem] shadow-xl shadow-orange-500/20 flex items-center justify-center active:scale-90 transition-all z-50"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
