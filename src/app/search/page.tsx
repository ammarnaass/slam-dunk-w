"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, PlayCircle, Film, Hash, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Anime, Episode } from "@/types";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ animes: Anime[]; episodes: (Episode & { animeTitle: string })[] }>({
        animes: [],
        episodes: [],
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults({ animes: [], episodes: [] });
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-24">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">البحث الشامل</h1>
                        <p className="text-slate-400">ابحث عن الأنمي المفضل لديك أو حلقة معينة</p>
                    </div>

                    {/* Search Field */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                            {loading ? (
                                <Loader2 size={24} className="text-red-500 animate-spin" />
                            ) : (
                                <SearchIcon size={24} className="text-slate-500 group-focus-within:text-red-500 transition-colors" />
                            )}
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-slate-900/50 backdrop-blur-xl border-2 border-slate-800 rounded-2xl py-5 pr-14 pl-6 text-xl text-white placeholder-slate-600 focus:outline-none focus:border-red-600/50 transition-all shadow-2xl"
                            placeholder="اكتب اسم الأنمي أو رقم الحلقة..."
                            autoFocus
                        />
                    </div>

                    {/* Results Container */}
                    <div className="space-y-12">
                        {results.animes.length === 0 && results.episodes.length === 0 && query.trim() && !loading && (
                            <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-900">
                                <SearchIcon size={48} className="text-slate-800 mx-auto mb-4" />
                                <p className="text-slate-500 text-lg">لم يتم العثور على نتائج لـ "{query}"</p>
                            </div>
                        )}

                        {/* Animes */}
                        {results.animes.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                                    <h2 className="text-xl font-bold text-white">الأنميات ({results.animes.length})</h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {results.animes.map((anime) => (
                                        <Link
                                            key={anime.id}
                                            href={`/animes/${anime.id}`}
                                            className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-red-600/50 transition-all"
                                        >
                                            <div className="aspect-[2/3] relative overflow-hidden">
                                                <img src={anime.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
                                            </div>
                                            <div className="absolute bottom-0 p-3 w-full">
                                                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">{anime.title}</h3>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{anime.releaseYear} • {anime.type}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Episodes */}
                        {results.episodes.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                                    <h2 className="text-xl font-bold text-white">الحلقات ({results.episodes.length})</h2>
                                </div>
                                <div className="space-y-3">
                                    {results.episodes.map((ep) => (
                                        <Link
                                            key={ep.id}
                                            href={`/watch/${ep.id}`}
                                            className="flex items-center gap-4 p-3 bg-slate-900/50 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-red-600/30 transition-all group"
                                        >
                                            <div className="w-24 md:w-32 aspect-video relative rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={ep.thumbnail || "/logoep.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PlayCircle size={24} className="text-white fill-red-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm md:text-base font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">{ep.title}</h3>
                                                <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
                                                    <span className="text-[10px] md:text-xs text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded whitespace-nowrap">حلقة {ep.episodeNumber}</span>
                                                    <span className="text-[10px] md:text-xs text-slate-500 line-clamp-1 truncate">{ep.animeTitle}</span>
                                                </div>
                                            </div>
                                            <ArrowRight size={18} className="text-slate-700 group-hover:text-red-500 -rotate-180 transition-transform" />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

        </main>
    );
}
