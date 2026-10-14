import { UserProfile } from '../../types';
import {
  API_BASE_URL,
  WEB_API_BASE_URL,
  CLOUD_WEB_API_URL,
  getHeaders,
  getAuthToken,
  setAuthToken,
  apiFetch,
} from './client';

// 1. User Login (يدعم كلا من API تطبيق الهاتف وAPI الموقع الموحد مع سقوط احتياطي ذكي)
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      const token = json.data.token || json.data.accessToken;
      if (token) setAuthToken(token);
      return { user: json.data };
    }
  } catch (_) {}

  try {
    const webRes = await fetch(`${WEB_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const webJson = await webRes.json();
    if (webJson.ok && webJson.data) {
      const token = webJson.data.accessToken || webJson.data.token;
      if (token) setAuthToken(token);
      const u = webJson.data.user || webJson.data;
      return {
        user: {
          id: u.id,
          name: u.name || email.split('@')[0],
          email: u.email || email,
          role: u.role || 'user',
          isVip: u.isVip ?? false,
          avatar: u.avatar || null,
        },
      };
    }
    return { user: null, error: webJson.error?.message || webJson.error || 'فشل تسجيل الدخول' };
  } catch (error: any) {
    return { user: null, error: error.message || 'خطأ في الاتصال بالخادم' };
  }
}

// 2. User Registration (إنشاء حساب جديد عبر API الحقيقي مع السقوط الاحتياطي)
export async function registerUser(payload: {
  name?: string;
  username: string;
  email: string;
  password: string;
  genres?: string[];
}): Promise<{ user: UserProfile | null; error?: string }> {
  const reqBody = {
    name: payload.name?.trim() || payload.username.trim(),
    email: payload.email.trim(),
    password: payload.password,
    username: payload.username.trim(),
  };

  try {
    // 1. Try mobile registration route
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });
    const json = await res.json();
    if (json.success && json.data) {
      if (json.data.token) {
        setAuthToken(json.data.token);
      }
      return { user: json.data };
    }
  } catch (_) {}

  try {
    // 2. Try web auth register endpoint on cloud backend
    const webRes = await fetch(`${CLOUD_WEB_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });
    const webJson = await webRes.json();
    if (webJson.ok && webJson.data?.user) {
      const u = webJson.data.user;
      if (webJson.data.accessToken) {
        setAuthToken(webJson.data.accessToken);
      }
      const userProfile: UserProfile = {
        id: u.id,
        name: u.name || payload.username,
        email: u.email,
        role: u.role || 'user',
        isVip: false,
        avatar: u.avatar || null,
      };
      return { user: userProfile };
    }
    return {
      user: null,
      error: webJson.error?.message || webJson.error || 'تعذر إتمام التسجيل. تأكد من صحة البيانات.',
    };
  } catch (error: any) {
    console.error('Registration API error:', error);
    return { user: null, error: error.message || 'خطأ في الاتصال بالخادم أثناء التسجيل' };
  }
}

// 3. User Profile (Me)
export async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const token = getAuthToken();
    if (!token) return null;

    // 1. Try unified web API
    const webRes = await apiFetch<any>(`${WEB_API_BASE_URL}/me`);
    if (webRes.success && webRes.data) {
      const d = webRes.data;
      return {
        id: d.id,
        name: d.name || d.username,
        email: d.email,
        role: d.role || 'user',
        isVip: d.isVip ?? false,
        avatar: d.avatar || null,
        watchlist: d.watchlist || [],
      };
    }
  } catch (_) {}

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.warn('Fetch user profile error:', error);
    return null;
  }
}

