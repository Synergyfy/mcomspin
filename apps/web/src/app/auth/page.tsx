'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16 relative overflow-hidden font-body">
      {/* Ambient glows */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#f97316]/[0.04] rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#f97316]/[0.03] rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="w-3 h-3 bg-[#f97316] rounded-full shadow-[0_0_12px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-shadow" />
            <span className="font-display font-bold text-xl tracking-tight text-[#1a1a1a]">MComSpin</span>
          </Link>
          <p className="text-[13px] text-[#999] mt-3 leading-relaxed">
            Business Engagement & Monetization Infrastructure
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-[#eee] shadow-xl shadow-black/[0.04] p-8 space-y-6">
          <div className="text-center">
            <h1 className="font-display font-bold text-lg text-[#1a1a1a]">Sign in to continue</h1>
            <p className="text-[12px] text-[#888] mt-1">
              Accounts are managed centrally via Central Hub Solution.
            </p>
          </div>

          {/* SSO */}
          <button
            type="button"
            onClick={() => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api/v1';
              window.location.href = `${apiUrl}/auth/sso/start`;
            }}
            className="w-full flex items-center justify-center gap-2.5 bg-white border border-[#e5e5e5] hover:border-[#f97316]/40 hover:bg-[#fafaf9] text-[#1a1a1a] py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-[#f97316]" />
            Continue with Central Hub Solution
          </button>

          <div className="pt-2 text-center">
            <a
              href="/admin/login"
              className="text-[11px] font-bold text-[#999] hover:text-[#f97316] transition-colors uppercase tracking-[0.1em]"
            >
              Admin Login
            </a>
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-[11px] text-[#bbb] mt-8">
          <Link href="/" className="hover:text-[#f97316] transition-colors">← Back to MComSpin</Link>
        </p>
      </div>
    </div>
  );
}
