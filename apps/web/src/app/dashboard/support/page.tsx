'use client';

import React from 'react';

/* ─── Static product content — not database-driven ─── */
const HELP_CATEGORIES = [
  { title: 'Getting Started', count: 12, icon: '🚀' },
  { title: 'Campaign Rules', count: 8, icon: '⚙️' },
  { title: 'Reward Types', count: 5, icon: '🎁' },
  { title: 'Staff Training', count: 4, icon: '👥' },
  { title: 'Analytics Help', count: 6, icon: '📊' },
  { title: 'Billing Info', count: 3, icon: '💳' },
];

const TUTORIALS = [
  { title: 'Setting up your first campaign', time: '5 mins', type: 'Video' },
  { title: 'How to manage staff roles', time: '3 mins', type: 'Guide' },
  { title: 'Understanding your analytics', time: '7 mins', type: 'Video' },
];

export default function SupportPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-[#1a1a1a]">How can we help?</h2>
        <p className="text-[#888] max-w-lg mx-auto">
          Search our knowledge base or reach out to our team of experts for personalized assistance.
        </p>
        <div className="max-w-xl mx-auto relative pt-4">
          <input
            type="text"
            placeholder="Search guides, tutorials, FAQs..."
            className="w-full bg-white border border-[#eee] rounded-[24px] px-6 py-4 text-[15px] outline-none shadow-xl shadow-black/5 focus:border-[#f97316] transition-all"
          />
          <button className="absolute right-3 top-[26px] p-2.5 bg-[#1a1a1a] text-white rounded-2xl hover:bg-[#f97316] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Help Resources */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {HELP_CATEGORIES.map((cat, i) => (
          <button key={i} className="bg-white border border-[#eee] p-6 rounded-[32px] hover:border-[#f97316]/30 hover:shadow-md transition-all text-center group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
            <p className="text-[13px] font-bold text-[#1a1a1a]">{cat.title}</p>
            <p className="text-[10px] text-[#aaa] mt-1 uppercase font-bold">{cat.count} Articles</p>
          </button>
        ))}
      </div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-[#1a1a1a] rounded-[40px] p-10 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Support</h3>
            <p className="text-white/60 text-[14px] leading-relaxed">
              Our support team is available Monday to Friday, 9am - 6pm. We typically respond within 2 hours.
            </p>
          </div>
          <div className="mt-10 space-y-3">
            <button className="w-full py-4 bg-[#f97316] text-white rounded-2xl font-bold text-[14px] hover:bg-[#ea580c] transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.094 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Start Live Chat
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-[13px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Email
              </button>
              <button className="py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-[13px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[40px] border border-[#eee] p-10 shadow-sm">
          <h3 className="text-2xl font-bold text-[#1a1a1a] mb-6">Recent Tutorials</h3>
          <div className="space-y-6">
            {TUTORIALS.map((t, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="w-20 h-14 bg-[#f5f5f3] rounded-xl flex items-center justify-center text-[10px] font-bold text-[#aaa] shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#f97316]/0 group-hover:bg-[#f97316]/10 transition-colors flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  {t.type}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#1a1a1a] group-hover:text-[#f97316] transition-colors">{t.title}</h4>
                  <p className="text-[12px] text-[#aaa] mt-1">{t.time} · {t.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-[#f5f5f3] hover:bg-[#eee] text-[#1a1a1a] text-[13px] font-bold rounded-2xl transition-colors">
            Browse All Tutorials
          </button>
        </section>
      </div>
    </div>
  );
}
