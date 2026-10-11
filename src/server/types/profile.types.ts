export interface AnimeAvatarPreset {
    id: string;
    name: string;
    anime: string;
    url: string;
}

export interface CoverBannerPreset {
    id: string;
    name: string;
    description: string;
    url: string;
}

export interface OtakuTitle {
    id: string;
    title: string;
    badge: string;
    color: string;
}

export interface StreamingPreferences {
    audioLanguage: "dubbed" | "subbed";
    quality: "4k" | "1080p" | "720p" | "auto";
    autoplay: boolean;
    favoritePlanet?: string;
}

export interface UserProfileData {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    bannerImage?: string | null;
    bio?: string | null;
    otakuTitle?: string | null;
    auraColor?: string | null;
    gender?: string | null;
    phoneNumber?: string | null;
    birthDate?: string | null;
    createdAt?: string;
    watchlist?: string[];
    preferences?: StreamingPreferences;
    subscription?: {
        planType: string;
        isActive: boolean;
        startDate?: string | null;
        endDate?: string | null;
    } | null;
}

export interface UpdateProfileDto {
    username?: string;
    email?: string;
    avatar?: string;
    bannerImage?: string;
    bio?: string;
    otakuTitle?: string;
    auraColor?: string;
    gender?: string;
    phoneNumber?: string;
    birthDate?: string;
    currentPassword?: string;
    newPassword?: string;
    preferences?: Partial<StreamingPreferences>;
}
