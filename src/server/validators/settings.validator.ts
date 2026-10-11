import { z } from "zod";

const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const updateSiteIdentitySchema = z.object({
    siteName: z.string()
        .min(2, "اسم الموقع يجب أن يحتوي على حرفين على الأقل")
        .max(60, "اسم الموقع لا يمكن أن يتجاوز 60 حرفاً"),
    siteNameEn: z.string().max(60, "اسم الموقع بالإنجليزية لا يتجاوز 60 حرفاً").optional(),
    siteDescription: z.string().max(500, "وصف الموقع لا يتجاوز 500 حرف").optional().default(""),
    logoUrl: z.string().min(1, "رابط أو بيانات الشعار مطلوبة"),
    faviconUrl: z.string().optional().default(""),
    brandColor: z.string().regex(hexColorRegex, "صيغة لون الهوية غير صالحة (مثال: #dc2626)").optional().default("#dc2626"),
    accentColor: z.string().regex(hexColorRegex, "صيغة اللون التكميلي غير صالحة (مثال: #ffb95f)").optional().default("#ffb95f")
});

export const updateSiteSettingsSchema = z.object({
    siteName: z.string().min(2, "اسم الموقع يجب أن يحتوي على حرفين على الأقل").max(60).optional(),
    siteNameEn: z.string().max(60).optional(),
    siteDescription: z.string().max(500).optional(),
    logoUrl: z.string().min(1, "رابط الشعار مطلوب").optional(),
    faviconUrl: z.string().optional(),
    brandColor: z.string().regex(hexColorRegex, "صيغة اللون غير صالحة").optional(),
    accentColor: z.string().regex(hexColorRegex, "صيغة اللون غير صالحة").optional(),
    currency: z.string().max(10).optional().default("ج.م"),
    maintenanceMode: z.boolean().optional().default(false),
    maintenanceMessage: z.string().max(300).optional().default("الموقع في وضع الصيانة حالياً."),
    socialLinks: z.object({
        facebook: z.string().optional().default(""),
        twitter: z.string().optional().default(""),
        instagram: z.string().optional().default(""),
        youtube: z.string().optional().default(""),
        telegram: z.string().optional().default(""),
        discord: z.string().optional().default("")
    }).optional(),
    admob: z.object({
        isEnabled: z.boolean().optional().default(false),
        appId: z.string().optional().default(""),
        bannerId: z.string().optional().default(""),
        interstitialId: z.string().optional().default(""),
        rewardedId: z.string().optional().default("")
    }).optional(),
    apiApp: z.record(z.string(), z.any()).optional(),
    sliderAnimeIds: z.array(z.string()).optional()
});
