'use client';

import React from 'react';
import { useBusinessBilling } from '@/services/business';

export default function BillingPage() {
  const { data: billingData, isLoading, isError } = useBusinessBilling();
  const rawInvoices = (billingData as any)?.invoices;
  const invoices: any[] = Array.isArray(rawInvoices) ? rawInvoices : [];

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-center">
          <p className="font-bold text-[15px]">Failed to load billing data</p>
          <p className="text-[13px] mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

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
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-4 w-24 bg-[#f0f0f0] rounded" />
                <div className="h-8 w-40 bg-[#f0f0f0] rounded" />
                <div className="h-4 w-full bg-[#f0f0f0] rounded" />
              </div>
            ) : (
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-[10px] font-bold uppercase tracking-widest rounded-full">Current Plan</span>
                  <h3 className="text-3xl font-black text-[#1a1a1a] mt-2">{(billingData as any)?.subscription?.tier ?? 'Starter Plan'}</h3>
                </div>
                <button className="px-6 py-2.5 bg-[#1a1a1a] text-white rounded-2xl text-[13px] font-bold hover:bg-[#f97316] transition-all shadow-lg">
                  Upgrade Plan
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-8 border-t border-[#f5f5f3] pt-6">
                <div>
                  <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Renewal Date</p>
                  <p className="text-[15px] font-bold text-[#1a1a1a] mt-1">{((billingData as any)?.subscription?.endDate ? new Date((billingData as any).subscription.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—')}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Monthly Usage</p>
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-[#f5f5f3] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f97316] w-[65%] rounded-full" />
                    </div>
                    <p className="text-[11px] font-medium text-[#888]">{(billingData as any)?.subscription?.usage ?? '—'}</p>
                  </div>
                </div>
              </div>
            </div>
            )}
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
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={4} className="px-8 py-5"><div className="h-4 w-full bg-[#f5f5f3] rounded animate-pulse" /></td>
                      </tr>
                    ))
                  ) : invoices.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-12 text-center text-[#888] text-[13px]">No invoices yet</td></tr>
                  ) : (
                    invoices.map((inv: any) => (
                    <tr key={inv.id} className="group hover:bg-[#fafaf9] transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-[14px] font-bold text-[#1a1a1a]">{inv.id}</p>
                        <p className="text-[12px] text-[#888]">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : inv.date}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[14px] font-bold text-[#1a1a1a]">{inv.totalAmount ? `£${Number(inv.totalAmount).toFixed(2)}` : inv.amount}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          inv.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-[12px] font-bold text-[#f97316] hover:underline">Download</button>
                      </td>
                    </tr>
                    ))
                  )}
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
