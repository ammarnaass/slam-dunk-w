import { StorageService } from '../storage';

export const CLOUD_BASE_HOST = 'https://slam-dunk-w.vercel.app';
export const CLOUD_API_BASE_URL = `${CLOUD_BASE_HOST}/api/mobile/v1`;
export const CLOUD_WEB_API_URL = `${CLOUD_BASE_HOST}/api/v1`;

// Default host: connect to cloud production backend by default, can be overridden
export let API_BASE_URL = CLOUD_API_BASE_URL;
export let WEB_API_BASE_URL = CLOUD_WEB_API_URL;

let authToken: string | null = null;
let isRefreshing = false;

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url.trim();
  // If the user specified a custom host like http://10.0.2.2:3000, adapt web v1 url accordingly
  if (API_BASE_URL.includes('/api/mobile/v1')) {
    WEB_API_BASE_URL = API_BASE_URL.replace('/api/mobile/v1', '/api/v1');
  } else if (!API_BASE_URL.endsWith('/api/v1')) {
    WEB_API_BASE_URL = `${API_BASE_URL.replace(/\/$/, '')}/api/v1`;
  }
};

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    StorageService.setToken(token).catch((e) =>
      console.error('Error persisting token:', e)
    );
  } else {
    StorageService.removeToken().catch((e) =>
      console.error('Error removing persisted token:', e)
    );
  }
};

export const getAuthToken = () => authToken;

export const initAuthToken = async (): Promise<string | null> => {
  try {
    const savedToken = await StorageService.getToken();
    if (savedToken) {
      authToken = savedToken;
    }
    return savedToken;
  } catch (error) {
    console.error('Error initializing auth token:', error);
    return null;
  }
};

export const getHeaders = (extraHeaders: Record<string, string> = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-app-version': '1.0.0',
    'x-platform': 'android',
    'Accept-Language': 'ar',
    ...extraHeaders,
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

/**
 * Robust API Fetch Wrapper with Automatic 401 Token Refresh & Error Normalization
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; status: number }> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : endpoint.startsWith('/api/v1')
    ? `${CLOUD_BASE_HOST}${endpoint}`
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = getHeaders(
    (options.headers as Record<string, string>) || {}
  );

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized -> Attempt Silent Refresh once
    if (res.status === 401 && authToken && !isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${WEB_API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: getHeaders(),
        });
        const refreshJson = await refreshRes.json();
        if (refreshJson.ok && refreshJson.data?.accessToken) {
          setAuthToken(refreshJson.data.accessToken);
          // Retry original request with new token
          const retryHeaders = getHeaders(
            (options.headers as Record<string, string>) || {}
          );
          const retryRes = await fetch(url, {
            ...options,
            headers: retryHeaders,
          });
          const retryJson = await retryRes.json();
          return {
            success: retryRes.ok && (retryJson.success ?? retryJson.ok ?? true),
            data: retryJson.data ?? retryJson,
            error: retryJson.error?.message || retryJson.error,
            status: retryRes.status,
          };
        }
      } catch (refreshErr) {
        console.warn('Silent token refresh failed:', refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const json = await res.json().catch(() => null);
    const success = res.ok && (json?.success ?? json?.ok ?? true);

    return {
      success,
      data: json?.data ?? json,
      error: json?.error?.message || json?.error || (res.ok ? undefined : `HTTP Error ${res.status}`),
      status: res.status,
    };
  } catch (error: any) {
    console.warn(`Network error requesting ${url}:`, error.message);
    return {
      success: false,
      error: error.message || 'خطأ في الاتصال بالشبكة',
      status: 0,
    };
  }
}
