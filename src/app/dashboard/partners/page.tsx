'use client';

import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Users2, Zap, Gift, TrendingUp, Lock, ShieldCheck } from 'lucide-react';

/* ─── mock data ─── */
const overviewStats = [
  { label: 'Total Partners',       value: '4',        icon: 'users', delta: '+1 this quarter',   color: 'bg-orange-50 text-orange-600' },
  { label: 'Active Contributors',  value: '3',        icon: 'zap', delta: '75% contributing',  color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Shared Pool Size',     value: '156',      icon: 'gift', delta: 'Rewards available',  color: 'bg-violet-50 text-violet-600' },
  { label: 'Ecosystem Revenue',    value: '£162,890', icon: 'trending', delta: '+18% vs last month', color: 'bg-sky-50 text-sky-600' },
];

const getIcon = (type: string, className = "w-5 h-5") => {
  switch (type) {
    case 'users': return <Users2 className={className} />;
    case 'zap': return <Zap className={className} />;
    case 'gift': return <Gift className={className} />;
    case 'trending': return <TrendingUp className={className} />;
    default: return null;
  }
};

const healthBadge: Record<string, string> = {
  Excellent: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  Good:      'bg-amber-50 text-amber-600 border border-amber-200',
  Fair:      'bg-stone-100 text-stone-600 border border-stone-200',
};

const partners = [
  {
    name: 'Meridian Apparel',
    category: 'Luxury Fashion',
    initials: 'MA',
    initialsColor: 'bg-rose-100 text-rose-600',
    leads: 412,
    revenue: '£32,490',
    contributions: 38,
    health: 'Excellent',
  },
  {
    name: 'Elara Wellness',
    category: 'Spa Services',
    initials: 'EW',
    initialsColor: 'bg-teal-100 text-teal-600',
    leads: 589,
    revenue: '£45,800',
    contributions: 52,
    health: 'Excellent',
  },
  {
    name: 'Vantage Electronics',
    category: 'Consumer Tech',
    initials: 'VE',
    initialsColor: 'bg-indigo-100 text-indigo-600',
    leads: 304,
    revenue: '£21,900',
    contributions: 27,
    health: 'Good',
  },
  {
    name: 'Soleil Dining Group',
    category: 'Hospitality',
    initials: 'SD',
    initialsColor: 'bg-amber-100 text-amber-600',
    leads: 622,
    revenue: '£62,700',
    contributions: 39,
    health: 'Excellent',
  },
];

const pieColors = ['#f97316', '#14b8a6', '#6366f1', '#f59e0b'];

const pieData = partners.map((p) => ({
  name: p.name,
  value: p.contributions,
}));

/* ─── custom legend ─── */
const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-2">
      {payload?.map((entry: any, i: number) => (
        <li key={i} className="flex items-center gap-1.5 text-[12px] text-[#555]">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

/* ─── component ─── */
export default function PartnersPage() {
  const [inviteEmail, setInviteEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#fafaf9] px-4 py-10 sm:px-8 lg:px-12">
      {/* ── header ── */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Partner Ecosystem</p>
        <h1 className="text-2xl font-display font-bold text-[#1a1a1a]">Your Business Network</h1>
        <p className="text-[#888] text-[13px] mt-1">Collaborate with partners, share reward pools, and grow your engagement ecosystem together.</p>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewStats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              {getIcon(s.icon)}
            </span>
            <div>
              <p className="text-[#888] text-[11px] font-semibold tracking-wide uppercase">{s.label}</p>
              <p className="text-2xl font-display font-bold text-[#1a1a1a] mt-0.5">{s.value}</p>
              <p className="text-[#aaa] text-[12px] mt-0.5">{s.delta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── partner cards ── */}
      <div className="mb-8">
        <h2 className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-4">Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {partners.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl border border-[#eee] shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col gap-4">
              {/* top */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[15px] font-bold ${p.initialsColor}`}>
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-display font-semibold text-[#1a1a1a] truncate">{p.name}</h3>
                  <p className="text-[12px] text-[#888]">{p.category}</p>
                </div>
                <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full ${healthBadge[p.health]}`}>
                  {p.health}
                </span>
              </div>

              {/* metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#fafaf9] rounded-xl p-3 text-center">
                  <p className="text-[10px] text-[#888] uppercase tracking-wide font-semibold">Leads</p>
                  <p className="text-[17px] font-display font-bold text-[#1a1a1a] mt-0.5">{p.leads.toLocaleString()}</p>
                </div>
                <div className="bg-[#fafaf9] rounded-xl p-3 text-center">
                  <p className="text-[10px] text-[#888] uppercase tracking-wide font-semibold">Revenue</p>
                  <p className="text-[17px] font-display font-bold text-[#1a1a1a] mt-0.5">{p.revenue}</p>
                </div>
                <div className="bg-[#fafaf9] rounded-xl p-3 text-center">
                  <p className="text-[10px] text-[#888] uppercase tracking-wide font-semibold">Contrib.</p>
                  <p className="text-[17px] font-display font-bold text-[#1a1a1a] mt-0.5">{p.contributions}</p>
                </div>
              </div>

              {/* view details */}
              <button className="w-full py-2.5 text-[12px] font-semibold text-[#f97316] bg-orange-50 rounded-xl hover:bg-orange-100 active:scale-[.98] transition-all cursor-pointer">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── bottom row: chart + invite ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* contribution chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#eee] shadow-sm p-6 flex flex-col">
          <h2 className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Contribution Analytics</h2>
          <p className="text-[#888] text-[12px] mb-4">Reward contributions by partner</p>

          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #eee',
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,.06)',
                  }}
                  formatter={(value: any) => [`${value} rewards`, 'Contributions']}
                />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* invite partner */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#eee] shadow-sm p-6 flex flex-col">
          <h2 className="text-[10px] font-bold tracking-[0.15em] text-[#f97316] uppercase mb-1">Invite a Partner</h2>
          <p className="text-[#888] text-[12px] mb-6">Send an invitation to join your partner ecosystem and start sharing rewards.</p>

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-wide">Partner Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="partner@company.com"
                className="rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#888] uppercase tracking-wide">Personal Note (optional)</label>
              <textarea
                rows={3}
                placeholder="Hi — we'd love to partner on our engagement platform…"
                className="rounded-xl border border-[#e5e5e5] px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder:text-[#ccc] resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition"
              />
            </div>

            <button className="mt-auto w-full px-8 py-3 bg-[#f97316] text-white text-[13px] font-bold tracking-wide rounded-xl hover:bg-[#ea6c10] active:scale-[.98] transition-all shadow-sm cursor-pointer">
              Send Invitation
            </button>
          </div>

          {/* decorative trust badges */}
          <div className="mt-6 pt-4 border-t border-[#f3f3f0] flex items-center gap-3 text-[11px] text-[#bbb]">
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-[#bbb]" /> Encrypted</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-[#bbb]" /> GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
