'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerActivity, useRedemptionHistory } from '@/services/customer';
import {
  Sparkles,
  Ticket,
  Gift,
  Clock,
  Search,
  Eye,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  Purchase: Gift,
  Redeem: Ticket,
  View: Eye,
  Search: Sparkles,
  Share: Share2,
  Review: Star,
  Favourite: Heart,
  Click: Sparkles,
};

const ACTIVITY_COLORS: Record<string, string> = {
  Purchase: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Redeem: 'bg-orange-50 text-orange-600 border-orange-100',
  View: 'bg-blue-50 text-blue-600 border-blue-100',
  Search: 'bg-purple-50 text-purple-600 border-purple-100',
  Share: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  Review: 'bg-amber-50 text-amber-600 border-amber-100',
  Favourite: 'bg-red-50 text-red-600 border-red-100',
  Click: 'bg-stone-50 text-stone-600 border-stone-100',
};

type Tab = 'all' | 'games' | 'rewards' | 'redemptions';

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: activityData, isLoading: activityLoading, isError: activityError } = useCustomerActivity({ page, limit: 10 });
  const { data: redemptionData, isLoading: redemptionLoading, isError: redemptionError } = useRedemptionHistory();

  const activityLog = React.useMemo(() => {
    if (!activityData) return [];
    const raw = (activityData as any).data ?? activityData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [activityData]);

  const redemptions = React.useMemo(() => {
    if (!redemptionData) return [];
    const raw = (redemptionData as any).data ?? redemptionData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [redemptionData]);

  const meta = React.useMemo(() => {
    if (!activityData) return null;
    return (activityData as any).meta ?? null;
  }, [activityData]);

  const filteredActivity = React.useMemo(() => {
    let items = activityLog;

    if (tab === 'games') {
      items = items.filter((a: any) => a.activityType === 'Purchase' || a.activityType === 'View');
    } else if (tab === 'rewards') {
      items = items.filter((a: any) => a.activityType === 'Purchase');
    } else if (tab === 'redemptions') {
      items = items.filter((a: any) => a.activityType === 'Redeem');
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((a: any) =>
        (a.description || '').toLowerCase().includes(q)
      );
    }

    return items;
  }, [activityLog, tab, searchQuery]);

  const totalPages = meta?.totalPages ?? 1;

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 pb-20 text-left bg-stone-50/20 min-h-screen">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1">
          <p className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Timeline</p>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight uppercase">Activity History</h1>
          <p className="text-stone-500 text-sm max-w-md font-medium">
            A full log of your spins, rewards, and redemptions across the ecosystem.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 bg-white border border-stone-100 rounded-[2rem] px-8 py-5 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Plays</p>
            <p className="text-2xl font-black text-stone-900 leading-tight">
              {activityLog.filter((a: any) => a.activityType === 'Purchase' || a.activityType === 'View').length}
            </p>
          </div>
          <div className="w-px h-10 bg-stone-100" />
          <div className="text-center">
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Wins</p>
            <p className="text-2xl font-black text-orange-500 leading-tight">
              {activityLog.filter((a: any) => a.activityType === 'Purchase').length}
            </p>
          </div>
          <div className="w-px h-10 bg-stone-100" />
          <div className="text-center">
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Redeemed</p>
            <p className="text-2xl font-black text-stone-900 leading-tight">{redemptions.length}</p>
          </div>
        </div>
      </header>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-white border border-stone-100 p-2 rounded-2xl shadow-sm overflow-x-auto w-full sm:w-auto custom-scrollbar gap-1">
          {([
            { key: 'all' as Tab, label: 'All Activity' },
            { key: 'games' as Tab, label: 'Spins & Games' },
            { key: 'rewards' as Tab, label: 'Rewards Won' },
            { key: 'redemptions' as Tab, label: 'Redemptions' },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                tab === t.key
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-bold placeholder:text-stone-300 text-stone-900"
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {(activityLoading || redemptionLoading) && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {activityError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 bg-white border border-red-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-center shadow-sm"
          >
            <div className="w-16 h-16 bg-red-50 rounded-[2rem] flex items-center justify-center">
              <Clock className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-900 uppercase">Failed to load</h3>
              <p className="text-stone-400 text-sm font-medium">Could not load activity history. Please try again.</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-stone-900 hover:bg-orange-500 text-white px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg"
            >
              Retry
            </button>
          </motion.div>
        )}

        {!activityLoading && !activityError && filteredActivity.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 bg-white border border-stone-100 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-4 text-center shadow-sm"
          >
            <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center">
              <Clock className="w-10 h-10 text-stone-200" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-stone-900 uppercase">No activity yet</h3>
              <p className="text-stone-400 text-sm font-medium">Play a game or redeem a reward to see your history here.</p>
            </div>
            <Link
              href="/customer/active-games"
              className="mt-2 bg-stone-900 hover:bg-orange-500 text-white px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg"
            >
              Browse Games
            </Link>
          </motion.div>
        )}

        {!activityLoading && !activityError && filteredActivity.length > 0 && (
          <div className="bg-white border border-stone-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="divide-y divide-stone-50">
              <AnimatePresence mode="popLayout">
                {filteredActivity.map((act: any, idx: number) => {
                  const Icon = ACTIVITY_ICONS[act.activityType] || Sparkles;
                  const colorClass = ACTIVITY_COLORS[act.activityType] || 'bg-stone-50 text-stone-600 border-stone-100';
                  const isWin = act.activityType === 'Purchase';

                  return (
                    <motion.div
                      key={act.id || idx}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center gap-4 px-6 md:px-8 py-5 hover:bg-stone-50/50 transition-colors"
                    >
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${colorClass}`}>
                        {isWin ? <Gift className="w-5 h-5" /> : Icon ? <Icon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-stone-900 leading-tight">
                          {act.description || act.activityType}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                            {act.activityType === 'Purchase' ? 'REWARD WON' :
                             act.activityType === 'Redeem' ? 'REDEEMED' :
                             act.activityType}
                          </span>
                          {act.entityType && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-stone-200" />
                              <span className="text-[10px] text-stone-400 font-medium">{act.entityType}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[11px] font-bold text-stone-500">{formatTime(act.createdAt)}</p>
                        {isWin && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Won
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 px-6 py-5 border-t border-stone-50 bg-stone-50/30">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 disabled:opacity-30 transition-all"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Redemption History Section */}
        {tab === 'all' && redemptions.length > 0 && (
          <section className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Ticket className="w-5 h-5 text-orange-500" />
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">Recent Redemptions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redemptions.slice(0, 4).map((r: any) => (
                <div key={r.id} className="flex items-center gap-4 bg-stone-50 border border-stone-100 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{r.reward?.name || 'Reward'}</p>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                      {new Date(r.redeemedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    Used
                  </span>
                </div>
              ))}
            </div>
            {redemptions.length > 4 && (
              <Link href="/customer/wallet" className="block text-center text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline mt-6">
                View All in Wallet
              </Link>
            )}
          </section>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <Clock className="w-10 h-10 text-orange-400 mx-auto" />
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
            Every Move <br className="sm:hidden" />Counts.
          </h2>
          <p className="text-stone-400 text-sm font-medium">
            Your complete journey is logged transparently. Every spin, every win, every redemption — all verifiable on-chain.
          </p>
          <Link
            href="/customer/active-games"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 active:scale-95"
          >
            Start New Game
          </Link>
        </div>
      </section>
    </div>
  );
}
