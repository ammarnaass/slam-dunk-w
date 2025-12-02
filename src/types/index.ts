export interface Episode {
    id: string;
    title: string;
    description: string;
    season: number;
    episode_number: number;
    thumbnail: string;
    duration: string;
    mega_link: string;
    video_url?: string;
}

export interface Character {
    id: string;
    name_ar: string;
    name_en: string;
    name_jp: string;
    role: string;
    height: string;
    weight: string;
    team: string;
    number: number;
    bio: string;
    image: string;
}
