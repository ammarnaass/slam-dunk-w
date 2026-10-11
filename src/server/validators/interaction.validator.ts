import { z } from "zod";

export const watchProgressSchema = z.object({
    positionSeconds: z.coerce.number().min(0, "الموضع بالثواني يجب أن يكون موجباً"),
    durationSeconds: z.coerce.number().min(0).default(0)
});

export const favoriteParamsSchema = z.object({
    type: z.enum(["anime", "episode"]),
    id: z.string().min(1, "معرّف العنصر مطلوب")
});

export const addCommentSchema = z.object({
    content: z.string().min(1, "التعليق لا يمكن أن يكون فارغاً").max(1000, "التعليق طويل جداً")
});

export const updateCommentSchema = z.object({
    content: z.string().min(1, "التعليق لا يمكن أن يكون فارغاً").max(1000, "التعليق طويل جداً")
});

export const rateEpisodeSchema = z.object({
    rating: z.coerce.number().int().min(1, "التقييم من 1 إلى 5").max(5, "التقييم من 1 إلى 5")
});

export const reportLinkSchema = z.object({
    serverId: z.string().optional(),
    reason: z.string().min(3, "يرجى توضيح سبب الإبلاغ بالتفصيل")
});

export const reportCommentSchema = z.object({
    reason: z.string().min(3, "يرجى توضيح سبب الإبلاغ عن التعليق")
});

export const commentsQuerySchema = z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20)
});
