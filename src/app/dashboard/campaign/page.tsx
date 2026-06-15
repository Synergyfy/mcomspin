'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Bell, 
  Search, 
  Gamepad2, 
  MoreVertical, 
  TrendingUp, 
  Gift, 
  ChevronRight, 
  Plus,
  History,
  LayoutDashboard,
  Megaphone,
  Award,
  Users,
  Menu
} from 'lucide-react';
import Image from 'next/image';

export default function CampaignsHome() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Active');

  const tabs = ['Active', 'Draft', 'Scheduled', 'Completed', 'Paused'];

  return (
    <div className="bg-surface font-body min-h-screen pb-24 text-on-surface">
      <main className="mt-4 px-container-margin animate-fade-in-up">
        {/* Search & Filter Cluster */}
        <div className="flex flex-col gap-stack-md mb-stack-lg">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input 
              className="w-full h-[56px] pl-12 pr-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/60 font-body-md transition-all outline-none" 
              placeholder="Search campaigns..." 
              type="text"
            />
          </div>

          {/* Status Tabs */}
          <div className="relative">
            <div className="flex overflow-x-auto no-scrollbar gap-4 pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2 font-label-md transition-all border-b-2 active:scale-95 ${
                    activeTab === tab 
                      ? 'text-primary border-primary' 
                      : 'text-on-surface-variant border-transparent hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Grid / List */}
        <div className="space-y-stack-md">
          {/* Active Campaign Card */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_10px_20px_-10px_rgba(53,16,0,0.15)] border-l-4 border-primary relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Active Now</span>
                </div>
                <h3 className="text-headline-md font-bold text-on-surface mb-1 font-display">Winter Spin 2024</h3>
                <p className="text-label-sm text-on-surface-variant flex items-center gap-1 font-medium">
                  <Gamepad2 className="w-4 h-4" /> Ball Drop
                </p>
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95">
                <MoreVertical className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                <span className="block text-label-sm font-semibold text-on-surface-variant mb-1">Total Plays</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-headline-md font-bold text-primary font-display">1,200</span>
                  <span className="text-green-600 text-label-sm font-bold">+12%</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                <span className="block text-label-sm font-semibold text-on-surface-variant mb-1">Rewards Won</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-headline-md font-bold text-tertiary font-display">150</span>
                  <span className="text-label-sm font-medium text-on-surface-variant">/500</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button 
                onClick={() => router.push('/dashboard/campaign/123')}
                className="flex-1 bg-primary text-on-primary font-label-md py-3 rounded-lg active:scale-95 shadow-[0_4px_0_0_#7b2f00] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#7b2f00] active:translate-y-[3px] active:shadow-[0_1px_0_0_#7b2f00] transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" /> View Stats
              </button>
            </div>
          </div>

          {/* Scheduled Campaign Card */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_10px_20px_-10px_rgba(53,16,0,0.15)] border-l-4 border-outline-variant/50 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-on-surface-variant/30"></span>
                  <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Scheduled</span>
                </div>
                <h3 className="text-headline-md font-bold text-on-surface mb-1 font-display">Spring Launch</h3>
                <p className="text-label-sm text-on-surface-variant flex items-center gap-1 font-medium">
                  <Gamepad2 className="w-4 h-4" /> Ball Drop
                </p>
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95">
                <MoreVertical className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-6 px-1">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                  <div className="w-full h-full bg-primary/20" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                  <div className="w-full h-full bg-tertiary/20" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary-container">
                  +4
                </div>
              </div>
              <span className="text-label-sm font-semibold text-on-surface-variant">Starts in 4 days</span>
            </div>
          </div>

          {/* Simple List View Item */}
          <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4 group hover:bg-surface-container-high transition-all cursor-pointer">
            <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center text-primary">
              <History className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-label-md font-bold text-on-surface">Flash Sale Friday</h4>
              <p className="text-label-sm text-on-surface-variant font-medium">Completed • 4,502 Plays</p>
            </div>
            <ChevronRight className="w-5 h-5 text-outline" />
          </div>
        </div>
      </main>

      {/* FAB */}
      <button 
        onClick={() => router.push('/dashboard/campaign/create')}
        className="fixed right-6 bottom-6 lg:bottom-12 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-[0_8px_16px_-4px_rgba(162,63,0,0.4)] flex items-center justify-center active:scale-90 transition-transform duration-200 z-50 hover:bg-primary/90"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
