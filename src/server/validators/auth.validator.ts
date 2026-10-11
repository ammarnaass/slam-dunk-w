import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "الاسم يجب أن يتكون من حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف"),
    deviceName: z.string().optional()
});

export const loginSchema = z.object({
    email: z.string().min(1, "يرجى إدخال البريد الإلكتروني أو اسم المستخدم"),
    password: z.string().min(1, "يرجى إدخال كلمة المرور"),
    deviceName: z.string().optional()
});

export const googleAuthSchema = z.object({
    idToken: z.string().min(10, "رمز Google idToken غير صالح"),
    deviceName: z.string().optional()
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(10, "رمز التجديد refreshToken غير صالح")
});

export const updateMeSchema = z.object({
    name: z.string().min(2, "الاسم يجب أن يتكون من حرفين على الأقل").optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    phoneNumber: z.string().optional(),
    birthDate: z.string().optional(),
    avatar: z.string().optional()
});
