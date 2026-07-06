import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

/* ─── Keys ─── */

export const dashboardKeys = {
  summary: ['dashboard', 'summary'] as const,
  sales: {
    summary: ['dashboard', 'sales', 'summary'] as const,
    promotions: ['dashboard', 'sales', 'promotions'] as const,
    vouchers: ['dashboard', 'sales', 'vouchers'] as const,
    qr: ['dashboard', 'sales', 'qr'] as const,
    events: ['dashboard', 'sales', 'events'] as const,
    rotators: ['dashboard', 'sales', 'rotators'] as const,
    gamification: ['dashboard', 'sales', 'gamification'] as const,
    activation: ['dashboard', 'sales', 'activation'] as const,
    analytics: ['dashboard', 'sales', 'analytics'] as const,
    automations: ['dashboard', 'sales', 'automations'] as const,
    interest: ['dashboard', 'sales', 'interest'] as const,
    live: ['dashboard', 'sales', 'live'] as const,
  },
};

/* ─── Summary ─── */

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: () =>
      api.get('/dashboard/summary').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Sales Summary ─── */

export function useSalesSummary() {
  return useQuery({
    queryKey: dashboardKeys.sales.summary,
    queryFn: () =>
      api.get('/dashboard/sales/summary').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Promotions ─── */

export function usePromotions() {
  return useQuery({
    queryKey: dashboardKeys.sales.promotions,
    queryFn: () =>
      api.get('/dashboard/sales/promotions').then((r) => r.data.data ?? r.data),
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/promotions', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.promotions });
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/dashboard/sales/promotions/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.promotions });
    },
  });
}

/* ─── Vouchers ─── */

export function useVouchers() {
  return useQuery({
    queryKey: dashboardKeys.sales.vouchers,
    queryFn: () =>
      api.get('/dashboard/sales/vouchers').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/vouchers', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.vouchers });
    },
  });
}

/* ─── QR Codes ─── */

export function useQRCodes() {
  return useQuery({
    queryKey: dashboardKeys.sales.qr,
    queryFn: () =>
      api.get('/dashboard/sales/qr').then((r) => r.data.data ?? r.data),
  });
}

export function useGenerateQR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/qr/generate', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.qr });
    },
  });
}

/* ─── Events ─── */

export function useSalesEvents() {
  return useQuery({
    queryKey: dashboardKeys.sales.events,
    queryFn: () =>
      api.get('/dashboard/sales/events').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateSalesEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/events', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.events });
    },
  });
}

export function useUpdateSalesEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Record<string, unknown>) =>
      api.put(`/dashboard/sales/events/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.events });
    },
  });
}

export function useCheckInEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/dashboard/sales/events/${id}/check-in`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.events });
    },
  });
}

/* ─── Rotators ─── */

export function useRotators() {
  return useQuery({
    queryKey: dashboardKeys.sales.rotators,
    queryFn: () =>
      api.get('/dashboard/sales/rotators').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateRotator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/rotators', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.rotators });
    },
  });
}

/* ─── Gamification ─── */

export function useSalesGamification() {
  return useQuery({
    queryKey: dashboardKeys.sales.gamification,
    queryFn: () =>
      api.get('/dashboard/sales/gamification').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateSalesGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/gamification', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.gamification });
    },
  });
}

/* ─── Activation ─── */

export function useSalesActivation() {
  return useQuery({
    queryKey: dashboardKeys.sales.activation,
    queryFn: () =>
      api.get('/dashboard/sales/activation').then((r) => r.data.data ?? r.data),
  });
}

export function useRegisterSalesBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/activation/register', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.activation });
    },
  });
}

/* ─── Analytics ─── */

export function useSalesAnalytics() {
  return useQuery({
    queryKey: dashboardKeys.sales.analytics,
    queryFn: () =>
      api.get('/dashboard/sales/analytics').then((r) => r.data.data ?? r.data),
  });
}

/* ─── Automations ─── */

export function useAutomations() {
  return useQuery({
    queryKey: dashboardKeys.sales.automations,
    queryFn: () =>
      api.get('/dashboard/sales/automations').then((r) => r.data.data ?? r.data),
  });
}

export function useCreateAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/automations', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.sales.automations });
    },
  });
}

/* ─── AI ─── */

export function useAISuggest() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/ai/suggest', payload).then((r) => r.data),
  });
}

/* ─── Interest & Live ─── */

export function useInterestSignals() {
  return useQuery({
    queryKey: dashboardKeys.sales.interest,
    queryFn: () =>
      api.get('/dashboard/sales/interest').then((r) => r.data.data ?? r.data),
  });
}

export function useLiveMonitoring() {
  return useQuery({
    queryKey: dashboardKeys.sales.live,
    queryFn: () =>
      api.get('/dashboard/sales/live').then((r) => r.data.data ?? r.data),
    refetchInterval: 30_000,
  });
}

/* ─── Notifications ─── */

export function useSendSalesNotification() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post('/dashboard/sales/notifications', payload).then((r) => r.data),
  });
}
