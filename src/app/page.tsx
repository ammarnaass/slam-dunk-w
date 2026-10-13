import fs from "fs";
import path from "path";
import Link from "next/link";
import { prisma } from "@/lib/prismadb";
import HomeSlider from "@/components/HomeSlider";
import AnimeCard from "@/components/AnimeCard";
import EpisodeCard from "@/components/EpisodeCard";
import CharacterCard from "@/components/CharacterCard";
import { DEFAULT_PROMO_BANNER } from "@/lib/promo-presets";
import { AppDownloadButtons } from "@/components/AppDownloadButtons";
import { 
    DEFAULT_HOME_SCREEN_CONFIG, 
    DEFAULT_HOME_SECTIONS, 
    HomeSectionId, 
    HomeSectionItem 
} from "@/lib/home-presets";

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
                        if (latestEpisodes.length === 0) return null;
                        const watchLimit = section.itemLimit || 3;
                        return (
                            <section key="section-continueWatching" className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-20 border-b border-white/[0.04]">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex items-end justify-between mb-space-lg">
                                        <div className="flex items-center gap-space-sm">
                                            <div className="w-1.5 h-7 rounded-full bg-primary-container shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
                                            <div>
                                                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                                    {section.title || "استكمل المشاهدة"}
                                                </h2>
                                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                                    {section.subtitle || "تابع من النقطة التي توقفت عندها بالضبط"}
                                                </p>
                                            </div>
                                        </div>
                                        <Link 
                                            href={section.viewAllLink || "/profile?tab=history"} 
                                            className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
                                        >
                                            <span>سجل المشاهدة الكامل</span>
                                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        </Link>
                                    </div>

                                    {/* Horizontal Episode Rail */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                                        {latestEpisodes.slice(0, watchLimit).map((ep, idx) => {
                                            const randomProgress = (idx * 25 + 40) % 85;
                                            return (
                                                <div 
                                                    key={ep.id}
                                                    className="group relative flex items-center gap-space-md p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all border border-white/[0.05] hover:border-primary-container/40 shadow-lg"
                                                >
                                                    <div className="w-40 aspect-video rounded-xl overflow-hidden shrink-0 relative bg-surface-container-highest">
                                                        <img
                                                            src={ep.thumbnail || "/hero-bg.jpg"}
                                                            alt={ep.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg">
                                                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-0 inset-x-0 h-1 bg-surface-container-highest">
                                                            <div 
                                                                className="h-full bg-primary-container shadow-[0_0_8px_rgba(220,38,38,0.8)]" 
                                                                style={{ width: `${randomProgress}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0 pr-1">
                                                        <span className="font-label-sm text-label-sm text-secondary font-bold block truncate">
                                                            {ep.animeTitle}
                                                        </span>
                                                        <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm truncate group-hover:text-primary transition-colors mt-0.5">
                                                            {ep.title}
                                                        </h4>
                                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-2">
                                                            <span>الحلقة {ep.episodeNumber}</span>
                                                            <span>•</span>
                                                            <span>متبقي 8 دقائق</span>
                                                        </p>
                                                        <Link 
                                                            href={`/watch/${ep.id}`}
                                                            className="mt-2 inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:text-on-primary-container"
                                                        >
                                                            <span>استئناف الآن</span>
                                                            <span className="material-symbols-outlined text-xs">play_circle</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        );

                    case "planets":
                        const planetsLimit = section.itemLimit || 6;
                        return (
                            <section key="section-planets" className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-surface-container-lowest relative border-b border-white/[0.04]">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex items-end justify-between mb-space-lg">
                                        <div className="flex items-center gap-space-sm">
                                            <div className="w-1.5 h-7 rounded-full bg-secondary-container shadow-[0_0_10px_rgba(238,152,0,0.7)]" />
                                            <div>
                                                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                                    {section.title || "كواكب الأنمي"}
                                                </h2>
                                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                                    {section.subtitle || "سافر بين عوالم التصنيفات المستوحاة من كواكب الطفولة والخيال"}
                                                </p>
                                            </div>
                                        </div>
                                        <Link 
                                            href={(!section.viewAllLink || section.viewAllLink === "/animes") ? "/planets" : section.viewAllLink} 
                                            className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
                                        >
                                            <span>كل الكواكب (+12)</span>
                                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-md">
                                        {SPACETOON_PLANETS.slice(0, planetsLimit).map((planet) => (
                                            <Link
                                                key={planet.name}
                                                href={`/planets?planet=${planet.planetId}`}
                                                className={`group flex flex-col items-center justify-center p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container border ${planet.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center`}
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-surface-container-highest/80 flex items-center justify-center mb-space-sm group-hover:scale-110 transition-transform duration-300 shadow-md">
                                                    <span className="material-symbols-outlined text-3xl">
                                                        {planet.icon}
                                                    </span>
                                                </div>
                                                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm group-hover:text-primary transition-colors">
                                                    {planet.name}
                                                </h3>
                                                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                                                    {planet.badge}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );

                    case "latestEpisodes":
                        const episodesLimit = section.itemLimit || 6;
                        return (
                            <section key="section-latestEpisodes" className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative border-b border-white/[0.04]">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm mb-space-lg">
                                        <div className="flex items-center gap-space-sm">
                                            <div className="w-1.5 h-7 rounded-full bg-primary-container shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                                        {section.title || "أحدث الحلقات المضافة"}
                                                    </h2>
                                                    {section.badgeText && (
                                                        <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-sm text-xs font-bold border border-primary-container/30 flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                                                            {section.badgeText}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                                    {section.subtitle || "تحديث فوري فور البث الياباني بدون فواصل إعلانية"}
                                                </p>
                                            </div>
                                        </div>
                                        <Link 
                                            href={section.viewAllLink || "/animes"} 
                                            className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1 self-start sm:self-auto"
                                        >
                                            <span>جدول الحلقات الأسبوعي</span>
                                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-gutter">
                                        {latestEpisodes.slice(0, episodesLimit).map((episode) => (
                                            <EpisodeCard 
                                                key={episode.id} 
                                                episode={{
                                                    ...episode,
                                                    isVip: false
                                                } as any} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );

                    case "topTrending":
                        const trendingLimit = section.itemLimit || 10;
                        return (
                            <section key="section-topTrending" className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-surface-container-lowest relative border-b border-white/[0.04]">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex items-end justify-between mb-space-lg">
                                        <div className="flex items-center gap-space-sm">
                                            <div className="w-1.5 h-7 rounded-full bg-primary-container shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
                                            <div>
                                                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                                    {section.title || "الأكثر مشاهدة هذا الأسبوع"}
                                                </h2>
                                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                                    {section.subtitle || "أفضل الأعمال التي تتصدر تصويت ومتابعات الجماهير العربية"}
                                                </p>
                                            </div>
                                        </div>
                                        <Link 
                                            href={section.viewAllLink || "/animes"} 
                                            className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
                                        >
                                            <span>عرض كل الأعمال</span>
                                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-space-md lg:gap-gutter">
                                        {allAnimes.slice(0, trendingLimit).map((anime, index) => (
                                            <div key={anime.id} className="relative">
                                                {/* Large Rank Number (01, 02...) */}
                                                {index < 5 && (
                                                    <span className="absolute -top-3 -right-2 z-20 font-cairo font-black text-3xl sm:text-4xl text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] bg-surface-container-high/90 px-2 py-0.5 rounded-xl border border-white/10 pointer-events-none">
                                                        0{index + 1}
                                                    </span>
                                                )}
                                                <AnimeCard
                                                    anime={anime}
                                                    priority={index < 4}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );

                    case "classics":
                        if (spacetoonClassics.length === 0) return null;
                        const classicsLimit = section.itemLimit || 5;
                        return (
                            <section key="section-classics" className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface-container-low/50 to-surface-container-lowest border-b border-white/[0.04]">
                                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />
                                
                                <div className="max-w-7xl mx-auto relative z-10">
                                    {/* Section Banner Header */}
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg p-space-lg rounded-2xl bg-surface-container-low/80 backdrop-blur-md shadow-xl border border-white/[0.06]">
                                        <div className="space-y-space-xs">
                                            {section.badgeText && (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary font-label-md text-label-md font-bold">
                                                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                                                    {section.badgeText}
                                                </div>
                                            )}
                                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-black">
                                                {section.title || "سبيستون كلاسيك دايز"}
                                            </h2>
                                            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                                                {section.subtitle || "أعد إحياء لحظات الطفولة الخالدة، جميع المواسم كاملة بجودة محسّنة بالذكاء الاصطناعي 1080p ومعالجة صوتية نقية للأغاني والشارات الأصلية."}
                                            </p>
                                        </div>
                                        <Link 
                                            href={section.viewAllLink || "/animes?planet=spacetoon"} 
                                            className="shrink-0 flex items-center gap-space-xs px-space-lg py-space-sm rounded-xl bg-secondary-container text-on-secondary font-headline-sm text-headline-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(238,152,0,0.4)]"
                                        >
                                            <span className="material-symbols-outlined text-xl">play_circle</span>
                                            <span>تصفح كوكب الكلاسيكيات</span>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-space-md lg:gap-gutter">
                                        {spacetoonClassics.slice(0, classicsLimit).map((anime) => (
                                            <AnimeCard
                                                key={`classic-${anime.id}`}
                                                anime={anime}
                                                priority={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );

                    case "characters":
                        if (featuredCharacters.length === 0) return null;
                        const charsLimit = section.itemLimit || 6;
                        return (
                            <section key="section-characters" className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative border-b border-white/[0.04]">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex items-center justify-between mb-space-lg">
                                        <div className="flex items-center gap-space-sm">
                                            <div className="w-1.5 h-7 rounded-full bg-primary-container shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
                                            <div>
                                                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                                    {section.title || "أبطال وشخصيات الأنمي"}
                                                </h2>
                                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                                    {section.subtitle || "تعرف على أبطال الأنمي ونخبة فناني الدبلجة"}
                                                </p>
                                            </div>
                                        </div>
                                        <Link 
                                            href={section.viewAllLink || "/characters"} 
                                            className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
                                        >
                                            <span>جميع الشخصيات</span>
                                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-space-md">
                                        {featuredCharacters.slice(0, charsLimit).map((character) => (
                                            <CharacterCard 
                                                key={character.id} 
                                                character={character} 
                                                variant="circle" 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );

                    case "promoBanner":
                        if (!promoBanner || !promoBanner.isEnabled) return null;
                        return (
                            <section key="section-promoBanner" className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                                <div className="max-w-7xl mx-auto">
                                    <div className="relative rounded-3xl bg-surface-container-low overflow-hidden p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/[0.06]">
                                        {/* Ambient Red/Amber Gradients */}
                                        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
                                        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none" />
                                        
                                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
                                            {/* Content Side (8 Cols) */}
                                            <div className="lg:col-span-8 space-y-space-md">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <div className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                                                        <span className="material-symbols-outlined text-sm">{promoBanner.badgeIcon || "install_mobile"}</span>
                                                        {promoBanner.badgeText}
                                                    </div>
                                                    {promoBanner.appIconUrl && (
                                                        <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/10 shrink-0 border border-white/20 shadow-md">
                                                            <img src={promoBanner.appIconUrl} alt="App Icon" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                                <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold max-w-xl">
                                                    {promoBanner.title}
                                                </h2>
                                                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                                                    {promoBanner.description}
                                                </p>
                                                
                                                {/* Features Highlights Grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                                                    {(promoBanner.features || []).map((feat: any, idx: number) => (
                                                        <div key={feat.id || idx} className="p-space-sm rounded-xl bg-surface-container flex items-center gap-2">
                                                            <span className={`material-symbols-outlined text-xl ${idx % 2 === 0 ? "text-primary" : "text-secondary"}`}>
                                                                {feat.icon}
                                                            </span>
                                                            <span className="font-label-md text-label-md text-on-surface">{feat.text}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* App Store & Direct Download Suite */}
                                                <div className="pt-space-sm space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-[#3DDC84] animate-ping" />
                                                        <span className="text-xs font-bold font-cairo text-[#ffb4ab]">
                                                            تحميل التطبيق الرسمي لأجهزة أندرويد و iOS والشاشات الذكية:
                                                        </span>
                                                    </div>
                                                    <AppDownloadButtons
                                                        googlePlayUrl={(promoBanner as any).googlePlayUrl || settings?.apiApp?.updateUrl}
                                                        appStoreUrl={(promoBanner as any).appStoreUrl || (settings?.apiApp as any)?.appStoreUrl}
                                                        directApkUrl={(promoBanner as any).directApkUrl || settings?.apiApp?.directApkUrl}
                                                        externalUrl={(promoBanner as any).externalUrl || (settings?.apiApp as any)?.externalUrl}
                                                        showPwa={true}
                                                        layout="row"
                                                    />
                                                </div>

                                                <div className="pt-2 flex flex-wrap items-center gap-space-md">
                                                    <Link
                                                        href={promoBanner.primaryButtonLink || "/pricing"}
                                                        className="flex items-center gap-space-sm px-space-lg py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-all font-label-md text-label-md border border-white/10"
                                                    >
                                                        <span className="material-symbols-outlined text-lg text-secondary">{promoBanner.primaryButtonIcon || "diamond"}</span>
                                                        <span>{promoBanner.primaryButtonText}</span>
                                                    </Link>
                                                    <Link
                                                        href={promoBanner.secondaryButtonLink || "/animes"}
                                                        className="flex items-center gap-space-sm px-space-lg py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-all font-label-md text-label-md border border-white/10"
                                                    >
                                                        <span>{promoBanner.secondaryButtonText}</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Graphic Promo Side (4 Cols) */}
                                            <div className="lg:col-span-4 hidden lg:flex justify-center">
                                                <div className="relative w-64 aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-highest border border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                                    <img
                                                        src={promoBanner.imageUrl || "/hero-bg.jpg"}
                                                        alt={promoBanner.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                                                    {promoBanner.imageCaption && (
                                                        <div className="absolute bottom-4 inset-x-4 p-3 rounded-xl bg-surface-container/90 backdrop-blur-md text-center">
                                                            <span className="font-headline-sm text-xs font-bold text-secondary">
                                                                {promoBanner.imageCaption}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );

                    default:
                        return null;
                }
            })}

        </div>
    );
}
