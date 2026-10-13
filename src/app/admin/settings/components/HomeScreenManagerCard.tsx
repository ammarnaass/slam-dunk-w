"use client";

import { useState } from "react";
import { 
    LayoutGrid, 
    ArrowUp, 
    ArrowDown, 
    Eye, 
    EyeOff, 
    Sliders, 
    RotateCcw, 
    Sparkles, 
    Check, 
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
    ExternalLink
} from "lucide-react";
import { HomeScreenConfig, HomeSectionItem, HomeSectionId, DEFAULT_HOME_SECTIONS } from "@/lib/home-presets";

interface HomeScreenManagerCardProps {
    config: HomeScreenConfig;
    onChange: (updated: HomeScreenConfig) => void;
    onResetToDefault: () => void;
}

const SECTION_ICONS: Record<HomeSectionId, any> = {
    heroSlider: Film,
    continueWatching: PlayCircle,
    planets: Compass,
    latestEpisodes: Clock,
    topTrending: Flame,
    classics: Tv,
    characters: Users,
    promoBanner: Smartphone
};

export default function HomeScreenManagerCard({
    config,
    onChange,
    onResetToDefault
}: HomeScreenManagerCardProps) {
    const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

    const sections = [...(config?.sections || DEFAULT_HOME_SECTIONS)].sort((a, b) => a.order - b.order);

    const handleToggleEnabled = (id: HomeSectionId) => {
        const updated = sections.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s);
        onChange({
            ...config,
            sections: updated
        });
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === sections.length - 1) return;

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const newSections = [...sections];
        
        // Swap items
        const temp = newSections[index];
        newSections[index] = newSections[targetIndex];
        newSections[targetIndex] = temp;

        // Re-assign 1-based order
        const reordered = newSections.map((s, idx) => ({
            ...s,
            order: idx + 1
        }));

        onChange({
            ...config,
            sections: reordered
        });
    };

    const handleUpdateSection = (id: HomeSectionId, fields: Partial<HomeSectionItem>) => {
        const updated = sections.map(s => s.id === id ? { ...s, ...fields } : s);
        onChange({
            ...config,
            sections: updated
        });
    };

    const enabledCount = sections.filter(s => s.isEnabled).length;

    return (
        <div className="space-y-6">
            {/* Header info card */}
            <div className="bg-[#131317] border border-white/[0.08] rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] relative z-10">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/20 border border-[#dc2626]/40 flex items-center justify-center text-[#ffb4ab] shrink-0">
                            <LayoutGrid size={24} />
                        </div>
                        <div>
                            <h2 className="font-cairo font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                                <span>تخصيص وترتيب أقسام الصفحة الرئيسية</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-cairo text-[11px] font-bold">
                                    {enabledCount} من {sections.length} مفعل
                                </span>
                            </h2>
                            <p className="font-tajawal text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                                يمكنك تفعيل أو إخفاء أي قسم، إعادة ترتيب الأقسام صعوداً وهبوطاً، وتعديل العناوين والشارات وحدود العرض.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onResetToDefault}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all self-start sm:self-auto cursor-pointer"
                        title="إعادة ضبط ترتيب وعناوين الأقسام للوضع الافتراضي"
                    >
                        <RotateCcw size={14} className="text-[#ffb95f]" />
                        <span>استعادة الترتيب الافتراضي</span>
                    </button>
                </div>

                {/* Section Cards List */}
                <div className="mt-6 space-y-3 relative z-10">
                    {sections.map((section, index) => {
                        const IconComponent = SECTION_ICONS[section.id] || LayoutGrid;
                        const isExpanded = expandedSectionId === section.id;
                        const isFirst = index === 0;
                        const isLast = index === sections.length - 1;

                        return (
                            <div
                                key={section.id}
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
                                                onClick={() => handleMove(index, "up")}
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
                                                onClick={() => handleMove(index, "down")}
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
                                            onClick={() => handleToggleEnabled(section.id)}
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
                                            onClick={() => setExpandedSectionId(isExpanded ? null : section.id)}
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
                                                    onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
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
                                                    onChange={(e) => handleUpdateSection(section.id, { subtitle: e.target.value })}
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
                                                    onChange={(e) => handleUpdateSection(section.id, { badgeText: e.target.value })}
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
                                                        onChange={(e) => handleUpdateSection(section.id, { itemLimit: parseInt(e.target.value) || 1 })}
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
                    })}
                </div>

                {/* Wireframe Mini Visualizer Footer */}
                <div className="mt-8 p-5 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-right">
                        <span className="font-cairo font-bold text-xs text-white flex items-center gap-2">
                            <Sparkles size={14} className="text-[#ffb95f]" />
                            التسلسل الفعلي للأقسام في الصفحة الرئيسية حالياً:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {sections
                                .filter(s => s.isEnabled)
                                .map((s, idx) => (
                                    <span
                                        key={s.id}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-tajawal text-[#e4e1e7]"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <span>{idx + 1}. {s.nameAr}</span>
                                    </span>
                                ))}
                        </div>
                    </div>

                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white font-cairo font-bold text-xs shadow-lg shadow-red-950/40 hover:brightness-110 transition-all shrink-0"
                    >
                        <span>معاينة الواجهة الحية</span>
                        <ExternalLink size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
}
