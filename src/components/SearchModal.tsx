"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, PlayCircle, Film } from "lucide-react";
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
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-slate-800 flex items-center gap-4">
                    <Search className="text-slate-400" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="ابحث عن أنمي أو حلقة..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-slate-500"
                    />
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Loader2 className="animate-spin mb-4" size={32} />
                            <span>جاري البحث...</span>
                        </div>
                    ) : query.length > 0 ? (
                        <div className="space-y-8">
                            {results.animes.length > 0 && (
                                <div>
                                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-4 px-2">الأنمي</h3>
                                    <div className="grid gap-2">
                                        {results.animes.map(anime => (
                                            <Link
                                                key={anime.id}
                                                href={`/animes/${anime.id}`}
                                                onClick={handleLinkClick}
                                                className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-800 transition-colors group"
                                            >
                                                <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={anime.coverImage} alt={anime.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold group-hover:text-red-500 transition-colors">{anime.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                        <span>{anime.type}</span>
                                                        <span>•</span>
                                                        <span>{anime.totalEpisodes} حلقة</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.episodes.length > 0 && (
                                <div>
                                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-4 px-2">الحلقات</h3>
                                    <div className="grid gap-2">
                                        {results.episodes.map(ep => (
                                            <Link
                                                key={ep.id}
                                                href={`/watch/${ep.id}`}
                                                onClick={handleLinkClick}
                                                className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-800 transition-colors group"
                                            >
                                                <div className="w-16 aspect-video rounded-lg overflow-hidden flex-shrink-0 relative">
                                                    <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <PlayCircle size={16} className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-medium group-hover:text-red-500 transition-colors line-clamp-1">{ep.title}</h4>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                                                        <Film size={12} className="text-red-600" />
                                                        <span>{ep.animeTitle}</span>
                                                        <span>•</span>
                                                        <span>الحلقة {ep.episodeNumber || ep.episode_number}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.animes.length === 0 && results.episodes.length === 0 && (
                                <div className="text-center py-12 text-slate-500">
                                    لا توجد نتائج لـ "{query}"
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            ابدأ الكتابة للبحث عن عملك المفضل...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
