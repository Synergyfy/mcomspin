'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin, useRegister } from '@/services/auth';

export default function AuthPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate(
      { email: loginEmail, password: loginPassword },
      {
        onSuccess: (data) => {
          const role = data.user?.role || (data.user as any)?.roles?.[0];
          if (role === 'SuperAdmin' || role === 'BoroughAdmin') {
            router.push('/admin');
          } else if (role === 'Customer') {
            router.push('/customer');
          } else {
            router.push('/dashboard');
          }
        },
        onError: (err: any) => {
          setError(err?.response?.data?.error?.message || err?.message || 'Login failed');
        },
      },
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    registerMutation.mutate(
      {
        email: regEmail,
        password: regPassword,
        firstName: regName,
        lastName: '',
      },
      {
        onSuccess: (data) => {
          const role = data.user?.role || (data.user as any)?.roles?.[0];
          if (role === 'SuperAdmin' || role === 'BoroughAdmin') {
            router.push('/admin');
          } else if (role === 'Customer') {
            router.push('/customer');
          } else {
            router.push('/dashboard');
          }
        },
        onError: (err: any) => {
          setError(err?.response?.data?.error?.message || err?.message || 'Registration failed');
        },
      },
    );
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl px-4 py-3">
              {error}
            </div>
          )}

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
                disabled={isPending}
                className="w-full bg-[#1a1a1a] hover:bg-[#f97316] text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isPending ? 'Signing in...' : 'Sign In'}
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
                disabled={isPending}
                className="w-full bg-[#1a1a1a] hover:bg-[#f97316] text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isPending ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Footer link */}
        <p className="text-center text-[11px] text-[#bbb] mt-8">
          <a href="/" className="hover:text-[#f97316] transition-colors">← Back to MComSpin</a>
        </p>
      </div>
    </div>
  );
}
