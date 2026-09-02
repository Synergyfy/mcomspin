'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProxy } from '../proxy';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AuthProxy allowedRoles={['SuperAdmin', 'BoroughAdmin']} redirectTo="/admin/login">
      {children}
    </AuthProxy>
  );
}
