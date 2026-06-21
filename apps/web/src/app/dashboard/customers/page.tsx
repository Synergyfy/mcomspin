'use client';

import React, { useState } from 'react';
import { useBusinessCustomers } from '@/services/business';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  rewardsWon: number;
  rewardsRedeemed: number;
  lastVisit: string;
  status: 'New' | 'Returning';
}

function getInitials(name: string | undefined | null) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function CustomersPage() {
  const { data: customersData, isLoading, isError } = useBusinessCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customersList: any[] = (customersData as any[]) ?? [];

  const filteredCustomers = customersList.filter(c => {
    const name = c.name ? String(c.name).toLowerCase() : '';
    const phone = c.phone ? String(c.phone) : '';
    const email = c.email ? String(c.email).toLowerCase() : '';
    const term = searchTerm.toLowerCase();
    
    return name.includes(term) || phone.includes(searchTerm) || email.includes(term);
  });

  if (isLoading && customersList.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-3 w-24 bg-[#f0f0f0] rounded mb-2" />
            <div className="h-7 w-48 bg-[#f0f0f0] rounded mb-1" />
            <div className="h-4 w-64 bg-[#f0f0f0] rounded" />
          </div>
        </div>
        <div className="bg-white rounded-[40px] border border-[#eee] shadow-sm overflow-hidden animate-pulse">
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f0f0f0] rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-[#f0f0f0] rounded" />
                  <div className="h-3 w-48 bg-[#f0f0f0] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Customer Database</h2>
          <p className="text-[#888] mt-1">Manage and track your customer engagement and reward history.</p>
        </div>
        <button className="px-5 py-2.5 bg-[#1a1a1a] text-white rounded-2xl text-[13px] font-bold hover:bg-[#f97316] transition-all shadow-lg shadow-black/5">
          Export Customer List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Customer List Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-3xl border border-[#eee] shadow-sm flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 bg-[#f5f5f3] rounded-2xl px-4 py-2.5">
              <svg className="w-4 h-4 text-[#bbb]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, phone or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-[13px] text-[#1a1a1a] placeholder:text-[#bbb] outline-none flex-1"
              />
            </div>
            <select className="bg-white border border-[#eee] rounded-2xl px-4 py-2.5 text-[13px] font-medium text-[#666] outline-none hover:border-[#ddd] transition-colors">
              <option>All Customers</option>
              <option>New</option>
              <option>Returning</option>
              <option>Top Winners</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-[#eee] shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fafaf9] border-b border-[#eee]">
                    <th className="px-6 py-4 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#aaa] uppercase tracking-wider text-center">Rewards</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f3]">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16">
                        <p className="text-[15px] font-bold text-[#1a1a1a]">No customers found</p>
                        <p className="text-[13px] text-[#888] mt-1">Customers who engage with your business will appear here.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer: any) => (
                      <tr 
                        key={customer.id} 
                        onClick={() => setSelectedCustomer(customer)}
                        className={`group cursor-pointer transition-colors ${selectedCustomer?.id === customer.id ? 'bg-[#f97316]/5' : 'hover:bg-[#fafaf9]'}`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f5f5f3] flex items-center justify-center text-[13px] font-bold text-[#1a1a1a] group-hover:bg-[#f97316] group-hover:text-white transition-colors shrink-0">
                              {getInitials(customer.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[14px] font-bold text-[#1a1a1a] truncate">{customer.name || 'Unnamed Customer'}</p>
                              <p className="text-[12px] text-[#888] truncate">{customer.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[13px] font-medium text-[#444]">{customer.phone || 'No phone'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-6">
                            <div className="text-center">
                              <p className="text-[14px] font-bold text-[#1a1a1a]">{customer.rewardsWon}</p>
                              <p className="text-[9px] font-bold text-[#aaa] uppercase tracking-tighter">Won</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[14px] font-bold text-[#f97316]">{customer.rewardsRedeemed}</p>
                              <p className="text-[9px] font-bold text-[#aaa] uppercase tracking-tighter">Used</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            customer.status === 'Returning' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[13px] text-[#888]">
                          {customer.lastVisit}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-[#f5f5f3]">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[15px] font-bold text-[#1a1a1a]">No customers found</p>
                </div>
              ) : (
                filteredCustomers.map((customer: any) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={`p-5 flex flex-col gap-4 active:bg-[#f97316]/5 transition-colors ${selectedCustomer?.id === customer.id ? 'bg-[#f97316]/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#f5f5f3] flex items-center justify-center text-[15px] font-bold text-[#1a1a1a]">
                          {getInitials(customer.name)}
                        </div>
                        <div>
                          <h4 className="text-[15px] font-bold text-[#1a1a1a]">{customer.name || 'Unnamed Customer'}</h4>
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider mt-1 ${
                            customer.status === 'Returning' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {customer.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest">Last Visit</p>
                        <p className="text-[13px] font-medium text-[#666] mt-0.5">{customer.lastVisit}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#fafaf9] rounded-2xl border border-[#f0f0ee]">
                        <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider mb-1">Contact Info</p>
                        <p className="text-[12px] font-medium text-[#444] truncate">{customer.phone || 'No phone'}</p>
                        <p className="text-[11px] text-[#888] truncate">{customer.email || 'No email'}</p>
                      </div>
                      <div className="p-3 bg-[#fafaf9] rounded-2xl border border-[#f0f0ee] flex items-center justify-around">
                        <div className="text-center">
                          <p className="text-[15px] font-bold text-[#1a1a1a]">{customer.rewardsWon}</p>
                          <p className="text-[9px] font-bold text-[#aaa] uppercase">Won</p>
                        </div>
                        <div className="w-px h-6 bg-[#eee]" />
                        <div className="text-center">
                          <p className="text-[15px] font-bold text-[#f97316]">{customer.rewardsRedeemed}</p>
                          <p className="text-[9px] font-bold text-[#aaa] uppercase">Used</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detailed View Column */}
        <div className="lg:col-span-1">
          {selectedCustomer ? (
            <div className="bg-white rounded-[32px] border border-[#eee] p-6 shadow-sm sticky top-24 space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#f97316]/10 text-[#f97316] flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-2 border-white shadow-xl">
                  {getInitials(selectedCustomer.name)}
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">{selectedCustomer.name || 'Unnamed Customer'}</h3>
                <p className="text-[13px] text-[#888]">{selectedCustomer.status} Customer</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#fafaf9] border border-[#f0f0ee] text-center">
                  <p className="text-xl font-bold text-[#1a1a1a]">{selectedCustomer.rewardsWon}</p>
                  <p className="text-[10px] font-bold text-[#aaa] uppercase mt-1">Total Wins</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#fafaf9] border border-[#f0f0ee] text-center">
                  <p className="text-xl font-bold text-[#f97316]">{selectedCustomer.rewardsRedeemed}</p>
                  <p className="text-[10px] font-bold text-[#aaa] uppercase mt-1">Redeemed</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[12px] font-bold text-[#aaa] uppercase tracking-widest">Recent Activity</h4>
                <div className="space-y-4">
                  {[
                    { action: 'Won Reward', detail: '20% Discount Voucher', time: '2h ago' },
                    { action: 'Redeemed', detail: 'Free Coffee', time: 'Yesterday' },
                    { action: 'Visit', detail: 'Downtown Store', time: 'Yesterday' },
                  ].map((act: any, i: any) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-[#f97316] rounded-full mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[13px] font-bold text-[#1a1a1a] leading-none">{act.action}</p>
                        <p className="text-[12px] text-[#888] mt-1">{act.detail}</p>
                        <p className="text-[10px] text-[#ccc] mt-1 uppercase font-medium">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 bg-[#f5f5f3] hover:bg-[#eee] text-[#1a1a1a] text-[13px] font-bold rounded-2xl transition-colors">
                View Full History
              </button>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-[#eee] rounded-[32px] flex flex-col items-center justify-center p-8 text-center bg-white/50">
              <div className="w-16 h-16 bg-[#f5f5f3] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-bold text-[#1a1a1a]">Select a Customer</h3>
              <p className="text-[13px] text-[#888] mt-2">Click on a customer in the list to view their detailed activity and reward history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
