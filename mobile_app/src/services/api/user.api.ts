import { WatchHistoryItem } from '../../types';
import { API_BASE_URL, getHeaders, getAuthToken } from './client';

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
    return !!json.success;
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
