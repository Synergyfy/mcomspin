'use client';

import { useState } from 'react';
import { 
  Users, 
  Gift, 
  Ticket, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  QrCode,
  Download,
  ChevronRight,
  ArrowUpRight,
  UserCircle2,
  ExternalLink,
  ShieldCheck,
  History
} from 'lucide-react';

/* ─── Mock Data ─── */
const rewardStats = [
  { label: 'Pending Redemptions', value: '142', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Total Redeemed', value: '3,842', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Active Prize Winners', value: '28', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Avg. Redemption Time', value: '4.2h', icon: History, color: 'text-violet-500', bg: 'bg-violet-50' },
];

const liveRedemptions = [
  { id: 'R-9042', customer: 'Sarah Jenkins', reward: '20% Off Color Service', time: '2 mins ago', status: 'Verifying', avatar: 'SJ' },
  { id: 'R-9041', customer: 'Marcus Thorne', reward: 'Free Styling Product', time: '15 mins ago', status: 'Completed', avatar: 'MT' },
  { id: 'R-9040', customer: 'Elena Rodriguez', reward: 'Weekend Pass (Event)', time: '45 mins ago', status: 'Completed', avatar: 'ER' },
  { id: 'R-9039', customer: 'James Wilson', reward: 'Buy 1 Get 1 Free', time: '1 hour ago', status: 'Expired', avatar: 'JW' },
];

const rewardHistory = [
  { 
    id: 'TXN-8821', 
    customer: 'Oliver Knight', 
    reward: 'Free Beard Trim', 
    date: 'May 27, 2026', 
    method: 'QR Scan', 
    points: '+50 XP',
    status: 'Redeemed' 
  },
  { 
    id: 'TXN-8820', 
    customer: 'Amelia Chen', 
    reward: 'VIP Lounge Access', 
    date: 'May 27, 2026', 
    method: 'Manual Entry', 
    points: '+120 XP',
    status: 'Redeemed' 
  },
  { 
    id: 'TXN-8819', 
    customer: 'Leo Brooks', 
    reward: '15% Retail Discount', 
    date: 'May 26, 2026', 
    method: 'API Sync', 
    points: '+25 XP',
    status: 'Pending' 
  },
  { 
    id: 'TXN-8818', 
    customer: 'Sophia Varga', 
    reward: 'Summer Festival Ticket', 
    date: 'May 26, 2026', 
    method: 'QR Scan', 
    points: '+200 XP',
    status: 'Redeemed' 
  },
  { 
    id: 'TXN-8817', 
    customer: 'Noah Smith', 
    reward: 'Gift Card (£10)', 
    date: 'May 25, 2026', 
    method: 'QR Scan', 
    points: '+10 XP',
    status: 'Canceled' 
  },
];

export default function CustomerRewardsPage() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="space-y-10 pb-20">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase">
            Loyalty Management
          </span>
          <h1 className="text-3xl font-display font-bold text-[#1a1a1a] mt-1">
            Customer Rewards
          </h1>
          <p className="text-[#888] text-[14px] mt-1 max-w-xl">
            Monitor prize redemptions, verify customer wins, and manage the lifecycle of rewards issued through your gamified campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[13px] hover:bg-[#333] transition-all shadow-lg shadow-black/10">
            <QrCode className="w-4 h-4" />
            Scan QR Code
          </button>
          <button className="p-4 bg-white border border-[#eee] rounded-2xl text-[#888] hover:bg-gray-50 shadow-sm transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Stats Overview ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewardStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[32px] border border-[#eee] p-8 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[12px] font-bold text-[#aaa] uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-display font-bold text-[#1a1a1a] mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Redemption History Table ── */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-[32px] border border-[#eee] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-[#f5f5f3] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-[17px] font-display font-bold text-[#1a1a1a]">Recent Redemptions</h2>
                <p className="text-[12px] text-[#888]">Comprehensive log of customer prize interactions.</p>
              </div>
              <div className="flex bg-[#fafaf9] rounded-xl p-1 border border-[#eee]">
                {['All', 'Redeemed', 'Pending'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      filter === t ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-[#aaa] hover:text-[#888]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#fafaf9]">
                    <th className="px-8 py-4 text-left text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Customer</th>
                    <th className="px-8 py-4 text-left text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Reward</th>
                    <th className="px-8 py-4 text-left text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Method</th>
                    <th className="px-8 py-4 text-left text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-right text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f3]">
                  {rewardHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fafaf9]/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-[#888]">
                            {item.customer.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#1a1a1a]">{item.customer}</p>
                            <p className="text-[10px] text-[#aaa]">{item.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-[#1a1a1a]">{item.reward}</span>
                          <span className="text-[10px] text-emerald-600 font-bold tracking-tight">{item.points}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[12px] text-[#888] flex items-center gap-1.5">
                          {item.method === 'QR Scan' ? <QrCode className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          {item.method}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Redeemed' ? 'bg-emerald-50 text-emerald-600' :
                          item.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-[#ccc] hover:text-[#f97316] transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-[#fafaf9] border-t border-[#f5f5f3] flex justify-center">
              <button className="text-[13px] font-bold text-[#888] hover:text-[#f97316] transition-all flex items-center gap-2">
                View All Transaction History
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>

        {/* ── Live Feed & Quick Actions ── */}
        <div className="space-y-8">
          
          {/* Live Redemption Feed */}
          <section className="bg-white rounded-[32px] border border-[#eee] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[17px] font-display font-bold text-[#1a1a1a]">Live Feed</h2>
                <p className="text-[12px] text-[#888]">Real-time win notifications.</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Live</span>
              </div>
            </div>

            <div className="space-y-6">
              {liveRedemptions.map((red, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#fafaf9] transition-all border border-transparent hover:border-[#eee]">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#f97316] flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                    {red.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[13px] font-bold text-[#1a1a1a] truncate">{red.customer}</p>
                      <span className="text-[10px] text-[#ccc] whitespace-nowrap ml-2">{red.time}</span>
                    </div>
                    <p className="text-[12px] text-[#666] leading-tight mb-2">{red.reward}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        red.status === 'Verifying' ? 'bg-amber-100 text-amber-700' :
                        red.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {red.status}
                      </span>
                      {red.status === 'Verifying' && (
                        <button className="text-[10px] font-bold text-[#f97316] hover:underline">Verify Now</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Verification Card */}
          <section className="bg-gradient-to-br from-[#1a1a1a] to-[#333] rounded-[32px] p-8 text-white shadow-xl">
             <Ticket className="w-10 h-10 text-[#f97316] mb-6" />
             <h3 className="text-xl font-display font-bold leading-tight">Manual Verification</h3>
             <p className="text-white/60 text-[12px] mt-2 mb-8 leading-relaxed">
               If a customer's QR code isn't scanning, enter their Transaction ID or Reward Code here to manually complete redemption.
             </p>
             <div className="space-y-3">
               <input 
                 type="text" 
                 placeholder="Enter Reward Code..." 
                 className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-[#f97316] placeholder:text-white/30"
               />
               <button className="w-full py-4 bg-[#f97316] text-white rounded-xl font-bold text-[13px] hover:bg-[#ea580c] transition-all">
                 Validate Code
               </button>
             </div>
          </section>

        </div>

      </div>
    </div>
  );
}
