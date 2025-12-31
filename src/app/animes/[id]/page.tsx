"use client";

import { useEffect, useState, use } from "react";
import { Anime, Episode } from "@/types";
import { Loader2, PlayCircle, Clock, Calendar, Film, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Toast, { ToastType } from "@/components/Toast";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function PublicAnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [anime, setAnime] = useState<Anime | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const animeRes = await fetch(`/api/animes/${id}`);
                if (animeRes.ok) {
                    const data = await animeRes.json();
                    setAnime(data);
                }

                const epsRes = await fetch(`/api/animes/${id}/episodes`);
                if (epsRes.ok) {
                    const data = await epsRes.json();
                    setEpisodes(data);
                }

                // Check watchlist status
                const watchlistRes = await fetch("/api/watchlist");
                if (watchlistRes.ok) {
                    const { watchlist } = await watchlistRes.json();
                    setIsInWatchlist(watchlist.includes(id));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
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
                    message: data.action === "added" ? "تمت الإضافة للمفضلة ❤️" : "تمت الإزالة من المفضلة",
                    type: "success"
                });
            } else if (res.status === 401) {
                setToast({ message: "يرجى تسجيل الدخول أولاً", type: "warning" });
            }
        } catch (error) {
            console.error("Watchlist toggle failed", error);
            setToast({ message: "فشلت العملية، حاول لاحقاً", type: "error" });
        } finally {
            setToggling(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-red-600 w-8 h-8" /></div>;
    if (!anime) return <div className="text-center p-20 text-white text-xl">العمل غير موجود</div>;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px]">
                <div className="absolute inset-0">
                    <img
                        src={anime.bannerImage || anime.coverImage}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 flex flex-col md:flex-row gap-8 items-end">
                    <div className="w-48 md:w-64 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-900 hidden md:block">
                        <img src={anime.coverImage} alt={anime.title} className="w-full h-auto" />
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap gap-2 text-sm font-bold">
                            <span className="bg-red-600 text-white px-2 py-1 rounded">{anime.type}</span>
                            <span className="bg-green-600/90 text-white px-2 py-1 rounded">{anime.status}</span>
                            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded">{anime.releaseYear}</span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                {anime.title}
                            </h1>
                            <button
                                onClick={handleWatchlistToggle}
                                disabled={toggling}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isInWatchlist
                                    ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20"
                                    : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                                    }`}
                            >
                                <Heart size={20} className={isInWatchlist ? "fill-white" : ""} />
                                <span className="text-sm font-bold">
                                    {isInWatchlist ? "في المفضلة" : "أضف للمفضلة"}
                                </span>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {anime.genres.map(g => (
                                <span key={g} className="text-slate-300 bg-slate-800/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-slate-700">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
                {/* Episodes List */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Film className="text-red-500" /> الحلقات ({episodes.length})
                        </h2>
                    </div>

                    <div className="grid gap-2">
                        {episodes.map(episode => (
                            <Link
                                key={episode.id}
                                href={`/watch/${episode.id}`} // Old route or updated?
                                className="group flex items-center gap-4 bg-slate-900 bg-opacity-50 hover:bg-opacity-100 border border-slate-800 hover:border-red-600/50 rounded-xl p-4 transition-all"
                            >
                                <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={episode.thumbnail || anime.coverImage} alt={episode.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                        <PlayCircle className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-slate-200 group-hover:text-red-500 transition-colors">
                                            {episode.title}
                                        </h3>
                                        <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                                            {episode.duration}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                        {episode.description || anime.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                        {episodes.length === 0 && (
                            <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                                لا توجد حلقات متاحة حالياً لهذا العمل.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-red-600 pl-3">القصة</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            {anime.description}
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-red-600 pl-3">معلومات</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-500">العنوان</span>
                                <span className="text-slate-300 font-medium">{anime.title}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-500">عدد الحلقات</span>
                                <span className="text-slate-300 font-medium">{anime.totalEpisodes}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-500">الحالة</span>
                                <span className="text-slate-300 font-medium">{anime.status}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                <span className="text-slate-500">السنة</span>
                                <span className="text-slate-300 font-medium">{anime.releaseYear}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
