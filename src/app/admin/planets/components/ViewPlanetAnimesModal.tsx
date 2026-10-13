"use client";

import React from "react";
import Link from "next/link";
import { X, Tv, ExternalLink, Plus, Loader2 } from "lucide-react";
import { AdminPlanetItem } from "@/lib/planets-presets";
import { Anime } from "@/types";

interface ViewPlanetAnimesModalProps {
    planet: AdminPlanetItem | null;
    onClose: () => void;
    animesList: Anime[];
    loading: boolean;
}

export function ViewPlanetAnimesModal({
    planet,
    onClose,
    animesList,
    loading,
}: ViewPlanetAnimesModalProps) {
    if (!planet) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#131317] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" dir="rtl">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{planet.badge}</span>
                        <div>
                            <h3 className="font-cairo font-black text-lg text-white">
                                الأعمال المصنفة في {planet.name}
                            </h3>
                            <span className="font-tajawal text-xs text-amber-400 font-bold">
                                {animesList.length} عملاً مطابقاً
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {loading ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-red-500" size={28} />
                        <span className="font-cairo text-xs text-[#94a3b8]">جاري جلب قائمة الأعمال...</span>
                    </div>
                ) : animesList.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                        <Tv size={36} className="mx-auto text-[#94a3b8]/40" />
                        <p className="font-cairo font-bold text-sm text-white">لا توجد أعمال مرتبطة بهذا الكوكب حالياً</p>
                        <p className="font-tajawal text-xs text-[#94a3b8]">
                            يمكنك تعيين التصنيف &quot;{planet.genreKey}&quot; لأي أنمي من مكتبة الأعمال ليظهر هنا تلقائياً.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                        {animesList.map((anime) => (
                            <div 
                                key={anime.id}
                                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 flex items-center justify-between gap-3 transition-all"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-12 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                                        <img 
                                            src={anime.coverImage} 
                                            alt={anime.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-cairo font-bold text-sm text-white truncate">{anime.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[11px] text-[#ffb4ab] font-bold">★ {anime.rating || 9.5}</span>
                                            <span className="text-white/20">•</span>
                                            <span className="text-[11px] text-[#94a3b8]">{anime.totalEpisodes || "?"} حلقة</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Link
                                        href={`/admin/animes/${anime.id}`}
                                        className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-cairo font-bold text-white transition-all"
                                    >
                                        تعديل الأنمي
                                    </Link>
                                    <Link
                                        href={`/animes/${anime.id}`}
                                        target="_blank"
                                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#94a3b8] hover:text-white transition-all"
                                    >
                                        <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                    <Link
                        href="/admin/animes/new"
                        className="text-xs font-cairo font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                        <Plus size={14} />
                        <span>إضافة أنمي جديد إلى الكوكب</span>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-white transition-all cursor-pointer"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
}
