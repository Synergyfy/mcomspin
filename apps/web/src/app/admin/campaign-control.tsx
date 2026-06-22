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
import {
  useAdminCampaigns,
  useAdminRewards,
  useCreateAdminReward
} from '@/services/admin';

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

  const campaignsQuery = useAdminCampaigns();
  const rewardsQuery = useAdminRewards();

  const campaignList = campaignsQuery.data?.data ?? campaignsQuery.data ?? [];
  const rewardList = rewardsQuery.data?.data ?? rewardsQuery.data ?? [];

  const [newReward, setNewReward] = useState({
    name: '',
    type: 'Discount',
    value: '10.00',
    currency: 'GBP',
    category: 'Coupon',
    initialQuantity: 100,
  });

  const createRewardMutation = useCreateAdminReward();

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReward.name.trim()) {
      alert('Please enter a reward name');
      return;
    }
    createRewardMutation.mutate({
      name: newReward.name,
      type: newReward.type,
      value: newReward.value,
      currency: newReward.currency,
      isActive: true,
      metadata: {
        category: newReward.category,
        initialQuantity: Number(newReward.initialQuantity),
      }
    }, {
      onSuccess: () => {
        setNewReward({
          name: '',
          type: 'Discount',
          value: '10.00',
          currency: 'GBP',
          category: 'Coupon',
          initialQuantity: 100,
        });
        alert('Reward created successfully!');
      },
      onError: (err: any) => {
        alert(err?.response?.data?.message || err?.message || 'Failed to create reward');
      }
    });
  };

  const stats = React.useMemo(() => {
    const counts = {
      Discount: 0,
      Voucher: 0,
      FreeProduct: 0,
      Cashback: 0,
      Points: 0,
    };
    rewardList.forEach((r: any) => {
      if (r.type && r.type in counts) {
        counts[r.type as keyof typeof counts] += r._count?.inventories || r.stock || 1;
      }
    });
    return [
      { label: 'Discounts', value: counts.Discount },
      { label: 'Vouchers', value: counts.Voucher },
      { label: 'Free Products', value: counts.FreeProduct },
      { label: 'Cashbacks', value: counts.Cashback },
      { label: 'Points', value: counts.Points },
    ];
  }, [rewardList]);

  const maxStatVal = React.useMemo(() => {
    return Math.max(...stats.map(s => s.value), 1);
  }, [stats]);

  const togglePromo = (item: string) => {
    setPromoStates(prev => ({ ...prev, [item]: !prev[item] }));
    // In a real app this would call an API to persist the toggle
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
                {campaignList.length > 0 ? campaignList.map((camp: any, i: number) => {
                  const priority = camp.priority || 'Med';
                  const priVariant = priority === 'High' ? 'red' : priority === 'Low' ? 'green' : 'yellow';
                  return (
                    <tr key={camp.id || i} className="border-b border-stone-50 hover:bg-stone-50">
                      <td className="py-4 font-bold">{camp.name || 'Unknown'}</td>
                      <td className="py-4">{camp.businesses?.[0]?.business?.name || 'MCOM Partner'}</td>
                      <td className="py-4">{camp.theme || 'Standard'}</td>
                      <td className="py-4"><Badge variant={priVariant}>{priority}</Badge></td>
                      <td className="py-4 w-32"><div className="w-full bg-stone-100 rounded-full h-1.5"><div className="bg-[#1a1a1a] h-1.5 rounded-full" style={{ width: `${camp.inventory ?? 50}%`}} /></div></td>
                      <td className="py-4">{camp.status || 'Active'}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={6} className="text-center text-[#888] py-8 text-[13px]">No campaigns found</td></tr>
                )}
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
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-stone-500">
                        <span>{stat.label}</span>
                        <span>{stat.value} units</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1">
                        <div 
                          className="bg-stone-800 h-1 rounded-full transition-all" 
                          style={{ width: `${(stat.value / maxStatVal) * 100}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="col-span-2">
                <Card title="Add New Reward to Inventory">
                  <form onSubmit={handleCreateReward} className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Reward Name</label>
                        <input 
                          type="text" 
                          value={newReward.name}
                          onChange={(e) => setNewReward(p => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. Summer Discount" 
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Reward Type</label>
                        <select 
                          value={newReward.type}
                          onChange={(e) => setNewReward(p => ({ ...p, type: e.target.value }))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400"
                        >
                          <option value="Discount">Discount</option>
                          <option value="Voucher">Voucher</option>
                          <option value="FreeProduct">Free Product</option>
                          <option value="Cashback">Cashback</option>
                          <option value="Points">Points</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Initial Quantity / Stock</label>
                        <input 
                          type="number" 
                          value={newReward.initialQuantity}
                          onChange={(e) => setNewReward(p => ({ ...p, initialQuantity: Number(e.target.value) }))}
                          placeholder="100" 
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Value</label>
                          <input 
                            type="text" 
                            value={newReward.value}
                            onChange={(e) => setNewReward(p => ({ ...p, value: e.target.value }))}
                            placeholder="5.00" 
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Category</label>
                          <select 
                            value={newReward.category}
                            onChange={(e) => setNewReward(p => ({ ...p, category: e.target.value }))}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-stone-400"
                          >
                            <option value="Coupon">Coupon</option>
                            <option value="Discount">Discount</option>
                            <option value="Service">Service</option>
                            <option value="Product">Product</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={createRewardMutation.isPending}
                      className="col-span-2 bg-[#1a1a1a] text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      {createRewardMutation.isPending ? 'Injecting...' : 'Initialize Reward Injection'}
                    </button>
                  </form>
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
                    <th className="pb-4">Value</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-stone-800">
                  {rewardList.length > 0 ? rewardList.map((item: any, i: number) => {
                    const cat = item.metadata?.category || 'Coupon';
                    const stock = item._count?.inventories ?? item.stock ?? 0;
                    const status = item.isActive ? 'Active' : 'Inactive';
                    return (
                      <tr key={item.id || i} className="border-b border-stone-50 hover:bg-stone-50">
                        <td className="py-4 font-bold">{item.name}</td>
                        <td className="py-4">{item.type}</td>
                        <td className="py-4 text-stone-500">{cat}</td>
                        <td className="py-4">{stock}</td>
                        <td className="py-4">
                          {item.currency ?? '£'}{Number(item.value).toFixed(2)}
                        </td>
                        <td className="py-4">
                          <Badge variant={item.isActive ? 'green' : 'red'}>
                            {status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6} className="text-center text-[#888] py-8 text-[13px]">
                        No rewards found
                      </td>
                    </tr>
                  )}
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
