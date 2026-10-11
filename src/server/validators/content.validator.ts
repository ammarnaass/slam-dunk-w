import { z } from "zod";

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
});

export const animesQuerySchema = paginationSchema.extend({
    q: z.string().optional(),
    genre: z.string().optional(),
    year: z.coerce.number().int().optional(),
    status: z.enum(["all", "ongoing", "completed"]).optional().default("all"),
    sort: z.enum(["latest", "rating", "year", "title"]).optional().default("latest")
});

export const animeSlugSchema = z.object({
    slug: z.string().min(1, "معرّف العمل مطلوب")
});

export const episodesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(150).default(100)
});

export const episodeIdSchema = z.object({
    id: z.string().min(1, "معرّف الحلقة مطلوب")
});

export const charactersQuerySchema = paginationSchema.extend({
    team: z.string().optional()
});

export const characterSlugSchema = z.object({
    slug: z.string().min(1, "معرّف الشخصية مطلوب")
});

export const searchQuerySchema = z.object({
    q: z.string().min(1, "يرجى إدخال كلمة البحث"),
    type: z.enum(["all", "anime", "episode", "character"]).optional().default("all"),
    limit: z.coerce.number().int().min(1).max(50).default(20)
});
