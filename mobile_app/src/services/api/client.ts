import { StorageService } from '../storage';

export const CLOUD_API_BASE_URL = 'https://slam-dunk-w.vercel.app/api/mobile/v1';
export const CLOUD_WEB_API_URL = 'https://slam-dunk-w.vercel.app/api/v1';

// Default host: connect to cloud production backend by default, can be overridden
export let API_BASE_URL = CLOUD_API_BASE_URL;

let authToken: string | null = null;

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url;
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
    ...extraHeaders,
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};
