'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  Building2,
  Target,
  Search,
  AlertTriangle,
  Star,
  Sparkles,
  UserCheck,
  LayoutGrid,
  Zap,
  Gift,
  ShieldAlert,
  Users,
  Compass,
  Route,
  Bell,
  Coins,
  BarChart3,
  Sliders,
  LogOut
} from 'lucide-react';
import {
  useAdminDashboard,
  useAdminBusinesses,
  useAdminCustomers,
  useAdminCampaigns,
  useAdminAnalytics,
  useAdminGames,
  useAdminRewards,
  useAdminPartners,
  useAdminRedemptions,
  useUpdateAdminBusiness,
  useUpdateAdminGame,
} from '@/services/admin';
import { useLogout } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';

import { GamificationControl } from './gamification-control';
import { CampaignControl } from './campaign-control';
import { PlanManagementControl } from './plan-management';

/* ─── SHARED UI COMPONENTS ─── */
const Card = ({ children, title, isProcessing }: { children: React.ReactNode, title?: string, isProcessing?: boolean }) => (
  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
    {title && <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-6">{title}</h3>}
    {children}
    {isProcessing && (
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full"
        />
      </div>
    )}
  </div>
);

const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode, variant?: 'neutral' | 'green' | 'red' | 'yellow' | 'blue' }) => {
  const styles = {
    neutral: 'bg-stone-100 text-stone-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[variant]}`}>{children}</span>;
};

/* ─── BUSINESS MANAGEMENT COMPONENT ─── */
const BusinessManagement = () => {
  const [subTab, setSubTab] = useState('pending');
  
  const businessesQuery = useAdminBusinesses();
  const gamesQuery = useAdminGames();
  const rewardsQuery = useAdminRewards();
  const updateBusinessMutation = useUpdateAdminBusiness();

  const bizList = businessesQuery.data?.data ?? businessesQuery.data ?? [];
  const gameList = gamesQuery.data?.data ?? gamesQuery.data ?? [];
  const rewardList = rewardsQuery.data?.data ?? rewardsQuery.data ?? [];

  const isProcessing = businessesQuery.isLoading || gamesQuery.isLoading || rewardsQuery.isLoading || updateBusinessMutation.isPending;

  const handleAction = (bizId: string, action: string) => {
    if (action === 'Approve') {
      updateBusinessMutation.mutate(
        { id: bizId, isActive: true },
        {
          onSuccess: () => alert(`Activated business successfully`),
          onError: () => alert('Failed to activate business'),
        }
      );
    } else if (action === 'Suspend') {
      updateBusinessMutation.mutate(
        { id: bizId, isActive: false },
        {
          onSuccess: () => alert(`Suspended business successfully`),
          onError: () => alert('Failed to suspend business'),
        }
      );
    } else {
      alert(`Action "${action}" is not yet connected to the backend. This is a UI mockup.`);
    }
  };

  const pendingBiz = React.useMemo(() => {
    return bizList.filter((b: any) => !b.isActive);
  }, [bizList]);

  const activeBiz = React.useMemo(() => {
    return bizList.filter((b: any) => b.isActive);
  }, [bizList]);

  const businessTabs = [
    { id: 'pending', label: 'Pending Businesses' },
    { id: 'active', label: 'Active Businesses' },
    { id: 'gamification', label: 'Gamification Status' },
    { id: 'overrides', label: 'Business Overrides' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl w-max">
        {businessTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all ${
              subTab === tab.id
                ? 'bg-white text-[#1a1a1a] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
        >
          {subTab === 'pending' && (
            <Card title="Business Onboarding Queue" isProcessing={isProcessing}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase text-stone-500 border-b border-stone-100">
                    <th className="pb-4">Business Name</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Reason</th>
                    <th className="pb-4">Submission</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-stone-800">
                  {pendingBiz.length > 0 ? pendingBiz.map((biz: any, i: number) => (
                    <tr key={biz.id || i} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="py-4 font-bold">{biz.name}</td>
                      <td className="py-4">{biz.slug ? 'Slug: ' + biz.slug : 'Other'}</td>
                      <td className="py-4 text-stone-500 italic">Onboarding Request</td>
                      <td className="py-4 text-stone-400">{biz.createdAt ? new Date(biz.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="py-4"><Badge variant="yellow">Pending</Badge></td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleAction(biz.id, 'Approve')} disabled={updateBusinessMutation.isPending} className="text-[10px] font-bold bg-[#1a1a1a] text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors disabled:opacity-50">Approve</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="text-center text-[#888] py-8 text-[13px]">No pending businesses</td></tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}

          {subTab === 'active' && (
            <Card title="Active Network Monitoring" isProcessing={isProcessing}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase text-stone-500 border-b border-stone-100">
                    <th className="pb-4">Brand ID</th>
                    <th className="pb-4">Campaigns</th>
                    <th className="pb-4">Inventory</th>
                    <th className="pb-4">Engagement</th>
                    <th className="pb-4">Redemption</th>
                    <th className="pb-4 text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-stone-800">
                  {activeBiz.length > 0 ? activeBiz.map((biz: any, i: number) => {
                    return (
                    <tr key={biz.id || i} className="border-b border-stone-50 hover:bg-stone-50">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{biz.name}</span>
                          <span className="text-[10px] text-stone-400">{biz.id}</span>
                        </div>
                      </td>
                      <td className="py-4">—</td>
                      <td className="py-4 text-stone-500">—</td>
                      <td className="py-4">
                        <Badge variant="neutral">—</Badge>
                      </td>
                      <td className="py-4 font-mono text-[11px]">—</td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleAction(biz.id, 'Suspend')} disabled={updateBusinessMutation.isPending} className="text-[10px] font-bold text-red-600 hover:underline transition-all disabled:opacity-50">Suspend</button>
                      </td>
                    </tr>
                  );
                    }) : (
                      <tr><td colSpan={6} className="text-center text-[#888] py-8 text-[13px]">No active businesses</td></tr>
                    )}
                </tbody>
              </table>
            </Card>
          )}

          {subTab === 'gamification' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Live Game Nodes" isProcessing={isProcessing}>
                <div className="space-y-4">
                  {gameList.length > 0 ? gameList.map((node: any, i: number) => (
                    <div key={node.id || i} className="flex justify-between items-center p-4 border border-stone-100 rounded-xl bg-stone-50">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-stone-700">{node.business?.name || 'Unknown'}</span>
                        <div className="flex items-center gap-2 text-[10px] text-stone-500">
                          <Compass className="w-3 h-3" /> {node.name || 'Arcade Game'} • {node.theme || 'Default Theme'}
                        </div>
                      </div>
                      <Badge variant={node.isActive ? 'green' : 'neutral'}>{node.isActive ? 'LIVE' : 'IDLE'}</Badge>
                    </div>
                  )) : (
                    <p className="text-center text-[#888] py-8 text-[13px]">No live game nodes</p>
                  )}
                </div>
              </Card>
              <Card title="Reward Activity Stream">
                <div className="space-y-4">
                  {rewardList.length > 0 ? rewardList.slice(0, 5).map((item: any, i: number) => (
                    <div key={item.id || i} className="flex items-center gap-3 text-xs border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-[10px]">WIN</div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-800">{item.name || 'Reward'}</span>
                          <span className="text-[10px] text-stone-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <span className="text-[10px] text-stone-500">{item.description || 'Ecosystem reward item'}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-[#888] py-8 text-[13px]">No recent rewards</p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {subTab === 'overrides' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Visibility & Traffic Overrides" isProcessing={isProcessing}>
                <div className="space-y-6">
                  {[
                    { label: 'Platform Global Visibility', desc: 'Force all campaigns to maximum reach', type: 'toggle' },
                    { label: 'Reward Frequency Multiplier', desc: 'Increase global win rates across all businesses', type: 'slider' },
                    { label: 'Box Count Override', desc: 'Force 8-box configuration globally', type: 'toggle' },
                  ].map((ctrl, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-stone-100 rounded-xl">
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-xs font-bold">{ctrl.label}</span>
                        <span className="text-[10px] text-stone-400">{ctrl.desc}</span>
                      </div>
                      {ctrl.type === 'toggle' ? (
                        <div className="w-9 h-5 bg-stone-200 rounded-full cursor-pointer p-1">
                          <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                      ) : (
                        <div className="w-24 h-1 bg-stone-100 rounded-full relative">
                          <div className="absolute left-0 top-0 h-full bg-[#1a1a1a] w-1/2 rounded-full" />
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-stone-300 rounded-full shadow-sm" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Targeted Campaign Pushes" isProcessing={isProcessing}>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <h4 className="text-[11px] font-bold text-orange-700 uppercase mb-2">Featured Spotlight</h4>
                    <select className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2 text-xs mb-3">
                      <option>Select Business to Feature...</option>
                    </select>
                    <button onClick={() => handleAction('Selected Business', 'Spotlight Push')} className="w-full bg-orange-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      PUSH TO FRONT PAGE
                    </button>
                  </div>
                  <div className="p-4 bg-stone-50 border border-stone-100 rounded-xl">
                    <h4 className="text-[11px] font-bold text-stone-700 uppercase mb-2">Inventory Boost</h4>
                    <p className="text-[10px] text-stone-500 mb-3">Manually inject rewards into a struggling business node.</p>
                    <button onClick={() => handleAction('Target Node', 'Inventory Injection')} className="w-full border border-stone-300 text-stone-700 text-[10px] font-bold py-2 rounded-lg hover:bg-white transition-colors">
                      LAUNCH INJECTION
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ─── AGENT MANAGEMENT COMPONENT ─── */
const AgentManagement = () => {
  const [subTab, setSubTab] = useState('assignment');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAgentAction = async (agentName: string, action: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/agents/${encodeURIComponent(agentName)}/${encodeURIComponent(action)}`, { method: 'POST' });
      if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
    } catch (err) {
      console.error('Agent action failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const agentTabs = [
    { id: 'assignment', label: 'Assignment Engine' },
    { id: 'workload', label: 'Workload Balance' },
    { id: 'control', label: 'Agent Control Panel' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl w-max">
        {agentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all ${
              subTab === tab.id
                ? 'bg-white text-[#1a1a1a] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
        >
          {subTab === 'assignment' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <Card title="Live Assignment Matching Engine" isProcessing={isProcessing}>
                  <div className="flex flex-col items-center justify-center py-10 text-stone-400">
                    <Route className="w-8 h-8 mb-2 opacity-20" />
                    <span className="text-xs font-medium">Listening for New Business Onboarding...</span>
                    <p className="text-[10px] mt-1 text-stone-400 max-w-xs text-center">No assignment matches in progress. Agent assignment engine is not yet connected.</p>
                  </div>
                </Card>
              </div>
              <Card title="Assignment Automation Rules">
                <div className="space-y-5">
                  {[
                    { label: 'Auto-Match Engine', enabled: true },
                    { label: 'Workload Balancing', enabled: true },
                    { label: 'Industry Expertise Bias', enabled: false },
                    { label: 'Response Speed Bias', enabled: true },
                  ].map((rule, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-stone-700">{rule.label}</span>
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${rule.enabled ? 'bg-green-500' : 'bg-stone-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full ${rule.enabled ? 'translate-x-4' : 'translate-x-0'} transition-transform`} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-stone-100">
                    <p className="text-[10px] text-stone-500 leading-relaxed mb-4">The system auto-assigns based on availability, workload, and industry expertise match.</p>
                    <button className="w-full py-2 bg-[#1a1a1a] text-white text-[10px] font-bold rounded-lg">FORCE REBALANCE</button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {subTab === 'workload' && (
            <div className="space-y-6">
              <Card title="Agent Capacity & Workload Balance">
                <div className="flex flex-col items-center justify-center py-12 text-stone-400">
                  <Users className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Agent Workload Tracking — Coming Soon</p>
                  <p className="text-[10px] mt-1 text-stone-400 max-w-xs text-center">Live agent capacity and performance metrics will appear here once agents are connected to the platform.</p>
                </div>
              </Card>
            </div>
          )}

          {subTab === 'control' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Assignment Overrides" isProcessing={isProcessing}>
                <div className="space-y-4">
                  <div className="p-4 bg-stone-50 border border-stone-100 rounded-xl space-y-3">
                    <h4 className="text-[11px] font-bold text-stone-700 uppercase">Manual Reassignment</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <select className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs">
                        <option>Select Business...</option>
                      </select>
                      <select className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs">
                        <option>Assign to Agent...</option>
                      </select>
                    </div>
                    <button onClick={() => handleAgentAction('', 'Reassignment')} className="w-full bg-[#1a1a1a] text-white text-[10px] font-bold py-2 rounded-lg">EXECUTE OVERRIDE</button>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <h4 className="text-[11px] font-bold text-red-700 uppercase mb-2">Emergency Halt</h4>
                    <p className="text-[10px] text-red-600 mb-3">Pause all automated assignments to resolve system maintenance.</p>
                    <button className="w-full bg-red-600 text-white text-[10px] font-bold py-2 rounded-lg">PAUSE AUTO-ASSIGNMENT</button>
                  </div>
                </div>
              </Card>
              <Card title="Agent Quality Monitoring">
                <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                  <p className="text-[10px] font-mono text-stone-300">No agent quality metrics available yet</p>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ─── CONSUMER MONITORING COMPONENT ─── */
const ConsumerMonitoring = () => {
  const [subTab, setSubTab] = useState('behavior');
  
  const customersQuery = useAdminCustomers();
  const redemptionsQuery = useAdminRedemptions();
  
  const customerList = customersQuery.data?.data ?? customersQuery.data ?? [];
  const redemptionList = redemptionsQuery.data?.data ?? redemptionsQuery.data ?? [];

  const isProcessing = customersQuery.isLoading || redemptionsQuery.isLoading;

  const handleConsumerAction = (userId: string, action: string) => {
    alert(`Action "${action}" for user ${userId} is not yet connected to the backend.`);
  };

  const consumerTabs = [
    { id: 'behavior', label: 'Consumer Behavior' },
    { id: 'wallet', label: 'Wallet & Redemptions' },
    { id: 'fraud', label: 'Fraud & Safety' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl w-max">
        {consumerTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all ${
              subTab === tab.id
                ? 'bg-white text-[#1a1a1a] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
        >
          {subTab === 'behavior' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Active Users', value: customerList.length, desc: 'Registered' },
                  { label: 'Avg Plays', value: '—', desc: 'Per user/day' },
                  { label: 'Fav Category', value: '—', desc: 'High engagement' },
                  { label: 'Youth Active', value: '—', desc: 'Of total base' },
                ].map((stat, i) => (
                  <Card key={i}>
                    <div className="text-[10px] font-bold uppercase text-stone-500 mb-1">{stat.label}</div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-[10px] text-stone-400">{stat.desc}</div>
                  </Card>
                ))}
              </div>
              <Card title="Engagement & Sentiment Analysis">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase text-stone-500 border-b border-stone-100">
                      <th className="pb-4">Consumer</th>
                      <th className="pb-4">Activity Level</th>
                      <th className="pb-4">Top Interaction</th>
                      <th className="pb-4">Persona</th>
                      <th className="pb-4">Retention</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-medium text-stone-800">
                    {customerList.length > 0 ? customerList.map((row: any, i: number) => (
                      <tr key={row.id || i} className="border-b border-stone-50 hover:bg-stone-50">
                        <td className="py-4 font-bold">{row.firstName || ''} {row.lastName || ''} ({row.email})</td>
                        <td className="py-4"><Badge variant="neutral">—</Badge></td>
                        <td className="py-4 text-stone-500">—</td>
                        <td className="py-4 font-bold text-stone-700">—</td>
                        <td className="py-4">—</td>
                        <td className="py-4 text-right">
                          <button className="text-[10px] font-bold text-[#1a1a1a] hover:underline transition-all">View Profile</button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} className="text-center text-[#888] py-8 text-[13px]">No consumers found</td></tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {subTab === 'wallet' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Recent Win & Claim History">
                <div className="space-y-4">
                  {redemptionList.length > 0 ? redemptionList.map((claim: any, i: number) => (
                    <div key={claim.id || i} className="flex justify-between items-center p-4 border border-stone-100 rounded-xl bg-stone-50">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-stone-700">{claim.reward?.name || 'Voucher Reward'}</span>
                        <span className="text-[10px] text-stone-500">Business: {claim.business?.name || 'MCOM Partner'} • {claim.redeemedAt ? new Date(claim.redeemedAt).toLocaleDateString() : 'Claimed'}</span>
                      </div>
                      <Badge variant="green">Claimed</Badge>
                    </div>
                  )) : (
                    <p className="text-center text-[#888] py-8 text-[13px]">No recent claims</p>
                  )}
                </div>
              </Card>
              <Card title="Wallet Performance Metrics">
                <div className="space-y-6">
                  {[
                    { label: 'Voucher Redemption Rate', val: '—', status: 'neutral' },
                    { label: 'Avg Claim to Use Time', val: '—', status: 'neutral' },
                    { label: 'Unclaimed Prize Volume', val: '—', status: 'neutral' },
                    { label: 'QR Scan Success Rate', val: '—', status: 'neutral' },
                  ].map((metric, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border border-stone-100 rounded-lg">
                      <span className="text-xs font-medium text-stone-600">{metric.label}</span>
                      <span className="text-xs font-bold text-stone-800">{metric.val}</span>
                    </div>
                  ))}
                  <button className="w-full border border-stone-300 text-stone-700 text-[10px] font-bold py-2 rounded-lg mt-2">EXPORT WALLET DATA</button>
                </div>
              </Card>
            </div>
          )}

          {subTab === 'fraud' && (
            <div className="space-y-6">
              <Card title="Security & Fairness Alerts">
                <div className="flex flex-col items-center justify-center py-12 text-stone-400">
                  <ShieldAlert className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Fraud Detection Coming Soon</p>
                  <p className="text-[10px] mt-1 text-stone-400 max-w-xs text-center">Real-time fraud alerts and security logs will appear here once the fraud detection engine is active.</p>
                </div>
              </Card>
              <div className="grid grid-cols-2 gap-6">
                <Card title="Fraud Prevention Logs">
                  <div className="flex flex-col items-center justify-center py-10 text-stone-400">
                    <p className="text-[10px] font-mono text-stone-300">No fraud events logged yet.</p>
                  </div>
                </Card>
                <Card title="Trust Index Global">
                  <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                    <p className="text-[10px] font-mono text-stone-300">No trust score data available yet</p>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ─── ANALYTICS & REPORTING COMPONENT ─── */
const AnalyticsReporting = () => {
  const [subTab, setSubTab] = useState('revenue');

  const analyticsTabs = [
    { id: 'revenue', label: 'Revenue & Growth' },
    { id: 'campaigns', label: 'Campaign Performance' },
    { id: 'regional', label: 'Regional Insights' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl w-max">
        {analyticsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all ${
              subTab === tab.id
                ? 'bg-white text-[#1a1a1a] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {subTab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <Card title="Total Platform Revenue">
                  <div className="text-3xl font-black text-stone-900 mb-1">—</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Revenue tracking not yet connected</div>
                </Card>
                <Card title="Lead Conversion Value">
                  <div className="text-3xl font-black text-stone-900 mb-1">—</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Connect payment provider</div>
                </Card>
                <Card title="Sponsored Contribution">
                  <div className="text-3xl font-black text-stone-900 mb-1">—</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Awaiting billing integration</div>
                </Card>
              </div>
              
              <Card title="Revenue Distribution by Category">
                <div className="h-[250px] w-full bg-stone-50 rounded-xl flex items-center justify-center">
                  <p className="text-[11px] text-stone-400">No revenue breakdown available yet — awaiting billing integration</p>
                </div>
              </Card>
            </div>
          )}

          {subTab === 'campaigns' && (
            <div className="space-y-6">
              <Card title="Top Performing Campaigns (ROI)">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase text-stone-500 border-b border-stone-100">
                      <th className="pb-4">Campaign Name</th>
                      <th className="pb-4">Engagement</th>
                      <th className="pb-4">Conversion</th>
                      <th className="pb-4">Reward ROI</th>
                      <th className="pb-4 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-medium text-stone-800">
                    <tr>
                      <td colSpan={5} className="text-center text-[#888] py-8 text-[13px]">No campaign performance data available yet</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {subTab === 'regional' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Regional Engagement Heatmap">
                <div className="flex flex-col items-center justify-center py-10 text-stone-400">
                  <p className="text-[10px] font-mono text-stone-300">No regional engagement data available yet</p>
                </div>
              </Card>
              <Card title="Regional Distribution Stats">
                <p className="text-[10px] text-stone-500 leading-relaxed italic">"Most active regional nodes are currently those with a high density of MCOM businesses and Youth-focused campaigns."</p>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold">Platform Saturation</span>
                  <span className="text-xs font-black">—</span>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ─── SYSTEM SETTINGS COMPONENT ─── */
const SystemSettings = () => {
  const [subTab, setSubTab] = useState('automation');

  const settingsTabs = [
    { id: 'automation', label: 'Automation Rules' },
    { id: 'security', label: 'Fraud & Security' },
    { id: 'config', label: 'Global Config' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl w-max">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-[11px] font-bold transition-all ${
              subTab === tab.id
                ? 'bg-white text-[#1a1a1a] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
        >
          {subTab === 'automation' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Global Automation Triggers">
                <div className="space-y-4">
                  {[
                    { label: 'Auto-Pause Low Engagement', desc: 'Pause campaigns under 2% engagement', enabled: true },
                    { label: 'Auto-Scale Inventory', desc: 'Inject rewards when stock drops below 10%', enabled: false },
                    { label: 'Agent Matching Engine', desc: 'Allow AI to auto-assign businesses', enabled: true },
                    { label: 'Youth Mode Priority', desc: 'Priority routing for 18-24 demographic', enabled: true },
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-stone-100 rounded-xl">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold">{rule.label}</span>
                        <span className="text-[10px] text-stone-400">{rule.desc}</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${rule.enabled ? 'bg-stone-800' : 'bg-stone-200'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full ${rule.enabled ? 'translate-x-4' : 'translate-x-0'} transition-transform`} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Operational Thresholds">
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-500 block mb-2">Max Agent Workload</label>
                    <input type="range" className="w-full accent-stone-800" />
                    <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                      <span>1 Business</span>
                      <span>Current: —</span>
                      <span>15 Businesses</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-500 block mb-2">Platform Visibility Bias</label>
                    <input type="range" className="w-full accent-stone-800" />
                    <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                      <span>Equal Dist.</span>
                      <span>Current: —</span>
                      <span>Extreme Blitz</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {subTab === 'security' && (
            <div className="space-y-6">
              <Card title="Fraud Prevention Sensitivity">
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { label: 'IP Rate Limiting', level: 'Aggressive' },
                    { label: 'Pattern Detection', level: 'Heuristic' },
                    { label: 'Voucher Fingerprinting', level: 'Strict' },
                  ].map((sec, i) => (
                    <div key={i} className="text-center p-4 border border-stone-100 rounded-xl bg-stone-50">
                      <div className="text-[10px] font-bold uppercase text-stone-400 mb-2">{sec.label}</div>
                      <div className="text-sm font-black text-stone-800">{sec.level}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Security Master Kill-Switches">
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-red-50 text-red-600 text-[10px] font-bold py-3 rounded-xl border border-red-100 hover:bg-red-100 transition-colors">PAUSE ALL REDEMPTIONS</button>
                  <button className="bg-stone-50 text-stone-600 text-[10px] font-bold py-3 rounded-xl border border-stone-200 hover:bg-stone-100 transition-colors">RESET ALL API KEYS</button>
                </div>
              </Card>
            </div>
          )}

          {subTab === 'config' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Platform Branding & UI">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">Theme Mode</span>
                    <select className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs">
                      <option>System Default</option>
                      <option>Sleek Dark</option>
                      <option>Clean Light</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">Primary Accent</span>
                    <div className="flex gap-2">
                      {['#f97316', '#1a1a1a', '#22c55e', '#3b82f6'].map(color => (
                        <div key={color} className="w-5 h-5 rounded-full border border-stone-200" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              <Card title="Ecosystem Endpoint Config">
                <div className="space-y-3">
                  <div className="p-3 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-mono text-stone-500 break-all">Not configured</div>
                  <button className="w-full border border-stone-300 text-stone-700 text-[10px] font-bold py-2 rounded-lg">RE-SYNCHRONIZE ALL NODES</button>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ─── MAIN DASHBOARD COMPONENT ─── */
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminDashboard() {
  const dashboardQuery = useAdminDashboard();
  const dash = dashboardQuery.data?.data ?? dashboardQuery.data ?? {};
  const logoutMutation = useLogout();
  const { user } = useAuthStore();

  /* ─── DASHBOARD LOCAL STATE ─── */
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddBizModal, setShowAddBizModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  if (dashboardQuery.isLoading) {
    return <div className="p-12 text-center"><div className="animate-spin w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full mx-auto" /></div>;
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'gamification', label: 'Gamification Control', icon: Compass },
    { id: 'campaigns', label: 'Campaign Control', icon: Sliders },
    { id: 'business', label: 'Business Management', icon: Building2 },
    { id: 'agents', label: 'Agent Management', icon: UserCheck },
    { id: 'consumers', label: 'Consumer Monitoring', icon: Users },
    { id: 'analytics', label: 'Analytics & Reporting', icon: TrendingUp },
    { id: 'plans', label: 'Plan Management', icon: Coins },
    { id: 'system', label: 'System Settings', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] flex font-sans h-screen overflow-hidden">

      {/* ─── Mobile overlay ─── */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-[#eee]
          flex flex-col transition-all duration-300 ease-out shrink-0
          ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}
          ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className={`flex items-center gap-3 px-5 h-16 border-b border-[#eee] shrink-0 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}>
          <span className="w-2.5 h-2.5 bg-[#f97316] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)] shrink-0" />
          {!sidebarCollapsed && (
            <span className="font-display font-bold text-[15px] tracking-tight text-[#1a1a1a]">MComSpin</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarMobileOpen(false); }}
                title={sidebarCollapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative
                  ${active
                    ? 'bg-[#f97316]/[0.08] text-[#f97316] font-semibold'
                    : 'text-[#888] hover:text-[#1a1a1a] hover:bg-[#f5f5f3]'
                  }
                  ${sidebarCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#f97316] rounded-r-full" />
                )}
                <span className={`shrink-0 ${active ? 'text-[#f97316]' : 'text-[#aaa] group-hover:text-[#666]'}`}>
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User panel */}
        <div className={`border-t border-[#eee] px-3 py-4 shrink-0 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {user ? (
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-[#f97316]/[0.1] text-[#f97316] flex items-center justify-center text-[11px] font-bold shrink-0">
                {user.avatar || getInitials(user.name)}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#1a1a1a] truncate">{user.name}</p>
                  <p className="text-[10px] text-[#aaa] truncate">{user.role}</p>
                </div>
              )}
            </div>
          ) : (
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a]/[0.06] text-[#1a1a1a] flex items-center justify-center text-[11px] font-bold shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              {!sidebarCollapsed && (
                <p className="text-[12px] font-semibold text-[#1a1a1a] truncate">Administrator</p>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-[#eee] px-4 lg:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-[#f5f5f3] text-[#888]"
              onClick={() => setSidebarMobileOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Collapse toggle (desktop) */}
            <button
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-[#f5f5f3] text-[#aaa] hover:text-[#666] transition-colors"
              onClick={() => setSidebarCollapsed((v) => !v)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
              </svg>
            </button>

            <h1 className="text-[15px] font-semibold text-[#1a1a1a] hidden sm:block">
              {menuItems.find((m) => m.id === activeTab)?.label || 'Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64">
              <span className="absolute inset-y-0 left-3 flex items-center"><Search className="w-3.5 h-3.5 text-stone-400" /></span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-[#eee] rounded-full py-1.5 pl-9 pr-4 text-[12px] outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddBizModal(true)}
              className="bg-[#1a1a1a] hover:bg-[#f97316] text-white text-[11px] font-bold uppercase px-4 py-2 rounded-full transition-all"
            >
              + Business
            </button>
            <button
              onClick={() => {
                logoutMutation.mutate(undefined, {
                  onSuccess: () => { window.location.href = '/admin/login'; },
                  onError: () => { window.location.href = '/admin/login'; },
                });
              }}
              className="flex items-center gap-1.5 text-stone-500 hover:text-red-500 text-[11px] font-bold uppercase px-3 py-2 rounded-full hover:bg-red-50 transition-all"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold">Platform Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { label: 'Active Businesses', value: dash.activeBusinesses ?? 0, icon: Building2 },
                      { label: 'Active Campaigns', value: dash.activeCampaigns ?? 0, icon: Target },
                      { label: 'Rewards Claimed', value: dash.rewardsIssued ?? 0, icon: Gift },
                      { label: 'Games Played', value: dash.totalPlays ?? 0, icon: Sparkles },
                      { label: 'Total Consumers', value: dash.totalCustomers ?? 0, icon: Users },
                      { label: 'Total Campaigns', value: dash.totalCampaigns ?? 0, icon: Target },
                      { label: 'Redemptions', value: dash.rewardsRedeemed ?? 0, icon: Coins },
                      { label: 'Redemption Rate', value: `${dash.redemptionRate ?? 0}%`, icon: TrendingUp },
                      { label: 'Platform Saturation', value: dash.platformSaturation != null ? `${dash.platformSaturation}%` : '—', icon: Star },
                      { label: 'Live Engagement', value: dash.liveEngagement || '—', icon: Zap },
                    ].map((card, i) => {
                      const Icon = card.icon;
                      return (
                        <motion.div key={i} whileHover={{ y: -2 }} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                            <Icon className="w-3.5 h-3.5" /> {card.label}
                          </div>
                          <div className="text-2xl font-bold">{card.value}</div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold mb-4">Recent Activity</h3>
                    {(dash.recentActivity?.length ?? 0) > 0 ? (
                      <div className="space-y-3">
                        {dash.recentActivity.map((item: any, i: number) => {
                          const name = item.customer
                            ? `${item.customer.firstName ?? ''} ${item.customer.lastName ?? ''}`.trim() || 'Guest'
                            : 'Guest';
                          return (
                            <div key={item.id || i} className="flex items-center gap-3 text-xs text-stone-600 border-b border-stone-50 last:border-0 pb-2 last:pb-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                              {name} started a play session — {new Date(item.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[12px] text-stone-400 text-center py-4">No recent activity yet</p>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'gamification' && <GamificationControl />}
              {activeTab === 'campaigns' && <CampaignControl />}
              {activeTab === 'plans' && <PlanManagementControl />}
              {activeTab === 'business' && <BusinessManagement />}
              {activeTab === 'agents' && <AgentManagement />}
              {activeTab === 'consumers' && <ConsumerMonitoring />}
              {activeTab === 'analytics' && <AnalyticsReporting />}
              {activeTab === 'system' && <SystemSettings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
