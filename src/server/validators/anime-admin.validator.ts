import { z } from "zod";

export const animeAdminSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "عنوان العمل يجب أن يكون حرفين على الأقل").max(120, "عنوان العمل طويل جداً"),
    title_en: z.string().max(120).optional().nullable(),
    title_jp: z.string().max(120).optional().nullable(),
    description: z.string().min(10, "الوصف والقصة يجب ألا يقل عن 10 أحرف"),
    coverImage: z.string().min(3, "صورة الغلاف والبوستر مطلوبة"),
    bannerImage: z.string().optional().nullable(),
    trailerUrl: z.string().optional().nullable(),
    type: z.enum(["TV Series", "Movie", "OVA", "Special"]).default("TV Series"),
    status: z.enum(["Ongoing", "Completed", "Coming Soon"]).default("Ongoing"),
    totalEpisodes: z.coerce.number().min(0).default(0),
    releaseYear: z.coerce.number().min(1960).max(2035).optional().nullable(),
    genres: z.array(z.string()).default([]),
    rating: z.coerce.number().min(0).max(10).default(9.0),
    isFeatured: z.boolean().default(false),
    isTrending: z.boolean().default(false),
    planet: z.string().optional().nullable(),
    studio: z.string().max(60).optional().nullable(),
    ageRating: z.string().max(30).optional().nullable(),
    audioLanguage: z.string().optional().nullable(),
    quality: z.string().optional().nullable(),
});

export type AnimeAdminSchemaType = z.infer<typeof animeAdminSchema>;
