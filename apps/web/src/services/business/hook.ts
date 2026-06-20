import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

/* ─── Keys ─── */

export const businessKeys = {
  profile: ['business', 'profile'] as const,
  billing: ['business', 'billing'] as const,
  locations: ['business', 'locations'] as const,
  staff: ['business', 'staff'] as const,
  customers: {
    all: ['business', 'customers'] as const,
    detail: (id: string) => ['business', 'customers', id] as const,
  },
  campaigns: {
    all: ['business', 'campaigns'] as const,
    detail: (id: string) => ['business', 'campaigns', id] as const,
  },
  rewards: {
    all: ['business', 'rewards'] as const,
    detail: (id: string) => ['business', 'rewards', id] as const,
  },
  redemptions: ['business', 'redemptions'] as const,
  game: ['business', 'game'] as const,
  analytics: ['business', 'analytics'] as const,
  localMall: {
    highStreet: ['business', 'local-mall', 'high-street'] as const,
    map: ['business', 'local-mall', 'map'] as const,
    partnerships: ['business', 'local-mall', 'partnerships'] as const,
    shareCampaigns: ['business', 'local-mall', 'share-campaigns'] as const,
    visibility: ['business', 'local-mall', 'visibility'] as const,
    community: ['business', 'local-mall', 'community'] as const,
    clusters: ['business', 'local-mall', 'clusters'] as const,
    expo: ['business', 'local-mall', 'expo'] as const,
    hub: ['business', 'local-mall', 'hub'] as const,
    notifications: ['business', 'local-mall', 'notifications'] as const,
  },
};

/* ─── Profile ─── */

export function useBusinessProfile() {
  return useQuery({
    queryKey: businessKeys.profile,
    queryFn: () =>
      api.get('/business/profile').then((r) => r.data.data ?? r.data),
  });
}

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.put('/business/profile', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.profile });
    },
  });
}

export function useUpdateBusinessSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.put('/business/settings', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.profile });
    },
  });
}

/* ─── Billing ─── */

export function useBusinessBilling() {
  return useQuery({
    queryKey: businessKeys.billing,
    queryFn: () =>
      api.get('/business/billing').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Locations ─── */

export function useLocations() {
  return useQuery({
    queryKey: businessKeys.locations,
    queryFn: () =>
      api.get('/business/locations').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/locations', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.locations });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/business/locations/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.locations });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/business/locations/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.locations });
    },
  });
}

/* ─── Staff ─── */

export function useStaff() {
  return useQuery({
    queryKey: businessKeys.staff,
    queryFn: () =>
      api.get('/business/staff').then((r) => r.data.data ?? r.data),
  });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/staff', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.staff });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/business/staff/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.staff });
    },
  });
}

export function useRemoveStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/business/staff/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.staff });
    },
  });
}

/* ─── Customers ─── */

export function useBusinessCustomers() {
  return useQuery({
    queryKey: businessKeys.customers.all,
    queryFn: () =>
      api.get('/business/customers').then((r) => r.data.data ?? r.data),
  });
}

export function useBusinessCustomer(id: string) {
  return useQuery({
    queryKey: businessKeys.customers.detail(id),
    queryFn: () =>
      api.get(`/business/customers/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

/* ─── Campaigns ─── */

export function useBusinessCampaigns() {
  return useQuery({
    queryKey: businessKeys.campaigns.all,
    queryFn: () =>
      api.get('/business/campaigns').then((r) => r.data.data ?? r.data),
  });
}

export function useBusinessCampaign(id: string) {
  return useQuery({
    queryKey: businessKeys.campaigns.detail(id),
    queryFn: () =>
      api.get(`/business/campaigns/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

export function useCreateBusinessCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/campaigns', payload).then((r) => r.data.data ?? r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.campaigns.all });
    },
  });
}

export function useUpdateBusinessCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/business/campaigns/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.campaigns.all });
    },
  });
}

export function useDeleteBusinessCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/business/campaigns/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.campaigns.all });
    },
  });
}

/* ─── Rewards ─── */

export function useBusinessRewards() {
  return useQuery({
    queryKey: businessKeys.rewards.all,
    queryFn: () =>
      api.get('/business/rewards').then((r) => r.data.data ?? r.data),
  });
}

export function useBusinessReward(id: string) {
  return useQuery({
    queryKey: businessKeys.rewards.detail(id),
    queryFn: () =>
      api.get(`/business/rewards/${id}`).then((r) => r.data.data ?? r.data),
    enabled: !!id,
  });
}

export function useCreateBusinessReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/rewards', payload).then((r) => r.data.data ?? r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.rewards.all });
    },
  });
}

export function useUpdateBusinessReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/business/rewards/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.rewards.all });
    },
  });
}

export function useDeleteBusinessReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/business/rewards/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.rewards.all });
    },
  });
}

/* ─── Redemptions ─── */

export function useBusinessRedemptions() {
  return useQuery({
    queryKey: businessKeys.redemptions,
    queryFn: () =>
      api.get('/business/redemptions').then((r) => r.data.data ?? r.data),
  });
}

export function useApproveRedemption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.put(`/business/redemptions/${id}/approve`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.redemptions });
    },
  });
}

/* ─── Game ─── */

export function useBusinessGame() {
  return useQuery({
    queryKey: businessKeys.game,
    queryFn: () =>
      api.get('/business/game').then((r) => r.data.data ?? r.data),
  });
}

export function useUpdateBusinessGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.put('/business/game', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.game });
    },
  });
}

/* ─── Analytics ─── */

export function useBusinessAnalytics() {
  return useQuery({
    queryKey: businessKeys.analytics,
    queryFn: () =>
      api.get('/business/analytics').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Notifications ─── */

export function useSendBusinessNotification() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/notifications/send', payload).then((r) => r.data),
  });
}

/* ─── Local Mall ─── */

export function useLocalMallHighStreet() {
  return useQuery({
    queryKey: businessKeys.localMall.highStreet,
    queryFn: () =>
      api.get('/business/local-mall/high-street').then((r) => r.data.data ?? r.data),
  });
}

export function useLocalMallMap() {
  return useQuery({
    queryKey: businessKeys.localMall.map,
    queryFn: () =>
      api.get('/business/local-mall/map').then((r) => r.data.data ?? r.data),
  });
}

export function useLocalMallPartnerships() {
  return useQuery({
    queryKey: businessKeys.localMall.partnerships,
    queryFn: () =>
      api.get('/business/local-mall/partnerships').then((r) => r.data.data ?? r.data),
  });
}

export function useRequestPartnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/local-mall/partnerships/request', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.localMall.partnerships });
    },
  });
}

export function useUpdatePartnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/business/local-mall/partnerships/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.localMall.partnerships });
    },
  });
}

export function useEndPartnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/business/local-mall/partnerships/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.localMall.partnerships });
    },
  });
}

export function useLocalMallShareCampaigns() {
  return useQuery({
    queryKey: businessKeys.localMall.shareCampaigns,
    queryFn: () =>
      api.get('/business/local-mall/share-campaigns').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateSharedCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/local-mall/share-campaigns', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.localMall.shareCampaigns });
    },
  });
}

export function useLocalMallVisibility() {
  return useQuery({
    queryKey: businessKeys.localMall.visibility,
    queryFn: () =>
      api.get('/business/local-mall/visibility').then((r) => r.data.data ?? r.data),
  });
}

export function useUpdateVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.put('/business/local-mall/visibility', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.localMall.visibility });
    },
  });
}

export function useBoostVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/local-mall/visibility/boost', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.localMall.visibility });
    },
  });
}

export function useLocalMallCommunity() {
  return useQuery({
    queryKey: businessKeys.localMall.community,
    queryFn: () =>
      api.get('/business/local-mall/community').then((r) => r.data.data ?? r.data),
  });
}

export function useActivateCommunityBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/local-mall/community/activate', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.localMall.community });
    },
  });
}

export function useLocalMallClusters() {
  return useQuery({
    queryKey: businessKeys.localMall.clusters,
    queryFn: () =>
      api.get('/business/local-mall/clusters').then((r) => r.data.data ?? r.data),
  });
}

export function useJoinCluster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/local-mall/clusters/join', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.localMall.clusters });
    },
  });
}

export function useLocalMallExpo() {
  return useQuery({
    queryKey: businessKeys.localMall.expo,
    queryFn: () =>
      api.get('/business/local-mall/expo').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateExpoBooth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/business/local-mall/expo/booth', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.localMall.expo });
    },
  });
}

export function useLocalMallHub() {
  return useQuery({
    queryKey: businessKeys.localMall.hub,
    queryFn: () =>
      api.get('/business/local-mall/hub').then((r) => r.data.data ?? r.data),
  });
}

export function useLocalMallNotifications() {
  return useQuery({
    queryKey: businessKeys.localMall.notifications,
    queryFn: () =>
      api.get('/business/local-mall/notifications').then((r) => r.data.data ?? r.data),
  });
}
