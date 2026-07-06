'use client';

import React from 'react';
import { AuthProxy } from '../proxy';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProxy allowedRoles={['SuperAdmin', 'BoroughAdmin']}>
      {children}
    </AuthProxy>
  );
}
