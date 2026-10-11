import { notFound } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import { prisma } from "@/lib/prismadb";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const episode = await prisma.episode.findUnique({
        where: { id },
        include: { anime: { select: { title: true } } }
    });

    if (!episode) return { title: "الحلقة غير موجودة" };

    return {
        title: `${episode.title} - ${episode.anime?.title || "مشاهدة"} | ANIME DAZE`,
        description: `شاهد ${episode.title} من أنمي ${episode.anime?.title} بدقة فائقة وترجمة ودبلجة حصرية على ANIME DAZE.`,
    };
}

export default async function WatchPage({ params }: PageProps) {
    const { id } = await params;

    const episode = await prisma.episode.findUnique({
        where: { id },
        include: {
            servers: true,
            anime: true
        }
    });

    if (!episode) {
        notFound();
    }

    const anime = episode.anime;
    const animeEpisodes = await prisma.episode.findMany({
        where: { animeId: episode.animeId },
        orderBy: { createdAt: 'asc' }
    });

    const currentIndex = animeEpisodes.findIndex(e => e.id === id);
    const prevEpisode = currentIndex > 0 ? animeEpisodes[currentIndex - 1] : null;
    const nextEpisode = currentIndex < animeEpisodes.length - 1 ? animeEpisodes[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pt-20 sm:pt-24 pb-12 sm:pb-20">
            {/* Ambient Cinematic Glow Backdrop */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute top-48 left-10 w-[400px] h-[300px] bg-secondary-container/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                
                {/* Breadcrumbs & Status Strip */}
                <div className="w-full flex flex-wrap items-center justify-between gap-space-md pb-space-md text-on-surface-variant font-body-sm text-body-sm border-b border-white/[0.05] mb-space-md">
                    <div className="flex items-center gap-space-xs flex-wrap">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">home</span>
                            <span>الرئيسية</span>
                        </Link>
                        <span className="text-outline-variant">/</span>
                        <Link href="/animes" className="hover:text-primary transition-colors">
                            دليل الأنميات
                        </Link>
                        <span className="text-outline-variant">/</span>
                        <Link href={`/animes/${anime?.id}`} className="hover:text-primary transition-colors text-on-surface font-bold">
                            {anime?.title}
                        </Link>
                        <span className="text-outline-variant">/</span>
                        <span className="text-primary-container font-headline-sm text-headline-sm font-bold">
                            {episode.title}
                        </span>
                    </div>

                    {/* Live Sync Status */}
                    <div className="flex items-center gap-space-md">
                        <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-1 rounded-full border border-white/5 shadow-inner">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-label-sm text-label-sm text-emerald-400">حفظ تلقائي للتقدم</span>
                        </div>
                    </div>
                </div>

                {/* Main Two-Column Layout (8 cols Theater + 4 cols Playlist) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
                    
                    {/* Main Streaming Theater Column (8 Cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
                        
                        {/* Video Player Shell */}
                        <VideoPlayer episode={episode as any} />

                        {/* Episode Metadata & Navigation Strip */}
                        <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-lg">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-surface-container-high text-secondary text-xs font-bold font-cairo">
                                        الحلقة {episode.episodeNumber || "1"}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-lg bg-surface-container text-on-surface-variant text-xs">
                                        الموسم {episode.seasonNumber || 1}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                        ULTRA HD
                                    </span>
                                </div>
                                <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight mt-1">
                                    {episode.title}
                                </h1>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    {episode.description || `${anime?.title} • مشاهدة فورية بدون إعلانات بدقة فائقة وترجمة ودبلجة مركز الزهرة الأصلية.`}
                                </p>
                            </div>

                            {/* Prev / Next Episode Buttons */}
                            <div className="flex items-center gap-2 shrink-0">
                                {prevEpisode ? (
                                    <Link
                                        href={`/watch/${prevEpisode.id}`}
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-cairo font-bold transition-all border border-white/5"
                                        title="الحلقة السابقة"
                                    >
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        <span>السابقة</span>
                                    </Link>
                                ) : (
                                    <button disabled className="px-3.5 py-2 rounded-xl bg-surface-container/40 text-on-surface-variant/40 text-xs font-cairo font-bold cursor-not-allowed">
                                        السابقة
                                    </button>
                                )}

                                {nextEpisode ? (
                                    <Link
                                        href={`/watch/${nextEpisode.id}`}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-cairo font-bold shadow-[0_0_16px_rgba(220,38,38,0.4)] hover:brightness-110 transition-all"
                                        title="الحلقة التالية"
                                    >
                                        <span>التالية</span>
                                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    </Link>
                                ) : (
                                    <button disabled className="px-4 py-2 rounded-xl bg-surface-container/40 text-on-surface-variant/40 text-xs font-cairo font-bold cursor-not-allowed">
                                        التالية
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Anime Series Summary Card */}
                        {anime && (
                            <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.06] flex items-center gap-space-md">
                                <Link href={`/animes/${anime.id}`} className="w-16 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden shrink-0 shadow-md group">
                                    <img
                                        src={anime.coverImage || "/hero-bg.jpg"}
                                        alt={anime.title}
                                        className="w-full h-full object-cover group-hover:scale-108 transition-transform"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0 text-right">
                                    <span className="font-label-sm text-label-sm text-secondary font-bold block">
                                        العمل الكامل
                                    </span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                                        {anime.title}
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                                        {anime.description}
                                    </p>
                                </div>
                                <Link
                                    href={`/animes/${anime.id}`}
                                    className="shrink-0 hidden sm:flex items-center gap-1 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all border border-white/5"
                                >
                                    <span>تفاصيل العمل</span>
                                    <span className="material-symbols-outlined text-sm">info</span>
                                </Link>
                            </div>
                        )}

                    </div>

                    {/* Sidebar Playlist Rail (4 Cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-space-md">
                        <div className="p-space-md rounded-2xl bg-surface-container-low border border-white/[0.06] shadow-xl">
                            <div className="flex items-center justify-between pb-space-sm border-b border-white/[0.06] mb-space-sm">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary-container text-xl">playlist_play</span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm">
                                        حلقات المسلسل ({animeEpisodes.length})
                                    </h3>
                                </div>
                                <span className="font-label-sm text-label-sm text-secondary font-mono">
                                    {currentIndex + 1} من {animeEpisodes.length}
                                </span>
                            </div>

                            {/* Episode List Scroll Container */}
                            <div className="flex flex-col gap-2 max-h-[620px] overflow-y-auto no-scrollbar pr-0.5">
                                {animeEpisodes.map((ep, idx) => {
                                    const isCurrent = ep.id === id;
                                    return (
                                        <Link
                                            key={ep.id}
                                            href={`/watch/${ep.id}`}
                                            className={`flex items-center gap-space-sm p-2 rounded-xl transition-all border ${
                                                isCurrent
                                                    ? "bg-primary-container/15 border-primary-container/50 text-on-surface shadow-[0_0_12px_rgba(220,38,38,0.25)]"
                                                    : "bg-surface-container/60 hover:bg-surface-container border-transparent text-on-surface-variant hover:text-on-surface"
                                            }`}
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-24 aspect-video rounded-lg overflow-hidden shrink-0 relative bg-surface-container-highest">
                                                <img
                                                    src={ep.thumbnail || anime?.coverImage || "/hero-bg.jpg"}
                                                    alt={ep.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isCurrent && (
                                                    <div className="absolute inset-0 bg-primary-container/40 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-white text-base animate-pulse">
                                                            play_circle
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="absolute bottom-1 left-1 bg-black/80 text-white font-mono text-[9px] px-1 rounded">
                                                    {ep.duration || "24m"}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 pr-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`font-label-sm text-label-sm font-bold ${isCurrent ? "text-primary" : "text-secondary"}`}>
                                                        الحلقة {ep.episodeNumber || idx + 1}
                                                    </span>
                                                    {isCurrent && (
                                                        <span className="text-[10px] bg-primary-container text-on-primary-container px-1.5 py-0.2 rounded font-bold">
                                                            الآن
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-body-sm text-body-sm text-on-surface truncate mt-0.5">
                                                    {ep.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Fast VIP Banner */}
                        <div className="p-space-md rounded-2xl bg-gradient-to-br from-primary-container/20 to-surface-container-low border border-primary-container/30 flex items-center justify-between gap-space-sm shadow-md">
                            <div>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold text-xs block">
                                    مشاهدة فورية بدون إعلانات
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                                    احصل على جودة 4K مع اشتراك الدايزر VIP
                                </span>
                            </div>
                            <Link
                                href="/pricing"
                                className="px-3 py-1.5 rounded-xl bg-secondary-container text-on-secondary font-cairo font-bold text-xs shrink-0 shadow"
                            >
                                ترقية VIP
                            </Link>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
