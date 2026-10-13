import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prismadb";
import HomeSlider from "@/components/HomeSlider";
import { DEFAULT_PROMO_BANNER } from "@/lib/promo-presets";
import { 
    DEFAULT_HOME_SCREEN_CONFIG, 
    DEFAULT_HOME_SECTIONS, 
    HomeSectionItem 
} from "@/lib/home-presets";
import { getStoredPlanets } from "@/server/services/planets.service";

// Modularized Home Sections
import { ContinueWatchingSection } from "@/components/home/ContinueWatchingSection";
import { HomePlanetsSection } from "@/components/home/HomePlanetsSection";
import { LatestEpisodesSection } from "@/components/home/LatestEpisodesSection";
import { TopTrendingSection } from "@/components/home/TopTrendingSection";
import { ClassicsSection } from "@/components/home/ClassicsSection";
import { FeaturedCharactersSection } from "@/components/home/FeaturedCharactersSection";
import { HomePromoBannerSection } from "@/components/home/HomePromoBannerSection";

export const revalidate = 60;

const SPACETOON_PLANETS = [
    { 
        name: "كوكب رياضة", 
        icon: "sports_basketball", 
        badge: "سلام دانك • ماجد", 
        genre: "Sports",
        planetId: "sports",
        color: "from-amber-600/30 to-orange-700/40 border-amber-500/30 text-amber-400"
    },
    { 
        name: "كوكب أكشن", 
        icon: "swords", 
        badge: "القناص • دراغون بول", 
        genre: "Action",
        planetId: "action",
        color: "from-red-600/30 to-rose-700/40 border-red-500/30 text-red-400"
    },
    { 
        name: "كوكب مغامرات", 
        icon: "explore", 
        badge: "ون بيس • كونان", 
        genre: "Adventure",
        planetId: "adventure",
        color: "from-emerald-600/30 to-teal-700/40 border-emerald-500/30 text-emerald-400"
    },
    { 
        name: "كوكب كوميديا", 
        icon: "sentiment_very_satisfied", 
        badge: "ضحك • ترفيه", 
        genre: "Comedy",
        planetId: "comedy",
        color: "from-yellow-500/30 to-amber-600/40 border-yellow-500/30 text-yellow-400"
    },
    { 
        name: "كوكب زمردة", 
        icon: "auto_awesome", 
        badge: "للفتيات فقط", 
        genre: "Drama",
        planetId: "emerald",
        color: "from-pink-600/30 to-purple-700/40 border-pink-500/30 text-pink-400"
    },
    { 
        name: "الخيال العلمي", 
        icon: "rocket_launch", 
        badge: "غرندايزر • ميكا", 
        genre: "Sci-Fi",
        planetId: "scifi",
        color: "from-cyan-600/30 to-blue-700/40 border-cyan-500/30 text-cyan-400"
    },
];

export default async function Home() {
    let allAnimes: any[] = [];
    let settings: any = null;
    let latestEpisodesData: any[] = [];
    let featuredCharacters: any[] = [];

    // Attempt to fetch from database with fallback to local seed data
    try {
        const queryPromise = Promise.all([
            prisma.anime.findMany({ orderBy: { updatedAt: 'desc' } }),
            prisma.settings.findUnique({ where: { id: "global" } }),
            prisma.episode.findMany({
                orderBy: { createdAt: 'desc' },
                take: 12,
                include: { anime: { select: { title: true, id: true } } }
            }),
            prisma.character.findMany({ take: 12 })
        ]);
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Home Prisma Timeout")), 2500)
        );
        [allAnimes, settings, latestEpisodesData, featuredCharacters] = await Promise.race([queryPromise, timeoutPromise]);
    } catch (err) {
        console.warn("Prisma query failed on Home, using local json fallback:", err);
    }

    // Local fallback if database returned empty
    const dataDir = path.join(process.cwd(), "src/data");

    if (allAnimes.length === 0 && fs.existsSync(path.join(dataDir, "animes.json"))) {
        try {
            const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, "animes.json"), "utf-8"));
            allAnimes = Array.isArray(parsed) ? parsed : (parsed.animes || []);
        } catch (e) {
            console.error("Fallback animes read error:", e);
        }
    }

    if (!settings && fs.existsSync(path.join(dataDir, "settings.json"))) {
        try {
            settings = JSON.parse(fs.readFileSync(path.join(dataDir, "settings.json"), "utf-8"));
        } catch (e) {
            console.error("Fallback settings read error:", e);
        }
    }

    let localSettings: any = null;
    if (fs.existsSync(path.join(dataDir, "settings.json"))) {
        try {
            localSettings = JSON.parse(fs.readFileSync(path.join(dataDir, "settings.json"), "utf-8"));
        } catch (_) {}
    }

    // Consolidated Home Screen & Slider Settings from Admin Dashboard
    const homeConfig = settings?.homeConfig || localSettings?.homeConfig || DEFAULT_HOME_SCREEN_CONFIG;
    const sliderConfig = homeConfig.slider || DEFAULT_HOME_SCREEN_CONFIG.slider;
    const promoBanner = settings?.promoBanner || localSettings?.promoBanner || DEFAULT_PROMO_BANNER;

    if (latestEpisodesData.length === 0 && fs.existsSync(path.join(dataDir, "episodes.json"))) {
        try {
            const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, "episodes.json"), "utf-8"));
            const eps = Array.isArray(parsed) ? parsed : (parsed.episodes || []);
            latestEpisodesData = eps.slice(0, 12).map((e: any) => ({
                id: e.id,
                title: e.title,
                thumbnail: e.thumbnail,
                duration: e.duration || "24 دقيقة",
                episodeNumber: e.episode_number || (e.title.match(/\d+/) ? e.title.match(/\d+/)![0] : "1"),
                anime: { title: "سلام دانك", id: "slam-dunk" }
            }));
        } catch (e) {
            console.error("Fallback episodes read error:", e);
        }
    }

    if (featuredCharacters.length === 0 && fs.existsSync(path.join(dataDir, "characters.json"))) {
        try {
            const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, "characters.json"), "utf-8"));
            featuredCharacters = (Array.isArray(parsed) ? parsed : (parsed.characters || [])).slice(0, 12);
        } catch (e) {
            console.error("Fallback characters read error:", e);
        }
    }

    // Filter featured animes for billboard
    const maxSlides = sliderConfig.maxSlides || 5;
    const sliderAnimes = allAnimes.filter(a => a.isFeatured).slice(0, maxSlides);
    const displaySliderAnimes = sliderAnimes.length > 0 ? sliderAnimes : allAnimes.slice(0, maxSlides);

    // Spacetoon & Classics
    const spacetoonClassics = allAnimes.filter(a => 
        a.genres?.includes("Sports") || 
        a.title?.includes("سلام دانك") || 
        a.title?.includes("القناص") || 
        a.title?.includes("كونان") ||
        a.isFeatured
    ).slice(0, 10);

    // Map episodes for display
    const latestEpisodes = latestEpisodesData.map((ep: any) => ({
        id: ep.id,
        title: ep.title,
        thumbnail: ep.thumbnail,
        duration: ep.duration || "24 دقيقة",
        episodeNumber: ep.episodeNumber || (ep.title.match(/\d+/) ? ep.title.match(/\d+/)![0] : "1"),
        animeTitle: ep.anime?.title || "سلام دانك"
    }));

    // Ordered & Enabled Sections from Admin Dashboard
    const sortedSections: HomeSectionItem[] = [...(homeConfig.sections || DEFAULT_HOME_SECTIONS)]
        .filter(s => s.isEnabled)
        .sort((a, b) => a.order - b.order);

    const storedPlanets = getStoredPlanets().filter(p => p.isEnabled);
    const planetsList = storedPlanets.length > 0 ? storedPlanets : SPACETOON_PLANETS;

    return (
        <div className="flex flex-col w-full text-on-surface font-body-md bg-surface-container-lowest">
            {sortedSections.map((section) => {
                switch (section.id) {
                    case "heroSlider":
                        return (
                            <HomeSlider
                                key="section-heroSlider"
                                animes={displaySliderAnimes}
                                config={sliderConfig}
                            />
                        );

                    case "continueWatching":
                        return (
                            <ContinueWatchingSection
                                key="section-continueWatching"
                                section={section}
                                episodes={latestEpisodes}
                            />
                        );

                    case "planets":
                        return (
                            <HomePlanetsSection
                                key="section-planets"
                                section={section}
                                planetsList={planetsList}
                            />
                        );

                    case "latestEpisodes":
                        return (
                            <LatestEpisodesSection
                                key="section-latestEpisodes"
                                section={section}
                                latestEpisodes={latestEpisodes}
                            />
                        );

                    case "topTrending":
                        return (
                            <TopTrendingSection
                                key="section-topTrending"
                                section={section}
                                allAnimes={allAnimes}
                            />
                        );

                    case "classics":
                        return (
                            <ClassicsSection
                                key="section-classics"
                                section={section}
                                spacetoonClassics={spacetoonClassics}
                            />
                        );

                    case "characters":
                        return (
                            <FeaturedCharactersSection
                                key="section-characters"
                                section={section}
                                featuredCharacters={featuredCharacters}
                            />
                        );

                    case "promoBanner":
                        return (
                            <HomePromoBannerSection
                                key="section-promoBanner"
                                promoBanner={promoBanner}
                                settings={settings}
                            />
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
