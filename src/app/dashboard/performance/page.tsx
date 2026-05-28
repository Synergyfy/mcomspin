'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Gift, 
  MousePointer2, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  ChevronRight,
  PlayCircle,
  Activity
} from 'lucide-react';

/* ─── Mock Data ─── */
const stats = [
  { 
    label: 'Total Game Plays', 
    value: '12,482', 
    change: '+14.2%', 
    trend: 'up', 
    icon: PlayCircle, 
    color: 'text-orange-500', 
    bg: 'bg-orange-50' 
  },
  { 
    label: 'Rewards Won', 
    value: '8,291', 
    change: '+8.1%', 
    trend: 'up', 
    icon: Gift, 
    color: 'text-blue-500', 
    bg: 'bg-blue-50' 
  },
  { 
    label: 'Engagement Rate', 
    value: '68.4%', 
    change: '+2.4%', 
    trend: 'up', 
    icon: MousePointer2, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50' 
  },
  { 
    label: 'Conversion Rate', 
    value: '12.8%', 
    change: '-1.2%', 
    trend: 'down', 
    icon: Activity, 
    color: 'text-violet-500', 
    bg: 'bg-violet-50' 
  },
];

const topRewards = [
  { name: '20% Off Haircut', wins: 2450, value: '£1,200', trend: 85, color: 'bg-orange-500' },
  { name: 'Free Coffee Voucher', wins: 1820, value: '£450', trend: 62, color: 'bg-blue-500' },
  { name: 'Premium Service Access', wins: 940, value: '£2,800', trend: 45, color: 'bg-emerald-500' },
  { name: 'Mystery Gift Box', wins: 720, value: '£900', trend: 38, color: 'bg-violet-500' },
];

const campaigns = [
  { id: 'C001', name: 'Summer Buzz Campaign', status: 'Active', plays: 4200, conv: '15.2%', start: 'May 1, 2026' },
  { id: 'C002', name: 'Weekend Flash Sale', status: 'Active', plays: 1850, conv: '12.8%', start: 'May 15, 2026' },
  { id: 'C003', name: 'Loyalty Reward Loop', status: 'Active', plays: 6432, conv: '18.4%', start: 'Jan 10, 2026' },
  { id: 'C004', name: 'Easter Special Hunt', status: 'Completed', plays: 3100, conv: '9.1%', start: 'Apr 5, 2026' },
];

export default function CampaignPerformancePage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <div className="space-y-10 pb-20">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
            Data Insights
          </span>
          <h1 className="text-3xl font-display font-bold text-[#1a1a1a] mt-1">
            Campaign Performance
          </h1>
          <p className="text-[#888] text-[14px] mt-1 max-w-xl">
            Real-time analytics on how your gamification strategy is driving business growth and customer loyalty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-[#eee] rounded-2xl p-1 shadow-sm">
            {['Last 7 Days', 'Last 30 Days', 'All Time'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
                  timeRange === range 
                    ? 'bg-[#f97316] text-white shadow-md' 
                    : 'text-[#888] hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="p-3 bg-white border border-[#eee] rounded-2xl text-[#888] hover:bg-gray-50 shadow-sm transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[32px] border border-[#eee] p-8 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-[12px] font-bold text-[#aaa] uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-display font-bold text-[#1a1a1a] mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Main Analytics Visualization (Simplified Chart Mock) ── */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-[#eee] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-[17px] font-display font-bold text-[#1a1a1a]">Engagement Activity</h2>
              <p className="text-[12px] text-[#888]">Daily game plays vs reward redemptions.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f97316]" />
                <span className="text-[11px] font-bold text-[#888]">Plays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[11px] font-bold text-[#888]">Wins</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] flex items-end justify-between gap-2">
            {[40, 65, 45, 90, 65, 80, 55, 70, 95, 60, 45, 75].map((height, i) => (
              <div key={i} className="flex-1 group relative">
                <div className="flex flex-col items-center gap-1 h-full justify-end">
                   <div 
                    className="w-full bg-blue-100 rounded-t-lg transition-all group-hover:bg-blue-200" 
                    style={{ height: `${height * 0.6}%` }} 
                  />
                  <div 
                    className="w-full bg-[#f97316]/20 rounded-t-lg transition-all group-hover:bg-[#f97316]/40" 
                    style={{ height: `${height}%` }} 
                  />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20">
                  {Math.round(height * 123)} Plays
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-1">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
               <span key={day} className="text-[11px] font-bold text-[#ccc]">{day}</span>
             ))}
          </div>
        </div>

        {/* ── Most Won Rewards ── */}
        <div className="bg-white rounded-[32px] border border-[#eee] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[17px] font-display font-bold text-[#1a1a1a]">Top Rewards</h2>
              <p className="text-[12px] text-[#888]">Highest engagement prizes.</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#f97316]" />
          </div>

          <div className="space-y-6">
            {topRewards.map((reward, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="font-bold text-[#1a1a1a]">{reward.name}</span>
                  <span className="text-[#888] font-medium">{reward.wins} wins</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${reward.color} rounded-full transition-all duration-1000`} 
                    style={{ width: `${reward.trend}%` }} 
                  />
                </div>
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-[#aaa]">Value: {reward.value}</span>
                   <span className="text-[#f97316] font-bold">+{reward.trend / 2}% Lift</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-4 rounded-2xl border border-[#eee] text-[13px] font-bold text-[#888] hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            View All Reward Stats
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ── Active Campaigns Table ── */}
      <section className="bg-white rounded-[32px] border border-[#eee] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-[#f5f5f3] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[17px] font-display font-bold text-[#1a1a1a]">Campaign Performance Breakdown</h2>
            <p className="text-[12px] text-[#888]">Comparative analysis of your current and past efforts.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" />
              <input 
                type="text" 
                placeholder="Search campaigns..." 
                className="pl-10 pr-4 py-2 bg-[#fafaf9] border border-[#eee] rounded-xl text-[12px] focus:outline-none focus:border-[#f97316]/30 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#fafaf9]">
                <th className="px-8 py-4 text-left text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Campaign</th>
                <th className="px-8 py-4 text-left text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-left text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Total Plays</th>
                <th className="px-8 py-4 text-left text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Conv. Rate</th>
                <th className="px-8 py-4 text-left text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Launched</th>
                <th className="px-8 py-4 text-right text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f3]">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-[#fafaf9]/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#f97316] flex items-center justify-center font-bold text-[10px]">
                        {campaign.id}
                      </div>
                      <span className="text-[14px] font-bold text-[#1a1a1a]">{campaign.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[14px] font-medium text-[#666]">{campaign.plays.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <span className="text-[14px] font-bold text-[#1a1a1a]">{campaign.conv}</span>
                       <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: campaign.conv }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[12px] text-[#888]">{campaign.start}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-[#ccc] hover:text-[#f97316]">
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-[#fafaf9] border-t border-[#f5f5f3] flex justify-center">
           <button className="text-[13px] font-bold text-[#f97316] hover:underline flex items-center gap-2">
             Load More History
             <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </section>

    </div>
  );
}
