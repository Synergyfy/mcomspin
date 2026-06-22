'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessCampaigns, useDeleteBusinessCampaign } from '@/services/business';
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
  const { data: campaignsData, isLoading } = useBusinessCampaigns();
  const deleteCampaign = useDeleteBusinessCampaign();
  const [activeTab, setActiveTab] = useState('Active');

  const tabs = ['Active', 'Draft', 'Scheduled', 'Completed', 'Paused'];
  const campaignList: any[] = (campaignsData as any[]) ?? [];

  if (isLoading) {
    return (
      <div className="bg-stone-50 min-h-screen pb-24 text-stone-900 font-sans">
        <main className="max-w-7xl mx-auto px-6 pt-10">
          <div className="mb-10">
            <div className="h-8 w-48 bg-[#e0e0e0] rounded mb-6" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-stone-100 shadow-sm animate-pulse">
                  <div className="w-10 h-10 bg-[#e0e0e0] rounded-xl mb-4" />
                  <div className="h-3 w-16 bg-[#e0e0e0] rounded mb-2" />
                  <div className="h-6 w-20 bg-[#e0e0e0] rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-stone-100 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#e0e0e0] rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-48 bg-[#e0e0e0] rounded" />
                    <div className="h-3 w-32 bg-[#e0e0e0] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-24 text-stone-900 font-sans">
      <main className="max-w-7xl mx-auto px-6 pt-10">
        
        {/* Header & Metrics */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight uppercase mb-6">Campaign Overview</h1>
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
            {tabs.map((tab: any) => (
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
          {campaignList.length === 0 ? (
            <div className="bg-white p-12 rounded-[2rem] border border-stone-100 text-center">
              <p className="text-lg font-bold text-stone-900">No campaigns yet</p>
              <p className="text-stone-400 text-[13px] mt-1">Create your first campaign to get started.</p>
              <button onClick={() => router.push('/dashboard/campaign/create')} className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all">
                Create Campaign
              </button>
            </div>
          ) : (
            campaignList.map((campaign: any) => (
            <div key={campaign.id} className="bg-white p-6 rounded-[2rem] border border-stone-100 flex items-center gap-6 group hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-xl">
                {campaign.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-stone-900 uppercase tracking-tight text-lg">{campaign.name}</h4>
                <p className="text-stone-400 text-[10px] font-semibold uppercase tracking-widest">{campaign.status} • {campaign._count?.rewards ?? 0} Rewards</p>
              </div>
              <button 
                onClick={() => router.push(`/dashboard/campaign/${campaign.id}`)}
                className="px-6 py-3 bg-stone-900 hover:bg-orange-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                View Stats
              </button>
            </div>
            ))
          )}
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
