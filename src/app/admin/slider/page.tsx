"use client";

import { useEffect, useState } from "react";
import { Anime } from "@/types";
import { Loader2, Sparkles, Check, X, Film, Image as ImageIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SliderManagementPage() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const fetchAnimes = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/animes");
            if (res.ok) {
                const data = await res.json();
                setAnimes(data);
            }
        } catch (error) {
            console.error("Failed to fetch animes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimes();
    }, []);

    const toggleFeatured = async (anime: Anime) => {
        setTogglingId(anime.id);
        try {
            const res = await fetch(`/api/admin/animes/${anime.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isFeatured: !anime.isFeatured
                }),
            });

            if (res.ok) {
                setAnimes(prev => prev.map(a =>
                    a.id === anime.id ? { ...a, isFeatured: !a.isFeatured } : a
                ));
            }
        } catch (error) {
            console.error("Failed to toggle featured status:", error);
        } finally {
            setTogglingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    const featuredAnimes = animes.filter(a => a.isFeatured);
    const regularAnimes = animes.filter(a => !a.isFeatured);

    return (
        <div className="space-y-8 animate-in fade-in duration-700" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Sparkles className="text-yellow-500" /> إدارة السلايدر الرئيسي
                    </h1>
                    <p className="text-slate-400 mt-2">تحكم في الأعمال التي تظهر في الواجهة الرئيسية للموقع</p>
                </div>
                <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <span className="text-slate-400 text-sm font-medium">الأعمال المختارة:</span>
                    <span className="text-white font-bold text-lg bg-red-600/20 text-red-500 px-3 py-0.5 rounded-lg border border-red-500/20">
                        {featuredAnimes.length}
                    </span>
                </div>
            </div>

            {/* Featured Section */}
            <section className="bg-slate-900/50 rounded-3xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    الأعمال المعروضة حالياً
                </h2>
                {featuredAnimes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredAnimes.map((anime) => (
                            <div key={anime.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-red-600/50 transition-all duration-300 shadow-xl">
                                <div className="relative aspect-video">
                                    <img
                                        src={anime.bannerImage || anime.coverImage}
                                        alt={anime.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                    <button
                                        onClick={() => toggleFeatured(anime)}
                                        disabled={togglingId === anime.id}
                                        className="absolute top-4 left-4 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                                        title="إزالة من السلايدر"
                                    >
                                        {togglingId === anime.id ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-white font-bold text-lg line-clamp-1">{anime.title}</h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/animes/${anime.id}`}
                                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
                                            >
                                                <Film size={16} />
                                            </Link>
                                            <a
                                                href={`/animes/${anime.id}`}
                                                target="_blank"
                                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{anime.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-950/30 rounded-2xl border border-dashed border-slate-800">
                        <Sparkles size={48} className="mx-auto text-slate-800 mb-4" />
                        <p className="text-slate-500">لا توجد أعمال معروضة في السلايدر حالياً</p>
                    </div>
                )}
            </section>

            {/* All Animes Section */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 pr-1">بقية الأعمال</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-slate-950 text-slate-400 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold border-b border-white/5">العمل</th>
                                    <th className="px-6 py-4 font-bold border-b border-white/5 hidden md:table-cell">الحالة</th>
                                    <th className="px-6 py-4 font-bold border-b border-white/5">الإجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {regularAnimes.map((anime) => (
                                    <tr key={anime.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-16 rounded-lg overflow-hidden border border-slate-800 flex-shrink-0">
                                                    <img src={anime.coverImage} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold group-hover:text-red-500 transition-colors">{anime.title}</div>
                                                    <div className="text-slate-500 text-xs mt-1">{anime.releaseYear || "N/A"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-bold rounded-full">
                                                {anime.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleFeatured(anime)}
                                                disabled={togglingId === anime.id}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all font-bold text-sm border border-slate-700 hover:border-red-500 shadow-lg disabled:opacity-50"
                                            >
                                                {togglingId === anime.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                إضافة للسلايدر
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
