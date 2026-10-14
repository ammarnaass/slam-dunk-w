"use client";

import React from "react";
import { Sliders, Clock } from "lucide-react";
import { HeroSliderSettings } from "@/lib/home-presets";

interface SliderMotionControlsProps {
    current: HeroSliderSettings;
    onUpdate: (fields: Partial<HeroSliderSettings>) => void;
}

export default function SliderMotionControls({
    current,
    onUpdate
}: SliderMotionControlsProps) {
    return (
        <div className="space-y-5 bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl">
            <h3 className="font-cairo font-bold text-sm text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <Sliders size={16} className="text-[#ffb95f]" />
                <span>سلوك وحركة السلايدر</span>
            </h3>

            {/* Master Toggle */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <label className="font-cairo font-bold text-xs text-white block">
                        تفعيل ظهور السلايدر في الرئيسية
                    </label>
                    <span className="font-tajawal text-[11px] text-[#94a3b8]">
                        عند الإلغاء، سيبدأ الموقع مباشرة من القسم التالي.
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => onUpdate({ isEnabled: !current.isEnabled })}
                    className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                        current.isEnabled ? "bg-[#dc2626]" : "bg-white/10"
                    }`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                        current.isEnabled ? "left-1" : "right-1"
                    }`} />
                </button>
            </div>

            {/* Autoplay Toggle */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <label className="font-cairo font-bold text-xs text-white block">
                        التبديل التلقائي بين الشرائح (Autoplay)
                    </label>
                    <span className="font-tajawal text-[11px] text-[#94a3b8]">
                        الانتقال التلقائي للعمل التالي بعد انقضاء الوقت المحدد.
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => onUpdate({ autoplay: !current.autoplay })}
                    className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                        current.autoplay ? "bg-[#dc2626]" : "bg-white/10"
                    }`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                        current.autoplay ? "left-1" : "right-1"
                    }`} />
                </button>
            </div>

            {/* Duration Interval Seconds */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="font-cairo font-bold text-xs text-[#e4e1e7] flex items-center gap-1.5">
                        <Clock size={14} className="text-red-400" />
                        <span>مدة عرض الشريحة الواحدة:</span>
                    </label>
                    <span className="font-cairo font-bold text-xs text-[#ffb95f] px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08]">
                        {current.intervalSeconds} ثوانٍ
                    </span>
                </div>
                <input
                    type="range"
                    min={3}
                    max={15}
                    step={0.5}
                    value={current.intervalSeconds}
                    onChange={(e) => onUpdate({ intervalSeconds: parseFloat(e.target.value) })}
                    className="w-full accent-[#dc2626] bg-[#1a1a20] rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between font-tajawal text-[10px] text-[#94a3b8]">
                    <span>3 ثوانٍ (سريع)</span>
                    <span>7.5 ثوانٍ (المعتمد)</span>
                    <span>15 ثانية (هادئ)</span>
                </div>
            </div>

            {/* Max slides */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="font-cairo font-bold text-xs text-[#e4e1e7]">
                        أقصى عدد شرائح معروضة في السلايدر:
                    </label>
                    <span className="font-cairo font-bold text-xs text-white px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08]">
                        {current.maxSlides} أعمال
                    </span>
                </div>
                <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={current.maxSlides}
                    onChange={(e) => onUpdate({ maxSlides: parseInt(e.target.value) })}
                    className="w-full accent-[#dc2626] bg-[#1a1a20] rounded-lg h-2 cursor-pointer"
                />
            </div>

            {/* Overlay Darkness */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="font-cairo font-bold text-xs text-[#e4e1e7]">
                        نسبة عتامة التظليل السينمائي (Overlay Darkness):
                    </label>
                    <span className="font-cairo font-bold text-xs text-[#ffb95f] px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08]">
                        {current.overlayDarkness}%
                    </span>
                </div>
                <input
                    type="range"
                    min={30}
                    max={90}
                    step={5}
                    value={current.overlayDarkness}
                    onChange={(e) => onUpdate({ overlayDarkness: parseInt(e.target.value) })}
                    className="w-full accent-[#dc2626] bg-[#1a1a20] rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between font-tajawal text-[10px] text-[#94a3b8]">
                    <span>30% (مضيء)</span>
                    <span>70% (سينمائي متوازن)</span>
                    <span>90% (داكن عالي التباين)</span>
                </div>
            </div>
        </div>
    );
}
