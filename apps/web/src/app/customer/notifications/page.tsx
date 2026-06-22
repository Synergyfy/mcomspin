'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerNotifications, useMarkNotificationRead } from '@/services/customer';
import {
  Bell,
  BellOff,
  CheckCheck,
  Gift,
  Ticket,
  Sparkles,
  Star,
  Info,
  ChevronRight,
  Megaphone,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const NOTIF_ICONS: Record<string, React.ElementType> = {
  Reward: Gift,
  Redeem: Ticket,
  Game: Star,
  Promotion: Megaphone,
  Info: Info,
  Achievement: Sparkles,
};

const NOTIF_COLORS: Record<string, string> = {
  Reward: 'bg-orange-50 text-orange-600 border-orange-100',
  Redeem: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Game: 'bg-blue-50 text-blue-600 border-blue-100',
  Promotion: 'bg-purple-50 text-purple-600 border-purple-100',
  Info: 'bg-stone-50 text-stone-600 border-stone-100',
  Achievement: 'bg-amber-50 text-amber-600 border-amber-100',
};

export default function NotificationsPage() {
  const { data: notifData, isLoading, isError } = useCustomerNotifications();
  const markRead = useMarkNotificationRead();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const notifications = React.useMemo(() => {
    if (!notifData) return [];
    const raw = (notifData as any).data ?? notifData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [notifData]);

  const meta = React.useMemo(() => {
    if (!notifData) return null;
    return (notifData as any).meta ?? null;
  }, [notifData]);

  const filteredNotifs = filter === 'unread'
    ? notifications.filter((n: any) => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1">
          <p className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Updates</p>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight uppercase">Notifications</h1>
          <p className="text-stone-500 text-sm max-w-md font-medium">
            Stay updated on rewards, game invites, and partner offers.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-stone-100 rounded-[2rem] px-8 py-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-orange-500' : 'text-stone-300'}`} />
            <span className="text-2xl font-black text-stone-900">{unreadCount}</span>
          </div>
          <div className="w-px h-10 bg-stone-100" />
          <div className="flex items-center gap-2">
            <CheckCheck className="w-5 h-5 text-stone-300" />
            <span className="text-2xl font-black text-stone-300">{notifications.length - unreadCount}</span>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center bg-white border border-stone-100 p-2 rounded-2xl shadow-sm w-full sm:w-auto overflow-x-auto custom-scrollbar gap-1">
        {([
          { key: 'all' as const, label: 'All' },
          { key: 'unread' as const, label: 'Unread' },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === t.key
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {t.label}
            {t.key === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-[8px]">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-stone-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-black text-stone-900 uppercase mb-1">Failed to Load</h3>
            <p className="text-stone-400 text-sm font-medium">Could not load notifications. Please try again.</p>
          </div>
        )}

        {!isLoading && !isError && filteredNotifs.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
              {filter === 'unread' ? <BellOff className="w-8 h-8 text-stone-200" /> : <Bell className="w-8 h-8 text-stone-200" />}
            </div>
            <h3 className="text-lg font-black text-stone-900 uppercase mb-1">All Clear</h3>
            <p className="text-stone-400 text-sm font-medium">
              {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
            </p>
          </div>
        )}

        {!isLoading && filteredNotifs.length > 0 && (
          <div className="divide-y divide-stone-50">
            <AnimatePresence mode="popLayout">
              {filteredNotifs.map((notif: any, idx: number) => {
                const Icon = NOTIF_ICONS[notif.type] || Bell;
                const colorClass = NOTIF_COLORS[notif.type] || 'bg-stone-50 text-stone-600 border-stone-100';

                return (
                  <motion.div
                    key={notif.id || idx}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`flex items-start gap-4 px-6 md:px-8 py-5 transition-colors cursor-pointer hover:bg-stone-50/50 ${
                      !notif.isRead ? 'bg-orange-50/20' : ''
                    }`}
                    onClick={() => {
                      if (!notif.isRead) {
                        markRead.mutate(notif.id, { onError: () => {} });
                      }
                    }}
                  >
                    <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm leading-tight ${notif.isRead ? 'font-bold text-stone-600' : 'font-black text-stone-900'}`}>
                          {notif.title}
                        </h4>
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{notif.body}</p>
                      <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-1.5">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>

                    {!notif.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead.mutate(notif.id, { onError: () => {} });
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-xl text-[8px] font-black text-stone-400 uppercase tracking-widest border border-stone-100 hover:border-orange-200 hover:text-orange-500 transition-all"
                      >
                        Mark Read
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="text-center">
        <Link
          href="/customer/history"
          className="inline-flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-orange-500 transition-colors"
        >
          View Activity History
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
