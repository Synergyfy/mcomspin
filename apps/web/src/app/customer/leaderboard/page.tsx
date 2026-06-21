'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeaderboard, useAchievements } from '@/services/customer';
import {
  Trophy,
  Award,
  CheckCircle2,
  Lock,
  Crown,
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'topPlayers' | 'mostRewards' | 'mostRedemptions';

const TAB_LABELS: Record<TabType, string> = {
  topPlayers: 'Top Players',
  mostRewards: 'Most Rewards',
  mostRedemptions: 'Most Redemptions',
};

const RANK_COLORS = ['text-yellow-500', 'text-stone-400', 'text-amber-700'];

const MEDAL_EMOJIS = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<TabType>('topPlayers');
  const { data: leaderboardData, isLoading } = useLeaderboard();
  const { data: achievementsData } = useAchievements();

  const achievements = React.useMemo(() => {
    if (!achievementsData) return [];
    const raw = (achievementsData as any).data ?? achievementsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [achievementsData]);

  const entries = React.useMemo(() => {
    if (!leaderboardData) return [];
    const raw = (leaderboardData as any).data ?? leaderboardData ?? [];
    const list = Array.isArray(raw) ? raw : [];
    return list.map((e: any) => ({
      ...e,
      score: tab === 'mostRewards' || tab === 'mostRedemptions' ? (e.count ?? 0) : (e.totalScore ?? 0),
    }));
  }, [leaderboardData, tab]);

  return (
    <div className="space-y-8 pb-20 text-left bg-stone-50/20 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1">
          <p className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Competition</p>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight uppercase">Leaderboard</h1>
          <p className="text-stone-500 text-sm max-w-md font-medium">
            See how you rank against other players in the ecosystem.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center bg-white border border-stone-100 p-2 rounded-2xl shadow-sm w-full sm:w-auto overflow-x-auto custom-scrollbar gap-1">
        {(['topPlayers', 'mostRewards', 'mostRedemptions'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              tab === t
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-stone-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && entries.length === 0 && (
              <div className="py-20 text-center">
                <Trophy className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                <p className="text-sm font-bold text-stone-400">No leaderboard data yet</p>
              </div>
            )}

            {!isLoading && entries.length > 0 && (
              <div className="divide-y divide-stone-50">
                <AnimatePresence mode="popLayout">
                  {entries.map((entry: any, idx: number) => {
                    const rank = idx + 1;
                    const isTop3 = rank <= 3;

                    return (
                      <motion.div
                        key={entry.customerId || idx}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`flex items-center gap-4 px-6 md:px-8 py-5 transition-colors ${
                          isTop3 ? 'bg-stone-50/50' : 'hover:bg-stone-50/30'
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                          {isTop3 ? (
                            <span className="text-2xl">{MEDAL_EMOJIS[rank - 1]}</span>
                          ) : (
                            <span className="text-stone-300">{rank}</span>
                          )}
                        </div>

                        {/* Avatar Placeholder */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                          isTop3 ? 'bg-orange-500' : 'bg-stone-200'
                        }`}>
                          {(entry.name || '?')[0]?.toUpperCase() || '?'}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-stone-900 truncate">{entry.name || 'Anonymous'}</p>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                            {tab === 'topPlayers' ? `${entry.plays ?? 0} plays` : `${entry.count ?? 0} total`}
                          </p>
                        </div>

                        {/* Score */}
                        <div className="text-right shrink-0">
                          <p className={`text-lg font-black ${isTop3 ? 'text-orange-500' : 'text-stone-900'}`}>
                            {entry.score ?? 0}
                          </p>
                          <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">
                            {tab === 'topPlayers' ? 'PTS' : 'COUNT'}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Achievements Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Your Stats */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-lg">
            <Crown className="w-8 h-8 mb-4 text-orange-200" />
            <h3 className="text-lg font-black uppercase tracking-tight">Keep Playing</h3>
            <p className="text-orange-100 text-xs font-medium mt-1">Complete achievements to unlock rewards and climb the ranks.</p>
            <Link
              href="/customer/active-games"
              className="inline-block mt-6 bg-white text-orange-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all"
            >
              Play Now
            </Link>
          </div>

          {/* Achievements */}
          <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-widest">Achievements</h3>
            </div>
            <div className="space-y-4">
              {achievements.map((ach: any) => {
                const progress = ach.target > 0 ? (ach.progress / ach.target) * 100 : 0;
                return (
                  <div key={ach.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {ach.unlocked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-stone-300" />
                        )}
                        <span className={`text-[11px] font-bold ${ach.unlocked ? 'text-stone-900' : 'text-stone-400'}`}>
                          {ach.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-stone-300">
                        {ach.progress}/{ach.target}
                      </span>
                    </div>
                    <div className="h-1.5 bg-stone-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ach.unlocked ? 'bg-emerald-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {achievements.length === 0 && (
                <p className="text-[11px] text-stone-400 font-medium text-center">No achievements yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
