'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, setTokens } from '@/services/token-store';
import { initAuth } from '@/services/api';
import { isMockEnabled, getMockToken } from '@/services/mock-data';

export function AuthProxy({
  children,
  allowedRoles,
  redirectTo = '/auth',
}: {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
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
          router.replace(redirectTo);
          return;
        }
        token = getAccessToken();
        if (!token) {
          router.replace(redirectTo);
          return;
        }
      }

      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          router.replace(redirectTo);
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

        let effectivePayload = payload;
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          const restored = await initAuth();
          if (cancelled) return;
          if (!restored) {
            router.replace(redirectTo);
            return;
          }
          const freshToken = getAccessToken();
          if (!freshToken) {
            router.replace(redirectTo);
            return;
          }
          const freshParts = freshToken.split('.');
          if (freshParts.length !== 3) {
            router.replace(redirectTo);
            return;
          }
          const b64 = freshParts[1].replace(/-/g, '+').replace(/_/g, '/');
          const bin = window.atob(b64);
          const u8 = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
          effectivePayload = JSON.parse(new TextDecoder().decode(u8));
        }

        const userRoles = effectivePayload.roles || [];
        const hasRole = allowedRoles.some((r) =>
          userRoles.map((role: string) => role.toLowerCase()).includes(r.toLowerCase())
        );

        if (!hasRole) {
          router.replace(redirectTo);
          return;
        }

        if (!cancelled) setVerified(true);
      } catch {
        if (!cancelled) router.replace(redirectTo);
      }
    }

    verify();

    return () => { cancelled = true; };
  }, [router, allowedRoles, redirectTo]);

  if (!verified) {
    return null;
  }

  return children as React.ReactElement;
}
