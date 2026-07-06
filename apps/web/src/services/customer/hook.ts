import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

/* ─── Keys ─── */

export const customerKeys = {
  dashboard: ['customer', 'dashboard'] as const,
  businesses: {
    all: ['customer', 'businesses'] as const,
    detail: (id: string) => ['customer', 'businesses', id] as const,
  },
  campaigns: {
    all: ['customer', 'campaigns'] as const,
    detail: (id: string) => ['customer', 'campaigns', id] as const,
  },
  discover: (params?: Record<string, string>) => ['customer', 'discover', params] as const,
  games: {
    eligibility: ['customer', 'games', 'eligibility'] as const,
  },
  activity: ['customer', 'activity'] as const,
  notifications: ['customer', 'notifications'] as const,
  leaderboard: ['customer', 'leaderboard'] as const,
  achievements: ['customer', 'leaderboard', 'achievements'] as const,
  rewards: {
    all: ['customer', 'rewards'] as const,
    detail: (id: string) => ['customer', 'rewards', id] as const,
    history: ['customer', 'rewards', 'history'] as const,
  },
  referrals: ['customer', 'referrals'] as const,
};

/* ─── Profile ─── */

export function useUpdateCustomerProfile() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.put('/customer/profile', payload).then((r) => r.data),
  });
}

/* ─── Dashboard ─── */

export function useCustomerDashboard() {
  return useQuery({
    queryKey: customerKeys.dashboard,
    queryFn: () =>
      api.get('/customer/dashboard').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Businesses ─── */

export function useCustomerBusiness(id: string) {
  return useQuery({
    queryKey: customerKeys.businesses.detail(id),
    queryFn: () =>
      api.get(`/customer/businesses/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

export function useFollowBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/customer/businesses/${id}/follow`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.businesses.all });
    },
  });
}

/* ─── Campaigns ─── */

export function useCustomerCampaigns() {
  return useQuery({
    queryKey: customerKeys.campaigns.all,
    queryFn: () =>
      api.get('/customer/campaigns').then((r) => r.data.data ?? r.data),
  });
}

export function useCustomerCampaign(id: string) {
  return useQuery({
    queryKey: customerKeys.campaigns.detail(id),
    queryFn: () =>
      api.get(`/customer/campaigns/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

/* ─── Discover ─── */

export function useDiscover(params?: Record<string, string>) {
  return useQuery({
    queryKey: customerKeys.discover(params),
    queryFn: () =>
      api.get('/customer/discover', { params }).then((r) => r.data.data ?? r.data),
  });
}

/* ─── Games ─── */

export function useGameEligibility(params?: { gameId?: string; campaignId?: string }) {
  return useQuery({
    queryKey: [...customerKeys.games.eligibility, params],
    queryFn: () =>
      api.get('/customer/games/eligibility', { params }).then((r) => r.data.data ?? r.data),
  });
}

export function usePlayGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload?: Record<string, unknown>) =>
      api.post('/customer/games/play', payload).then((r) => r.data.data ?? r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.dashboard });
    },
  });
}

export function useDropBall() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { sessionId: string; boxIndex: number }) =>
      api.post('/customer/games/drop', payload).then((r) => r.data.data ?? r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.games.eligibility });
    },
  });
}

export function useClaimReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { sessionId: string }) =>
      api.post('/customer/games/claim', payload).then((r) => r.data.data ?? r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.rewards.all });
    },
  });
}

/* ─── Activity ─── */

export function useCustomerActivity(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...customerKeys.activity, params],
    queryFn: () =>
      api.get('/customer/activity', { params }).then((r) => r.data.data ?? r.data),
  });
}

export function useCustomerActivityInfinite() {
  return useQuery({
    queryKey: customerKeys.activity,
    queryFn: () =>
      api.get('/customer/activity', { params: { page: 1, limit: 50 } }).then((r) => r.data.data ?? r.data),
  });
}

/* ─── Notifications ─── */

export function useCustomerNotifications(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...customerKeys.notifications, params],
    queryFn: () =>
      api.get('/customer/notifications', { params }).then((r) => r.data.data ?? r.data),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.put(`/customer/notifications/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.notifications });
    },
  });
}

/* ─── Leaderboard ─── */

export function useLeaderboard() {
  return useQuery({
    queryKey: customerKeys.leaderboard,
    queryFn: () =>
      api.get('/customer/leaderboard').then((r) => r.data.data ?? r.data),
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: customerKeys.achievements,
    queryFn: () =>
      api.get('/customer/leaderboard/achievements').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Rewards ─── */

export function useCustomerRewards() {
  return useQuery({
    queryKey: customerKeys.rewards.all,
    queryFn: () =>
      api.get('/customer/rewards').then((r) => r.data.data ?? r.data),
  });
}

export function useCustomerReward(id: string) {
  return useQuery({
    queryKey: customerKeys.rewards.detail(id),
    queryFn: () =>
      api.get(`/customer/rewards/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

export function useRedeemReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { rewardId: string; qrCode?: string }) =>
      api.post('/customer/rewards/redeem', payload).then((r) => r.data.data ?? r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.rewards.all });
      queryClient.invalidateQueries({ queryKey: customerKeys.rewards.history });
    },
  });
}

export function useRedemptionHistory() {
  return useQuery({
    queryKey: customerKeys.rewards.history,
    queryFn: () =>
      api.get('/customer/rewards/history').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Referrals ─── */

export function useReferrals() {
  return useQuery({
    queryKey: customerKeys.referrals,
    queryFn: () =>
      api.get('/customer/referrals').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateReferral() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload?: Record<string, unknown>) =>
      api.post('/customer/referrals', payload).then((r) => r.data.data ?? r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.referrals });
    },
  });
}

/* ─── Settings ─── */

export function useUpdateCustomerSettings() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.put('/customer/settings', payload).then((r) => r.data),
  });
}
