"use client";

import React from "react";
import { Layers, Star, Flame, Clock, Sparkles } from "lucide-react";
import { HeroSliderSettings } from "@/lib/home-presets";

interface SliderBadgesControlsProps {
    current: HeroSliderSettings;
    onUpdate: (fields: Partial<HeroSliderSettings>) => void;
}

export default function SliderBadgesControls({
    current,
    onUpdate
}: SliderBadgesControlsProps) {
    return (
        <div className="space-y-5 bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl flex flex-col justify-between">
            <div>
                <h3 className="font-cairo font-bold text-sm text-white flex items-center gap-2 border-b border-white/[0.06] pb-3 mb-4">
                    <Layers size={16} className="text-[#ffb95f]" />
                    <span>الشارات والتفاصيل المرئية (Badges)</span>
                </h3>

                <div className="space-y-3">
                    {/* Rating Badge */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-all cursor-pointer">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                <Star size={14} />
                            </div>
                            <div>
                                <span className="font-cairo font-bold text-xs text-white block">شارة تقييم النجوم (★ 9.2)</span>
                                <span className="font-tajawal text-[11px] text-[#94a3b8]">عرض تقييم العمل الذهبي</span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={current.showRatingBadge}
                            onChange={(e) => onUpdate({ showRatingBadge: e.target.checked })}
                            className="w-4 h-4 accent-[#dc2626] rounded cursor-pointer"
                        />
                    </label>

                    {/* 4K Quality Badge */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-all cursor-pointer">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                                4K
                            </div>
                            <div>
                                <span className="font-cairo font-bold text-xs text-white block">شارة الجودة (4K UHD)</span>
                                <span className="font-tajawal text-[11px] text-[#94a3b8]">إظهار ملصق الدقة الفائقة</span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={current.showQualityBadge}
                            onChange={(e) => onUpdate({ showQualityBadge: e.target.checked })}
                            className="w-4 h-4 accent-[#dc2626] rounded cursor-pointer"
                        />
                    </label>

                    {/* VIP Badge */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-all cursor-pointer">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                                <Flame size={14} />
                            </div>
                            <div>
                                <span className="font-cairo font-bold text-xs text-white block">شارة التميز (حصري VIP)</span>
                                <span className="font-tajawal text-[11px] text-[#94a3b8]">إبراز حصرية المحتوى للمشتركين</span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={current.showVipBadge}
                            onChange={(e) => onUpdate({ showVipBadge: e.target.checked })}
                            className="w-4 h-4 accent-[#dc2626] rounded cursor-pointer"
                        />
                    </label>

                    {/* Episodes count Badge */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-all cursor-pointer">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <Clock size={14} />
                            </div>
                            <div>
                                <span className="font-cairo font-bold text-xs text-white block">شارة عدد الحلقات (مثال: 101 حلقة)</span>
                                <span className="font-tajawal text-[11px] text-[#94a3b8]">إظهار اكتمال أو عدد حلقات العمل</span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={current.showEpisodeCount}
                            onChange={(e) => onUpdate({ showEpisodeCount: e.target.checked })}
                            className="w-4 h-4 accent-[#dc2626] rounded cursor-pointer"
                        />
                    </label>

                    {/* Genres Tags */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] transition-all cursor-pointer">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                <Sparkles size={14} />
                            </div>
                            <div>
                                <span className="font-cairo font-bold text-xs text-white block">تصنيفات الأنمي (رياضة • شونين • مغامرات)</span>
                                <span className="font-tajawal text-[11px] text-[#94a3b8]">إظهار نوع العمل في الشريط العلوي</span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={current.showGenres}
                            onChange={(e) => onUpdate({ showGenres: e.target.checked })}
                            className="w-4 h-4 accent-[#dc2626] rounded cursor-pointer"
                        />
                    </label>
                </div>
            </div>

            {/* Interactive Visual Simulation */}
            <div className="mt-4 p-4 rounded-xl bg-[#0a0a0d] border border-white/[0.06] space-y-2">
                <span className="font-tajawal text-[11px] text-[#94a3b8] block">
                    معاينة مظهر شارات السلايدر الحالية:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {current.showRatingBadge && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary text-[11px] font-bold">
                            <Star size={10} className="fill-current text-amber-400" />
                            <span>4.9</span>
                        </span>
                    )}
                    {current.showQualityBadge && (
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-white text-[11px] font-bold">
                            4K UHD
                        </span>
                    )}
                    {current.showVipBadge && (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-bold shadow-md shadow-red-950/40">
                            حصري VIP
                        </span>
                    )}
                    {current.showEpisodeCount && (
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[#94a3b8] text-[11px]">
                            101 حلقة
                        </span>
                    )}
                    {current.showGenres && (
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-[#94a3b8] text-[11px]">
                            رياضة • شونين • دراما
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
