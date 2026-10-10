"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Users, X, Loader2, ArrowLeft } from "lucide-react";
import { Character } from "@/types";

export default function CharactersAdmin() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const res = await fetch("/api/characters");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCharacters(data);
            } else if (data?.characters && Array.isArray(data.characters)) {
                setCharacters(data.characters);
            }
        } catch (error) {
            console.error("Failed to fetch characters", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف اللاعب "${name}"؟`)) return;

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

    const filteredCharacters = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        if (!q) return characters;
        return characters.filter((char) =>
            (char.name_ar || "").toLowerCase().includes(q) ||
            (char.name || "").toLowerCase().includes(q) ||
            (char.team || "").toLowerCase().includes(q) ||
            (char.role || "").toLowerCase().includes(q)
        );
    }, [characters, searchTerm]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <p className="text-xs text-slate-400 font-medium">جاري تحميل قائمة الشخصيات...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            إدارة لاعبي وشخصيات سلام دانك
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                        إضافة وتعديل صور، أرقام ومراكز لاعبي الفرق (الصقور، الساحق، الشعلة...).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                        إجمالي اللاعبين: <strong className="text-white">{characters.length}</strong>
                    </span>

                    <Link
                        href="/admin/characters/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                    >
                        <Plus size={16} />
                        <span>إضافة لاعب جديد</span>
                    </Link>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    placeholder="ابحث باسم اللاعب بالعربية أو الإنجليزية، أو اسم الفريق..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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

            {/* Characters Table */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                        <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800/80">
                            <tr>
                                <th className="p-4 pr-6 font-semibold">اللاعب</th>
                                <th className="p-4 font-semibold">الرقم والقميص</th>
                                <th className="p-4 font-semibold">المركز</th>
                                <th className="p-4 font-semibold">الفريق</th>
                                <th className="p-4 pl-6 text-left font-semibold">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredCharacters.map((char) => (
                                <tr key={char.id} className="hover:bg-slate-800/40 transition-colors group">
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                                                <img 
                                                    src={char.image || "/favicon.png"} 
                                                    alt={char.name_ar || char.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                                                    {char.name_ar || char.name}
                                                </div>
                                                {char.name && char.name !== char.name_ar && (
                                                    <div className="text-[11px] text-slate-500 font-medium">
                                                        {char.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        {char.number ? (
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 font-black text-sm">
                                                #{char.number}
                                            </span>
                                        ) : (
                                            <span className="text-slate-600">—</span>
                                        )}
                                    </td>

                                    <td className="p-4">
                                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold text-[11px]">
                                            {char.role || "لاعب"}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span className="text-slate-400 font-semibold text-xs">
                                            {char.team || "فريق الصقور (Shohoku)"}
                                        </span>
                                    </td>

                                    <td className="p-4 pl-6 text-left">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link
                                                href={`/admin/characters/${char.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-colors text-xs"
                                                title="تعديل اللاعب"
                                            >
                                                <Pencil size={13} />
                                                <span>تعديل</span>
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(char.id, char.name_ar || char.name)}
                                                disabled={deletingId === char.id}
                                                className="p-1.5 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/30 disabled:opacity-50"
                                                title="حذف اللاعب"
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCharacters.length === 0 && (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                        <Users size={32} className="mx-auto text-slate-600 mb-2" />
                        <p className="text-sm font-bold text-white">لا توجد شخصيات مطابقة للبحث</p>
                        <p className="text-xs text-slate-500">جرب البحث بكلمات مختلفة أو اسم الفريق.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
