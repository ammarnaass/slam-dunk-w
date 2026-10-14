import { WatchHistoryItem } from '../../types';
import {
  API_BASE_URL,
  WEB_API_BASE_URL,
  getHeaders,
  getAuthToken,
  apiFetch,
} from './client';

// 1. Record Watch History
export async function recordWatchHistory(
  animeId: string,
  episodeId: string,
  progress: number
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) return false;
    const res = await fetch(`${API_BASE_URL}/history`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ animeId, episodeId, progress }),
    });
    const json = await res.json();
    return !!(json.success ?? json.ok);
  } catch (error) {
    console.warn('Record history error:', error);
    return false;
  }
}

// 2. Fetch Watch History
export async function fetchWatchHistory(): Promise<WatchHistoryItem[]> {
  try {
    const token = getAuthToken();
    if (!token) return [];
    
    // 1. Try web v1 history
    const webRes = await apiFetch<WatchHistoryItem[]>(`${WEB_API_BASE_URL}/me/history`);
    if (webRes.success && Array.isArray(webRes.data)) {
      return webRes.data;
    }

    // 2. Fallback to mobile history
    const res = await fetch(`${API_BASE_URL}/history`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (error) {
    console.warn('Fetch watch history error:', error);
    return [];
  }
}

// 3. Fetch Continue Watching List (مزامنة استئناف المشاهدة السحابية)
export async function fetchContinueWatching(): Promise<any[]> {
  try {
    const token = getAuthToken();
    if (!token) return [];

    const res = await apiFetch<any[]>(`${WEB_API_BASE_URL}/me/continue-watching`);
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.warn('Fetch continue watching error:', error);
    return [];
  }
}

// 4. Sync Watch Progress (حفظ تقدم المشاهدة بالثانية إلى الخادم)
export async function syncWatchProgress(
  episodeId: string,
  positionSeconds: number,
  durationSeconds: number
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const res = await apiFetch(`${WEB_API_BASE_URL}/me/progress/${episodeId}`, {
      method: 'PUT',
      body: JSON.stringify({
        positionSeconds: Math.floor(positionSeconds),
        durationSeconds: Math.floor(durationSeconds),
      }),
    });
    return res.success;
  } catch (error) {
    console.warn('Sync watch progress error:', error);
    return false;
  }
}

// 5. Fetch Favorites / Watchlist (جلب قائمة المفضلة السحابية)
export async function fetchFavorites(): Promise<any[]> {
  try {
    const token = getAuthToken();
    if (!token) return [];

    const res = await apiFetch<any[]>(`${WEB_API_BASE_URL}/me/favorites`);
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.warn('Fetch favorites error:', error);
    return [];
  }
}

// 6. Toggle Favorite (إضافة/إزالة عمل أو حلقة من المفضلة)
export async function toggleFavorite(
  type: 'anime' | 'episode',
  id: string,
  isFavorite: boolean
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) return false;

    // If isFavorite is true, we want to remove it (DELETE), else add it (PUT)
    const method = isFavorite ? 'DELETE' : 'PUT';
    const res = await apiFetch(`${WEB_API_BASE_URL}/me/favorites/${type}/${id}`, {
      method,
    });
    return res.success;
  } catch (error) {
    console.warn('Toggle favorite error:', error);
    return false;
  }
}

// 7. Update User Profile
export async function updateUserProfile(payload: {
  name?: string;
  bio?: string;
  avatar?: string;
  preferences?: any;
}): Promise<any> {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const res = await apiFetch(`${WEB_API_BASE_URL}/me`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  } catch (error) {
    console.warn('Update user profile error:', error);
    return null;
  }
}
