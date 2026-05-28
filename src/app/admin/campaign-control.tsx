'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Users,
  Target,
  Gift,
  Zap,
  TrendingUp,
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  LayoutGrid
} from 'lucide-react';

/* ─── UI COMPONENTS ─── */
const ToggleSwitch = ({ active }: { active: boolean }) => (
  <div className={`w-9 h-5 rounded-full p-1 transition-colors duration-200 ${active ? 'bg-green-500' : 'bg-stone-200'}`}>
    <motion.div
      animate={{ x: active ? 16 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-3 h-3 bg-white rounded-full shadow-sm"
    />
  </div>
);

const Card = ({ children, title }: { children: React.ReactNode, title?: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
    {title && <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-6">{title}</h3>}
    {children}
  </div>
);

const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode, variant?: 'neutral' | 'green' | 'red' | 'yellow' }) => {
  const styles = {
    neutral: 'bg-stone-100 text-stone-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-amber-50 text-amber-700',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[variant]}`}>{children}</span>;
};

/* ─── MAIN COMPONENT ─── */
export const CampaignControl = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [promoStates, setPromoStates] = useState<Record<string, boolean>>({
    'Boost Rewards': true,
    'High Street Promo': true,
    'Event Promo': true,
    'Featured': true,
  });

  const togglePromo = (item: string) => {
    setPromoStates(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const tabs = [
    { id: 'active', label: 'Active Campaigns', icon: LayoutGrid },
    { id: 'sponsored', label: 'Sponsored Campaigns', icon: Zap },
    { id: 'inventory', label: 'Reward Inventory', icon: Gift },
    { id: 'ethical', label: 'Ethical Monitoring', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#1a1a1a] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[400px]"
      >
        {activeTab === 'active' && (
          <Card title="Currently Running Campaigns">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase text-stone-500 border-b border-stone-100">
                  <th className="pb-4">Campaign</th>
                  <th className="pb-4">Business</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Priority</th>
                  <th className="pb-4">Inventory</th>
                  <th className="pb-4">Engagement</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-stone-800">
                {[
                  { name: 'Summer Fresh', business: 'MCOM Barber', type: 'Growth', priority: 'High', inv: 75, eng: 'High' },
                  { name: 'Tech Blitz', business: 'Downtown Retail', type: 'Blitz', priority: 'Med', inv: 30, eng: 'Med' },
                ].map((camp, i) => (
                  <tr key={i} className="border-b border-stone-50 hover:bg-stone-50">
                    <td className="py-4 font-bold">{camp.name}</td>
                    <td className="py-4">{camp.business}</td>
                    <td className="py-4">{camp.type}</td>
                    <td className="py-4"><Badge variant={camp.priority === 'High' ? 'red' : 'yellow'}>{camp.priority}</Badge></td>
                    <td className="py-4 w-32"><div className="w-full bg-stone-100 rounded-full h-1.5"><div className="bg-[#1a1a1a] h-1.5 rounded-full" style={{ width: `${camp.inv}%`}} /></div></td>
                    <td className="py-4">{camp.eng}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {activeTab === 'sponsored' && (
          <div className="grid grid-cols-2 gap-6">
            <Card title="Promotional Controls">
                <div className="space-y-4">
                    {['Boost Rewards', 'High Street Promo', 'Event Promo', 'Featured'].map(item => (
                        <div 
                            key={item} 
                            onClick={() => togglePromo(item)}
                            className="flex justify-between items-center p-4 border border-stone-100 rounded-xl bg-stone-50 cursor-pointer hover:border-stone-200 transition-colors"
                        >
                            <span className="text-xs font-bold text-stone-700">{item}</span>
                            <ToggleSwitch active={promoStates[item]} />
                        </div>
                    ))}
                </div>
            </Card>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <Card title="Inventory Distribution">
                <div className="space-y-4">
                  {[
                    { label: 'Platform Rewards', value: 42, color: 'stone' },
                    { label: 'Sponsored Pool', value: 128, color: 'green' },
                    { label: 'Global Inventory', value: 856, color: 'blue' },
                    { label: 'Youth Focused', value: 214, color: 'amber' },
                    { label: 'Mall Distribution', value: 95, color: 'purple' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-stone-500">
                        <span>{stat.label}</span>
                        <span>{stat.value} units</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1">
                        <div 
                          className={`bg-stone-800 h-1 rounded-full transition-all`} 
                          style={{ width: `${(stat.value / 1000) * 100}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="col-span-2">
                <Card title="Add New Reward to Inventory">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Reward Name</label>
                        <input type="text" placeholder="e.g. Summer Discount" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Reward Type</label>
                        <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400">
                          <option>Platform Reward</option>
                          <option>Sponsored Reward</option>
                          <option>Global Campaign</option>
                          <option>Youth Reward</option>
                          <option>Mall Reward</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Initial Quantity</label>
                        <input type="number" placeholder="100" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Category</label>
                        <select className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400">
                          <option>Coupon</option>
                          <option>Discount</option>
                          <option>Service</option>
                          <option>Product</option>
                        </select>
                      </div>
                    </div>
                    <button className="col-span-2 bg-[#1a1a1a] text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2">
                      <Gift className="w-3.5 h-3.5" />
                      Initialize Reward Injection
                    </button>
                  </div>
                </Card>
              </div>
            </div>

            <Card title="Current Global Inventory Pool">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase text-stone-500 border-b border-stone-100">
                    <th className="pb-4">Reward</th>
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">In Stock</th>
                    <th className="pb-4">Allocated</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-stone-800">
                  {[
                    { name: 'MCOM VIP Pass', type: 'Platform', cat: 'Voucher', stock: 42, alloc: '85%', status: 'Active' },
                    { name: 'Red Bull Sponsor', type: 'Sponsored', cat: 'Product', stock: 128, alloc: '40%', status: 'Live' },
                    { name: 'Youth Summer Fun', type: 'Youth', cat: 'Discount', stock: 214, alloc: '12%', status: 'Pending' },
                    { name: 'City Mall Voucher', type: 'Mall', cat: 'Coupon', stock: 95, alloc: '95%', status: 'Low Stock' },
                  ].map((item, i) => (
                    <tr key={i} className="border-b border-stone-50 hover:bg-stone-50">
                      <td className="py-4 font-bold">{item.name}</td>
                      <td className="py-4">{item.type}</td>
                      <td className="py-4 text-stone-500">{item.cat}</td>
                      <td className="py-4">{item.stock}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-400">{item.alloc}</span>
                          <div className="w-12 bg-stone-100 rounded-full h-1">
                            <div className="bg-[#1a1a1a] h-1 rounded-full" style={{ width: item.alloc }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant={item.status === 'Active' || item.status === 'Live' ? 'green' : item.status === 'Low Stock' ? 'red' : 'yellow'}>
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {activeTab === 'ethical' && (
          <Card title="Threat Monitoring Dashboard">
            <div className="space-y-4">
                {[
                    { title: 'Suspicious Reward Patterns', status: 'Warning', severity: 'yellow' },
                    { title: 'Over-Manipulation Detected', status: 'Critical', severity: 'red' },
                    { title: 'IP Abuse Indicators', status: 'Clean', severity: 'green' },
                ].map(threat => (
                    <div key={threat.title} className="flex justify-between items-center p-4 border border-stone-100 rounded-xl">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className={`w-4 h-4 text-${threat.severity}-500`} />
                            <span className="text-xs font-bold">{threat.title}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant={threat.severity === 'red' ? 'red' : threat.severity === 'yellow' ? 'yellow' : 'green'}>{threat.status}</Badge>
                            <button className="text-[10px] text-red-600 font-bold flex items-center gap-1"><Ban className="w-3 h-3"/> Ban User</button>
                        </div>
                    </div>
                ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};
