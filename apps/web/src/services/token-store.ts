const ACCESS_TOKEN_KEY = 'mcom_access_token';
const REFRESH_TOKEN_KEY = 'mcom_refresh_token';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return accessToken;
}

export function getRefreshToken(): string | null {
  if (refreshToken) return refreshToken;
  if (typeof window !== 'undefined') {
    refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return refreshToken;
}

export function setTokens(access: string, refresh?: string): void {
  accessToken = access;
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  }
  if (refresh) {
    refreshToken = refresh;
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    }
  }
}

export function clearTokens(): void {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function hasToken(): boolean {
  return !!getAccessToken();
}
