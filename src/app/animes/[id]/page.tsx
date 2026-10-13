"use client";

import { useEffect, useState, use } from "react";
import { Anime, Episode, Character } from "@/types";
import Link from "next/link";
import Toast, { ToastType } from "@/components/Toast";
import EpisodeCard from "@/components/EpisodeCard";
import CharacterCard from "@/components/CharacterCard";
import AnimeCard from "@/components/AnimeCard";

export default function PublicAnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [anime, setAnime] = useState<Anime | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [relatedAnimes, setRelatedAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
    const [filterEpisodeType, setFilterEpisodeType] = useState<"all" | "free" | "vip">("all");
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchAll = async () => {
            try {
                // Fetch all data in parallel instead of sequential waterfall
                const [animeRes, epsRes, charRes, allAnimesRes, watchlistRes] = await Promise.all([
                    fetch(`/api/animes/${id}`),
                    fetch(`/api/animes/${id}/episodes`),
                    fetch("/api/characters"),
                    fetch("/api/animes"),
                    fetch("/api/watchlist"),
                ]);

                if (!isMounted) return;

                if (animeRes.ok) {
                    const data = await animeRes.json();
                    setAnime(data);
                }
                if (epsRes.ok) {
                    const data = await epsRes.json();
                    setEpisodes(data);
                }
                if (charRes.ok) {
                    const data = await charRes.json();
                    setCharacters(Array.isArray(data) ? data.slice(0, 6) : []);
                }
                if (allAnimesRes.ok) {
                    const data = await allAnimesRes.json();
                    const list = Array.isArray(data) ? data : (data.animes || []);
                    setRelatedAnimes(list.filter((a: Anime) => a.id !== id).slice(0, 5));
                }
                if (watchlistRes.ok) {
                    const { watchlist } = await watchlistRes.json();
                    if (Array.isArray(watchlist)) {
                        setIsInWatchlist(watchlist.includes(id));
                    }
                }
            } catch (error) {
                console.error("Error loading anime page:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchAll();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleWatchlistToggle = async () => {
        setToggling(true);
        try {
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ animeId: id }),
            });
            if (res.ok) {
                const data = await res.json();
                setIsInWatchlist(data.action === "added");
                setToast({
                    message: data.action === "added" ? "تمت الإضافة للمفضلة بنجاح ❤️" : "تمت الإزالة من المفضلة",
                    type: "success"
                });
            } else if (res.status === 401) {
                setToast({ message: "يرجى تسجيل الدخول أولاً لإضافة العمل لمفضلاتك", type: "warning" });
            }
        } catch (error) {
            console.error("Watchlist toggle failed", error);
            setToast({ message: "فشلت العملية، حاول لاحقاً", type: "error" });
        } finally {
            setToggling(false);
        }
    };

    const handleCopyShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard?.writeText(window.location.href);
            setToast({ message: "تم نسخ رابط العمل لمشاركته!", type: "success" });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary-container border-t-transparent animate-spin"></div>
                <span className="font-cairo text-on-surface-variant font-bold text-sm">جاري تحميل تفاصيل العمل...</span>
            </div>
        );
    }

    if (!anime) {
        return (
            <div className="text-center py-28 text-on-surface flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-6xl text-primary">error_outline</span>
                <h1 className="text-2xl font-bold font-cairo">العمل المطلوب غير موجود</h1>
                <Link href="/animes" className="px-6 py-2 rounded-xl bg-primary-container text-on-primary-container font-cairo font-bold">
                    العودة للمكتبة
                </Link>
            </div>
        );
    }

    const firstEpisodeId = episodes.length > 0 ? episodes[0].id : null;
    const ratingVal = anime.rating && anime.rating > 0 ? anime.rating.toFixed(1) : "9.2";

    const filteredEpisodes = episodes.filter(ep => {
        if (filterEpisodeType === "free") return (ep.episodeNumber || 1) <= 2;
        if (filterEpisodeType === "vip") return (ep.episodeNumber || 1) > 2;
        return true;
    });

    return (
        <div className="flex flex-col w-full text-on-surface font-body-md bg-surface-container-lowest pb-20">
            
            {/* ========================================== */}
            {/* 1. CINEMATIC HERO BILLBOARD & METADATA    */}
            {/* ========================================== */}
            <section className="relative w-full overflow-hidden -mt-20">
                {/* Backdrop Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{
                        backgroundImage: `url('${anime.bannerImage || anime.coverImage || "/hero-bg.jpg"}')`,
                    }}
                />
                
                {/* Ambient Scrims & Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/85 to-surface-container-lowest/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-transparent to-surface-container-lowest/90" />
                <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary-container/20 rounded-full blur-[140px] pointer-events-none" />

                {/* Main Hero Container */}
                <div className="relative w-full max-w-7xl mx-auto px-gutter-lg pt-32 pb-space-xl">
                    <div className="flex flex-col lg:flex-row items-start gap-space-xl">
                        
                        {/* RTL Right: Poster Card */}
                        <div className="flex-shrink-0 w-full max-w-[280px] sm:max-w-[320px] mx-auto lg:mx-0 group">
                            <div className="relative rounded-2xl overflow-hidden bg-surface-container-low shadow-[0_16px_40px_rgba(0,0,0,0.8)] border border-white/[0.08] transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(220,38,38,0.25)] group-hover:-translate-y-1">
                                <img
                                    src={anime.coverImage || "/hero-bg.jpg"}
                                    alt={anime.title}
                                    className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Top Badges */}
                                <div className="absolute top-space-md inset-x-space-md flex items-center justify-between">
                                    <span className="px-space-sm py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md font-label-sm text-label-sm text-on-surface flex items-center gap-1 shadow-md">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        {anime.status || "مستمر"}
                                    </span>
                                    <span className="px-space-sm py-1 rounded-full bg-primary-container/90 backdrop-blur-md text-on-primary-container font-label-sm text-label-sm font-black shadow-md">
                                        ULTRA HD 4K
                                    </span>
                                </div>

                                {/* Bottom Strip */}
                                <div className="absolute bottom-0 inset-x-0 p-space-md bg-gradient-to-t from-surface-container-lowest to-transparent flex items-center justify-between">
                                    <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                                        دبلجة يابانية + عربية
                                    </span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                                        24m/حلقة
                                    </span>
                                </div>
                            </div>

                            {/* PWA Fast Streaming Hint */}
                            <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-low/70 backdrop-blur-sm flex items-center justify-center gap-space-sm text-on-surface-variant text-center border border-white/5 shadow-inner">
                                <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
                                <span className="font-label-sm text-label-sm">متاح للبث التكيفي السريع 1080p / 4K</span>
                            </div>
                        </div>

                        {/* RTL Left: Details & Actions */}
                        <div className="flex-1 flex flex-col gap-space-lg w-full text-right">
                            {/* Badges & Titles */}
                            <div className="flex flex-col gap-space-xs">
                                <div className="flex items-center gap-space-sm flex-wrap">
                                    <span className="font-label-md text-label-md text-secondary tracking-widest uppercase bg-secondary-container/20 px-space-sm py-0.5 rounded">
                                        العرض الحصري لموسم الأنمي
                                    </span>
                                    <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                                        استوديو {(anime as any).studio || "Toei Animation"} • ترخيص رسمي
                                    </span>
                                </div>
                                <h1 className="font-headline-hero text-headline-hero text-on-surface font-extrabold tracking-tight mt-1">
                                    {anime.title}
                                </h1>
                                <div className="flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md pt-1">
                                    <span className="font-bold tracking-widest text-primary">スラムダンク • 作品</span>
                                    <span>•</span>
                                    <span className="font-medium tracking-wide">ANIME DAZE Exclusive Remaster</span>
                                </div>
                            </div>

                            {/* Metadata Badges Strip */}
                            <div className="flex flex-wrap items-center gap-space-sm">
                                {/* Rating Badge */}
                                <div className="flex items-center gap-1.5 px-space-md py-1.5 rounded-xl bg-secondary-container/25 text-secondary shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="font-headline-sm text-headline-sm leading-none font-bold">{ratingVal}</span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant pr-1 font-normal">(تقييم الجمهور)</span>
                                </div>
                                {/* Year */}
                                <div className="px-space-md py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md">
                                    {anime.releaseYear || "2024"}
                                </div>
                                {/* Age Rating */}
                                <div className="px-space-md py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                                    +16 (إثارة وشونين)
                                </div>
                                {/* Total Episodes */}
                                <div className="px-space-md py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md">
                                    {anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "كامل"}
                                </div>
                            </div>

                            {/* Genres Row */}
                            <div className="flex flex-wrap items-center gap-space-xs">
                                <span className="px-space-md py-1.5 rounded-full bg-primary-container/20 text-primary font-label-md text-label-md flex items-center gap-1.5 border border-primary-container/30">
                                    <span className="material-symbols-outlined text-[16px]">public</span>
                                    <span>كوكب الرياضة والأكشن</span>
                                </span>
                                {(anime.genres || []).map((genre) => (
                                    <span key={genre} className="px-space-md py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-all font-label-md text-label-md">
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            {/* Story Synopsis */}
                            <div className="bg-surface-container-low/80 backdrop-blur-md p-space-lg rounded-2xl shadow-inner border border-white/[0.05]">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs flex items-center gap-space-xs font-bold">
                                    <span className="material-symbols-outlined text-primary-container text-[20px]">auto_stories</span>
                                    قصة العمل
                                </h3>
                                <p className={`font-body-lg text-body-lg text-on-surface-variant leading-relaxed ${isSynopsisExpanded ? "" : "line-clamp-3"}`}>
                                    {anime.description || "استمتع بمتابعة هذا العمل الأسطوري الرائع مع أبطاله المتميزين وجودة العرض السينمائية 4K وترجمة ودبلجة مركز الزهرة الأصلية الخالية من أي تشويش أو فواصل."}
                                </p>
                                <button 
                                    onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                                    className="mt-space-xs inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container transition-colors focus:outline-none cursor-pointer"
                                >
                                    <span>{isSynopsisExpanded ? "عرض أقل" : "عرض المزيد"}</span>
                                    <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${isSynopsisExpanded ? "rotate-180" : ""}`}>
                                        expand_more
                                    </span>
                                </button>
                            </div>

                            {/* CTA Action Buttons */}
                            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                                {firstEpisodeId ? (
                                    <Link
                                        href={`/watch/${firstEpisodeId}`}
                                        className="relative group flex items-center gap-space-sm px-space-xl py-space-md rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold shadow-[0_8px_24px_rgba(220,38,38,0.4)] hover:brightness-110 active:scale-95 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                        <span>ابدأ المشاهدة (الحلقة 1)</span>
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="px-space-xl py-space-md rounded-xl bg-surface-container-high text-on-surface-variant font-headline-sm"
                                    >
                                        الحلقات قادمة قريباً
                                    </button>
                                )}

                                <button
                                    onClick={handleWatchlistToggle}
                                    disabled={toggling}
                                    className={`flex items-center gap-space-xs px-space-md py-space-md rounded-xl font-label-md text-label-md transition-all border cursor-pointer ${
                                        isInWatchlist 
                                            ? "bg-primary-container/20 border-primary-container text-primary" 
                                            : "bg-surface-container-low hover:bg-surface-container-high border-white/[0.08] text-on-surface-variant hover:text-on-surface"
                                    }`}
                                >
                                    <span 
                                        className={`material-symbols-outlined text-[20px] ${isInWatchlist ? "text-primary-container" : ""}`}
                                        style={{ fontVariationSettings: isInWatchlist ? "'FILL' 1" : "'FILL' 0" }}
                                    >
                                        favorite
                                    </span>
                                    <span>{isInWatchlist ? "في المفضلة ❤️" : "أضف للمفضلة"}</span>
                                </button>

                                <button
                                    onClick={handleCopyShare}
                                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-white/[0.08] text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
                                    title="مشاركة الرابط"
                                >
                                    <span className="material-symbols-outlined text-[20px]">share</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* 2. EPISODES MANAGEMENT & STREAMING RAIL   */}
            {/* ========================================== */}
            <section className="w-full max-w-7xl mx-auto px-gutter-lg py-space-xl">
                {/* Header & Filter Controls */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg mb-space-xl">
                    <div className="flex items-baseline gap-space-md">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold flex items-center gap-space-sm">
                            <span className="w-2.5 h-6 rounded-full bg-primary-container"></span>
                            قائمة الحلقات
                        </h2>
                        <span className="font-label-md text-label-md text-secondary bg-secondary-container/15 px-space-sm py-0.5 rounded-full">
                            {episodes.length} حلقة متوفرة
                        </span>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-white/[0.05]">
                        <button
                            onClick={() => setFilterEpisodeType("all")}
                            className={`px-space-md py-1.5 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer ${
                                filterEpisodeType === "all" ? "bg-primary-container text-on-primary-container font-bold shadow" : "text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            الكل ({episodes.length})
                        </button>
                        <button
                            onClick={() => setFilterEpisodeType("free")}
                            className={`px-space-md py-1.5 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer ${
                                filterEpisodeType === "free" ? "bg-primary-container text-on-primary-container font-bold shadow" : "text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            مجانية (أول حلقتين)
                        </button>
                        <button
                            onClick={() => setFilterEpisodeType("vip")}
                            className={`px-space-md py-1.5 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer ${
                                filterEpisodeType === "vip" ? "bg-secondary-container text-on-secondary font-bold shadow" : "text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            حصريات VIP
                        </button>
                    </div>
                </div>

                {/* Resume Playback Banner */}
                {episodes.length > 0 && (
                    <div className="mb-space-lg p-space-md rounded-2xl bg-gradient-to-r from-primary-container/20 via-surface-container to-surface-container-low border border-primary-container/30 flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-lg">
                        <div className="flex items-center gap-space-md w-full sm:w-auto">
                            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(220,38,38,0.5)]">
                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                            </div>
                            <div className="text-right">
                                <span className="font-label-sm text-label-sm text-primary font-bold block">قيد المتابعة الآن • توقفت عند الدقيقة 13:10</span>
                                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm">
                                    {episodes[0]?.title || "الحلقة السابقة"}
                                </h4>
                                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">متبقي 10 دقائق لإكمال الحلقة</span>
                            </div>
                        </div>
                        <Link
                            href={`/watch/${episodes[0]?.id}`}
                            className="shrink-0 px-space-lg py-2 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <span>استكمال التشغيل</span>
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                        </Link>
                    </div>
                )}

                {/* Episodes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
                    {filteredEpisodes.map((episode, idx) => (
                        <EpisodeCard
                            key={episode.id}
                            episode={{
                                ...episode,
                                animeTitle: anime.title,
                                isVip: idx >= 2
                            }}
                        />
                    ))}
                    {filteredEpisodes.length === 0 && (
                        <div className="col-span-full text-center py-12 text-on-surface-variant bg-surface-container-low rounded-2xl border border-dashed border-white/10">
                            لا توجد حلقات مطابقة للفلتر المحدد.
                        </div>
                    )}
                </div>
            </section>

            {/* ========================================== */}
            {/* 3. CHARACTERS & VOICE ACTORS              */}
            {/* ========================================== */}
            {characters.length > 0 && (
                <section className="w-full max-w-7xl mx-auto px-gutter-lg py-space-xl border-t border-white/[0.05]">
                    <div className="flex items-center justify-between mb-space-lg">
                        <div className="flex items-center gap-space-sm">
                            <span className="w-2.5 h-6 rounded-full bg-secondary"></span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">الشخصيات وطاقم الدبلجة</h2>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline-block">
                            أداء ثنائي باليابانية والعربية الفصحى
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-space-md">
                        {characters.map((char) => (
                            <CharacterCard key={char.id} character={char} variant="circle" />
                        ))}
                    </div>
                </section>
            )}

            {/* ========================================== */}
            {/* 4. USER REVIEWS & RATINGS SUMMARY          */}
            {/* ========================================== */}
            <section className="w-full max-w-7xl mx-auto px-gutter-lg py-space-xl border-t border-white/[0.05]">
                <div className="p-space-xl rounded-3xl bg-surface-container-low border border-white/[0.05] shadow-xl">
                    <div className="flex flex-col lg:flex-row gap-space-xl items-start">
                        {/* Rating Metrics Left Card (RTL right) */}
                        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col items-center text-center p-space-lg rounded-2xl bg-surface-container border border-white/[0.04] shadow-inner">
                            <span className="font-label-md text-label-md text-on-surface-variant mb-1">تقييم مجتمع ANIME DAZE</span>
                            <div className="flex items-center gap-2 my-2">
                                <span className="font-headline-hero text-headline-hero text-on-surface font-extrabold leading-none">{ratingVal}</span>
                                <div className="flex flex-col text-right">
                                    <div className="flex text-secondary">
                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                    </div>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">من 10 نقاط</span>
                                </div>
                            </div>
                            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">مبني على 28,420 مراجعة معتمدة</span>

                            {/* Stars Distribution Bars */}
                            <div className="w-full flex flex-col gap-2 mt-space-lg">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-8 text-on-surface-variant font-mono">5 ★</span>
                                    <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary rounded-full w-[78%]"></div>
                                    </div>
                                    <span className="w-8 text-on-surface-variant font-mono text-left">78%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-8 text-on-surface-variant font-mono">4 ★</span>
                                    <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary/80 rounded-full w-[14%]"></div>
                                    </div>
                                    <span className="w-8 text-on-surface-variant font-mono text-left">14%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-8 text-on-surface-variant font-mono">3 ★</span>
                                    <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary/50 rounded-full w-[5%]"></div>
                                    </div>
                                    <span className="w-8 text-on-surface-variant font-mono text-left">5%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-8 text-on-surface-variant font-mono">2 ★</span>
                                    <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary/30 rounded-full w-[2%]"></div>
                                    </div>
                                    <span className="w-8 text-on-surface-variant font-mono text-left">2%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-8 text-on-surface-variant font-mono">1 ★</span>
                                    <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary/20 rounded-full w-[1%]"></div>
                                    </div>
                                    <span className="w-8 text-on-surface-variant font-mono text-left">1%</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setToast({ message: "شكراً لتقييمك! تم تسجيل رأيك في المنصة ⭐", type: "success" })}
                                className="mt-space-lg w-full py-space-sm rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                            >
                                أضف تقييمك للعمل
                            </button>
                        </div>

                        {/* Featured User Reviews */}
                        <div className="flex-1 flex flex-col gap-space-md w-full text-right">
                            <div className="flex items-center justify-between">
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">أبرز مراجعات المشاهدين</h3>
                                <span className="font-label-md text-label-md text-primary hover:underline cursor-pointer">عرض جميع المراجعات (142)</span>
                            </div>

                            {/* Review 1 */}
                            <div className="p-space-lg rounded-2xl bg-surface-container border border-white/[0.04] shadow-md flex flex-col gap-space-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-space-sm">
                                        <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary-container flex items-center justify-center font-bold">
                                            ط
                                        </div>
                                        <div>
                                            <h5 className="font-headline-sm text-headline-sm text-sm text-on-surface font-bold">طارق السبيعي (أوتاكو كلاسيك)</h5>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">قبل يومين • شاهد 7 حلقات</span>
                                        </div>
                                    </div>
                                    <div className="flex text-secondary">
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    </div>
                                </div>
                                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    "تحفة بصرية استثنائية أعادت لي بريق أعمال سبيستون الذهبية مع أحدث تقنيات الإنتاج الحديث! أداء صوتي عربي فصيح متقن يبعث على الفخر، وأتمنى استمرار هذا الألق طوال حلقات الموسم."
                                </p>
                                <div className="flex items-center gap-space-md pt-space-xs text-on-surface-variant font-label-sm text-label-sm">
                                    <button className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                                        <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                                        <span>مفيد (412)</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-pointer">
                                        <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                                        <span>ردود (18)</span>
                                    </button>
                                </div>
                            </div>

                            {/* Review 2 */}
                            <div className="p-space-lg rounded-2xl bg-surface-container border border-white/[0.04] shadow-md flex flex-col gap-space-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-space-sm">
                                        <div className="w-10 h-10 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center font-bold">
                                            ن
                                        </div>
                                        <div>
                                            <h5 className="font-headline-sm text-headline-sm text-sm text-on-surface font-bold">نورة الخالدي</h5>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">قبل 5 أيام • شاهدت كل الحلقات المتوفرة</span>
                                        </div>
                                    </div>
                                    <div className="flex text-secondary">
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[16px]">star</span>
                                    </div>
                                </div>
                                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    "الموسيقى التصويرية تأخذك لعالم آخر، وبناء العالم الأثيري دقيق جداً ومليء بالتفاصيل الغامضة. شخصية البطل وحبكة القصة متقنة للغاية وجودة 4K على الشاشة خرافية."
                                </p>
                                <div className="flex items-center gap-space-md pt-space-xs text-on-surface-variant font-label-sm text-label-sm">
                                    <button className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                                        <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                                        <span>مفيد (289)</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-pointer">
                                        <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                                        <span>ردود (7)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* 5. SIMILAR RECOMMENDATIONS                */}
            {/* ========================================== */}
            {relatedAnimes.length > 0 && (
                <section className="w-full max-w-7xl mx-auto px-gutter-lg py-space-xl border-t border-white/[0.05]">
                    <div className="flex items-center justify-between mb-space-lg">
                        <div className="flex items-center gap-space-sm">
                            <span className="w-2.5 h-6 rounded-full bg-primary-container"></span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">أعمال مشابهة قد تعجبك</h2>
                        </div>
                        <Link href="/animes" className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1">
                            <span>عرض المزيد</span>
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-space-md">
                        {relatedAnimes.map((rel) => (
                            <AnimeCard key={rel.id} anime={rel} />
                        ))}
                    </div>
                </section>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
