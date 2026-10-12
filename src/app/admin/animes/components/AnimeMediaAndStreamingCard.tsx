"use client";

import { CURATED_POSTER_PRESETS, CURATED_BANNER_PRESETS } from "@/lib/anime-presets";
import { Upload, Link2 } from "lucide-react";

interface AnimeMediaAndStreamingCardProps {
    coverImage: string;
    bannerImage?: string;
    trailerUrl?: string;
    audioLanguage?: string;
    quality?: string;
    onChangeField: (field: string, value: any) => void;
}

export default function AnimeMediaAndStreamingCard({
    coverImage,
    bannerImage = "",
    trailerUrl = "",
    audioLanguage = "dubbed",
    quality = "4K",
    onChangeField,
}: AnimeMediaAndStreamingCardProps) {

    const handleFileUpload = (field: "coverImage" | "bannerImage", e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                onChangeField(field, reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-[#121217] rounded-2xl border border-white/[0.06] p-6 shadow-xl space-y-5 text-right">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">movie</span>
                    </div>
                    <div>
                        <h3 className="font-cairo font-bold text-base text-white">وسائط العرض والبث السينمائي</h3>
                        <p className="text-xs text-[#94a3b8]">بوستر الغلاف، خلفية السلايدر، العرض الدعائي، وجودة البث</p>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                {/* 1. Poster Image (Portrait 2:3) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#e4e1e7]">
                            صورة البوستر العمودية (Poster - Aspect 2:3) <span className="text-[#dc2626]">*</span>
                        </label>
                        <span className="text-[10px] text-[#94a3b8]">تظهر في البطاقات وقوائم الأنمي</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={coverImage}
                            onChange={(e) => onChangeField("coverImage", e.target.value)}
                            placeholder="https://example.com/poster.jpg"
                            className="flex-1 bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
                            required
                        />

                        <label className="px-3.5 py-2.5 rounded-xl bg-[#22222d] hover:bg-[#dc2626] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                            <Upload size={14} />
                            <span>رفع</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("coverImage", e)}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Poster Presets Quick Select */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                        <span className="text-[10px] text-[#94a3b8] shrink-0">نماذج جاهزة:</span>
                        {CURATED_POSTER_PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                type="button"
                                onClick={() => onChangeField("coverImage", preset.url)}
                                className="px-2 py-1 rounded-md bg-[#181820] hover:bg-white/10 text-[10px] text-[#e4e1e7] whitespace-nowrap border border-white/5 cursor-pointer"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Banner Image (Landscape 16:9) */}
                <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#e4e1e7]">
                            غلاف السلايدر الأفقي (Banner - Aspect 16:9)
                        </label>
                        <span className="text-[10px] text-[#94a3b8]">يظهر في هيدر العمل والسلايدر الرئيسي</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={bannerImage || ""}
                            onChange={(e) => onChangeField("bannerImage", e.target.value)}
                            placeholder="https://example.com/banner.jpg"
                            className="flex-1 bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
                        />

                        <label className="px-3.5 py-2.5 rounded-xl bg-[#22222d] hover:bg-[#dc2626] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                            <Upload size={14} />
                            <span>رفع</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload("bannerImage", e)}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Banner Presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                        <span className="text-[10px] text-[#94a3b8] shrink-0">نماذج أغلفة:</span>
                        {CURATED_BANNER_PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                type="button"
                                onClick={() => onChangeField("bannerImage", preset.url)}
                                className="px-2 py-1 rounded-md bg-[#181820] hover:bg-white/10 text-[10px] text-[#e4e1e7] whitespace-nowrap border border-white/5 cursor-pointer"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Trailer URL & Audio & Quality */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/[0.04]">
                    <div>
                        <label className="block text-xs font-bold text-[#e4e1e7] mb-1.5">
                            رابط العرض الدعائي (Trailer)
                        </label>
                        <div className="relative">
                            <input
                                type="url"
                                value={trailerUrl || ""}
                                onChange={(e) => onChangeField("trailerUrl", e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#e4e1e7] mb-1.5">
                            المسار الصوتي (Audio Track)
                        </label>
                        <select
                            value={audioLanguage || "dubbed"}
                            onChange={(e) => onChangeField("audioLanguage", e.target.value)}
                            className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-3 py-2 text-xs text-white outline-none font-bold cursor-pointer"
                        >
                            <option value="dubbed">دبلجة مركز الزهرة (عربي)</option>
                            <option value="subbed">الصوت الياباني (مترجم)</option>
                            <option value="dual">ثنائي الصوت (Dual Audio)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#e4e1e7] mb-1.5">
                            دقة العرض القصوى
                        </label>
                        <select
                            value={quality || "4K"}
                            onChange={(e) => onChangeField("quality", e.target.value)}
                            className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-3 py-2 text-xs text-white outline-none font-bold cursor-pointer"
                        >
                            <option value="4K">ULTRA HD 4K (سينمائي)</option>
                            <option value="1080p">FULL HD 1080p</option>
                            <option value="720p">HD 720p (اقتصادي)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
