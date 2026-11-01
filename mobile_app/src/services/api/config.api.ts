import { AppConfig } from '../../types';
import { API_BASE_URL, CLOUD_API_BASE_URL, getHeaders } from './client';

export async function fetchAppConfig(): Promise<AppConfig | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/config`, { headers: getHeaders() });
    const json = await res.json();
    if ((json.success || json.ok) && json.data) {
      return json.data as AppConfig;
    }
  } catch (error: any) {
    console.warn('Config fetch local error, trying cloud fallback:', error.message);
    try {
      const res = await fetch(`${CLOUD_API_BASE_URL}/config`);
      const json = await res.json();
      if ((json.success || json.ok) && json.data) return json.data as AppConfig;
    } catch (_) {}
  }
  return null;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { headers: getHeaders() });
    const json = await res.json();
    return !!(json.success || json.ok);
  } catch (_) {
    return false;
  }
}
