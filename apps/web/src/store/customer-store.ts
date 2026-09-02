import { create } from 'zustand';

export interface CustomerReward {
  id: string;
  title: string;
  provider: string;
  providerLogo: string;
  type: 'coupon' | 'appointment' | 'voucher' | 'product' | 'exclusive' | 'discount';
  value: string;
  details: string;
  code: string;
  qrCode: string;
  expiry: string;
  claimed: boolean;
  claimedAt?: string;
  status: 'active' | 'redeemed' | 'expired';
}

export interface CustomerProfile {
  name: string;
  email: string;
  avatar: string;
  onboardingCompleted: boolean;
  interests: string[];
  categories: string[];
  favoritePartners: string[];
  streakDays: number;
  totalPoints: number;
  availableSpins: number;
}

export interface CustomerNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'reward' | 'partner' | 'system' | 'streak';
}

export interface ActivityLog {
  id: string;
  type: 'spin' | 'redeem' | 'visit' | 'streak';
  description: string;
  time: string;
  points: number;
}

interface CustomerState {
  profile: CustomerProfile;
  wallet: CustomerReward[];
  notifications: CustomerNotification[];
  activity: ActivityLog[];
  activeView: 'home' | 'dashboard' | 'rewards' | 'spin' | 'partners' | 'profile';
  revealedReward: CustomerReward | null;
  onboardingStep: number;
  
  // Actions
  completeOnboarding: (name: string, email: string, interests: string[], categories: string[]) => void;
  setOnboardingStep: (step: number) => void;
  setView: (view: 'home' | 'dashboard' | 'rewards' | 'spin' | 'partners' | 'profile') => void;
  addSpin: (count: number) => void;
  decrementSpins: () => void;
  unlockReward: (reward: Omit<CustomerReward, 'id' | 'code' | 'qrCode' | 'status' | 'claimed' | 'expiry'>) => void;
  redeemReward: (id: string) => void;
  setRevealedReward: (reward: CustomerReward | null) => void;
  addPoints: (points: number) => void;
  addNotification: (title: string, desc: string, type: CustomerNotification['type']) => void;
  markNotificationsRead: () => void;
  logActivity: (type: ActivityLog['type'], desc: string, points: number) => void;
  resetCustomerSession: () => void;
}

const initialProfile: CustomerProfile = {
  name: '',
  email: '',
  avatar: '',
  onboardingCompleted: false,
  interests: [],
  categories: [],
  favoritePartners: [],
  streakDays: 0,
  totalPoints: 0,
  availableSpins: 0,
};

const initialWallet: CustomerReward[] = [];

const initialNotifications: CustomerNotification[] = [];

const initialActivity: ActivityLog[] = [];

export const useCustomerStore = create<CustomerState>((set) => ({
  profile: initialProfile,
  wallet: initialWallet,
  notifications: initialNotifications,
  activity: initialActivity,
  activeView: 'home',
  revealedReward: null,
  onboardingStep: 0,

  completeOnboarding: (name, email, interests, categories) => set((state) => {
    const updatedProfile = {
      ...state.profile,
      name,
      email,
      interests,
      categories,
      onboardingCompleted: true,
      availableSpins: state.profile.availableSpins + 1, // Bonus spin
    };
    
    const newActivity: ActivityLog = {
      id: `a-${Date.now()}`,
      type: 'streak',
      description: 'Completed onboarding profile - Received +1 Bonus Spin!',
      time: 'Just now',
      points: 50,
    };

    return {
      profile: updatedProfile,
      activity: [newActivity, ...state.activity],
    };
  }),

  setOnboardingStep: (step) => set({ onboardingStep: step }),
  
  setView: (view) => set({ activeView: view }),

  addSpin: (count) => set((state) => ({
    profile: { ...state.profile, availableSpins: state.profile.availableSpins + count }
  })),

  decrementSpins: () => set((state) => ({
    profile: { ...state.profile, availableSpins: Math.max(0, state.profile.availableSpins - 1) }
  })),

  unlockReward: (reward) => set((state) => {
    const uniqueId = `rw-${Date.now()}`;
    const code = `${reward.provider.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newReward: CustomerReward = {
      ...reward,
      id: uniqueId,
      code,
      qrCode: `MCS-QR-${uniqueId}`,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      claimed: false,
      status: 'active',
    };

    const newActivity: ActivityLog = {
      id: `a-${Date.now()}`,
      type: 'spin',
      description: `Unlocked "${reward.title}" from ${reward.provider}`,
      time: 'Just now',
      points: 30,
    };

    const newNotification: CustomerNotification = {
      id: `n-${Date.now()}`,
      title: 'New Reward Unlocked!',
      description: `You unlocked "${reward.title}" from ${reward.provider}. Check your Wallet.`,
      time: 'Just now',
      read: false,
      type: 'reward',
    };

    return {
      wallet: [newReward, ...state.wallet],
      activity: [newActivity, ...state.activity],
      notifications: [newNotification, ...state.notifications],
      revealedReward: newReward,
      profile: {
        ...state.profile,
        totalPoints: state.profile.totalPoints + 30
      }
    };
  }),

  redeemReward: (id) => set((state) => {
    const updatedWallet = state.wallet.map(item => {
      if (item.id === id) {
        return {
          ...item,
          claimed: true,
          claimedAt: new Date().toLocaleDateString(),
          status: 'redeemed' as const
        };
      }
      return item;
    });

    const targetReward = state.wallet.find(item => item.id === id);
    const newActivity: ActivityLog = {
      id: `a-${Date.now()}`,
      type: 'redeem',
      description: `Redeemed "${targetReward?.title}" at ${targetReward?.provider}`,
      time: 'Just now',
      points: 100,
    };

    return {
      wallet: updatedWallet,
      activity: [newActivity, ...state.activity],
      profile: {
        ...state.profile,
        totalPoints: state.profile.totalPoints + 100
      }
    };
  }),

  setRevealedReward: (reward) => set({ revealedReward: reward }),

  addPoints: (points) => set((state) => ({
    profile: { ...state.profile, totalPoints: state.profile.totalPoints + points }
  })),

  addNotification: (title, desc, type) => set((state) => ({
    notifications: [
      {
        id: `n-${Date.now()}`,
        title,
        description: desc,
        time: 'Just now',
        read: false,
        type,
      },
      ...state.notifications
    ]
  })),

  markNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  logActivity: (type, desc, points) => set((state) => ({
    activity: [
      { id: `a-${Date.now()}`, type, description: desc, time: 'Just now', points },
      ...state.activity
    ]
  })),

  resetCustomerSession: () => set({
    profile: initialProfile,
    wallet: initialWallet,
    notifications: initialNotifications,
    activity: initialActivity,
    activeView: 'home',
    revealedReward: null,
    onboardingStep: 0,
  }),
}));
