'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft } from 'lucide-react';
import { useLogin } from '@/services/auth';

const ADMIN_ROLES = ['SuperAdmin', 'BoroughAdmin'];

export default function AdminLoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          const role = data.user?.role || (data.user as { roles?: string[] })?.roles?.[0] || '';
          if (!ADMIN_ROLES.includes(role)) {
            setError('This account does not have admin access');
            return;
          }
          router.push('/admin');
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
          setError(msg || 'Invalid credentials');
        },
      },
    );
  };

  const isPending = loginMutation.isPending;

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#f97316]/[0.08] rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#f97316]/[0.05] rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f97316]/15 border border-[#f97316]/30 mb-4">
            <Shield className="w-7 h-7 text-[#f97316]" />
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-white">MComSpin Admin</h1>
          <p className="text-[12px] text-[#888] mt-2">Restricted access. Administrator sign-in required.</p>
        </div>

        <div className="bg-white rounded-2xl border border-white/10 shadow-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mcomspin.com"
                className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#eee] bg-[#fafaf9] text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#f97316]/40 focus:ring-2 focus:ring-[#f97316]/10 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#1a1a1a] hover:bg-[#f97316] text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8">
          <a href="/auth" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#888] hover:text-[#f97316] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to user sign in
          </a>
        </p>
      </div>
    </div>
  );
}
