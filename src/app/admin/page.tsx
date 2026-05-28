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
  Sliders
} from 'lucide-react';
import { useAdminStore } from '@/store/admin-store';

import { GamificationControl } from './gamification-control';
import { CampaignControl } from './campaign-control';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (bizName: string, action: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`${action} successful for ${bizName}`);
    }, 800);
  };

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
                  {[
                    { name: 'Glow Skin Clinic', cat: 'Wellness', reason: 'Setup Request', date: '2 hours ago', status: 'Pending Agent' },
                    { name: 'Urban Threads', cat: 'Retail', reason: 'New Approval', date: '5 hours ago', status: 'Verification' },
                    { name: 'Elite Cuts', cat: 'Barber', reason: 'Agent Request', date: '1 day ago', status: 'Pending Assignment' },
                  ].map((biz, i) => (
                    <tr key={i} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="py-4 font-bold">{biz.name}</td>
                      <td className="py-4">{biz.cat}</td>
                      <td className="py-4 text-stone-500 italic">{biz.reason}</td>
                      <td className="py-4 text-stone-400">{biz.date}</td>
                      <td className="py-4"><Badge variant="yellow">{biz.status}</Badge></td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleAction(biz.name, 'Review')} className="text-[10px] font-bold bg-[#1a1a1a] text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors">Review</button>
                      </td>
                    </tr>
                  ))}
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
                  {[
                    { id: 'MB-001', name: 'MCOM Barber', camps: 2, inv: '142/500', eng: 'High', red: '78%', status: 'Stable' },
                    { id: 'DR-042', name: 'Downtown Retail', camps: 5, inv: '88/200', eng: 'Med', red: '62%', status: 'Check' },
                    { id: 'LL-099', name: 'Luna Lounge', camps: 1, inv: '45/100', eng: 'Low', red: '15%', status: 'Alert' },
                  ].map((biz, i) => (
                    <tr key={i} className="border-b border-stone-50 hover:bg-stone-50">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{biz.name}</span>
                          <span className="text-[10px] text-stone-400">{biz.id}</span>
                        </div>
                      </td>
                      <td className="py-4">{biz.camps} active</td>
                      <td className="py-4 text-stone-500">{biz.inv}</td>
                      <td className="py-4">
                        <Badge variant={biz.eng === 'High' ? 'green' : biz.eng === 'Med' ? 'yellow' : 'red'}>{biz.eng}</Badge>
                      </td>
                      <td className="py-4 font-mono text-[11px]">{biz.red}</td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleAction(biz.name, 'Inspection')} className="text-[10px] font-bold text-[#1a1a1a] hover:underline transition-all">Inspect Node</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {subTab === 'gamification' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Live Game Nodes" isProcessing={isProcessing}>
                <div className="space-y-4">
                  {[
                    { biz: 'MCOM Barber', game: '8-Box Shuffle', theme: 'Sleek Dark', active: true },
                    { biz: 'Tech Blitz', game: '4-Box Reveal', theme: 'Neon Blitz', active: true },
                    { biz: 'Green Grove', game: '6-Box Spin', theme: 'Organic Leaf', active: false },
                  ].map((node, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border border-stone-100 rounded-xl bg-stone-50">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-stone-700">{node.biz}</span>
                        <div className="flex items-center gap-2 text-[10px] text-stone-500">
                          <Compass className="w-3 h-3" /> {node.game} • {node.theme}
                        </div>
                      </div>
                      <Badge variant={node.active ? 'green' : 'neutral'}>{node.active ? 'LIVE' : 'IDLE'}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Reward Activity Stream">
                <div className="space-y-4">
                  {[
                    { time: '12s ago', biz: 'MCOM Barber', reward: 'Free Haircut', user: 'User #8812' },
                    { time: '1m ago', biz: 'Downtown Retail', reward: '10% Discount', user: 'User #4491' },
                    { time: '3m ago', biz: 'Tech Blitz', reward: 'Gift Card', user: 'User #2210' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-[10px]">WIN</div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-800">{item.reward}</span>
                          <span className="text-[10px] text-stone-400">{item.time}</span>
                        </div>
                        <span className="text-[10px] text-stone-500">{item.biz} won by {item.user}</span>
                      </div>
                    </div>
                  ))}
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
                      <option>MCOM Barber</option>
                      <option>Tech Blitz</option>
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

  const handleAgentAction = (agentName: string, action: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`${action} successful for ${agentName}`);
    }, 800);
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
                  <div className="space-y-4">
                    {[
                      { biz: 'Glow Skin Clinic', status: 'Matching...', steps: ['Category: Wellness', 'Goals: Growth', 'Assets: Uploaded'], progress: 65 },
                      { biz: 'Urban Threads', status: 'Processing...', steps: ['Category: Retail', 'Goals: Blitz', 'Assets: Pending'], progress: 30 },
                    ].map((match, i) => (
                      <div key={i} className="p-4 border border-stone-100 rounded-xl bg-stone-50 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold">{match.biz}</span>
                          <span className="text-[10px] font-bold text-orange-600 animate-pulse">{match.status}</span>
                        </div>
                        <div className="flex gap-4">
                          {match.steps.map((step, j) => (
                            <span key={j} className="text-[10px] text-stone-500 bg-white px-2 py-1 rounded-md border border-stone-200">{step}</span>
                          ))}
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-1">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${match.progress}%` }} className="bg-[#1a1a1a] h-1 rounded-full" />
                        </div>
                      </div>
                    ))}
                    <div className="p-4 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center py-8 text-stone-400">
                      <Route className="w-8 h-8 mb-2 opacity-20" />
                      <span className="text-xs font-medium">Listening for New Business Onboarding...</span>
                    </div>
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
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Avg Workload', value: '4.2', desc: 'Businesses/Agent' },
                  { label: 'Wait Time', value: '< 5m', desc: 'Auto-Assignment' },
                  { label: 'Completion', value: '94%', desc: 'Setup Rate' },
                  { label: 'Satisfaction', value: '4.9', desc: 'Business Rating' },
                ].map((stat, i) => (
                  <Card key={i}>
                    <div className="text-[10px] font-bold uppercase text-stone-500 mb-1">{stat.label}</div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-[10px] text-stone-400">{stat.desc}</div>
                  </Card>
                ))}
              </div>
              <Card title="Agent Capacity & Workload Balance">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase text-stone-500 border-b border-stone-100">
                      <th className="pb-4">Agent Name</th>
                      <th className="pb-4">Active Load</th>
                      <th className="pb-4">Expertise</th>
                      <th className="pb-4">Setup Quality</th>
                      <th className="pb-4">Last Active</th>
                      <th className="pb-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-medium text-stone-800">
                    {[
                      { name: 'Agent B (Sarah)', load: 4, exp: 'Retail/Barber', quality: '98%', active: '3m ago', status: 'Available' },
                      { name: 'Agent A (Marcus)', load: 5, exp: 'Hospitality', quality: '92%', active: '12m ago', status: 'Busy' },
                      { name: 'Agent C (Elena)', load: 7, exp: 'Global/Tech', quality: '95%', active: 'Now', status: 'Max Load' },
                    ].map((agent, i) => (
                      <tr key={i} className="border-b border-stone-50 hover:bg-stone-50">
                        <td className="py-4 font-bold">{agent.name}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span>{agent.load}</span>
                            <div className="w-16 bg-stone-100 rounded-full h-1">
                              <div className="bg-[#1a1a1a] h-1 rounded-full" style={{ width: `${(agent.load / 10) * 100}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-stone-500">{agent.exp}</td>
                        <td className="py-4">{agent.quality}</td>
                        <td className="py-4 text-stone-400">{agent.active}</td>
                        <td className="py-4 text-right">
                          <Badge variant={agent.status === 'Available' ? 'green' : agent.status === 'Busy' ? 'yellow' : 'red'}>{agent.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                        <option>Glow Skin Clinic</option>
                      </select>
                      <select className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs">
                        <option>Assign to Agent...</option>
                        <option>Agent B (Sarah)</option>
                        <option>Agent A (Marcus)</option>
                      </select>
                    </div>
                    <button onClick={() => handleAgentAction('Sarah', 'Reassignment')} className="w-full bg-[#1a1a1a] text-white text-[10px] font-bold py-2 rounded-lg">EXECUTE OVERRIDE</button>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <h4 className="text-[11px] font-bold text-red-700 uppercase mb-2">Emergency Halt</h4>
                    <p className="text-[10px] text-red-600 mb-3">Pause all automated assignments to resolve system maintenance.</p>
                    <button className="w-full bg-red-600 text-white text-[10px] font-bold py-2 rounded-lg">PAUSE AUTO-ASSIGNMENT</button>
                  </div>
                </div>
              </Card>
              <Card title="Agent Quality Monitoring">
                <div className="space-y-4">
                  {[
                    { label: 'Setup Time Compliance', val: '98%', status: 'green' },
                    { label: 'Branding Fidelity Score', val: '95%', status: 'green' },
                    { label: 'Reward Logic Accuracy', val: '88%', status: 'yellow' },
                    { label: 'Visual Design Rating', val: '99%', status: 'green' },
                  ].map((metric, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border border-stone-100 rounded-lg">
                      <span className="text-xs font-medium text-stone-600">{metric.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold">{metric.val}</span>
                        <div className={`w-2 h-2 rounded-full bg-${metric.status}-500`} />
                      </div>
                    </div>
                  ))}
                  <button className="w-full border border-stone-300 text-stone-700 text-[10px] font-bold py-2 rounded-lg mt-2">GENERATE PERFORMANCE REPORT</button>
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConsumerAction = (userId: string, action: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`${action} successful for ${userId}`);
    }, 800);
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
                  { label: 'Active Users', value: '12.4k', desc: 'Last 24h' },
                  { label: 'Avg Plays', value: '3.8', desc: 'Per user/day' },
                  { label: 'Fav Category', value: 'Retail', desc: 'High engagement' },
                  { label: 'Youth Active', value: '45%', desc: 'Of total base' },
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
                    {[
                      { user: 'Michael P. (#8812)', act: 'Very High', top: 'MCOM Barber', persona: 'Loyalist', ret: '95%' },
                      { user: 'Sarah L. (#4421)', act: 'High', top: 'Downtown Retail', persona: 'Shopper', ret: '82%' },
                      { user: 'Kevin J. (#2210)', act: 'Medium', top: 'Tech Blitz', persona: 'Youth', ret: '45%' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-stone-50 hover:bg-stone-50">
                        <td className="py-4 font-bold">{row.user}</td>
                        <td className="py-4">
                          <Badge variant={row.act === 'Very High' ? 'green' : row.act === 'High' ? 'blue' : 'yellow'}>{row.act}</Badge>
                        </td>
                        <td className="py-4 text-stone-500">{row.top}</td>
                        <td className="py-4 font-bold text-stone-700">{row.persona}</td>
                        <td className="py-4">{row.ret}</td>
                        <td className="py-4 text-right">
                          <button className="text-[10px] font-bold text-[#1a1a1a] hover:underline transition-all">View Profile</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {subTab === 'wallet' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Recent Win & Claim History">
                <div className="space-y-4">
                  {[
                    { time: '2s ago', prize: 'MCOM VIP Pass', biz: 'MCOM Barber', status: 'Claimed' },
                    { time: '45s ago', prize: '10% Discount', biz: 'Downtown Retail', status: 'Expired' },
                    { time: '2m ago', prize: 'Free Product', biz: 'Tech Blitz', status: 'Pending' },
                  ].map((claim, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border border-stone-100 rounded-xl bg-stone-50">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-stone-700">{claim.prize}</span>
                        <span className="text-[10px] text-stone-500">{claim.biz} • {claim.time}</span>
                      </div>
                      <Badge variant={claim.status === 'Claimed' ? 'green' : claim.status === 'Pending' ? 'yellow' : 'red'}>{claim.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Wallet Performance Metrics">
                <div className="space-y-6">
                  {[
                    { label: 'Voucher Redemption Rate', val: '72%', status: 'green' },
                    { label: 'Avg Claim to Use Time', val: '4.2h', status: 'green' },
                    { label: 'Unclaimed Prize Volume', val: '$1,240', status: 'yellow' },
                    { label: 'QR Scan Success Rate', val: '99.2%', status: 'green' },
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
              <Card title="Security & Fairness Alerts" isProcessing={isProcessing}>
                <div className="space-y-4">
                  {[
                    { type: 'IP Abuse', desc: 'Multiple accounts detected from same subnet', severity: 'Critical', user: 'Subnet 0x4' },
                    { type: 'Bot Behavior', desc: 'High frequency play pattern in 10-box game', severity: 'Warning', user: 'User #9921' },
                    { type: 'Repeat Exploit', desc: 'Attempting to reclaim expired voucher', severity: 'Medium', user: 'User #4412' },
                  ].map((alert, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border border-stone-100 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${alert.severity === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-stone-800">{alert.type} - {alert.user}</span>
                          <span className="text-[10px] text-stone-500">{alert.desc}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={alert.severity === 'Critical' ? 'red' : 'yellow'}>{alert.severity}</Badge>
                        <button onClick={() => handleConsumerAction(alert.user, 'Security Flag')} className="text-[10px] font-bold text-red-600 hover:underline">Suspend Account</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="grid grid-cols-2 gap-6">
                <Card title="Fraud Prevention Logs">
                  <div className="space-y-3">
                    {[
                      'System: Blocked IP 192.168.1.45 (Rate Limit)',
                      'Audit: User #4412 flagged for suspicious redemption',
                      'WAF: Neutralized SQL injection attempt on wallet endpoint',
                      'Fairness: Re-balancing win distribution for Retail node',
                    ].map((log, i) => (
                      <div key={i} className="text-[10px] text-stone-600 font-mono flex items-center gap-2">
                        <span className="text-stone-300">[{new Date().toLocaleTimeString()}]</span>
                        {log}
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="Trust Index Global">
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-stone-100" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                        <path className="text-green-500" strokeDasharray="94, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">94</span>
                        <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Healthy</span>
                      </div>
                    </div>
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
                  <div className="text-3xl font-black text-stone-900 mb-1">$428,590</div>
                  <div className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12.4% vs last month
                  </div>
                </Card>
                <Card title="Lead Conversion Value">
                  <div className="text-3xl font-black text-stone-900 mb-1">$124,102</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Averaging $12.50 per lead</div>
                </Card>
                <Card title="Sponsored Contribution">
                  <div className="text-3xl font-black text-stone-900 mb-1">34%</div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase">Growth in Partner Spend</div>
                </Card>
              </div>
              
              <Card title="Revenue Distribution by Category">
                <div className="h-[250px] w-full bg-stone-50 rounded-xl flex items-end p-6 gap-4">
                  {[
                    { cat: 'Retail', val: '85%' },
                    { cat: 'Wellness', val: '62%' },
                    { cat: 'Tech', val: '45%' },
                    { cat: 'Food', val: '92%' },
                    { cat: 'Youth', val: '58%' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <motion.div initial={{ height: 0 }} animate={{ height: bar.val }} className="w-full bg-stone-800 rounded-lg shadow-sm" />
                      <span className="text-[10px] font-bold text-stone-500 uppercase">{bar.cat}</span>
                    </div>
                  ))}
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
                    {[
                      { name: 'Summer Fresh', eng: 'High', conv: '12.4%', roi: '4.2x', trend: '+15%' },
                      { name: 'Tech Blitz', eng: 'Extreme', conv: '18.9%', roi: '5.8x', trend: '+22%' },
                      { name: 'Glow Reveal', eng: 'Med', conv: '8.2%', roi: '2.1x', trend: '-2%' },
                    ].map((camp, i) => (
                      <tr key={i} className="border-b border-stone-50 hover:bg-stone-50">
                        <td className="py-4 font-bold">{camp.name}</td>
                        <td className="py-4">{camp.eng}</td>
                        <td className="py-4 font-mono">{camp.conv}</td>
                        <td className="py-4 text-green-600 font-bold">{camp.roi}</td>
                        <td className="py-4 text-right font-bold text-stone-400">{camp.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {subTab === 'regional' && (
            <div className="grid grid-cols-2 gap-6">
              <Card title="Regional Engagement Heatmap">
                <div className="space-y-4">
                  {[
                    { city: 'London Central', level: '94%', trend: 'up' },
                    { city: 'Manchester North', level: '72%', trend: 'up' },
                    { city: 'Birmingham Retail', level: '45%', trend: 'down' },
                    { city: 'Leeds Global', level: '12%', trend: 'new' },
                  ].map((loc, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border border-stone-100 rounded-xl">
                      <span className="text-xs font-bold text-stone-700">{loc.city}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold">{loc.level}</span>
                        <div className={`w-2 h-2 rounded-full ${loc.trend === 'up' ? 'bg-green-500' : loc.trend === 'new' ? 'bg-blue-500' : 'bg-red-500'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Regional Distribution Stats">
                <p className="text-[10px] text-stone-500 leading-relaxed italic">"Most active regional nodes are currently those with a high density of MCOM businesses and Youth-focused campaigns."</p>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold">Platform Saturation</span>
                  <span className="text-xs font-black">68.2%</span>
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
                      <span>Current: 8 Businesses</span>
                      <span>15 Businesses</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-500 block mb-2">Platform Visibility Bias</label>
                    <input type="range" className="w-full accent-stone-800" />
                    <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                      <span>Equal Dist.</span>
                      <span>Current: Growth Priority</span>
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
                  <div className="p-3 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-mono text-stone-500 break-all">wss://gateway.mcomspin.network/v1/live</div>
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
export default function AdminDashboard() {
  const {
    businesses,
    addTelemetryLog,
    triggerSecurityAlert,
    setInspector,
  } = useAdminStore();

  /* ─── DASHBOARD LOCAL STATE ─── */
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddBizModal, setShowAddBizModal] = useState(false);

  /* ─── LIVE TELEMETRY SIMULATION ─── */
  useEffect(() => {
    const logs = [
      { type: 'lead_route' as const, desc: 'Routed verification tag for user "Michael P." to Elara Wellness', origin: 'MComSpin Gateway', dest: 'Elara CRM', status: 'completed' as const },
      { type: 'reward_unlock' as const, desc: 'Unlocked reward voucher ID #88491 (20% Off Session)', origin: 'Ecosystem Spin Engine', dest: 'Meridian Wallet Node', status: 'completed' as const },
      { type: 'partner_sync' as const, desc: 'Synchronized spotlight campaign metadata with AdServer node', origin: 'Platform Scheduler', dest: 'Partner Ad Server', status: 'completed' as const },
      { type: 'security_flag' as const, desc: 'High frequency spin pattern observed on localized subnet', origin: 'WAF Rate Limiter', dest: 'Fraud Ledger', status: 'flagged' as const },
    ];

    const timer = setInterval(() => {
      if (Math.random() > 0.4) {
        const selected = logs[Math.floor(Math.random() * logs.length)];
        addTelemetryLog({
          type: selected.type,
          description: selected.desc,
          nodeOrigin: selected.origin,
          nodeDest: selected.dest,
          status: selected.status,
        });

        if (selected.status === 'flagged' && Math.random() > 0.6) {
          triggerSecurityAlert({
            businessName: businesses[Math.floor(Math.random() * businesses.length)]?.name || 'Unknown Merchant',
            severity: Math.random() > 0.5 ? 'medium' : 'high',
            pattern: 'Repetitive transaction signature detected in short interval.',
          });
        }
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [addTelemetryLog, triggerSecurityAlert, businesses]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'gamification', label: 'Gamification Control', icon: Compass },
    { id: 'campaigns', label: 'Campaign Control', icon: Sliders },
    { id: 'business', label: 'Business Management', icon: Building2 },
    { id: 'agents', label: 'Agent Management', icon: UserCheck },
    { id: 'consumers', label: 'Consumer Monitoring', icon: Users },
    { id: 'analytics', label: 'Analytics & Reporting', icon: TrendingUp },
    { id: 'system', label: 'System Settings', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] flex font-sans h-screen overflow-hidden">
      
      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 bg-white border-r border-[#eee] flex flex-col h-full shrink-0">
        <div className="h-16 border-b border-[#eee] px-6 flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 bg-[#f97316] rounded-full shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
          <span className="font-display font-extrabold text-base tracking-tight text-[#1a1a1a]">MComSpin</span>
        </div>
        
        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setInspector(null, null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-bold tracking-wide transition-all ${
                  activeTab === item.id
                    ? 'bg-orange-50 text-[#f97316]'
                    : 'text-[#666] hover:bg-stone-50 hover:text-[#1a1a1a]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-[#eee] px-8 flex items-center justify-between shrink-0">
          <div className="relative w-96">
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
                      { label: 'Active Businesses', value: '1,284', icon: Building2 },
                      { label: 'Active Campaigns', value: '452', icon: Target },
                      { label: 'Rewards Claimed', value: '89.4k', icon: Gift },
                      { label: 'Games Played', value: '1.2m', icon: Sparkles },
                      { label: 'Total Consumers', value: '3.4m', icon: Users },
                      { label: 'Agents Active', value: '142', icon: UserCheck },
                      { label: 'Pending Agent Requests', value: '28', icon: Bell },
                      { label: 'High Perf. Campaigns', value: '12', icon: Star },
                      { label: 'Most Claimed Rewards', value: '45', icon: Coins },
                      { label: 'Live Engagement', value: '12.4k', icon: TrendingUp },
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
                    <div className="space-y-3">
                      {[
                        'New business request: Elara Wellness (Pending)',
                        'New campaign submitted: Summer Refresh (Fashion)',
                        'Agent assignment: John D. -> Meridian Spa',
                        'Reward spike detected: 20% Voucher (Retail)',
                        'Fraud alert: High frequency spins - Subnet 0x4',
                        'High activity business: TechGadgets Inc.',
                        'Redemption alert: Unusual volume - Cafe Luna',
                        'Consumer complaint: Reward not applied (User #9982)',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs text-stone-600 border-b border-stone-50 last:border-0 pb-2 last:pb-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'gamification' && <GamificationControl />}
              {activeTab === 'campaigns' && <CampaignControl />}
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
