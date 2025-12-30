export interface Episode {
    id: string;
    animeId: string; // Foreign key to Anime
    title: string;
    description: string;
    season: number;
    episode_number: number;
    thumbnail: string;
    duration: string;
    mega_link: string;
    video_url?: string;
}

export interface Anime {
    id: string;
    title: string;
    description: string;
    coverImage: string; // Portrait image
    bannerImage?: string; // Landscape image
    type: string; // e.g. "TV", "Movie", "OVA"
    status: "Ongoing" | "Completed" | "Coming Soon";
    totalEpisodes: number;
    releaseYear?: string;
    genres: string[];
}

export interface Character {
    id: string;
    animeId: string; // Foreign key to Anime
    name_ar: string;
    name_en?: string;
    name_jp?: string;
    role: string; // e.g. "Main", "Supporting"
    height?: string;
    weight?: string;
    team?: string; // Specific to sports anime
    number?: number; // Specific to sports anime
    bio: string;
    image: string;
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
    duration: number; // in days
    features: string[];
    isPopular: boolean;
    active: boolean;
}

export interface PaymentMethod {
    id: string;
    name: string;
    type: "card" | "manual";
    instructions: string;
    logoUrl?: string;
    active: boolean;
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

