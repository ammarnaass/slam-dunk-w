"use client";

import React from "react";
import { 
    ArrowUp, 
    ArrowDown, 
    Eye, 
    EyeOff, 
    ChevronDown, 
    ChevronUp,
    Film,
    PlayCircle,
    Compass,
    Clock,
    Flame,
    Tv,
    Users,
    Smartphone,
    LayoutGrid
} from "lucide-react";
import { HomeSectionItem, HomeSectionId } from "@/lib/home-presets";

export const SECTION_ICONS: Record<HomeSectionId, React.ComponentType<{ size?: number; className?: string }>> = {
    heroSlider: Film,
    continueWatching: PlayCircle,
    planets: Compass,
    latestEpisodes: Clock,
    topTrending: Flame,
    classics: Tv,
    characters: Users,
    promoBanner: Smartphone
};

interface HomeSectionRowProps {
    section: HomeSectionItem;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    isExpanded: boolean;
    onMove: (index: number, direction: "up" | "down") => void;
    onToggleEnabled: (id: HomeSectionId) => void;
    onToggleExpand: (id: HomeSectionId) => void;
    onUpdateSection: (id: HomeSectionId, fields: Partial<HomeSectionItem>) => void;
}

export function HomeSectionRow({
    section,
    index,
    isFirst,
    isLast,
    isExpanded,
    onMove,
    onToggleEnabled,
    onToggleExpand,
    onUpdateSection,
}: HomeSectionRowProps) {
    const IconComponent = SECTION_ICONS[section.id] || LayoutGrid;

    return (
        <div
            className={`rounded-2xl border transition-all duration-300 ${
                section.isEnabled
                    ? "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15]"
                    : "bg-black/30 border-white/[0.04] opacity-65"
            }`}
        >
            {/* Main Item Bar */}
            <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1 bg-[#1a1a20] p-1 rounded-xl border border-white/[0.06] shrink-0">
                        <button
                            type="button"
                            onClick={() => onMove(index, "up")}
                            disabled={isFirst}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                isFirst
                                    ? "text-white/20 cursor-not-allowed"
                                    : "text-[#94a3b8] hover:text-white hover:bg-white/[0.08] cursor-pointer"
                            }`}
                            title="تحريك لأعلى"
                        >
                            <ArrowUp size={14} />
                        </button>
                        <span className="font-cairo font-bold text-xs text-[#ffb95f] px-1 select-none">
                            {section.order}
                        </span>
                        <button
                            type="button"
                            onClick={() => onMove(index, "down")}
                            disabled={isLast}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                isLast
                                    ? "text-white/20 cursor-not-allowed"
                                    : "text-[#94a3b8] hover:text-white hover:bg-white/[0.08] cursor-pointer"
                            }`}
                            title="تحريك لأسفل"
                        >
                            <ArrowDown size={14} />
                        </button>
                    </div>

                    {/* Section Icon & Title Info */}
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white shrink-0">
                        <IconComponent size={18} className={section.isEnabled ? "text-red-400" : "text-[#94a3b8]"} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-cairo font-bold text-sm sm:text-base text-white truncate">
                                {section.nameAr}
                            </h4>
                            {section.badgeText && (
                                <span className="px-2 py-0.5 rounded-md bg-[#ffb95f]/15 border border-[#ffb95f]/30 text-[#ffb95f] font-tajawal text-[10px] font-bold">
                                    {section.badgeText}
                                </span>
                            )}
                            <span className="text-[11px] font-tajawal text-[#94a3b8]">
                                (حد: {section.itemLimit})
                            </span>
                        </div>
                        <p className="font-tajawal text-xs text-[#94a3b8] truncate mt-0.5">
                            {section.title} • {section.subtitle}
                        </p>
                    </div>
                </div>

                {/* Action buttons (Toggle & Expand) */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => onToggleEnabled(section.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-cairo text-xs font-bold transition-all cursor-pointer ${
                            section.isEnabled
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                                : "bg-white/[0.05] text-[#94a3b8] border border-white/[0.08] hover:bg-white/[0.08]"
                        }`}
                        title={section.isEnabled ? "إخفاء القسم" : "تفعيل القسم"}
                    >
                        {section.isEnabled ? (
                            <>
                                <Eye size={14} className="text-emerald-400" />
                                <span className="hidden sm:inline">مفعل</span>
                            </>
                        ) : (
                            <>
                                <EyeOff size={14} />
                                <span className="hidden sm:inline">معطل</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => onToggleExpand(section.id)}
                        className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94a3b8] hover:text-white flex items-center justify-center border border-white/[0.08] transition-all cursor-pointer"
                        title="تعديل تفاصيل القسم"
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Expanded Customization Drawer */}
            {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-white/[0.06] bg-black/20 space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                            <label className="block font-cairo font-bold text-xs text-[#e4e1e7] mb-1.5">
                                عنوان القسم المعروض بالواجهة
                            </label>
                            <input
                                type="text"
                                value={section.title}
                                onChange={(e) => onUpdateSection(section.id, { title: e.target.value })}
                                className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-3.5 py-2 font-tajawal text-xs text-white focus:outline-none focus:border-[#dc2626] transition-all"
                                placeholder="مثال: أحدث الحلقات المضافة"
                            />
                        </div>

                        {/* Subtitle */}
                        <div>
                            <label className="block font-cairo font-bold text-xs text-[#e4e1e7] mb-1.5">
                                الوصف أو العنوان الفرعي
                            </label>
                            <input
                                type="text"
                                value={section.subtitle}
                                onChange={(e) => onUpdateSection(section.id, { subtitle: e.target.value })}
                                className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-3.5 py-2 font-tajawal text-xs text-white focus:outline-none focus:border-[#dc2626] transition-all"
                                placeholder="مثال: تحديث فوري فور البث الياباني..."
                            />
                        </div>

                        {/* Badge text */}
                        <div>
                            <label className="block font-cairo font-bold text-xs text-[#e4e1e7] mb-1.5">
                                نص الشارة التعريفية (Badge)
                            </label>
                            <input
                                type="text"
                                value={section.badgeText || ""}
                                onChange={(e) => onUpdateSection(section.id, { badgeText: e.target.value })}
                                className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-3.5 py-2 font-tajawal text-xs text-white focus:outline-none focus:border-[#dc2626] transition-all"
                                placeholder="مثال: مباشر الآن / حصري"
                            />
                        </div>

                        {/* Items count limit */}
                        <div>
                            <label className="block font-cairo font-bold text-xs text-[#e4e1e7] mb-1.5">
                                أقصى عدد عناصر معروضة
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min={1}
                                    max={24}
                                    value={section.itemLimit}
                                    onChange={(e) => onUpdateSection(section.id, { itemLimit: parseInt(e.target.value) || 1 })}
                                    className="w-24 bg-[#18181f] border border-white/[0.1] rounded-xl px-3 py-2 font-tajawal text-xs text-white text-center focus:outline-none focus:border-[#dc2626]"
                                />
                                <span className="font-tajawal text-xs text-[#94a3b8]">
                                    عناصر في هذا القسم
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
