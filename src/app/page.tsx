import fs from "fs";
import path from "path";
import Link from "next/link";
import { 
    ArrowLeft, 
    Play, 
    PlayCircle, 
    Sparkles, 
    Zap, 
    Tv, 
    ShieldCheck, 
    Flame,
    Film,
    BookmarkCheck
} from "lucide-react";
import { prisma } from "@/lib/prismadb";
import HomeSlider from "@/components/HomeSlider";
import AnimeCard from "@/components/AnimeCard";
import CharacterCard from "@/components/CharacterCard";

export const dynamic = "force-dynamic";

export default async function Home() {
    let allAnimes: any[] = [];
    let settings: any = null;
    let latestEpisodesData: any[] = [];
    let featuredCharacters: any[] = [];

    // Attempt to fetch from database with fallback to local seed data
    try {
        [allAnimes, settings, latestEpisodesData, featuredCharacters] = await Promise.all([
            prisma.anime.findMany({ orderBy: { updatedAt: 'desc' } }),
            prisma.settings.findUnique({ where: { id: "global" } }),
            prisma.episode.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { anime: { select: { title: true } } }
            }),
            prisma.character.findMany({ take: 4 })
        ]);
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

    if (latestEpisodesData.length === 0 && fs.existsSync(path.join(dataDir, "episodes.json"))) {
        try {
            const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, "episodes.json"), "utf-8"));
            const eps = Array.isArray(parsed) ? parsed : (parsed.episodes || []);
            latestEpisodesData = eps.slice(0, 5).map((e: any) => ({
                id: e.id,
                title: e.title,
                thumbnail: e.thumbnail,
                episodeNumber: e.episode_number || (e.title.match(/\d+/) ? e.title.match(/\d+/)![0] : "1"),
                anime: { title: "سلام دانك" }
            }));
        } catch (e) {
            console.error("Fallback episodes read error:", e);
        }
    }

    if (featuredCharacters.length === 0 && fs.existsSync(path.join(dataDir, "characters.json"))) {
        try {
            const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, "characters.json"), "utf-8"));
            featuredCharacters = (Array.isArray(parsed) ? parsed : (parsed.characters || [])).slice(0, 4);
        } catch (e) {
            console.error("Fallback characters read error:", e);
        }
    }

    // Filter slider animes
    const sliderAnimes = allAnimes.filter(a => a.isFeatured).slice(0, 4);
    const displaySliderAnimes = sliderAnimes.length > 0 ? sliderAnimes : allAnimes.slice(0, 4);

    const animes = allAnimes.slice(0, 10);

    // Map latest episodes for display
    const latestEpisodes = latestEpisodesData.map((ep: any) => ({
        id: ep.id,
        title: ep.title,
        thumbnail: ep.thumbnail,
        episodeNumber: ep.episodeNumber || (ep.title.match(/\d+/) ? ep.title.match(/\d+/)![0] : "1"),
        animeTitle: ep.anime?.title || "سلام دانك"
    }));

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden pb-16">
            {/* Ambient Background Radial Glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(220,38,38,0.22),transparent_80%)]" />

            {/* Hero Cinema Slider */}
            <HomeSlider animes={displaySliderAnimes} />

            {/* Latest Episodes Section */}
            <section className="relative py-12 bg-slate-950/70 border-b border-slate-900/80 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-red-600 rounded-full" />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                    أحدث الحلقات المضافة
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">مشاهدة مباشرة بجودة عالية وسيرفرات سريعة</p>
                            </div>
                        </div>

                        <Link 
                            href="/animes" 
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-red-500 hover:text-red-400 font-bold transition-colors group"
                        >
                            <span>جميع الحلقات</span>
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
                        {latestEpisodes.map((ep) => (
                            <Link
                                key={ep.id}
                                href={`/watch/${ep.id}`}
                                className="group flex flex-col bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_-6px_rgba(220,38,38,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            >
                                <div className="aspect-video relative overflow-hidden bg-slate-950">
                                    <img 
                                        src={ep.thumbnail || "/logoep.jpg"} 
                                        alt={ep.title} 
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                    
                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                                        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50 transform scale-75 group-hover:scale-100 transition-all">
                                            <Play size={18} className="fill-white translate-x-[-1px]" />
                                        </div>
                                    </div>

                                    {/* Episode Badge */}
                                    <div className="absolute bottom-2.5 right-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                                        الحلقة {ep.episodeNumber}
                                    </div>
                                    
                                    {/* Quality Badge */}
                                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                        FHD
                                    </div>
                                </div>

                                <div className="p-3 flex flex-col justify-between flex-1 gap-1">
                                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                                        {ep.title}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {ep.animeTitle}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Advantages Banner */}
            <section className="py-12 border-b border-slate-900 bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
                            <div className="p-2.5 rounded-xl bg-red-600/10 text-red-500 shrink-0">
                                <Zap size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">سرعة فائقة</h3>
                                <p className="text-[11px] text-slate-400">سيرفرات سحابية بدون تقطيع</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
                            <div className="p-2.5 rounded-xl bg-rose-600/10 text-rose-500 shrink-0">
                                <Tv size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">دقة FHD 1080p</h3>
                                <p className="text-[11px] text-slate-400">نقاء سينمائي وصوت محيطي</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
                            <div className="p-2.5 rounded-xl bg-amber-600/10 text-amber-500 shrink-0">
                                <BookmarkCheck size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">تتبع المشاهدة</h3>
                                <p className="text-[11px] text-slate-400">حفظ تلقائي للتقدم والمفضلة</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
                            <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-500 shrink-0">
                                <ShieldCheck size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">بدون إعلانات</h3>
                                <p className="text-[11px] text-slate-400">مشاهدة نقية ومريحة 100%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Anime Showcase Section */}
            <section className="py-16 container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-red-600 rounded-full" />
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                أحدث مسلسلات وأفلام الأنمي
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">أعمال كلاسيكية وحديثة مترجمة ومدبلجة</p>
                        </div>
                    </div>

                    <Link 
                        href="/animes" 
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-red-500 hover:text-red-400 font-bold transition-colors group"
                    >
                        <span>عرض الكل</span>
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {animes.map((anime, index) => (
                        <AnimeCard
                            key={anime.id}
                            anime={anime}
                            priority={index < 4}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Characters Section */}
            <section className="py-20 bg-slate-900/30 border-y border-slate-900 relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-15 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-red-600 rounded-full" />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                    أبطال ونجوم سلام دانك
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">تعرف على لاعبي فريق الصقور والمنافسين وإحصائياتهم</p>
                            </div>
                        </div>

                        <Link 
                            href="/characters" 
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-red-500 hover:text-red-400 font-bold transition-colors group"
                        >
                            <span>جميع الشخصيات</span>
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {featuredCharacters.map((character) => (
                            <CharacterCard key={character.id} character={character} />
                        ))}
                    </div>
                </div>
            </section>

            {/* VIP Subscription CTA Teaser */}
            <section className="py-16 container mx-auto px-4">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900/90 to-amber-950/40 border border-red-500/30 p-8 sm:p-12 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                            <Sparkles size={14} className="fill-amber-400" />
                            <span>عضوية VIP المميزة</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            استمتع بأفضل تجربة مشاهدة أنمي بدون أي إعلانات
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            احصل على سرعات تحميل فائقة، وصول مبكر للحلقات الحصرية، وتنزيل الحلقات للمشاهدة بدون إنترنت عبر تطبيق الهاتف.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                            >
                                <span>اشترك الآن</span>
                                <ArrowLeft size={16} />
                            </Link>

                            <Link
                                href="/animes"
                                className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-700 transition-colors"
                            >
                                <span>استكشف الأعمال المجانية</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
