"use client";

import Link from "next/link";
import { 
    Film, 
    Sparkles, 
    Clock, 
    Sliders, 
    ShieldCheck, 
    Layers, 
    Eye, 
    EyeOff, 
    ExternalLink, 
    Check, 
    Star, 
    Flame,
    RotateCcw
} from "lucide-react";
import { HeroSliderSettings, DEFAULT_HERO_SLIDER_SETTINGS } from "@/lib/home-presets";

interface SliderManagerCardProps {
    slider: HeroSliderSettings;
    onChange: (updated: HeroSliderSettings) => void;
    onResetToDefault: () => void;
}

export default function SliderManagerCard({
    slider,
    onChange,
    onResetToDefault
}: SliderManagerCardProps) {
    const current = slider || DEFAULT_HERO_SLIDER_SETTINGS;

    const handleUpdate = (fields: Partial<HeroSliderSettings>) => {
        onChange({
            ...current,
            ...fields
        });
    };

    return (
        <div className="space-y-6">
            {/* Header info card */}
            <div className="bg-[#131317] border border-white/[0.08] rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] relative z-10">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/20 border border-[#dc2626]/40 flex items-center justify-center text-[#ffb4ab] shrink-0">
                            <Film size={24} />
                        </div>
                        <div>
                            <h2 className="font-cairo font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                                <span>إعدادات وتخصيص السلايدر السينمائي</span>
                                <span className={`px-2.5 py-0.5 rounded-full font-cairo text-[11px] font-bold ${
                                    current.isEnabled 
                                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                                        : "bg-red-500/15 border border-red-500/30 text-red-400"
                                }`}>
                                    {current.isEnabled ? "السلايدر نشط" : "السلايدر معطل"}
                                </span>
                            </h2>
                            <p className="font-tajawal text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                                تحكم في سرعة تبديل الشرائح، العتامة وتدرج الإضاءة، الشارات المعروضة، والحد الأقصى للأعمال المختارة.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                            type="button"
                            onClick={onResetToDefault}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer"
                            title="استعادة إعدادات السلايدر الافتراضية"
                        >
                            <RotateCcw size={14} className="text-[#ffb95f]" />
                            <span>استعادة الافتراضي</span>
                        </button>

                        <Link
                            href="/admin/slider"
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-xs font-cairo font-bold text-white shadow-lg shadow-red-950/40 transition-all"
                        >
                            <Sparkles size={14} />
                            <span>اختيار أعمال السلايدر</span>
                        </Link>
                    </div>
                </div>

                {/* Form Controls Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {/* General Controls */}
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
                                onClick={() => handleUpdate({ isEnabled: !current.isEnabled })}
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
                                onClick={() => handleUpdate({ autoplay: !current.autoplay })}
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
                                onChange={(e) => handleUpdate({ intervalSeconds: parseFloat(e.target.value) })}
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
                                onChange={(e) => handleUpdate({ maxSlides: parseInt(e.target.value) })}
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
                                onChange={(e) => handleUpdate({ overlayDarkness: parseInt(e.target.value) })}
                                className="w-full accent-[#dc2626] bg-[#1a1a20] rounded-lg h-2 cursor-pointer"
                            />
                            <div className="flex justify-between font-tajawal text-[10px] text-[#94a3b8]">
                                <span>30% (مضيء)</span>
                                <span>70% (سينمائي متوازن)</span>
                                <span>90% (داكن عالي التباين)</span>
                            </div>
                        </div>
                    </div>

                    {/* Badges & Visuals Controls */}
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
                                        onChange={(e) => handleUpdate({ showRatingBadge: e.target.checked })}
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
                                        onChange={(e) => handleUpdate({ showQualityBadge: e.target.checked })}
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
                                        onChange={(e) => handleUpdate({ showVipBadge: e.target.checked })}
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
                                        onChange={(e) => handleUpdate({ showEpisodeCount: e.target.checked })}
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
                                        onChange={(e) => handleUpdate({ showGenres: e.target.checked })}
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
                </div>
            </div>
        </div>
    );
}
