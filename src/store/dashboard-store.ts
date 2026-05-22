import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  businessName: string;
  avatar: string;
  role: string;
}

interface DashboardState {
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;

  // Auth
  isAuthenticated: boolean;
  currentUser: User | null;
  loginAsDemo: () => void;
  login: (email: string, password: string) => void;
  logout: () => void;

  // Notifications
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  decrementNotification: () => void;
}

const demoUser: User = {
  name: 'Alex Morgan',
  email: 'alex@demo-business.com',
  businessName: 'Demo Business Co.',
  avatar: 'AM',
  role: 'Administrator',
};

export const useDashboardStore = create<DashboardState>((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),

  // Auth
  isAuthenticated: false,
  currentUser: null,
  loginAsDemo: () =>
    set({
      isAuthenticated: true,
      currentUser: demoUser,
      notificationCount: 5,
    }),
  login: (_email: string, _password: string) =>
    set({
      isAuthenticated: true,
      currentUser: demoUser,
      notificationCount: 3,
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      currentUser: null,
      notificationCount: 0,
    }),

  // Notifications
  notificationCount: 0,
  setNotificationCount: (count) => set({ notificationCount: count }),
  decrementNotification: () =>
    set((s) => ({ notificationCount: Math.max(0, s.notificationCount - 1) })),
}));
