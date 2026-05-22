'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/store/dashboard-store';

export default function AuthPage() {
  const router = useRouter();
  const { loginAsDemo, login } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(loginEmail, loginPassword);
      router.push('/dashboard');
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(regEmail, regPassword);
      router.push('/dashboard');
    }, 800);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      loginAsDemo();
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16 relative overflow-hidden font-body">
      {/* Ambient glows */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#f97316]/[0.04] rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#f97316]/[0.03] rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-2.5 group">
            <span className="w-3 h-3 bg-[#f97316] rounded-full shadow-[0_0_12px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-shadow" />
            <span className="font-display font-bold text-xl tracking-tight text-[#1a1a1a]">MComSpin</span>
          </a>
          <p className="text-[13px] text-[#999] mt-3 leading-relaxed">
            Business Engagement & Monetization Infrastructure
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-[#eee] shadow-xl shadow-black/[0.04] p-8 space-y-6">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-[#f5f5f3] p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] rounded-lg transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-white text-[#1a1a1a] shadow-sm'
                  : 'text-[#999] hover:text-[#666]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] rounded-lg transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-white text-[#1a1a1a] shadow-sm'
                  : 'text-[#999] hover:text-[#666]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all"
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 text-[#888] cursor-pointer">
                  <input type="checkbox" className="accent-[#f97316] w-3.5 h-3.5 rounded" />
                  Remember me
                </label>
                <a href="#" className="text-[#f97316] font-semibold hover:underline">Forgot password?</a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] hover:bg-[#f97316] text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Your Business Co."
                  className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] hover:bg-[#f97316] text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#eee]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#ccc]">Or</span>
            <div className="flex-1 h-px bg-[#eee]" />
          </div>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc5209] text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-md shadow-[#f97316]/15 disabled:opacity-50 flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Try Demo Dashboard
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <p className="text-center text-[11px] text-[#bbb]">
            Instant access with pre-loaded demo data — no sign-up required.
          </p>
        </div>

        {/* Footer link */}
        <p className="text-center text-[11px] text-[#bbb] mt-8">
          <a href="/" className="hover:text-[#f97316] transition-colors">← Back to MComSpin</a>
        </p>
      </div>
    </div>
  );
}
