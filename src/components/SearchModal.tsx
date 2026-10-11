"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ animes: any[], episodes: any[] }>({ animes: [], episodes: [] });
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                setLoading(true);
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    setResults(data);
                } catch (error) {
                    console.error("Search error", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults({ animes: [], episodes: [] });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    const handleLinkClick = () => {
        onClose();
        setQuery("");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-24 px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#0e0e12]/85 backdrop-blur-md transition-opacity" 
                onClick={onClose} 
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-2xl bg-surface-container-low border border-white/[0.08] rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Search Bar Header */}
                <div className="p-space-md border-b border-white/[0.06] flex items-center gap-space-md bg-surface-container-lowest/60">
                    <span className="material-symbols-outlined text-primary text-2xl">
                        search
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="ابحث عن أنمي أو حلقة... (اضغط ESC للإغلاق)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-on-surface text-lg placeholder:text-on-surface-variant/40 font-tajawal"
                    />
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-surface-container-high rounded-xl text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="إغلاق"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Results Panel */}
                <div className="max-h-[60vh] overflow-y-auto p-space-md custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-primary-container border-t-transparent animate-spin" />
                            <span className="font-tajawal text-xs font-bold">جاري البحث في قاعدة البيانات...</span>
                        </div>
                    ) : query.length > 0 ? (
                        <div className="space-y-space-lg">
                            {/* Anime Results */}
                            {results.animes.length > 0 && (
                                <div>
                                    <h3 className="text-secondary font-bold text-xs uppercase tracking-wider mb-space-sm px-2 flex items-center gap-1.5 font-headline-sm">
                                        <span className="material-symbols-outlined text-sm">movie</span>
                                        الأنمي والأعمال ({results.animes.length})
                                    </h3>
                                    <div className="grid gap-1.5">
                                        {results.animes.map(anime => (
                                            <Link
                                                key={anime.id}
                                                href={`/animes/${anime.id}`}
                                                onClick={handleLinkClick}
                                                className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-surface-container-high transition-colors group border border-transparent hover:border-white/[0.04]"
                                            >
                                                <div className="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-lowest">
                                                    <img src={anime.coverImage} alt={anime.title} className="w-full h-full object-cover group-hover:scale-108 transition-transform" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-on-surface font-headline-sm text-sm font-bold group-hover:text-primary transition-colors truncate">
                                                        {anime.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-xs text-on-surface-variant font-mono mt-1">
                                                        <span>{anime.type || "TV"}</span>
                                                        <span>•</span>
                                                        <span>{anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "كامل"}</span>
                                                        <span>•</span>
                                                        <span className="text-secondary font-bold">★ {anime.rating ? anime.rating.toFixed(1) : "9.2"}</span>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary text-xl">
                                                    arrow_back
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Episode Results */}
                            {results.episodes.length > 0 && (
                                <div>
                                    <h3 className="text-primary font-bold text-xs uppercase tracking-wider mb-space-sm px-2 flex items-center gap-1.5 font-headline-sm">
                                        <span className="material-symbols-outlined text-sm">play_circle</span>
                                        الحلقات ({results.episodes.length})
                                    </h3>
                                    <div className="grid gap-1.5">
                                        {results.episodes.map(ep => (
                                            <Link
                                                key={ep.id}
                                                href={`/watch/${ep.id}`}
                                                onClick={handleLinkClick}
                                                className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-surface-container-high transition-colors group border border-transparent hover:border-white/[0.04]"
                                            >
                                                <div className="w-20 aspect-video rounded-xl overflow-hidden flex-shrink-0 relative bg-surface-container-lowest">
                                                    <img src={ep.thumbnail || "/logoep.jpg"} alt={ep.title} className="w-full h-full object-cover group-hover:scale-108 transition-transform" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                            play_circle
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-on-surface font-headline-sm text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                                                        {ep.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1">
                                                        <span className="text-primary font-bold bg-primary-container/20 px-2 py-0.5 rounded text-[10px]">
                                                            الحلقة {ep.episodeNumber || ep.episode_number}
                                                        </span>
                                                        <span className="truncate text-on-surface-variant text-[11px]">{ep.animeTitle}</span>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary text-xl">
                                                    arrow_back
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.animes.length === 0 && results.episodes.length === 0 && (
                                <div className="text-center py-12 text-on-surface-variant flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">search_off</span>
                                    <p className="font-tajawal text-sm">لا توجد نتائج مطابقة لـ &quot;{query}&quot;</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-on-surface-variant/60 flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">saved_search</span>
                            <p className="font-tajawal text-sm">ابدأ الكتابة للبحث الفوري عن عملك أو حلقتك المفضلة...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
