'use client';

import React, { useState } from 'react';
import { RefreshCw, Gift, AlertTriangle, BarChart3, Pause, Pin, Zap, GitFork, Rocket } from 'lucide-react';

const automations = [
  {
    name: 'Auto Partner Rotation',
    status: 'Active' as const,
    trigger: 'Triggers when a partner exceeds daily lead cap or engagement score drops below threshold.',
    lastRun: '12 min ago',
    enabled: true,
  },
  {
    name: 'Reward Rebalancing',
    status: 'Active' as const,
    trigger: 'Runs hourly to rebalance reward pools based on redemption velocity and budget allocation.',
    lastRun: '1 hr ago',
    enabled: true,
  },
  {
    name: 'Lead Nurture Sequence',
    status: 'Paused' as const,
    trigger: 'Sends a 5-step email drip to leads inactive for 72+ hours.',
    lastRun: '3 days ago',
    enabled: false,
  },
  {
    name: 'Low Stock Alert',
    status: 'Active' as const,
    trigger: 'Monitors reward inventory and alerts when stock drops below 15% of capacity.',
    lastRun: '4 hr ago',
    enabled: true,
  },
];

const scheduledTasks = [
  { name: 'Daily Revenue Sync', schedule: 'Every day at 2:00 AM', nextRun: 'May 22, 2:00 AM', status: 'Scheduled' },
  { name: 'Weekly Partner Report', schedule: 'Every Monday at 9:00 AM', nextRun: 'May 26, 9:00 AM', status: 'Scheduled' },
  { name: 'Monthly Cleanup', schedule: '1st of each month', nextRun: 'Jun 1, 12:00 AM', status: 'Scheduled' },
];

const eventLog = [
  { time: '19:32', date: 'Today', event: 'Auto Partner Rotation executed — shifted 24 leads from Solara to Meridian.', type: 'rotation' },
  { time: '18:15', date: 'Today', event: 'Reward Rebalancing completed — redistributed £1,240 across 3 pools.', type: 'reward' },
  { time: '14:02', date: 'Today', event: 'Low Stock Alert fired — "Premium Gift Card" at 12% inventory.', type: 'alert' },
  { time: '09:00', date: 'Yesterday', event: 'Daily Revenue Sync completed — 842 records processed.', type: 'sync' },
  { time: '08:45', date: 'Yesterday', event: 'Lead Nurture Sequence paused by user — manual override.', type: 'pause' },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'Paused':
      return 'bg-amber-50 text-amber-600 border border-amber-200';
    case 'Scheduled':
      return 'bg-blue-50 text-blue-600 border border-blue-200';
    default:
      return 'bg-stone-100 text-stone-600 border border-stone-200';
  }
};

const getEventIcon = (type: string, className = "w-4 h-4 text-[#888]") => {
  switch (type) {
    case 'rotation': return <RefreshCw className={`${className} text-orange-500`} />;
    case 'reward': return <Gift className={`${className} text-pink-500`} />;
    case 'alert': return <AlertTriangle className={`${className} text-amber-500`} />;
    case 'sync': return <BarChart3 className={`${className} text-blue-500`} />;
    case 'pause': return <Pause className={`${className} text-[#888]`} />;
    default: return <Pin className={`${className}`} />;
  }
};

export default function AutomationPage() {
  const [toggles, setToggles] = useState<Record<number, boolean>>(
    automations.reduce((acc, a, i) => ({ ...acc, [i]: a.enabled }), {})
  );

  const handleToggle = (index: number) => {
    setToggles((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Automation</p>
        <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Workflow Automation</h1>
        <p className="text-[#888] text-[13px] mt-1">Configure automated workflows, monitor scheduled tasks, and review event history.</p>
      </div>

      {/* Active Automations */}
      <div>
        <h2 className="text-sm font-display font-semibold text-[#1a1a1a] mb-4">Active Automations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {automations.map((auto, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-display font-semibold text-[#1a1a1a]">{auto.name}</h3>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusBadge(toggles[i] ? 'Active' : 'Paused')}`}>
                    {toggles[i] ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-[13px] text-[#666] leading-relaxed mb-4">{auto.trigger}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#f0f0f0]">
                <span className="text-[12px] text-[#999]">Last run: {auto.lastRun}</span>
                <button
                  onClick={() => handleToggle(i)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                    toggles[i] ? 'bg-[#f97316]' : 'bg-[#ddd]'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                      toggles[i] ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Builder Preview */}
      <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Builder Preview</p>
        <h2 className="text-lg font-display font-semibold text-[#1a1a1a] mb-6">Automation Flow</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
          {/* Step 1: Trigger */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#fb923c] flex items-center justify-center text-white shadow-lg shadow-orange-200/50">
              <Zap className="w-7 h-7 fill-white stroke-none" />
            </div>
            <span className="mt-2 text-[13px] font-semibold text-[#1a1a1a]">Trigger</span>
            <span className="text-[11px] text-[#999]">Lead Cap Reached</span>
          </div>

          {/* Connector */}
          <div className="hidden sm:block w-16 h-[2px] bg-gradient-to-r from-[#f97316] to-[#d4d4d4] mx-2 mt-[-16px]" />
          <div className="sm:hidden w-[2px] h-8 bg-gradient-to-b from-[#f97316] to-[#d4d4d4]" />

          {/* Step 2: Condition */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center text-white shadow-lg shadow-amber-200/50">
              <GitFork className="w-7 h-7 stroke-white" />
            </div>
            <span className="mt-2 text-[13px] font-semibold text-[#1a1a1a]">Condition</span>
            <span className="text-[11px] text-[#999]">Score &gt; 7.5</span>
          </div>

          {/* Connector */}
          <div className="hidden sm:block w-16 h-[2px] bg-gradient-to-r from-[#d4d4d4] to-[#22c55e] mx-2 mt-[-16px]" />
          <div className="sm:hidden w-[2px] h-8 bg-gradient-to-b from-[#d4d4d4] to-[#22c55e]" />

          {/* Step 3: Action */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white shadow-lg shadow-emerald-200/50">
              <Rocket className="w-7 h-7 fill-white stroke-none" />
            </div>
            <span className="mt-2 text-[13px] font-semibold text-[#1a1a1a]">Action</span>
            <span className="text-[11px] text-[#999]">Rotate Partner</span>
          </div>
        </div>
      </div>

      {/* Scheduled Tasks + Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Tasks */}
        <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Schedule</p>
          <h2 className="text-lg font-display font-semibold text-[#1a1a1a] mb-5">Scheduled Tasks</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f0f0f0]">
                  {['Task', 'Schedule', 'Next Run', 'Status'].map((h) => (
                    <th key={h} className="pb-3 text-[11px] font-semibold text-[#999] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduledTasks.map((task, i) => (
                  <tr key={i} className="border-b border-[#f8f8f8] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 text-[13px] font-semibold text-[#1a1a1a]">{task.name}</td>
                    <td className="py-3 text-[13px] text-[#666]">{task.schedule}</td>
                    <td className="py-3 text-[13px] text-[#666]">{task.nextRun}</td>
                    <td className="py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusBadge(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Activity</p>
          <h2 className="text-lg font-display font-semibold text-[#1a1a1a] mb-5">Event Log</h2>
          <div className="space-y-0">
            {eventLog.map((evt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 border-b border-[#f8f8f8] last:border-0 hover:bg-[#fafafa] transition-colors rounded-lg px-2 -mx-2"
              >
                <span className="mt-0.5 flex-shrink-0">{getEventIcon(evt.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#333] leading-relaxed">{evt.event}</p>
                  <p className="text-[11px] text-[#bbb] mt-1">{evt.date} at {evt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
