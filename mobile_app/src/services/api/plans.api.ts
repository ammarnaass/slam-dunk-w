import { Plan } from '../../types';
import { API_BASE_URL, CLOUD_API_BASE_URL, getHeaders } from './client';

// 1. Subscription Plans Catalog (باقات وخطط الاشتراك الحقيقية من API)
export async function fetchPlans(): Promise<Plan[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/plans`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
  } catch (error) {
    console.warn('Fetch plans primary error, trying fallback:', error);
  }

  try {
    const fallbackRes = await fetch(`${CLOUD_API_BASE_URL}/plans`);
    const fallbackJson = await fallbackRes.json();
    if (fallbackJson.success && Array.isArray(fallbackJson.data)) {
      return fallbackJson.data;
    }
  } catch (err) {
    console.warn('Fetch plans fallback error:', err);
  }

  return [];
}

// 2. Create Subscription Plan (إنشاء الخطة عبر API)
export async function createPlan(planData: {
  name: string;
  price: number;
  duration?: string;
  description?: string;
  features?: string[];
  isActive?: boolean;
}): Promise<{ plan: Plan | null; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/plans`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(planData),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return { plan: json.data };
    }
    return { plan: null, error: json.error || 'فشل إنشاء الخطة' };
  } catch (error: any) {
    console.warn('Create plan primary API failed, trying cloud endpoint:', error.message);
    try {
      const cloudRes = await fetch(`${CLOUD_API_BASE_URL}/plans`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(planData),
      });
      const cloudJson = await cloudRes.json();
      if (cloudJson.success && cloudJson.data) {
        return { plan: cloudJson.data };
      }
      return { plan: null, error: cloudJson.error || 'فشل إنشاء الخطة' };
    } catch (cloudErr: any) {
      console.error('Create plan cloud error:', cloudErr);
      return {
        plan: null,
        error: cloudErr.message || 'خطأ في الاتصال بالخادم أثناء إنشاء الخطة',
      };
    }
  }
}
