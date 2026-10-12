"use client";

import { POPULAR_STUDIOS } from "@/lib/anime-presets";
import { Sparkles, Flame, Film } from "lucide-react";

interface AnimePromotionCardProps {
    type: string;
    status: string;
    totalEpisodes: number;
    releaseYear?: number | null;
    studio?: string;
    rating: number;
    isFeatured: boolean;
    isTrending: boolean;
    onChangeField: (field: string, value: any) => void;
}

export default function AnimePromotionCard({
    type = "TV Series",
    status = "Ongoing",
    totalEpisodes = 0,
    releaseYear = new Date().getFullYear(),
    studio = "Toei Animation",
    rating = 9.2,
    isFeatured = false,
    isTrending = false,
    onChangeField,
}: AnimePromotionCardProps) {
    return (
        <div className="bg-[#121217] rounded-2xl border border-white/[0.06] p-6 shadow-xl space-y-5 text-right">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600/20 text-[#dc2626] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">stars</span>
                    </div>
                    <div>
                        <h3 className="font-cairo font-bold text-base text-white">الإنتاج والترويج والجدولة</h3>
                        <p className="text-xs text-[#94a3b8]">خيارات التثبيت في السلايدر، رواج العمل، والاستوديو والحلقات</p>
                    </div>
                </div>
            </div>

            {/* Featured & Trending Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Featured in Hero Slider */}
                <div 
                    onClick={() => onChangeField("isFeatured", !isFeatured)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isFeatured
                            ? "bg-red-950/30 border-[#dc2626] ring-1 ring-[#dc2626]/40 shadow-md"
                            : "bg-[#181820] border-white/5 hover:border-white/10"
                    }`}
                >
                    <div className="space-y-0.5">
                        <span className="font-cairo font-bold text-xs text-white flex items-center gap-1.5">
                            <Sparkles size={14} className="text-[#ffb95f]" />
                            <span>تثبيت في السلايدر الرئيسي</span>
                        </span>
                        <span className="text-[10px] text-[#94a3b8] block">
                            يظهر كعمل مميز في واجهة الموقع العلوية
                        </span>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-colors relative ${isFeatured ? "bg-[#dc2626]" : "bg-[#282834]"}`}>
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isFeatured ? "right-5" : "right-1"}`} />
                    </div>
                </div>

                {/* Trending Badge */}
                <div 
                    onClick={() => onChangeField("isTrending", !isTrending)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isTrending
                            ? "bg-amber-950/30 border-[#f59e0b] ring-1 ring-[#f59e0b]/40 shadow-md"
                            : "bg-[#181820] border-white/5 hover:border-white/10"
                    }`}
                >
                    <div className="space-y-0.5">
                        <span className="font-cairo font-bold text-xs text-white flex items-center gap-1.5">
                            <Flame size={14} className="text-[#f59e0b]" />
                            <span>شارة الأكثر رواجاً (Trending)</span>
                        </span>
                        <span className="text-[10px] text-[#94a3b8] block">
                            إبراز العمل في قوائم الأعمال الأكثر طلباً
                        </span>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-colors relative ${isTrending ? "bg-[#f59e0b]" : "bg-[#282834]"}`}>
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isTrending ? "right-5" : "right-1"}`} />
                    </div>
                </div>
            </div>

            {/* Production Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/[0.04]">
                {/* Type */}
                <div>
                    <label className="block text-xs font-bold text-[#e4e1e7] mb-1.5">نوع العمل</label>
                    <select
                        value={type}
                        onChange={(e) => onChangeField("type", e.target.value)}
                        className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-3 py-2 text-xs text-white outline-none font-bold cursor-pointer"
                    >
                        <option value="TV Series">مسلسل (TV Series)</option>
                        <option value="Movie">فيلم أنمي (Movie)</option>
                        <option value="OVA">حلقات خاصة (OVA)</option>
                        <option value="Special">حلقة استثنائية (Special)</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-xs font-bold text-[#e4e1e7] mb-1.5">حالة البث</label>
                    <select
                        value={status}
                        onChange={(e) => onChangeField("status", e.target.value)}
                        className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-3 py-2 text-xs text-white outline-none font-bold cursor-pointer"
                    >
                        <option value="Ongoing">مستمر (Ongoing)</option>
                        <option value="Completed">مكتمل (Completed)</option>
                        <option value="Coming Soon">قريباً (Coming Soon)</option>
                    </select>
                </div>

                {/* Total Episodes */}
                <div>
                    <label className="block text-xs font-bold text-[#e4e1e7] mb-1.5">عدد الحلقات</label>
                    <input
                        type="number"
                        min={0}
                        value={totalEpisodes}
                        onChange={(e) => onChangeField("totalEpisodes", e.target.value)}
                        className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                    />
                </div>

                {/* Release Year */}
                <div>
                    <label className="block text-xs font-bold text-[#e4e1e7] mb-1.5">سنة الإصدار</label>
                    <input
                        type="number"
                        min={1960}
                        max={2035}
                        value={releaseYear || ""}
                        onChange={(e) => onChangeField("releaseYear", e.target.value)}
                        placeholder="YYYY"
                        className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                    />
                </div>
            </div>

            {/* Studio and Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.04]">
                <div>
                    <label className="block text-xs font-bold text-[#e4e1e7] mb-1.5">
                        استوديو الإنتاج
                    </label>
                    <div className="space-y-1.5">
                        <input
                            type="text"
                            value={studio || ""}
                            onChange={(e) => onChangeField("studio", e.target.value)}
                            placeholder="Toei Animation"
                            className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-3 py-2 text-xs text-white outline-none"
                        />
                        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                            {POPULAR_STUDIOS.slice(0, 5).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => onChangeField("studio", s)}
                                    className="px-2 py-0.5 rounded bg-[#181820] hover:bg-white/10 text-[10px] text-[#94a3b8] hover:text-white whitespace-nowrap cursor-pointer"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#e4e1e7]">
                            تقييم الجمهور المبدئي (Rating Score)
                        </label>
                        <span className="text-xs font-bold text-[#ffb95f] font-mono">
                            ★ {rating ? Number(rating).toFixed(1) : "9.0"} / 10
                        </span>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.1}
                        value={rating || 9.0}
                        onChange={(e) => onChangeField("rating", parseFloat(e.target.value))}
                        className="w-full accent-[#dc2626] cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}
