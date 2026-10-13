"use client";

import { useState, useEffect } from "react";
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
                    setResults({
                        animes: Array.isArray(data?.animes) ? data.animes : [],
                        episodes: Array.isArray(data?.episodes) ? data.episodes : []
                    });
                } else {
                    setResults({ animes: [], episodes: [] });
                }
            } catch (error) {
                console.error("Search failed:", error);
                setResults({ animes: [], episodes: [] });
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <main className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pt-24 pb-24">
            <div className="max-w-4xl mx-auto px-gutter-lg">
                <div className="space-y-space-xl">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/20 text-primary font-label-md text-label-md font-bold mb-2">
                            <span className="material-symbols-outlined text-[16px]">manage_search</span>
                            <span>البحث الفوري الشامل</span>
                        </div>
                        <h1 className="font-headline-hero text-headline-hero font-extrabold text-on-surface tracking-tight">
                            ابحث في مكتبة ANIME DAZE
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
                            ابحث باسم الأنمي، رقم الحلقة، أو أسماء الشخصيات بدقة فائقة وبدون فواصل.
                        </p>
                    </div>

                    {/* Search Field */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                            {loading ? (
                                <div className="w-5 h-5 rounded-full border-2 border-primary-container border-t-transparent animate-spin" />
                            ) : (
                                <span className="material-symbols-outlined text-2xl">search</span>
                            )}
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-surface-container-low border-2 border-white/[0.08] focus:border-primary-container rounded-2xl py-5 pr-14 pl-6 text-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none transition-all shadow-[0_12px_36px_rgba(0,0,0,0.5)] font-tajawal"
                            placeholder="اكتب اسم الأنمي أو رقم الحلقة..."
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute inset-y-0 left-0 pl-5 flex items-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        )}
                    </div>

                    {/* Results Container */}
                    <div className="space-y-space-xl">
                        {results.animes.length === 0 && results.episodes.length === 0 && query.trim() && !loading && (
                            <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-space-sm">
                                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">search_off</span>
                                <p className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">
                                    لم يتم العثور على نتائج مطابقة لـ &quot;{query}&quot;
                                </p>
                            </div>
                        )}

                        {/* Animes Section */}
                        {results.animes.length > 0 && (
                            <section className="space-y-space-md">
                                <div className="flex items-center gap-space-sm">
                                    <div className="w-1.5 h-6 bg-primary-container rounded-full" />
                                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                                        الأعمال والمسلسلات ({results.animes.length})
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-gutter">
                                    {results.animes.map((anime) => (
                                        <Link
                                            key={anime.id}
                                            href={`/animes/${anime.id}`}
                                            className="group relative bg-surface-container-low rounded-2xl overflow-hidden border border-white/[0.06] hover:border-primary-container/40 transition-all hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            <div className="aspect-[3/4] relative overflow-hidden">
                                                <img 
                                                    src={anime.coverImage || "/hero-bg.jpg"} 
                                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                                                    alt={anime.title} 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
                                            </div>
                                            <div className="absolute bottom-0 p-3 w-full">
                                                <h3 className="font-headline-sm text-xs font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                                    {anime.title}
                                                </h3>
                                                <p className="font-label-sm text-[10px] text-on-surface-variant mt-0.5 font-mono">
                                                    {anime.releaseYear || "2024"} • {anime.type || "TV"}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Episodes Section */}
                        {results.episodes.length > 0 && (
                            <section className="space-y-space-md">
                                <div className="flex items-center gap-space-sm">
                                    <div className="w-1.5 h-6 bg-secondary-container rounded-full" />
                                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                                        الحلقات المتوفرة ({results.episodes.length})
                                    </h2>
                                </div>
                                <div className="space-y-2.5">
                                    {results.episodes.map((ep) => (
                                        <Link
                                            key={ep.id}
                                            href={`/watch/${ep.id}`}
                                            className="flex items-center gap-4 p-3 bg-surface-container-low hover:bg-surface-container rounded-2xl border border-white/[0.06] hover:border-primary-container/30 transition-all group"
                                        >
                                            <div className="w-24 md:w-32 aspect-video relative rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-lowest">
                                                <img 
                                                    src={ep.thumbnail || "/logoep.jpg"} 
                                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                                                    alt={ep.title} 
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                        play_circle
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-headline-sm text-sm md:text-base font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                                    {ep.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1.5 overflow-hidden">
                                                    <span className="font-label-sm text-[10px] md:text-xs text-primary font-bold bg-primary-container/20 px-2 py-0.5 rounded whitespace-nowrap">
                                                        حلقة {ep.episodeNumber}
                                                    </span>
                                                    <span className="font-body-sm text-[10px] md:text-xs text-on-surface-variant truncate">
                                                        {ep.animeTitle}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors text-xl">
                                                arrow_back
                                            </span>
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
