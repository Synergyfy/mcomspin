'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.replace('/auth');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        router.replace('/auth');
        return;
      }

      // Base64 decode payload
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      // Check expiration
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

      setVerified(true);
    } catch (err) {
      router.replace('/auth');
    }
  }, [router, allowedRoles]);

  if (!verified) {
    return null;
  }

  return children as React.ReactElement;
}
