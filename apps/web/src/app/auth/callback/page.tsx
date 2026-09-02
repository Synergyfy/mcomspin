'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '/dashboard';

  useEffect(() => {
    if (!code) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api/v1';
    let cancelled = false;

    fetch(
      `${apiUrl}/auth/sso/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
      { credentials: 'include' },
    )
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok || !body?.success) {
          throw new Error(body?.error?.message || body?.message || 'SSO login failed');
        }
        if (!cancelled) router.replace(body.redirect || state || '/dashboard');
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'SSO login failed');
      });

    return () => {
      cancelled = true;
    };
  }, [code, state, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm text-center space-y-4">
        <span className="w-3 h-3 bg-[#f97316] rounded-full mx-auto block shadow-[0_0_12px_rgba(249,115,22,0.4)]" />
        {error || !code ? (
          <>
            <h1 className="font-display font-bold text-lg text-[#1a1a1a]">Sign-in failed</h1>
            <p className="text-[13px] text-[#888]">
              {error || 'Missing authorization code. Please try signing in again.'}
            </p>
            <a
              href="/auth"
              className="inline-block mt-2 text-[11px] font-bold uppercase tracking-[0.15em] bg-[#1a1a1a] text-white px-6 py-3 rounded-xl hover:bg-[#f97316] transition-all"
            >
              Back to Sign In
            </a>
          </>
        ) : (
          <>
            <h1 className="font-display font-bold text-lg text-[#1a1a1a]">Completing sign-in…</h1>
            <p className="text-[13px] text-[#888]">Exchanging your session with Central Hub Solution.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-[13px] text-[#888]">Completing sign-in…</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}