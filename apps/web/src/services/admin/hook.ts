import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

/* ─── Keys ─── */

export const adminKeys = {
  dashboard: ['admin', 'dashboard'] as const,
  businesses: {
    all: ['admin', 'businesses'] as const,
    detail: (id: string) => ['admin', 'businesses', id] as const,
  },
  customers: {
    all: ['admin', 'customers'] as const,
    detail: (id: string) => ['admin', 'customers', id] as const,
  },
  campaigns: {
    all: ['admin', 'campaigns'] as const,
    detail: (id: string) => ['admin', 'campaigns', id] as const,
  },
  analytics: ['admin', 'analytics'] as const,
  games: ['admin', 'games'] as const,
  rewards: {
    all: ['admin', 'rewards'] as const,
    detail: (id: string) => ['admin', 'rewards', id] as const,
  },
  redemptions: ['admin', 'redemptions'] as const,
  partners: ['admin', 'partners'] as const,
  settings: ['admin', 'settings'] as const,
};

/* ─── Dashboard ─── */

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: () =>
      api.get('/admin/dashboard').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Businesses ─── */

export function useAdminBusinesses() {
  return useQuery({
    queryKey: adminKeys.businesses.all,
    queryFn: () =>
      api.get('/admin/businesses').then((r) => r.data.data ?? r.data),
  });
}

export function useAdminBusiness(id: string) {
  return useQuery({
    queryKey: adminKeys.businesses.detail(id),
    queryFn: () =>
      api.get(`/admin/businesses/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

export function useUpdateAdminBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/admin/businesses/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.businesses.all });
    },
  });
}

/* ─── Customers ─── */

export function useAdminCustomers() {
  return useQuery({
    queryKey: adminKeys.customers.all,
    queryFn: () =>
      api.get('/admin/customers').then((r) => r.data.data ?? r.data),
  });
}

export function useAdminCustomer(id: string) {
  return useQuery({
    queryKey: adminKeys.customers.detail(id),
    queryFn: () =>
      api.get(`/admin/customers/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

export function useUpdateAdminCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/admin/customers/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.customers.all });
    },
  });
}

/* ─── Campaigns ─── */

export function useAdminCampaigns() {
  return useQuery({
    queryKey: adminKeys.campaigns.all,
    queryFn: () =>
      api.get('/admin/campaigns').then((r) => r.data.data ?? r.data),
  });
}

export function useAdminCampaign(id: string) {
  return useQuery({
    queryKey: adminKeys.campaigns.detail(id),
    queryFn: () =>
      api.get(`/admin/campaigns/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

export function useCreateAdminCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/admin/campaigns', payload).then((r) => r.data.data ?? r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.campaigns.all });
    },
  });
}

export function useUpdateAdminCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/admin/campaigns/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.campaigns.all });
    },
  });
}

export function useDeleteAdminCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/admin/campaigns/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.campaigns.all });
    },
  });
}

/* ─── Analytics ─── */

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics,
    queryFn: () =>
      api.get('/admin/analytics').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Games ─── */

export function useAdminGames() {
  return useQuery({
    queryKey: adminKeys.games,
    queryFn: () =>
      api.get('/admin/games').then((r) => r.data.data ?? r.data),
  });
}

export function useUpdateAdminGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/admin/games/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.games });
    },
  });
}

/* ─── Rewards ─── */

export function useAdminRewards() {
  return useQuery({
    queryKey: adminKeys.rewards.all,
    queryFn: () =>
      api.get('/admin/rewards').then((r) => r.data.data ?? r.data),
  });
}

export function useAdminReward(id: string) {
  return useQuery({
    queryKey: adminKeys.rewards.detail(id),
    queryFn: () =>
      api.get(`/admin/rewards/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

export function useCreateAdminReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/admin/rewards', payload).then((r) => r.data.data ?? r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.rewards.all });
    },
  });
}

export function useUpdateAdminReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/admin/rewards/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.rewards.all });
    },
  });
}

export function useDeleteAdminReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/admin/rewards/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.rewards.all });
    },
  });
}

/* ─── Redemptions ─── */

export function useAdminRedemptions() {
  return useQuery({
    queryKey: adminKeys.redemptions,
    queryFn: () =>
      api.get('/admin/redemptions').then((r) => r.data.data ?? r.data),
  });
}

export function useUpdateAdminRedemption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/admin/redemptions/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.redemptions });
    },
  });
}

/* ─── Partners ─── */

export function useAdminPartners() {
  return useQuery({
    queryKey: adminKeys.partners,
    queryFn: () =>
      api.get('/admin/partners').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateAdminPartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/admin/partners', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.partners });
    },
  });
}

export function useUpdateAdminPartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/admin/partners/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.partners });
    },
  });
}

/* ─── Settings ─── */

export function useAdminSettings() {
  return useQuery({
    queryKey: adminKeys.settings,
    queryFn: () =>
      api.get('/admin/settings').then((r) => r.data.data ?? r.data),
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.put('/admin/settings', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.settings });
    },
  });
}
