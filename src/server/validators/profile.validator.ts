import { z } from "zod";

export const streamingPreferencesSchema = z.object({
    audioLanguage: z.enum(["dubbed", "subbed"]).default("dubbed"),
    quality: z.enum(["4k", "1080p", "720p", "auto"]).default("1080p"),
    autoplay: z.boolean().default(true),
    favoritePlanet: z.string().optional()
});

export const updateProfileSchema = z.object({
    username: z.string().min(2, "اسم المستخدم يجب أن يكون حرفين على الأقل").max(50, "اسم المستخدم يجب ألا يتجاوز 50 حرفاً").optional(),
    name: z.string().min(2).max(50).optional(),
    email: z.string().email("صيغة البريد الإلكتروني غير صالحة").optional(),
    avatar: z.string().optional().nullable(),
    profileImage: z.string().optional().nullable(),
    bannerImage: z.string().optional().nullable(),
    bio: z.string().max(180, "النبذة التعريفية يجب ألا تتجاوز 180 حرفاً").optional().nullable(),
    otakuTitle: z.string().max(40).optional().nullable(),
    auraColor: z.string().max(20).optional().nullable(),
    gender: z.string().optional().nullable(),
    phoneNumber: z.string().max(20).optional().nullable(),
    birthDate: z.string().optional().nullable(),
    currentPassword: z.string().optional().nullable(),
    password: z.string().optional().nullable(),
    newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل").optional().or(z.literal("")).nullable(),
    preferences: streamingPreferencesSchema.partial().optional()
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
