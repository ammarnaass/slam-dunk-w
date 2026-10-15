"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResults {
    animes: any[];
    episodes: any[];
    characters: any[];
}

const POPULAR_SEARCH_CHIPS = [
    "سلام دانك",
    "المحقق كونان",
    "الحلقة 1",
    "حسان",
    "فادي",
    "سينشي كودو",
    "كوكب رياضة",
    "سبيستون"
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResults>({ animes: [], episodes: [], characters: [] });
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input and lock scroll
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Live search query effect with debounce
    useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setResults({ animes: [], episodes: [], characters: [] });
            setLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults({
                        animes: Array.isArray(data?.animes) ? data.animes : [],
                        episodes: Array.isArray(data?.episodes) ? data.episodes : [],
                        characters: Array.isArray(data?.characters) ? data.characters : []
                    });
                } else {
                    setResults({ animes: [], episodes: [], characters: [] });
                }
            } catch (error) {
                console.error("Search modal error:", error);
                setResults({ animes: [], episodes: [], characters: [] });
            } finally {
                setLoading(false);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    const handleLinkClick = () => {
        onClose();
        setQuery("");
    };

    const hasResults =
        results.animes.length > 0 ||
        results.episodes.length > 0 ||
        results.characters.length > 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-24 px-4" dir="rtl">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#0e0e12]/85 backdrop-blur-md transition-opacity" 
                onClick={onClose} 
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-2xl bg-[#131317] border border-white/[0.1] rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Search Bar Header */}
                <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center gap-3 bg-[#0a0a0d]/80">
                    <span className="material-symbols-outlined text-[#dc2626] text-2xl shrink-0">
                        search
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="ابحث عن أنمي أو حلقة... (اضغط ESC للإغلاق)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white text-base sm:text-lg placeholder:text-[#94a3b8]/50 font-tajawal"
                    />

                    {/* Clear input button */}
                    {query.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl hover:bg-white/[0.08] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                            title="مسح النص"
                            aria-label="مسح النص"
                        >
                            <span className="material-symbols-outlined text-lg">cancel</span>
                        </button>
                    )}

                    {/* Close modal button */}
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 hover:bg-white/[0.08] rounded-xl text-[#94a3b8] hover:text-white transition-colors cursor-pointer shrink-0"
                        title="إغلاق النافذة"
                        aria-label="إغلاق النافذة"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Results & Suggestions Panel */}
                <div className="max-h-[62vh] overflow-y-auto p-4 sm:p-5 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-[#94a3b8] gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-[#dc2626] border-t-transparent animate-spin" />
                            <span className="font-tajawal text-xs font-bold text-[#e4e1e7]">
                                جاري البحث الفوري في مكتبة أنمي دايز...
                            </span>
                        </div>
                    ) : query.trim().length > 0 ? (
                        <div className="space-y-6">
                            {/* 1. Anime Results */}
                            {results.animes.length > 0 && (
                                <div>
                                    <h3 className="text-[#ffb95f] font-bold text-xs uppercase tracking-wider mb-2.5 px-2 flex items-center gap-1.5 font-cairo">
                                        <span className="material-symbols-outlined text-sm">movie</span>
                                        الأنمي والأعمال ({results.animes.length})
                                    </h3>
                                    <div className="grid gap-2">
                                        {results.animes.map(anime => (
                                            <Link
                                                key={anime.id}
                                                href={`/animes/${anime.id}`}
                                                onClick={handleLinkClick}
                                                className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors group border border-white/[0.04] hover:border-white/[0.1]"
                                            >
                                                <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 bg-black/40">
                                                    <img src={anime.coverImage} alt={anime.title} className="w-full h-full object-cover group-hover:scale-108 transition-transform" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-cairo text-sm font-bold group-hover:text-red-400 transition-colors truncate">
                                                        {anime.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2.5 text-xs text-[#94a3b8] mt-1">
                                                        <span>{anime.type || "TV"}</span>
                                                        <span>•</span>
                                                        <span>{anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "كامل"}</span>
                                                        <span>•</span>
                                                        <span className="text-[#ffb95f] font-bold">★ {anime.rating ? Number(anime.rating).toFixed(1) : "9.2"}</span>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-white/20 group-hover:text-white text-xl">
                                                    arrow_back
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 2. Character Results */}
                            {results.characters.length > 0 && (
                                <div>
                                    <h3 className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-2.5 px-2 flex items-center gap-1.5 font-cairo">
                                        <span className="material-symbols-outlined text-sm">group</span>
                                        أبطال وشخصيات الأنمي ({results.characters.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {results.characters.map(char => (
                                            <Link
                                                key={char.id}
                                                href={`/characters/${char.id}`}
                                                onClick={handleLinkClick}
                                                className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors group border border-white/[0.04] hover:border-white/[0.1]"
                                            >
                                                <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-white/10 bg-black/40">
                                                    <img src={char.image} alt={char.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-cairo text-sm font-bold group-hover:text-purple-300 transition-colors truncate">
                                                        {char.name}
                                                    </h4>
                                                    <span className="text-[11px] text-[#94a3b8] font-tajawal truncate block">
                                                        {char.team || char.role}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. Episode Results */}
                            {results.episodes.length > 0 && (
                                <div>
                                    <h3 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2.5 px-2 flex items-center gap-1.5 font-cairo">
                                        <span className="material-symbols-outlined text-sm">play_circle</span>
                                        الحلقات المباشرة ({results.episodes.length})
                                    </h3>
                                    <div className="grid gap-2">
                                        {results.episodes.map(ep => (
                                            <Link
                                                key={ep.id}
                                                href={`/watch/${ep.id}`}
                                                onClick={handleLinkClick}
                                                className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors group border border-white/[0.04] hover:border-white/[0.1]"
                                            >
                                                <div className="w-20 aspect-video rounded-xl overflow-hidden shrink-0 relative bg-black/40">
                                                    <img src={ep.thumbnail || "/hero-bg.jpg"} alt={ep.title} className="w-full h-full object-cover group-hover:scale-108 transition-transform" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                            play_circle
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-cairo text-sm font-medium group-hover:text-red-400 transition-colors line-clamp-1">
                                                        {ep.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-[#94a3b8] mt-1">
                                                        <span className="text-red-400 font-bold bg-red-600/20 px-2 py-0.5 rounded text-[10px]">
                                                            الحلقة {ep.episodeNumber || ep.episode_number}
                                                        </span>
                                                        <span className="truncate text-[#94a3b8] text-[11px]">{ep.animeTitle}</span>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-white/20 group-hover:text-white text-xl">
                                                    arrow_back
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results Fallback */}
                            {!hasResults && (
                                <div className="text-center py-12 text-[#94a3b8] flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-4xl text-white/20">search_off</span>
                                    <p className="font-tajawal text-sm text-[#e4e1e7]">
                                        لم يتم العثور على نتائج مطابقة لـ &quot;{query}&quot;
                                    </p>
                                    <p className="font-tajawal text-xs text-[#94a3b8]">
                                        جرب البحث باسم آخر مثل: سلام دانك، كونان، أو رقم الحلقة...
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Idle State with Clickable Suggestion Chips */
                        <div className="py-8 space-y-6 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 rounded-2xl bg-[#dc2626]/10 border border-[#dc2626]/20 flex items-center justify-center text-[#ffb4ab] mb-1">
                                    <span className="material-symbols-outlined text-3xl">saved_search</span>
                                </div>
                                <h4 className="font-cairo font-bold text-base text-white">
                                    ابدأ الكتابة للبحث الفوري عن عملك أو حلقتك المفضلة..
                                </h4>
                                <p className="font-tajawal text-xs text-[#94a3b8] max-w-md mx-auto">
                                    ابحث باسم الأنمي، رقم الحلقة، أو أسماء أبطال الدبلجة في ثوانٍ معدودة.
                                </p>
                            </div>

                            {/* Quick Suggestion Chips */}
                            <div className="pt-2">
                                <span className="font-tajawal text-[11px] font-bold text-[#ffb95f] block mb-2.5">
                                    عمليات البحث الشائعة:
                                </span>
                                <div className="flex items-center justify-center gap-2 flex-wrap max-w-lg mx-auto">
                                    {POPULAR_SEARCH_CHIPS.map((chip) => (
                                        <button
                                            key={chip}
                                            type="button"
                                            onClick={() => setQuery(chip)}
                                            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#dc2626]/40 text-xs font-tajawal text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer hover:text-white"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
