"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Users, X, Loader2, ExternalLink, Film, Sparkles, Filter } from "lucide-react";
import { Character, Anime } from "@/types";

export default function CharactersAdmin() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAnime, setSelectedAnime] = useState<string>("all");
    const [selectedRole, setSelectedRole] = useState<string>("all");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [charsRes, animesRes] = await Promise.all([
                fetch("/api/characters"),
                fetch("/api/admin/animes").catch(() => fetch("/api/animes")),
            ]);

            const charsData = await charsRes.json();
            if (Array.isArray(charsData)) {
                setCharacters(charsData);
            } else if (charsData?.characters && Array.isArray(charsData.characters)) {
                setCharacters(charsData.characters);
            }

            if (animesRes.ok) {
                const animesData = await animesRes.json();
                if (Array.isArray(animesData)) {
                    setAnimes(animesData);
                } else if (animesData?.items && Array.isArray(animesData.items)) {
                    setAnimes(animesData.items);
                }
            }
        } catch (error) {
            console.error("Failed to fetch characters or animes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف الشخصية "${name}" نهائياً؟`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/characters/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCharacters(prev => prev.filter((char) => char.id !== id));
            } else {
                alert("فشل حذف الشخصية");
            }
        } catch (error) {
            console.error("Failed to delete character", error);
        } finally {
            setDeletingId(null);
        }
    };

    const animeMap = useMemo(() => {
        const map = new Map<string, Anime>();
        animes.forEach(a => map.set(a.id, a));
        return map;
    }, [animes]);

    const filteredCharacters = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        return characters.filter((char) => {
            // Anime Filter
            if (selectedAnime !== "all") {
                if (char.animeId !== selectedAnime) return false;
            }

            // Role Filter
            if (selectedRole !== "all") {
                const roleLower = (char.role || "").toLowerCase();
                if (!roleLower.includes(selectedRole.toLowerCase())) return false;
            }

            // Search query
            if (!q) return true;
            return (
                (char.name_ar || "").toLowerCase().includes(q) ||
                (char.name || "").toLowerCase().includes(q) ||
                (char.name_en || "").toLowerCase().includes(q) ||
                (char.name_jp || "").toLowerCase().includes(q) ||
                (char.team || "").toLowerCase().includes(q) ||
                (char.role || "").toLowerCase().includes(q) ||
                (char.description || "").toLowerCase().includes(q)
            );
        });
    }, [characters, searchTerm, selectedAnime, selectedRole]);

    // Unique animes represented in characters
    const uniqueAnimeCount = useMemo(() => {
        const set = new Set<string>();
        characters.forEach(c => {
            if (c.animeId) set.add(c.animeId);
        });
        return set.size;
    }, [characters]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[380px] gap-3">
                <Loader2 className="w-9 h-9 animate-spin text-red-600" />
                <p className="text-sm text-slate-400 font-medium">جاري تحميل موسوعة شخصيات ANIME DAZE...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-7 bg-gradient-to-b from-red-600 to-amber-500 rounded-full" />
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            إدارة شخصيات الأعمال والأنمي
                        </h1>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                            ANIME DAZE
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                        إدارة وتعديل أبطال ومساعدي وخصوم أعمال المنصة، وربطهم بالأعمال الفنية والكواكب ومؤدي الأصوات.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                        <span>إجمالي الشخصيات:</span>
                        <strong className="text-white text-sm">{characters.length}</strong>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                        <span>الأعمال المغطاة:</span>
                        <strong className="text-amber-400 text-sm">{uniqueAnimeCount}</strong>
                    </div>

                    <Link
                        href="/admin/characters/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                    >
                        <Plus size={16} />
                        <span>إضافة شخصية جديدة</span>
                    </Link>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search Input */}
                <div className="md:col-span-6 relative">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="ابحث باسم الشخصية (عربي/إنجليزي/ياباني)، الفصيل، أو الدور..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Anime Filter */}
                <div className="md:col-span-3">
                    <div className="relative">
                        <select
                            value={selectedAnime}
                            onChange={(e) => setSelectedAnime(e.target.value)}
                            className="w-full appearance-none bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 transition-all cursor-pointer"
                        >
                            <option value="all">كل الأعمال والأنميات ({characters.length})</option>
                            {animes.map(anime => {
                                const count = characters.filter(c => c.animeId === anime.id).length;
                                return (
                                    <option key={anime.id} value={anime.id}>
                                        {anime.title} ({count})
                                    </option>
                                );
                            })}
                        </select>
                        <Film size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                </div>

                {/* Role Filter */}
                <div className="md:col-span-3">
                    <div className="relative">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full appearance-none bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 transition-all cursor-pointer"
                        >
                            <option value="all">كل الأدوار الدرامية</option>
                            <option value="بطل">أبطال رئيسيون</option>
                            <option value="مساند">شخصيات مساندة</option>
                            <option value="خصم">خصوم ومنافسون</option>
                            <option value="شرير">أشرار ومنظمات</option>
                        </select>
                        <Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Characters Table */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                        <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800/80">
                            <tr>
                                <th className="p-4 pr-6 font-semibold">الشخصية</th>
                                <th className="p-4 font-semibold">العمل التابع له</th>
                                <th className="p-4 font-semibold">الدور والانتماء</th>
                                <th className="p-4 font-semibold">الأداء الصوتي</th>
                                <th className="p-4 pl-6 text-left font-semibold">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredCharacters.map((char) => {
                                const linkedAnime = char.animeId ? animeMap.get(char.animeId) : null;
                                const charAny = char as any;

                                return (
                                    <tr key={char.id} className="hover:bg-slate-800/40 transition-colors group">
                                        {/* Character Info */}
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                                                    <img
                                                        src={char.image || "/hero-bg.jpg"}
                                                        alt={char.name_ar || char.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm group-hover:text-red-400 transition-colors">
                                                        {char.name_ar || char.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {char.name_en && (
                                                            <span className="text-[11px] text-slate-400 font-mono">
                                                                {char.name_en}
                                                            </span>
                                                        )}
                                                        {char.name_jp && (
                                                            <span className="text-[10px] text-slate-500 font-light">
                                                                • {char.name_jp}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Anime & Planet */}
                                        <td className="p-4">
                                            {linkedAnime ? (
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className="font-bold text-white text-xs">
                                                        {linkedAnime.title}
                                                    </span>
                                                    {linkedAnime.planet && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold">
                                                            <Sparkles size={10} />
                                                            <span>كوكب {linkedAnime.planet}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-500 text-xs">
                                                    {char.animeId ? char.animeId : "غير محدد"}
                                                </span>
                                            )}
                                        </td>

                                        {/* Role & Affiliation */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="inline-flex px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/20 text-red-300 font-semibold text-[11px]">
                                                    {char.role || "شخصية رئيسية"}
                                                </span>
                                                {char.team && (
                                                    <span className="text-[11px] text-slate-400">
                                                        {char.team}
                                                    </span>
                                                )}
                                                {char.number && (
                                                    <span className="text-[10px] text-slate-500 font-mono">
                                                        #{char.number}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Voice Actors */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-0.5 text-[11px]">
                                                {charAny.voiceActorJa ? (
                                                    <span className="text-slate-300 truncate max-w-[180px]" title={charAny.voiceActorJa}>
                                                        🇯🇵 {charAny.voiceActorJa}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500">🇯🇵 أصلي</span>
                                                )}
                                                {charAny.voiceActorAr ? (
                                                    <span className="text-amber-400/90 truncate max-w-[180px]" title={charAny.voiceActorAr}>
                                                        🎙️ {charAny.voiceActorAr}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500">🎙️ دبلجة</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 pl-6 text-left">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/characters/${char.id}`}
                                                    target="_blank"
                                                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                                    title="معاينة في الموقع"
                                                >
                                                    <ExternalLink size={14} />
                                                </Link>

                                                <Link
                                                    href={`/admin/characters/${char.id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-colors text-xs"
                                                    title="تعديل الشخصية"
                                                >
                                                    <Pencil size={13} />
                                                    <span>تعديل</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(char.id, char.name_ar || char.name)}
                                                    disabled={deletingId === char.id}
                                                    className="p-1.5 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/30 disabled:opacity-50"
                                                    title="حذف الشخصية"
                                                >
                                                    {deletingId === char.id ? (
                                                        <Loader2 size={15} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={15} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredCharacters.length === 0 && (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                        <Users size={32} className="mx-auto text-slate-600 mb-2" />
                        <p className="text-sm font-bold text-white">لا توجد شخصيات مطابقة لمعايير البحث</p>
                        <p className="text-xs text-slate-500">جرب اختيار عمل آخر أو مسح كلمة البحث.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
