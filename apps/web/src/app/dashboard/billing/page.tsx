'use client';

import React from 'react';
import { useBusinessBilling } from '@/services/business';

export default function BillingPage() {
  const { data: billingData } = useBusinessBilling();
  const rawInvoices = (billingData as any)?.invoices;
  const invoices: any[] = rawInvoices?.length ? rawInvoices : [
    { id: 'INV-001', date: 'Jun 01, 2026', amount: '$49.00', status: 'Paid' },
    { id: 'INV-002', date: 'May 01, 2026', amount: '$49.00', status: 'Paid' },
    { id: 'INV-003', date: 'Apr 01, 2026', amount: '$49.00', status: 'Paid' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Billing & Subscription</h2>
        <p className="text-[#888] mt-1">Manage your plan, invoices, and payment history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Subscription Info */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-[10px] font-bold uppercase tracking-widest rounded-full">Current Plan</span>
                  <h3 className="text-3xl font-black text-[#1a1a1a] mt-2">Starter Plan</h3>
                </div>
                <button className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-2xl text-[13px] font-bold hover:bg-[#f97316] transition-all shadow-lg">
                  Upgrade Plan
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-8 border-t border-[#f5f5f3] pt-6">
                <div>
                  <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Renewal Date</p>
                  <p className="text-[15px] font-bold text-[#1a1a1a] mt-1">July 01, 2026</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Monthly Usage</p>
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-[#f5f5f3] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f97316] w-[65%] rounded-full" />
                    </div>
                    <p className="text-[11px] font-medium text-[#888]">650 / 1000 plays used</p>
                  </div>
                </div>
              </div>
            </div>
            {/* BG Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/5 rounded-bl-[100px]" />
          </section>

          {/* Invoices List */}
          <section className="bg-white rounded-[40px] border border-[#eee] shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-[#eee]">
              <h3 className="text-[15px] font-bold text-[#1a1a1a]">Invoice History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#f5f5f3]">
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} className="group hover:bg-[#fafaf9] transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-[14px] font-bold text-[#1a1a1a]">{inv.id}</p>
                        <p className="text-[12px] text-[#888]">{inv.date}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[14px] font-bold text-[#1a1a1a]">{inv.amount}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-[12px] font-bold text-[#f97316] hover:underline">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <section className="bg-[#1a1a1a] rounded-[40px] p-8 text-white">
            <h4 className="text-[15px] font-bold mb-4">Payment Method</h4>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center font-bold text-[10px]">VISA</div>
              <div>
                <p className="text-[13px] font-bold">•••• 4242</p>
                <p className="text-[11px] text-white/40">Expires 12/28</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border border-white/20 hover:border-white/40 text-[13px] font-bold rounded-2xl transition-all">
              Change Method
            </button>
          </section>

          <section className="bg-[#f97316]/5 rounded-[40px] p-8 border border-[#f97316]/10">
            <h4 className="text-[15px] font-bold text-[#1a1a1a] mb-2">Need help?</h4>
            <p className="text-[13px] text-[#888] leading-relaxed">
              If you have questions about your subscription or need a custom plan, our team is here to help.
            </p>
            <button className="mt-4 text-[13px] font-bold text-[#f97316] hover:underline">Contact Billing Support</button>
          </section>
        </div>
      </div>
    </div>
  );
}
