import { z } from "zod";

export const updateUserAdminSchema = z.object({
    username: z.string().min(2, "اسم المستخدم يجب أن يكون حرفين على الأقل").optional(),
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").optional(),
    email: z.string().email("البريد الإلكتروني غير صالح").optional(),
    password: z.string().min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف").optional().or(z.literal("")),
    role: z.string().optional(), // 'ADMIN' or 'USER'
    quickAction: z.string().optional(), // 'UPGRADE_30' | 'UPGRADE_90' | 'UPGRADE_365' | 'UPGRADE_LIFETIME' | 'CANCEL_VIP' | 'TOGGLE_ROLE'
    subscription: z.object({
        type: z.string().optional(),
        planType: z.string().optional(),
        status: z.string().optional(),
        isActive: z.boolean().optional(),
        endDate: z.string().optional().nullable(),
    }).optional(),
});

export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;
