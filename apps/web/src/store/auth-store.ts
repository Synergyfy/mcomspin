import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  avatar?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  notificationCount: number;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setNotificationCount: (count: number) => void;
  decrementNotification: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  notificationCount: 0,
  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),
  clearUser: () =>
    set({ user: null, isAuthenticated: false, notificationCount: 0 }),
  setNotificationCount: (count) => set({ notificationCount: count }),
  decrementNotification: () =>
    set((s) => ({ notificationCount: Math.max(0, s.notificationCount - 1) })),
}));
