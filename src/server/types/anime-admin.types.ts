export type SpacetoonPlanet = "رياضة" | "مغامرات" | "أكشن" | "غموض" | "كوميديا" | "زمردة" | "علوم" | "تاريخ" | "أفلام";

export type AudioTrackType = "dubbed" | "subbed" | "dual";

export type AgeRatingType = "all" | "+13" | "+16" | "+18";

export type ResolutionQuality = "4K" | "1080p" | "720p";

export type AnimeStatusType = "Ongoing" | "Completed" | "Coming Soon";

export type AnimeContentType = "TV Series" | "Movie" | "OVA" | "Special";

export interface AnimeAdminData {
    id: string;
    title: string;
    title_en?: string | null;
    title_jp?: string | null;
    description: string;
    coverImage: string;
    bannerImage?: string | null;
    trailerUrl?: string | null;
    type: AnimeContentType;
    status: AnimeStatusType;
    totalEpisodes: number;
    releaseYear?: number | null;
    genres: string[];
    rating: number;
    isFeatured: boolean;
    isTrending: boolean;
    planet?: SpacetoonPlanet | string | null;
    studio?: string | null;
    ageRating?: AgeRatingType | string | null;
    audioLanguage?: AudioTrackType | string | null;
    quality?: ResolutionQuality | string | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface CreateAnimeDto {
    id?: string;
    title: string;
    title_en?: string;
    title_jp?: string;
    description: string;
    coverImage: string;
    bannerImage?: string;
    trailerUrl?: string;
    type?: AnimeContentType;
    status?: AnimeStatusType;
    totalEpisodes?: number;
    releaseYear?: number | null;
    genres?: string[];
    rating?: number;
    isFeatured?: boolean;
    isTrending?: boolean;
    planet?: SpacetoonPlanet | string;
    studio?: string;
    ageRating?: AgeRatingType | string;
    audioLanguage?: AudioTrackType | string;
    quality?: ResolutionQuality | string;
}

export interface UpdateAnimeDto extends Partial<CreateAnimeDto> {}
