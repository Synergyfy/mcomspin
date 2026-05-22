'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useAdminStore, AdminBusiness, ProbabilitySegment, SecurityAlert, SpotlightCampaign } from '@/store/admin-store';
import { 
  BarChart3, 
  Network, 
  UserCheck, 
  Users, 
  Sliders, 
  Compass, 
  Gift, 
  Scale, 
  Calendar, 
  Route, 
  Monitor, 
  Zap, 
  TrendingUp, 
  Shield, 
  Bell, 
  Coins,
  Building2,
  Target,
  Search,
  AlertTriangle,
  ArrowRight,
  Star,
  Sparkles,
  Check,
  X
} from 'lucide-react';

/* ─── HELPERS & CONSTANTS ─── */
const menuItems = [
  { id: 'overview', label: 'Platform Overview', icon: 'overview' },
  { id: 'network', label: 'Live Network Map', icon: 'network' },
  { id: 'verification', label: 'Business Verification', icon: 'verification' },
  { id: 'ecosystem', label: 'Partner Ecosystem', icon: 'ecosystem' },
  { id: 'campaigns', label: 'Campaign Engine', icon: 'campaigns' },
  { id: 'gamification', label: 'Gamification Orchestrator', icon: 'gamification' },
  { id: 'rewards', label: 'Reward Oversight', icon: 'rewards' },
  { id: 'probability', label: 'Probability & Logic', icon: 'probability' },
  { id: 'spotlight', label: 'Rotation Spotlight', icon: 'spotlight' },
  { id: 'routing', label: 'Lead Routing', icon: 'routing' },
  { id: 'storefront', label: 'Storefront Previews', icon: 'storefront' },
  { id: 'automation', label: 'Automation Rules', icon: 'automation' },
  { id: 'analytics', label: 'Analytics & Intelligence', icon: 'analytics' },
  { id: 'risk', label: 'Fraud & Risk', icon: 'risk' },
  { id: 'alerts', label: 'Alerts Center', icon: 'alerts' },
  { id: 'revenue', label: 'Revenue Control', icon: 'revenue' },
];

const getAdminMenuIcon = (id: string, className = "w-4 h-4") => {
  switch (id) {
    case 'overview': return <BarChart3 className={className} />;
    case 'network': return <Network className={className} />;
    case 'verification': return <UserCheck className={className} />;
    case 'ecosystem': return <Users className={className} />;
    case 'campaigns': return <Sliders className={className} />;
    case 'gamification': return <Compass className={className} />;
    case 'rewards': return <Gift className={className} />;
    case 'probability': return <Scale className={className} />;
    case 'spotlight': return <Calendar className={className} />;
    case 'routing': return <Route className={className} />;
    case 'storefront': return <Monitor className={className} />;
    case 'automation': return <Zap className={className} />;
    case 'analytics': return <TrendingUp className={className} />;
    case 'risk': return <Shield className={className} />;
    case 'alerts': return <Bell className={className} />;
    case 'revenue': return <Coins className={className} />;
    default: return null;
  }
};

export default function AdminDashboard() {
  const {
    totalActiveBusinesses,
    totalRewardsAllocated,
    leadConversionRate,
    totalPlatformRevenue,
    businesses,
    probabilities,
    telemetryLogs,
    securityAlerts,
    spotlights,
    systemHealthIndex,
    activeInspectorId,
    activeInspectorType,
    verifyBusiness,
    suspendBusiness,
    deleteBusiness,
    setProbabilityWeight,
    resolveAlert,
    dismissAlert,
    setInspector,
    addBusiness,
    addTelemetryLog,
    updateSpotlightWeight,
    triggerSecurityAlert,
  } = useAdminStore();

  /* ─── DASHBOARD LOCAL STATE ─── */
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [businessFilter, setBusinessFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [newBizName, setNewBizName] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizOwner, setNewBizOwner] = useState('');
  const [newBizCategory, setNewBizCategory] = useState('Luxury Fashion');
  const [newBizTier, setNewBizTier] = useState<'Silver' | 'Gold' | 'Platinum'>('Silver');
  const [showAddBizModal, setShowAddBizModal] = useState(false);
  const [simulatingLog, setSimulatingLog] = useState(false);

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

        // Small probability of generating a new security alert
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

  /* ─── CHARTS STATIC DATA ─── */
  const performanceData = [
    { name: '08:00', volume: 240, leads: 82, revenue: 12000 },
    { name: '10:00', volume: 380, leads: 120, revenue: 19000 },
    { name: '12:00', volume: 450, leads: 154, revenue: 22000 },
    { name: '14:00', volume: 320, leads: 98, revenue: 16000 },
    { name: '16:00', volume: 590, leads: 210, revenue: 31000 },
    { name: '18:00', volume: 680, leads: 245, revenue: 38000 },
    { name: '20:00', volume: 480, leads: 165, revenue: 24000 },
  ];

  const categoryDistribution = [
    { name: 'Luxury Fashion', value: 40 },
    { name: 'Spa Services', value: 20 },
    { name: 'Consumer Tech', value: 15 },
    { name: 'Hospitality', value: 25 },
  ];

  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

  /* ─── DYNAMIC COMPONENT HANDLERS ─── */
  const handleAddNewBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newBizEmail || !newBizOwner) return;
    addBusiness({
      name: newBizName,
      email: newBizEmail,
      owner: newBizOwner,
      avatar: newBizName.split(' ').map(x => x[0]).join('').substring(0, 2).toUpperCase(),
      category: newBizCategory,
      partnerTier: newBizTier,
      spotlightState: 'inactive',
      leadConversion: 0,
    });
    setNewBizName('');
    setNewBizEmail('');
    setNewBizOwner('');
    setShowAddBizModal(false);
  };

  const getInspectorData = () => {
    if (!activeInspectorId) return null;
    if (activeInspectorType === 'business') {
      return businesses.find(b => b.id === activeInspectorId);
    }
    if (activeInspectorType === 'probability') {
      return probabilities.find(p => p.id === activeInspectorId);
    }
    if (activeInspectorType === 'alert') {
      return securityAlerts.find(a => a.id === activeInspectorId);
    }
    return null;
  };

  const inspector = getInspectorData();

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] flex font-sans selection:bg-[#f97316]/10 selection:text-[#f97316] overflow-hidden h-screen">
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#f97316]/[0.01] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#f97316]/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* 1. LEFT SIDEBAR (NAVIGATION) */}
      <aside className="w-64 bg-white border-r border-[#eee] flex flex-col justify-between h-full z-20 shrink-0">
        <div>
          {/* Logo Brand Cap */}
          <div className="h-16 border-b border-[#eee] px-6 flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 bg-[#f97316] rounded-full shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-[#1a1a1a]">MComSpin</span>
              <span className="text-[9px] bg-orange-50 text-[#f97316] font-bold px-1.5 py-0.2 rounded-full border border-orange-100/50 ml-1.5">GOV</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="p-4 grid grid-cols-2 gap-2 border-b border-[#eee] bg-[#fafaf9]">
            <div className="p-2 bg-white border border-[#eee] rounded-xl text-center">
              <span className="text-[10px] text-[#888] font-bold block uppercase tracking-wider">Health</span>
              <span className="text-[12px] font-extrabold text-emerald-600 font-mono">{systemHealthIndex}%</span>
            </div>
            <div className="p-2 bg-white border border-[#eee] rounded-xl text-center">
              <span className="text-[10px] text-[#888] font-bold block uppercase tracking-wider">Pending</span>
              <span className="text-[12px] font-extrabold text-[#f97316] font-mono">
                {businesses.filter(b => b.status === 'pending').length}
              </span>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="p-3 space-y-0.5 max-h-[calc(100vh-210px)] overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setInspector(null, null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold tracking-wide transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100/30 text-[#f97316] border-l-4 border-[#f97316]'
                    : 'text-[#666] hover:bg-stone-50 hover:text-[#1a1a1a] border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={activeTab === item.id ? 'text-[#f97316]' : 'text-stone-400'}>
                    {getAdminMenuIcon(item.id, "w-4 h-4")}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.id === 'alerts' && securityAlerts.filter(a => a.status === 'unresolved').length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono scale-90">
                    {securityAlerts.filter(a => a.status === 'unresolved').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User context footer */}
        <div className="p-4 border-t border-[#eee] bg-[#fafaf9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ea580c] to-[#fb923c] text-white flex items-center justify-center text-xs font-black">
              EN
            </div>
            <div>
              <p className="text-[11px] font-black text-[#1a1a1a] leading-none">ENI Controller</p>
              <p className="text-[9px] text-[#888] font-bold uppercase tracking-wider mt-0.5">Ecosystem Admin</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-200 animate-pulse" />
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* 2. TOP COMMAND BAR */}
        <header className="h-16 bg-white border-b border-[#eee] px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-stone-400 text-sm">
                <Search className="w-3.5 h-3.5 text-stone-400" />
              </span>
              <input
                type="text"
                placeholder="Search active domains, nodes, alert IDs, partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-[#eee] rounded-full py-1.5 pl-9 pr-4 text-[12px] font-medium outline-none focus:border-[#f97316] focus:bg-white transition-all placeholder:text-[#bbb]"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-[#666]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>Node Gateway: Active</span>
              </div>
              <div className="h-4 w-[1px] bg-stone-200" />
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Telemetry: 24.8kbps</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setShowAddBizModal(true)}
              className="bg-[#1a1a1a] hover:bg-[#f97316] text-white text-[11px] font-bold uppercase tracking-[0.08em] px-4 py-2 rounded-full transition-all shadow-md active:scale-95"
            >
              + Onboard Business
            </button>
          </div>
        </header>

        {/* 3. MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 relative max-h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >

              {/* ─── TAB 1: PLATFORM OVERVIEW ─── */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Title & Alerts summary */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Mission Control System</p>
                      <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Ecosystem Intelligence Dashboard</h1>
                    </div>
                    <div className="bg-[#fff7ed] border border-orange-100 rounded-2xl p-3 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 animate-pulse shrink-0" />
                      <div>
                        <p className="text-[12px] font-extrabold text-[#1a1a1a]">Anomaly Alert Core Active</p>
                        <p className="text-[10px] text-[#f97316] font-bold">
                          {securityAlerts.filter(a => a.status === 'unresolved').length} open threats currently require attention.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4 KPI Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white border border-[#eee] rounded-2xl p-5 relative overflow-hidden group hover:border-[#f97316]/30 transition-all shadow-sm">
                      <div className="text-xl mb-2.5 text-orange-500"><Building2 className="w-5 h-5" /></div>
                      <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider block">Verified Businesses</span>
                      <span className="text-2xl font-display font-black text-[#1a1a1a] mt-1 block">
                        {businesses.filter(b => b.status === 'active').length} <span className="text-[12px] text-[#888] font-normal">Registered</span>
                      </span>
                    </div>

                    <div className="bg-white border border-[#eee] rounded-2xl p-5 relative overflow-hidden group hover:border-[#f97316]/30 transition-all shadow-sm">
                      <div className="text-xl mb-2.5 text-orange-500"><Gift className="w-5 h-5" /></div>
                      <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider block">Rewards Dispatched</span>
                      <span className="text-2xl font-display font-black text-[#1a1a1a] mt-1 block">
                        {totalRewardsAllocated} <span className="text-[12px] text-[#888] font-normal">Instances</span>
                      </span>
                    </div>

                    <div className="bg-white border border-[#eee] rounded-2xl p-5 relative overflow-hidden group hover:border-[#f97316]/30 transition-all shadow-sm">
                      <div className="text-xl mb-2.5 text-emerald-500"><Target className="w-5 h-5" /></div>
                      <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider block">Lead Match Rate</span>
                      <span className="text-2xl font-display font-black text-emerald-600 mt-1 block">
                        {leadConversionRate}% <span className="text-[12px] text-[#888] font-normal">Conversion</span>
                      </span>
                    </div>

                    <div className="bg-white border border-[#eee] rounded-2xl p-5 relative overflow-hidden group hover:border-[#f97316]/30 transition-all shadow-sm">
                      <div className="text-xl mb-2.5 text-orange-500"><Coins className="w-5 h-5" /></div>
                      <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider block">Platform Revenue Ledger</span>
                      <span className="text-2xl font-display font-black text-[#1a1a1a] mt-1 block">
                        ${totalPlatformRevenue.toLocaleString()} <span className="text-[12px] text-[#888] font-normal">USD</span>
                      </span>
                    </div>
                  </div>

                  {/* Charts row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Area Graph */}
                    <div className="bg-white border border-[#eee] rounded-2xl p-6 lg:col-span-2 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-bold text-[#1a1a1a]">Ecosystem Transaction Flow Velocity</h3>
                          <p className="text-[11px] text-[#888]">Hourly volume activity logs tracked across global partner subnets.</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#f97316] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">REAL-TIME</span>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <defs>
                              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #eee' }} />
                            <Area type="monotone" dataKey="volume" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick activity logs */}
                    <div className="bg-white border border-[#eee] rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-[#1a1a1a]">Live System Telemetry Logs</h3>
                        <p className="text-[11px] text-[#888]">Continuous trace of routed leads and campaign activities.</p>
                      </div>
                      <div className="space-y-3 my-4 overflow-y-auto max-h-56 pr-1 custom-scrollbar">
                        {telemetryLogs.map((log) => (
                          <div key={log.id} className="p-2.5 rounded-xl border border-stone-50 bg-[#fafaf9] flex items-start gap-2.5 text-left">
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 bg-[#f97316] animate-pulse" />
                            <div className="space-y-0.5">
                              <p className="text-[11px] font-bold text-[#1a1a1a] leading-tight">{log.description}</p>
                              <div className="flex gap-2 text-[9px] font-bold text-[#888]">
                                <span>{log.nodeOrigin} <ArrowRight className="w-2.5 h-2.5 inline align-middle mx-1 text-stone-400" /> {log.nodeDest}</span>
                                <span>•</span>
                                <span>{log.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 2: LIVE NETWORK MAP ─── */}
              {activeTab === 'network' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Telemetry Visualization</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Active Commerce Node Topology</h1>
                    <p className="text-[#888] text-[13px]">Real-time node connections showing lead routing streams and verification pathways.</p>
                  </div>

                  <div className="bg-white border border-[#eee] rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row gap-6 relative overflow-hidden h-[460px]">
                    <div className="flex-1 relative bg-stone-50 border border-stone-200/50 rounded-2xl flex items-center justify-center overflow-hidden">
                      {/* SVG Canvas Map */}
                      <svg width="100%" height="100%" viewBox="0 0 800 400" className="absolute inset-0">
                        {/* Connecting Lines */}
                        <line x1="400" y1="200" x2="150" y2="100" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="5,5" />
                        <line x1="400" y1="200" x2="150" y2="300" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="5,5" />
                        <line x1="400" y1="200" x2="650" y2="100" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="5,5" />
                        <line x1="400" y1="200" x2="650" y2="300" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="5,5" />

                        {/* Animated Packets */}
                        <motion.circle r="5" fill="#f97316"
                          animate={{ cx: [400, 150], cy: [200, 100] }}
                          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        />
                        <motion.circle r="5" fill="#ea580c"
                          animate={{ cx: [400, 650], cy: [200, 300] }}
                          transition={{ repeat: Infinity, duration: 4, ease: 'linear', delay: 1 }}
                        />
                        <motion.circle r="5" fill="#f97316"
                          animate={{ cx: [400, 150], cy: [200, 300] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', delay: 0.5 }}
                        />
                        <motion.circle r="5" fill="#ea580c"
                          animate={{ cx: [400, 650], cy: [200, 100] }}
                          transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', delay: 1.5 }}
                        />

                        {/* Core Gateway Node */}
                        <circle cx="400" cy="200" r="32" fill="#fff7ed" stroke="#f97316" strokeWidth="3" />
                        <text x="400" y="204" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="bold">MCOM CORE</text>

                        {/* Partner Nodes */}
                        <circle cx="150" cy="100" r="24" fill="#ffffff" stroke="#eee" strokeWidth="2" />
                        <text x="150" y="103" textAnchor="middle" fill="#1a1a1a" fontSize="8" fontWeight="bold">MERIDIAN</text>

                        <circle cx="150" cy="300" r="24" fill="#ffffff" stroke="#eee" strokeWidth="2" />
                        <text x="150" y="303" textAnchor="middle" fill="#1a1a1a" fontSize="8" fontWeight="bold">ELARA</text>

                        <circle cx="650" cy="100" r="24" fill="#ffffff" stroke="#eee" strokeWidth="2" />
                        <text x="650" y="103" textAnchor="middle" fill="#1a1a1a" fontSize="8" fontWeight="bold">VANTAGE</text>

                        <circle cx="650" cy="300" r="24" fill="#ffffff" stroke="#eee" strokeWidth="2" />
                        <text x="650" y="303" textAnchor="middle" fill="#1a1a1a" fontSize="8" fontWeight="bold">SOLEIL</text>
                      </svg>
                    </div>

                    <div className="w-full lg:w-72 space-y-4">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Network Telemetry Summary</h3>
                      <div className="bg-[#fafaf9] border border-[#eee] rounded-2xl p-4 space-y-3 text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-[#888]">Active Node Clusters:</span>
                          <span className="font-bold font-mono text-[#1a1a1a]">4 Node Pools</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888]">Network Status:</span>
                          <span className="font-bold text-emerald-600">Operational</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888]">Average Latency:</span>
                          <span className="font-bold font-mono text-[#1a1a1a]">14ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888]">Trigger Pulses/Min:</span>
                          <span className="font-bold font-mono text-[#1a1a1a]">1,842 requests</span>
                        </div>
                      </div>
                      <div className="p-4 bg-orange-50/50 border border-orange-100/50 rounded-2xl text-[11px] leading-relaxed text-[#f97316] font-medium">
                        ℹ️ Animated packets show live Customer Lead matching signals travelling directly from the gamified spin portal to verified merchant systems.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 3: BUSINESS VERIFICATION ─── */}
              {activeTab === 'verification' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Platform Governance</p>
                      <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Partner Account Verification Grid</h1>
                      <p className="text-[#888] text-[13px]">Approve, audit, or suspend business registrations and adjust risk limits.</p>
                    </div>
                    
                    {/* Status filter buttons */}
                    <div className="bg-stone-100 p-1.5 rounded-full flex gap-1 border border-stone-200/50 text-[11px] font-bold">
                      {(['all', 'active', 'pending', 'suspended'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setBusinessFilter(filter)}
                          className={`px-3 py-1 rounded-full uppercase tracking-wider transition-all ${
                            businessFilter === filter ? 'bg-white text-[#f97316] shadow-sm' : 'text-[#666] hover:text-[#1a1a1a]'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-[#eee] rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-[12px] border-collapse">
                      <thead>
                        <tr className="bg-stone-50 text-[#888] border-b border-[#eee] font-bold uppercase tracking-wider">
                          <th className="p-4 pl-6">Business Node</th>
                          <th className="p-4">Owner Profile</th>
                          <th className="p-4">Category Area</th>
                          <th className="p-4 text-center">Status state</th>
                          <th className="p-4 text-right">Conversion Match</th>
                          <th className="p-4 text-right">Risk Factor</th>
                          <th className="p-4 text-right pr-6">Direct Action Keys</th>
                        </tr>
                      </thead>
                      <tbody>
                        {businesses
                          .filter((b) => businessFilter === 'all' || b.status === businessFilter)
                          .map((biz) => (
                            <tr key={biz.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                              <td className="p-4 pl-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#f97316] flex items-center justify-center font-bold font-display text-[11px] ring-2 ring-orange-50">
                                  {biz.avatar}
                                </div>
                                <div>
                                  <p className="font-bold text-[#1a1a1a]">{biz.name}</p>
                                  <p className="text-[10px] text-[#888]">{biz.email}</p>
                                </div>
                              </td>
                              <td className="p-4 text-[#555] font-semibold">{biz.owner}</td>
                              <td className="p-4">
                                <span className="bg-stone-100 text-[#555] px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-stone-200">
                                  {biz.category}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                  biz.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : biz.status === 'pending'
                                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                                    : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                  {biz.status}
                                </span>
                              </td>
                              <td className="p-4 text-right font-mono font-bold text-[#1a1a1a]">{biz.leadConversion}%</td>
                              <td className="p-4 text-right">
                                <span className={`font-mono font-bold ${biz.riskScore > 50 ? 'text-red-500' : 'text-stone-600'}`}>
                                  {biz.riskScore}/100
                                </span>
                              </td>
                              <td className="p-4 text-right pr-6 space-x-2">
                                <button
                                  onClick={() => setInspector('business', biz.id)}
                                  className="text-[10px] bg-stone-100 hover:bg-[#f97316] hover:text-white border border-stone-200 font-bold uppercase px-3 py-1 rounded-full transition-all"
                                >
                                  Inspect
                                </button>
                                {biz.status === 'pending' && (
                                  <button
                                    onClick={() => verifyBusiness(biz.id)}
                                    className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase px-3 py-1 rounded-full transition-all shadow-sm"
                                  >
                                    Approve
                                  </button>
                                )}
                                {biz.status === 'active' && (
                                  <button
                                    onClick={() => suspendBusiness(biz.id)}
                                    className="text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold uppercase px-3 py-1 rounded-full transition-all shadow-sm"
                                  >
                                    Suspend
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── TAB 4: PARTNER ECOSYSTEM ─── */}
              {activeTab === 'ecosystem' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Ecosystem Cluster</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Collaborative Commerce Ecosystem Map</h1>
                    <p className="text-[#888] text-[13px]">Analyze collaborative categories, revenue contributions, and category mappings.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#eee] rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Partner Category Distributions</h3>
                      <div className="h-48 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {categoryDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-[#666]">
                        {categoryDistribution.map((cat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                            <span>{cat.name} ({cat.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-[#eee] rounded-2xl p-6 lg:col-span-2 space-y-4 shadow-sm">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Partner Volume Contribution Analysis</h3>
                      <div className="space-y-4">
                        {businesses.filter(b => b.status === 'active').map((biz, idx) => (
                          <div key={biz.id} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-[#1a1a1a]">
                              <span>{biz.name} ({biz.partnerTier})</span>
                              <span>${(totalPlatformRevenue * (biz.leadConversion / 100) * 0.1).toFixed(2)} Platform Share</span>
                            </div>
                            <div className="h-2 bg-[#f5f5f3] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                                style={{ width: `${biz.leadConversion * 2.5}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 5: CAMPAIGN ENGINE ─── */}
              {activeTab === 'campaigns' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Campaign Automation</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Active Campaign Lifecycles</h1>
                    <p className="text-[#888] text-[13px]">Oversee active partner schedules, validation structures, and rotating rules.</p>
                  </div>

                  <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-[#fafaf9] border border-[#eee] rounded-xl space-y-2">
                        <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider">Active Campaigns</span>
                        <p className="text-xl font-display font-black text-[#1a1a1a]">12 Schedules</p>
                        <p className="text-[10px] text-emerald-600 font-bold">● Fully aligned without overlaps</p>
                      </div>
                      <div className="p-4 bg-[#fafaf9] border border-[#eee] rounded-xl space-y-2">
                        <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider">Accumulated Impressions</span>
                        <p className="text-xl font-display font-black text-[#1a1a1a]">142,940 hits</p>
                        <p className="text-[10px] text-[#888] font-bold">This billing cycle</p>
                      </div>
                      <div className="p-4 bg-[#fafaf9] border border-[#eee] rounded-xl space-y-2">
                        <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider">Active Triggers Rate</span>
                        <p className="text-xl font-display font-black text-emerald-600">89.4%</p>
                        <p className="text-[10px] text-[#888] font-bold">Match validity target score</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Dynamic Lifecycle Timeline</h3>
                      <div className="border border-stone-100 rounded-xl overflow-hidden text-[12px]">
                        <div className="grid grid-cols-3 bg-stone-50 p-3 font-bold uppercase text-[#888] border-b border-stone-100">
                          <span>Partner Campaign Name</span>
                          <span>Rotation Tier</span>
                          <span className="text-right">Execution Status</span>
                        </div>
                        {businesses.filter(b => b.campaignsCount > 0).map((biz) => (
                          <div key={biz.id} className="grid grid-cols-3 p-3 border-b border-stone-50 items-center">
                            <span className="font-bold text-[#1a1a1a]">{biz.name} Campaign Pool</span>
                            <span>
                              <span className="bg-orange-50 text-[#f97316] font-bold text-[9px] px-2 py-0.5 rounded-full border border-orange-100">
                                {biz.partnerTier}
                              </span>
                            </span>
                            <span className="text-right text-emerald-600 font-bold">ACTIVE</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 6: GAMIFICATION ORCHESTRATOR ─── */}
              {activeTab === 'gamification' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Ecosystem Core</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Gamification & Cooldown Rules</h1>
                    <p className="text-[#888] text-[13px]">Define spin limitations per consumer IP and adjust verification cooldowns.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Engagement Cooldown Settings</h3>
                      <div className="space-y-4 text-[12px]">
                        <div className="space-y-2">
                          <label className="font-bold text-[#555] block">Default Spin Cooldown Interval (Hours)</label>
                          <input type="number" defaultValue="24" className="w-full bg-[#fafaf9] border border-[#eee] rounded-xl px-4 py-2 text-[#1a1a1a] font-mono outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="font-bold text-[#555] block">Max Spins per Local IP / Daily limit</label>
                          <input type="number" defaultValue="3" className="w-full bg-[#fafaf9] border border-[#eee] rounded-xl px-4 py-2 text-[#1a1a1a] font-mono outline-none" />
                        </div>
                        <button className="bg-[#1a1a1a] text-white text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl w-full hover:bg-[#f97316] transition-colors">
                          Apply Cooldown Directives
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Gamified Experience Templates</h3>
                      <div className="space-y-2.5 text-[12px]">
                        <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-bold text-[#1a1a1a]">Strategic Spin Wheel (Default)</p>
                            <p className="text-[10px] text-[#f97316]">Active on landing & customer hub pages</p>
                          </div>
                          <span className="bg-[#f97316] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                        </div>

                        <div className="p-3 border border-stone-100 rounded-xl flex justify-between items-center opacity-60">
                          <div>
                            <p className="font-bold text-[#1a1a1a]">Scratch & Reveal Voucher</p>
                            <p className="text-[10px] text-[#888]">Scheduled release for seasonal promotions</p>
                          </div>
                          <span className="text-[9px] text-[#888] font-bold uppercase">Disabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 7: REWARD OVERSIGHT ─── */}
              {activeTab === 'rewards' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Reward Infrastructure</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Platform Reward Allocation Database</h1>
                    <p className="text-[#888] text-[13px]">Track claimed voucher hashes, expiration parameters, and client allocation status.</p>
                  </div>

                  <div className="bg-white border border-[#eee] rounded-2xl shadow-sm overflow-hidden text-[12px]">
                    <div className="p-4 border-b border-[#eee] bg-[#fafaf9] flex justify-between items-center">
                      <span className="font-bold text-[#1a1a1a]">Voucher Redemptions Registry</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold">100% AUDITED</span>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-100 text-[#888] font-bold uppercase tracking-wider">
                          <th className="p-3 pl-6">Voucher code hash</th>
                          <th className="p-3">Partner Merchant</th>
                          <th className="p-3">Reward Value</th>
                          <th className="p-3">Claim Status</th>
                          <th className="p-3 text-right pr-6">Expiry Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-stone-50">
                          <td className="p-3 pl-6 font-mono text-[#f97316] font-semibold">MCS-MERIDIAN-20-DISC</td>
                          <td className="p-3 font-semibold text-[#1a1a1a]">Meridian Apparel</td>
                          <td className="p-3 font-semibold">20% Off Session</td>
                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-100">REDEEMED</span>
                          </td>
                          <td className="p-3 text-right pr-6 font-mono text-[#888]">2026-06-30</td>
                        </tr>
                        <tr className="border-b border-stone-50">
                          <td className="p-3 pl-6 font-mono text-[#f97316] font-semibold">MCS-ELARA-DETOX-FAC</td>
                          <td className="p-3 font-semibold text-[#1a1a1a]">Elara Wellness</td>
                          <td className="p-3 font-semibold">Free Detox Facial</td>
                          <td className="p-3">
                            <span className="bg-orange-50 text-[#f97316] px-2 py-0.5 rounded-full text-[9px] font-bold border border-orange-100">CLAIMED</span>
                          </td>
                          <td className="p-3 text-right pr-6 font-mono text-[#888]">2026-07-15</td>
                        </tr>
                        <tr className="border-b border-stone-50">
                          <td className="p-3 pl-6 font-mono text-[#f97316] font-semibold">MCS-VANTAGE-CHARGER</td>
                          <td className="p-3 font-semibold text-[#1a1a1a]">Vantage Electronics</td>
                          <td className="p-3 font-semibold">Free Charger Adapter</td>
                          <td className="p-3">
                            <span className="bg-orange-50 text-[#f97316] px-2 py-0.5 rounded-full text-[9px] font-bold border border-orange-100">CLAIMED</span>
                          </td>
                          <td className="p-3 text-right pr-6 font-mono text-[#888]">2026-06-15</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── TAB 8: PROBABILITY & LOGIC ─── */}
              {activeTab === 'probability' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Ecosystem Governor</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Outcome Weight Balancing</h1>
                    <p className="text-[#888] text-[13px]">Tweak weighted values on the fly. The live preview distribution recalibrates instantly.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Live Recharts preview */}
                    <div className="bg-white border border-[#eee] rounded-2xl p-6 lg:col-span-2 space-y-4 shadow-sm flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#1a1a1a]">Expected Outcome Probability Spread</h3>
                        <p className="text-[11px] text-[#888]">Live bar chart preview generated instantly from sector weights.</p>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={probabilities}>
                            <XAxis dataKey="rewardName" stroke="#888" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={9} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #eee' }} />
                            <Bar dataKey="currentWeight" fill="#f97316" radius={[6, 6, 0, 0]}>
                              {probabilities.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Weight Sliders panel */}
                    <div className="bg-white border border-[#eee] rounded-2xl p-6 space-y-4 shadow-sm">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Dynamic Probability Adjusters</h3>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {probabilities.map((prob) => (
                          <div key={prob.id} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-[#1a1a1a]">
                              <span>{prob.rewardName}</span>
                              <span className="font-mono text-[#f97316]">{prob.currentWeight}W</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={prob.currentWeight}
                              onChange={(e) => setProbabilityWeight(prob.id, parseInt(e.target.value))}
                              className="w-full h-1.5 bg-[#f5f5f3] rounded-lg appearance-none cursor-pointer accent-[#f97316]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 9: ROTATION SPOTLIGHT ─── */}
              {activeTab === 'spotlight' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Orchestrator Scheduler</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Spotlight Rotation Calendar</h1>
                    <p className="text-[#888] text-[13px]">Define spotlight campaign weight allocation targets across days of the week.</p>
                  </div>

                  <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#1a1a1a]">Weekly Partner Spotlight Allocation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {spotlights.map((spot) => (
                        <div key={spot.id} className="p-4 bg-[#fafaf9] border border-[#eee] rounded-2xl space-y-3 relative">
                          <Star className="absolute top-3.5 right-3.5 w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                          <div>
                            <span className="text-[10px] text-[#f97316] font-bold uppercase tracking-wider">{spot.day}</span>
                            <h4 className="text-[13px] font-bold text-[#1a1a1a] mt-0.5">{spot.businessName}</h4>
                            <p className="text-[10px] text-[#888] leading-tight mt-1">{spot.campaignName}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-[#1a1a1a]">
                              <span>Visibility weight:</span>
                              <span>{spot.weight}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={spot.weight}
                              onChange={(e) => updateSpotlightWeight(spot.id, parseInt(e.target.value))}
                              className="w-full h-1 bg-[#eee] rounded appearance-none accent-[#f97316]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 10: LEAD ROUTING ─── */}
              {activeTab === 'routing' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Ecosystem Funnel</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Intelligent Lead Routing pipeline</h1>
                    <p className="text-[#888] text-[13px]">Track customer verification leads routed dynamically to verified merchant systems.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1: Captured */}
                    <div className="bg-white border border-[#eee] rounded-2xl p-4 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]">1. Captured Gateway Leads</span>
                        <span className="bg-orange-50 text-[#f97316] text-[9px] font-bold px-1.5 py-0.5 rounded">4 active</span>
                      </div>
                      <div className="space-y-2.5 text-[12px]">
                        <div className="p-3 bg-[#fafaf9] border border-stone-200/50 rounded-xl space-y-1.5">
                          <p className="font-bold text-[#1a1a1a]">David K.</p>
                          <p className="text-[10px] text-[#888]">Captured via Luxury Apparel Spin</p>
                        </div>
                        <div className="p-3 bg-[#fafaf9] border border-stone-200/50 rounded-xl space-y-1.5">
                          <p className="font-bold text-[#1a1a1a]">Elena R.</p>
                          <p className="text-[10px] text-[#888]">Captured via Wellness Priority Booking</p>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: In-Transit */}
                    <div className="bg-white border border-[#eee] rounded-2xl p-4 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]">2. Matching / Verification</span>
                        <span className="bg-orange-50 text-[#f97316] text-[9px] font-bold px-1.5 py-0.5 rounded">2 active</span>
                      </div>
                      <div className="space-y-2.5 text-[12px]">
                        <div className="p-3 bg-orange-50/20 border border-orange-100 rounded-xl space-y-1">
                          <p className="font-bold text-[#f97316]">Marcus T.</p>
                          <p className="text-[10px] text-[#ea580c] font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                            Synchronizing API Webhooks
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Delivered */}
                    <div className="bg-white border border-[#eee] rounded-2xl p-4 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a1a1a]">3. Delivered CRM Node</span>
                        <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded">142 completed</span>
                      </div>
                      <div className="space-y-2.5 text-[12px] opacity-70">
                        <div className="p-3 bg-emerald-50/10 border border-emerald-100 rounded-xl space-y-1">
                          <p className="font-bold text-emerald-600">Sarah J.</p>
                          <p className="text-[10px] text-[#888]">Successfully pushed to Meridian CRM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 11: STOREFRONT PREVIEWS ─── */}
              {activeTab === 'storefront' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Partner Sandbox</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Storefront Widget preview sandbox</h1>
                    <p className="text-[#888] text-[13px]">Preview responsive widgets in simulated partner storefront containers.</p>
                  </div>

                  <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1 space-y-4 text-[12px]">
                        <h3 className="text-sm font-bold text-[#1a1a1a]">Client Embed Script Configurations</h3>
                        <div className="p-4 bg-stone-900 text-[#fdba74] font-mono rounded-xl border border-stone-800 overflow-x-auto text-[11px]">
                          <code>
                            {`<!-- MComSpin Gamified Engagement Embed -->\n`}
                            {`<script \n`}
                            {`  src="https://cdn.mcomspin.io/widget.v1.js" \n`}
                            {`  data-client-id="mcs_live_920x841a" \n`}
                            {`  data-theme="light" \n`}
                            {`  data-position="bottom-right">\n`}
                            {`</script>`}
                          </code>
                        </div>
                        <p className="text-[#888] leading-relaxed text-[11px]">
                          Paste this lightweight asynchronous script tag into partner store HTML layouts to instantiate the high-fidelity floating widget.
                        </p>
                      </div>

                      <div className="w-full lg:w-[320px] bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col justify-between h-56 select-none relative">
                        <span className="text-[10px] text-[#888] font-bold block uppercase tracking-wider">Simulated Checkout Simulator</span>
                        <div className="border border-stone-200/50 bg-white rounded-xl p-3 text-center my-auto space-y-1">
                          <p className="font-bold text-[12px]">Luxury Silk Scarf</p>
                          <p className="text-[10px] text-[#888]">$120.00 USD</p>
                        </div>
                        {/* Simulated widget anchor */}
                        <div className="absolute bottom-3 right-3 bg-[#f97316] text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md cursor-pointer animate-bounce">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 12: AUTOMATION RULES ─── */}
              {activeTab === 'automation' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Automation Core</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Dynamic Trigger Rules Configuration</h1>
                    <p className="text-[#888] text-[13px]">Define backend automated routing logic nodes to keep the platform hyper-active.</p>
                  </div>

                  <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#1a1a1a]">Trigger-Condition-Action Directives</h3>
                    <div className="space-y-3 text-[12px]">
                      <div className="p-3 bg-[#fafaf9] border border-[#eee] rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#1a1a1a]">
                            If <span className="text-[#f97316]">Reward Unlocked</span> <ArrowRight className="w-3 h-3 inline align-middle mx-1 text-[#888]" /> Then <span className="text-[#f97316]">Trigger SMS verification alert</span>
                          </p>
                          <p className="text-[10px] text-[#888]">Interval cap: 5 minutes. Active since launch.</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded text-[10px]">ACTIVE</span>
                      </div>

                      <div className="p-3 bg-[#fafaf9] border border-[#eee] rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#1a1a1a]">
                            If <span className="text-[#f97316]">Customer completes dining scan</span> <ArrowRight className="w-3 h-3 inline align-middle mx-1 text-[#888]" /> Then <span className="text-[#f97316]">Spotlight partner dining campaign</span>
                          </p>
                          <p className="text-[10px] text-[#888]">Weight sync target: +15%. Active since launch.</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded text-[10px]">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 13: ANALYTICS & INTELLIGENCE ─── */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Telemetry Intelligence</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Conversion Analytics Telemetry</h1>
                    <p className="text-[#888] text-[13px]">Track platform match success ratios and real-time revenue distributions.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Match Success Ratio Trends</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                            <Line type="monotone" dataKey="leads" stroke="#f97316" strokeWidth={2.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Accumulated Platform Revenue Velocity</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceData}>
                            <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                            <Line type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 14: FRAUD & RISK ─── */}
              {activeTab === 'risk' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Security Intelligence</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Threat Prevention Center</h1>
                    <p className="text-[#888] text-[13px]">Secure active networks, configure fraud flags, and apply client restrictions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#eee] rounded-2xl p-5 shadow-sm space-y-2">
                      <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider block">Local Network Violations</span>
                      <p className="text-xl font-display font-black text-red-500">1 Incident</p>
                      <p className="text-[10px] text-[#888] font-bold">Unresolved block queue status</p>
                    </div>

                    <div className="bg-white border border-[#eee] rounded-2xl p-5 shadow-sm space-y-2">
                      <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider block">Global Spam Index</span>
                      <p className="text-xl font-display font-black text-emerald-600">0.02%</p>
                      <p className="text-[10px] text-emerald-600 font-bold">● Far within normal limits</p>
                    </div>

                    <div className="bg-white border border-[#eee] rounded-2xl p-5 shadow-sm space-y-2">
                      <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider block">Blacklisted IP subnets</span>
                      <p className="text-xl font-display font-black text-[#1a1a1a]">4 Subnets</p>
                      <p className="text-[10px] text-[#888] font-bold">Assigned at gateway router</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 15: ALERTS CENTER ─── */}
              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Platform Governance</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">System Governance & Alerts Center</h1>
                    <p className="text-[#888] text-[13px]">Review live warnings from the WAF Shield and quickly apply corrective bans.</p>
                  </div>

                  <div className="bg-white border border-[#eee] rounded-2xl shadow-sm overflow-hidden text-[12px]">
                    <div className="p-4 border-b border-[#eee] bg-stone-50 flex justify-between items-center">
                      <span className="font-bold text-[#1a1a1a]">Unresolved Threat Ledger</span>
                      <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold">
                        {securityAlerts.filter(a => a.status === 'unresolved').length} Active Spikes
                      </span>
                    </div>

                    <div className="divide-y divide-stone-100">
                      {securityAlerts.map((alert) => (
                        <div key={alert.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
                          <div className="flex gap-3 items-start">
                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              alert.severity === 'high' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                            }`} />
                            <div>
                              <p className="font-bold text-[#1a1a1a] flex items-center gap-2">
                                {alert.businessName}
                                <span className={`text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.2 rounded border ${
                                  alert.severity === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                  {alert.severity}
                                </span>
                              </p>
                              <p className="text-[#888] text-[11px] mt-0.5">{alert.pattern}</p>
                              <p className="text-[9px] text-[#bbb] font-bold mt-1 font-mono">{alert.timestamp}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-end md:self-auto">
                            {alert.status === 'unresolved' ? (
                              <>
                                <button
                                  onClick={() => resolveAlert(alert.id)}
                                  className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase px-3.5 py-1.5 rounded-full transition-all shadow-sm"
                                >
                                  Resolve Incident
                                </button>
                                <button
                                  onClick={() => dismissAlert(alert.id)}
                                  className="text-[10px] bg-stone-100 hover:bg-stone-200 border border-stone-200 text-[#555] font-bold uppercase px-3.5 py-1.5 rounded-full transition-all"
                                >
                                  Dismiss
                                </button>
                              </>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-stone-400 font-extrabold uppercase tracking-widest bg-stone-50 border border-stone-200/50 px-3 py-1 rounded-full">
                                Resolved <Check className="w-2.5 h-2.5 text-stone-400" />
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 16: REVENUE CONTROL ─── */}
              {activeTab === 'revenue' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-0.5">Billing Oversight</p>
                    <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#1a1a1a]">Revenue Ledger & platform fees</h1>
                    <p className="text-[#888] text-[13px]">Track transaction commission payouts and dynamic business tier invoicing.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Accumulated Billing Logs</h3>
                      <div className="space-y-3 text-[12px]">
                        <div className="p-3 bg-[#fafaf9] border border-[#eee] rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-bold text-[#1a1a1a]">Meridian Apparel billing ledger</p>
                            <p className="text-[10px] text-[#888]">Monthly SaaS recurring + 2% transaction commission</p>
                          </div>
                          <span className="font-mono font-bold text-[#1a1a1a]">$1,240.80</span>
                        </div>

                        <div className="p-3 bg-[#fafaf9] border border-[#eee] rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-bold text-[#1a1a1a]">Elara Wellness billing ledger</p>
                            <p className="text-[10px] text-[#888]">Monthly SaaS recurring + 2% transaction commission</p>
                          </div>
                          <span className="font-mono font-bold text-[#1a1a1a]">$842.10</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#1a1a1a]">Fee Percentage configurations</h3>
                        <p className="text-[11px] text-[#888] leading-relaxed mt-1">
                          Dynamic transaction cuts are set to a baseline platform value of <span className="font-bold text-[#f97316]">2.00%</span>. Tier updates apply next billing cycle.
                        </p>
                      </div>
                      <button className="bg-[#1a1a1a] text-white text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl w-full hover:bg-[#f97316] transition-colors">
                        Tweak Global Ledger Parameters
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 4. RIGHT CONTEXTUAL INSPECTOR DRAWER */}
      <AnimatePresence>
        {activeInspectorId && inspector && (
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white border-l border-[#eee] h-full shadow-2xl z-30 flex flex-col justify-between shrink-0"
          >
            <div>
              {/* Header Title */}
              <div className="p-6 border-b border-[#eee] flex justify-between items-center bg-[#fafaf9]">
                <div>
                  <span className="text-[10px] text-[#f97316] font-bold uppercase tracking-wider">Governer Node</span>
                  <h3 className="text-sm font-bold text-[#1a1a1a] mt-0.5">Deep Inspector</h3>
                </div>
                <button
                  onClick={() => setInspector(null, null)}
                  className="text-stone-400 hover:text-[#1a1a1a] p-1.5 hover:bg-stone-100 rounded-full transition-all"
                  aria-label="Close Inspector"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Inspector Content */}
              <div className="p-6 space-y-6 text-[12px]">
                {activeInspectorType === 'business' && (
                  <>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-orange-100 text-[#f97316] flex items-center justify-center font-display font-extrabold text-sm mx-auto shadow-sm">
                        {(inspector as AdminBusiness).avatar}
                      </div>
                      <h4 className="font-extrabold text-sm text-[#1a1a1a] leading-tight">{(inspector as AdminBusiness).name}</h4>
                      <p className="text-[10px] text-[#888]">{(inspector as AdminBusiness).email}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3 space-y-2 font-medium">
                        <div className="flex justify-between">
                          <span className="text-[#888]">Owner Account:</span>
                          <span className="font-bold text-[#1a1a1a]">{(inspector as AdminBusiness).owner}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888]">Active Tier:</span>
                          <span className="font-bold text-[#f97316]">{(inspector as AdminBusiness).partnerTier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888]">Onboarded:</span>
                          <span className="font-bold text-[#1a1a1a] font-mono">{(inspector as AdminBusiness).registrationDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#888]">Ecosystem status:</span>
                          <span className="font-bold uppercase tracking-wider text-emerald-600">{(inspector as AdminBusiness).status}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl text-[11px] leading-relaxed text-[#f97316] font-medium flex gap-2 items-start">
                        <Shield className="w-4 h-4 mt-0.5 shrink-0 text-[#f97316]" />
                        <span>Governance measures enforce automatic limit locks should threat factors exceed baseline metrics.</span>
                      </div>
                    </div>
                  </>
                )}

                {activeInspectorType === 'probability' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-[#1a1a1a]">{(inspector as ProbabilitySegment).rewardName}</h4>
                    <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#888]">Merchant:</span>
                        <span className="font-bold">{(inspector as ProbabilitySegment).provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888]">Allocated Today:</span>
                        <span className="font-bold">{(inspector as ProbabilitySegment).allocatedToday} / {(inspector as ProbabilitySegment).capPerDay}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick action footer */}
            <div className="p-4 border-t border-[#eee] bg-[#fafaf9]">
              <button
                onClick={() => setInspector(null, null)}
                className="w-full bg-[#1a1a1a] text-white hover:bg-[#f97316] text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all"
              >
                Close Audit Logs
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ONBOARDING ADD-BUSINESS MODAL ─── */}
      <AnimatePresence>
        {showAddBizModal && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-white rounded-3xl border border-[#eee] shadow-2xl p-8 space-y-6"
            >
              <div>
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#f97316] uppercase mb-0.5">Platform Governance</p>
                <h3 className="text-xl font-display font-extrabold text-[#1a1a1a]">Onboard New Merchant Node</h3>
                <p className="text-[#888] text-[12px]">Verify credentials to spin up active promotion routing blocks.</p>
              </div>

              <form onSubmit={handleAddNewBusiness} className="space-y-4 text-[12px]">
                <div className="space-y-1">
                  <label className="font-bold text-[#555]">Business Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nebula Coffee Labs"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    className="w-full bg-stone-50 border border-[#eee] rounded-xl px-4 py-2 text-[#1a1a1a] font-medium outline-none focus:border-[#f97316] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#555]">Administrator Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. support@nebulacoffee.com"
                    value={newBizEmail}
                    onChange={(e) => setNewBizEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-[#eee] rounded-xl px-4 py-2 text-[#1a1a1a] font-medium outline-none focus:border-[#f97316] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#555]">Account Owner</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cassandra Croft"
                    value={newBizOwner}
                    onChange={(e) => setNewBizOwner(e.target.value)}
                    className="w-full bg-stone-50 border border-[#eee] rounded-xl px-4 py-2 text-[#1a1a1a] font-medium outline-none focus:border-[#f97316] focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-[#555]">Category Area</label>
                    <select
                      value={newBizCategory}
                      onChange={(e) => setNewBizCategory(e.target.value)}
                      className="w-full bg-stone-50 border border-[#eee] rounded-xl px-3 py-2 text-[#1a1a1a] font-medium outline-none focus:border-[#f97316] focus:bg-white transition-all"
                    >
                      <option value="Luxury Fashion">Luxury Fashion</option>
                      <option value="Spa Services">Spa Services</option>
                      <option value="Consumer Tech">Consumer Tech</option>
                      <option value="Hospitality">Hospitality</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#555]">Partner Tier</label>
                    <select
                      value={newBizTier}
                      onChange={(e) => setNewBizTier(e.target.value as any)}
                      className="w-full bg-stone-50 border border-[#eee] rounded-xl px-3 py-2 text-[#1a1a1a] font-medium outline-none focus:border-[#f97316] focus:bg-white transition-all"
                    >
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBizModal(false)}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-[#555] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#1a1a1a] hover:bg-[#f97316] text-white font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md"
                  >
                    Submit Node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
