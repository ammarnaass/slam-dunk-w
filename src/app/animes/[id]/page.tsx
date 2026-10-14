"use client";

import { useEffect, useState, use } from "react";
import { Anime, Episode, Character } from "@/types";
import Link from "next/link";
import Toast, { ToastType } from "@/components/Toast";
import AnimeCard from "@/components/AnimeCard";
import { AnimeHeroSection } from "./components/AnimeHeroSection";
import { AnimeEpisodesSection } from "./components/AnimeEpisodesSection";
import { AnimeCastSection } from "./components/AnimeCastSection";
import { AnimeReviewsSection } from "./components/AnimeReviewsSection";

export default function PublicAnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [anime, setAnime] = useState<Anime | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [relatedAnimes, setRelatedAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [toggling, setToggling] = useState(false);
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
                    message: data.action === "added" ? "تمت الإضافة لقائمة المشاهدة بنجاح ❤️" : "تمت الإزالة من قائمة المشاهدة",
                    type: "success"
                });
            } else {
                setToast({ message: "يرجى تسجيل الدخول لحفظ قائمة المشاهدة", type: "error" });
            }
        } catch {
            setToast({ message: "حدث خطأ في الاتصال، يرجى المحاولة لاحقاً", type: "error" });
        } finally {
            setToggling(false);
        }
    };

    const handleCopyShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setToast({ message: "تم نسخ رابط العمل لمشاركته مع أصدقائك 📋", type: "info" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-space-md">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="font-label-md text-label-md text-on-surface-variant font-bold">
                    جاري تحميل عالم الأنمي...
                </span>
            </div>
        );
    }

    if (!anime) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-space-md text-center p-gutter-lg">
                <span className="material-symbols-outlined text-6xl text-primary mb-space-sm">error</span>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">العمل غير موجود</h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                    لم نتمكن من العثور على العمل المطلوب، ربما تم نقله أو تغييره بواسطة إدارة المنصة.
                </p>
                <Link
                    href="/animes"
                    className="mt-space-md px-space-xl py-space-sm rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm"
                >
                    العودة لمكتبة الأنمي
                </Link>
            </div>
        );
    }

    const firstEpisodeId = episodes.length > 0 ? episodes[0].id : undefined;
    const ratingVal = anime.rating ? Number(anime.rating).toFixed(1) : "9.8";

    return (
        <div className="min-h-screen bg-background text-on-surface flex flex-col overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
            {/* 1. CINEMATIC HERO SHOWCASE */}
            <AnimeHeroSection
                anime={anime}
                firstEpisodeId={firstEpisodeId}
                isInWatchlist={isInWatchlist}
                toggling={toggling}
                onWatchlistToggle={handleWatchlistToggle}
                onCopyShare={handleCopyShare}
            />

            {/* 2. EPISODES MANAGEMENT & STREAMING RAIL */}
            <AnimeEpisodesSection
                episodes={episodes}
                firstEpisodeId={firstEpisodeId}
                filterEpisodeType={filterEpisodeType}
                setFilterEpisodeType={setFilterEpisodeType}
            />

            {/* 3. CHARACTERS CAST SHOWCASE */}
            <AnimeCastSection characters={characters} />

            {/* 4. USER REVIEWS & RATINGS SUMMARY */}
            <AnimeReviewsSection
                ratingVal={ratingVal}
                onAddReviewClick={() => setToast({ message: "شكراً لتقييمك! تم تسجيل رأيك في المنصة ⭐", type: "success" })}
            />

            {/* 5. SIMILAR RECOMMENDATIONS */}
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
