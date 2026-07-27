'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, setTokens } from '@/services/token-store';
import { initAuth } from '@/services/api';
import { isMockEnabled, getMockToken } from '@/services/mock-data';

export function AuthProxy({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const MOCK = isMockEnabled();

      if (MOCK) {
        setTokens(getMockToken());
        if (!cancelled) setVerified(true);
        return;
      }

      let token = typeof window !== 'undefined' ? getAccessToken() : null;

      if (!token) {
        const restored = await initAuth();
        if (cancelled) return;
        if (!restored) {
          router.replace('/auth');
          return;
        }
        token = getAccessToken();
        if (!token) {
          router.replace('/auth');
          return;
        }
      }

      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          router.replace('/auth');
          return;
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const binary = window.atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const jsonPayload = new TextDecoder().decode(bytes);
        const payload = JSON.parse(jsonPayload);

        if (payload.exp && Date.now() >= payload.exp * 1000) {
          router.replace('/auth');
          return;
        }

        const userRoles = payload.roles || [];
        const hasRole = allowedRoles.some((r) =>
          userRoles.map((role: string) => role.toLowerCase()).includes(r.toLowerCase())
        );

        if (!hasRole) {
          router.replace('/auth');
          return;
        }

        if (!cancelled) setVerified(true);
      } catch {
        if (!cancelled) router.replace('/auth');
      }
    }

    verify();

    return () => { cancelled = true; };
  }, [router, allowedRoles]);

  if (!verified) {
    return null;
  }

  return children as React.ReactElement;
}
