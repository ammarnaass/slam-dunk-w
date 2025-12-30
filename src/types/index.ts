export interface Episode {
    id: string;
    animeId: string;
    title: string;
    description: string | null;
    seasonNumber: number;
    episodeNumber: number;
    thumbnail: string | null;
    duration: string | null;
    mega_link?: string;
    video_url?: string;
    servers?: { name: string; url: string; quality?: string | null }[];
}

export interface Anime {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    bannerImage?: string | null;
    type?: string | null;
    status: string;
    totalEpisodes?: number | null;
    releaseYear?: number | null;
    genres: string[];
    rating?: number;
    isFeatured?: boolean;
    isTrending?: boolean;
}

export interface Character {
    id: string;
    name: string;
    name_ar?: string | null;
    name_en?: string | null;
    name_jp?: string | null;
    role?: string | null;
    height?: string | null;
    weight?: string | null;
    team?: string | null;
    number?: string | null;
    description?: string | null;
    image?: string | null;
    animeId?: string | null;
}

export interface User {
    id: string;
    name?: string;
    username?: string;
    email: string;
    password?: string; // Hashed
    role: "ADMIN" | "USER";
    createdAt: string;
    gender?: "male" | "female" | "other";
    phoneNumber?: string;
    profileImage?: string;
    watchlist?: string[];
    subscription?: {
        type: "FREE" | "PREMIUM";
        startDate?: string;
        endDate?: string;
        status: "ACTIVE" | "EXPIRED";
        planId?: string; // Link to the specific plan
        paymentMethodId?: string;
    };
}

export interface Plan {
    id: string;
    name: string;
    price: number;
    duration: string;
    description?: string | null;
    features: string[];
    isPopular?: boolean;
    isActive: boolean;
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: string;
    instructions?: string | null;
    logoUrl?: string | null;
    details?: string | null;
    icon?: string | null;
    isActive: boolean;
}

export interface Settings {
    siteName: string;
    siteDescription: string;
    logoUrl: string;
    faviconUrl: string;
    currency: string;
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
        telegram?: string;
    };
    sliderAnimeIds: string[];
    admob: {
        isEnabled: boolean;
        appId?: string;
        bannerId?: string;
        interstitialId?: string;
    };
    apiApp: {
        isMaintenance: boolean;
        maintenanceMessage: string;
        latestVersion: string;
        updateUrl: string;
        apiUrl: string;
    };
}

