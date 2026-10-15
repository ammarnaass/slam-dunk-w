export interface SpacetoonPlanetItem {
    name: string;
    genre: string;
    icon: string;
}

export interface RecentSearchItem {
    label: string;
    query?: string;
    genre?: string;
}

export const SPACETOON_PLANETS: SpacetoonPlanetItem[] = [
    { name: "الكل", genre: "all", icon: "apps" },
    { name: "كوكب الأكشن والمغامرة", genre: "Action", icon: "swords" },
    { name: "كوكب الرياضة والحماس", genre: "Sports", icon: "sports_basketball" },
    { name: "كوكب المغامرات", genre: "Adventure", icon: "explore" },
    { name: "كوكب الغموض والخيال", genre: "Mystery", icon: "psychology" },
    { name: "شونين", genre: "Shounen", icon: "local_fire_department" },
    { name: "دراما ورومانسية", genre: "Drama", icon: "favorite" },
    { name: "كوكب الكوميديا", genre: "Comedy", icon: "sentiment_very_satisfied" },
    { name: "الخيال العلمي", genre: "Sci-Fi", icon: "rocket_launch" },
    { name: "خارق للطبيعة", genre: "Fantasy", icon: "auto_awesome" },
];

export const RECENT_SEARCHES: RecentSearchItem[] = [
    { label: "هجوم العمالقة", query: "هجوم العمالقة" },
    { label: "سولو ليفلينج", query: "سولو ليفلينج" },
    { label: "ون بيس", query: "ون بيس" },
    { label: "سلام دانك", query: "سلام دانك" },
    { label: "كوكب الأكشن", genre: "Action" },
];

export const GENRE_MAPPING: Record<string, string> = {
    Sports: "رياضة",
    Comedy: "كوميديا",
    School: "مدرسي",
    Shounen: "شونين",
    Action: "أكشن",
    Mystery: "غموض",
    Drama: "دراما",
    Adventure: "مغامرات",
    Fantasy: "فانتازيا",
    "Sci-Fi": "خيال علمي"
};
