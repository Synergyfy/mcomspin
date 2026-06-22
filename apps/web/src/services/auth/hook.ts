import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { setTokens, clearTokens, hasToken } from '../token-store';
import { useAuthStore } from '@/store/auth-store';

/* ─── Types ─── */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface BusinessRegisterPayload {
  businessName: string;
  contactName: string;
  email: string;
  password: string;
  businessType: string;
  phone?: string;
}

export interface CustomerRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CustomerLoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

/* ─── Helpers ─── */

function saveTokens(data: AuthResponse) {
  setTokens(data.accessToken, data.refreshToken);
}

function setUserFromAuth(data: AuthResponse) {
  const { setUser } = useAuthStore.getState();
  setUser({
    id: data.user.id,
    name: data.user.name ?? `${data.user.firstName ?? ''} ${data.user.lastName ?? ''}`.trim(),
    email: data.user.email,
    role: data.user.role || (data.user as any).roles?.[0] || '',
  });
}

const userKeys = {
  me: ['user', 'me'] as const,
};

/* ─── Hooks ─── */

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      api.post<{ success: boolean; data: AuthResponse }>('/auth/login', payload).then((r) => r.data.data),
    onSuccess: (data) => {
      saveTokens(data);
      setUserFromAuth(data);
      queryClient.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.post<{ success: boolean; data: AuthResponse }>('/auth/register', payload).then((r) => r.data.data),
    onSuccess: (data) => {
      saveTokens(data);
      setUserFromAuth(data);
      queryClient.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () =>
      api.post('/auth/logout').then((r) => r.data),
    onSuccess: () => {
      clearTokens();
      useAuthStore.getState().clearUser();
    },
    onError: () => {
      clearTokens();
      useAuthStore.getState().clearUser();
    },
  });
}

export function useBusinessRegister() {
  return useMutation({
    mutationFn: (payload: BusinessRegisterPayload) =>
      api.post<{ success: boolean; data: AuthResponse }>('/auth/business/register', payload).then((r) => r.data.data),
  });
}

export function useCustomerRegister() {
  return useMutation({
    mutationFn: (payload: CustomerRegisterPayload) =>
      api.post<{ success: boolean; data: AuthResponse }>('/auth/customer/register', payload).then((r) => r.data.data),
  });
}

export function useCustomerLogin() {
  return useMutation({
    mutationFn: (payload: CustomerLoginPayload) =>
      api.post<{ success: boolean; data: AuthResponse }>('/auth/customer/login', payload).then((r) => r.data.data),
    onSuccess: (data) => {
      saveTokens(data);
      setUserFromAuth(data);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      api.post('/auth/customer/forgot-password', payload).then((r) => r.data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      api.post('/auth/customer/reset-password', payload).then((r) => r.data),
  });
}

export function useCurrentUser() {
  const { setUser, user } = useAuthStore();
  const tokenExists = typeof window !== 'undefined' && hasToken();
  return useQuery({
    queryKey: userKeys.me,
    queryFn: () =>
      api.get<{ success: boolean; data: any }>('/users/me').then((r) => r.data.data),
    enabled: typeof window !== 'undefined',
    staleTime: 60_000,
    retry: false,
    select: (data) => {
      const mapped = {
        id: data.id,
        name: data.name ?? `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
        email: data.email,
        role: data.role || data.roles?.[0]?.role?.name || '',
        businessName: data.businessName ?? data.business?.name,
        avatar: data.avatar,
      };
      if (!user) setUser(mapped);
      return mapped;
    },
  });
}
