"use client";

import { Type, Palette, FileText } from "lucide-react";

interface IdentitySettingsCardProps {
    siteName: string;
    siteNameEn: string;
    siteDescription: string;
    brandColor: string;
    accentColor: string;
    onChangeField: (field: string, value: string) => void;
}

const COLOR_PRESETS = [
    { name: "Obsidian Crimson (الافتراضي)", primary: "#dc2626", accent: "#ffb95f" },
    { name: "Neon Cyber Red", primary: "#e11d48", accent: "#38bdf8" },
    { name: "Royal Gold", primary: "#f59e0b", accent: "#ef4444" },
    { name: "Purple Galaxy", primary: "#9333ea", accent: "#fbbf24" }
];

export default function IdentitySettingsCard({
    siteName,
    siteNameEn,
    siteDescription,
    brandColor,
    accentColor,
    onChangeField
}: IdentitySettingsCardProps) {
    return (
        <div className="bg-[#131317] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-[#ffb95f]/15 border border-[#ffb95f]/30 flex items-center justify-center text-[#ffb95f]">
                    <Type size={20} />
                </div>
                <div>
                    <h3 className="font-cairo font-bold text-base text-white">هوية المنصة والتسمية</h3>
                    <p className="font-tajawal text-xs text-[#94a3b8]">التحكم في اسم الموقع الرسمي بالعربية والإنجليزية، والوصف العام، وألوان المنظومة</p>
                </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Site Name (Arabic) */}
                <div className="flex flex-col gap-2">
                    <label className="font-cairo font-bold text-xs text-white flex items-center justify-between">
                        <span>اسم الموقع (بالعربية) *</span>
                        <span className="text-[10px] text-[#94a3b8] font-normal">{siteName.length}/60</span>
                    </label>
                    <input
                        type="text"
                        value={siteName}
                        onChange={(e) => onChangeField("siteName", e.target.value)}
                        placeholder="أنمي دايز"
                        maxLength={60}
                        className="bg-[#0e0e12] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#dc2626] font-cairo font-bold"
                    />
                </div>

                {/* Site Name (English) */}
                <div className="flex flex-col gap-2">
                    <label className="font-cairo font-bold text-xs text-white flex items-center justify-between">
                        <span>اسم الموقع (بالإنجليزية)</span>
                        <span className="text-[10px] text-[#94a3b8] font-normal font-mono">{(siteNameEn || "").length}/60</span>
                    </label>
                    <input
                        type="text"
                        value={siteNameEn || ""}
                        onChange={(e) => onChangeField("siteNameEn", e.target.value)}
                        placeholder="ANIME DAZE"
                        maxLength={60}
                        className="bg-[#0e0e12] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#dc2626] font-mono"
                    />
                </div>
            </div>

            {/* Site Description */}
            <div className="flex flex-col gap-2">
                <label className="font-cairo font-bold text-xs text-white flex items-center justify-between">
                    <span>الوصف العام للمنصة ومحركات البحث (SEO Tagline)</span>
                    <span className="text-[10px] text-[#94a3b8] font-normal">{siteDescription.length}/500</span>
                </label>
                <textarea
                    rows={3}
                    value={siteDescription}
                    onChange={(e) => onChangeField("siteDescription", e.target.value)}
                    placeholder="وصف المنصة..."
                    maxLength={500}
                    className="bg-[#0e0e12] border border-white/[0.1] rounded-xl p-3.5 text-xs text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#dc2626] leading-relaxed resize-none font-tajawal"
                />
            </div>

            {/* Brand Colors Control */}
            <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <Palette size={16} className="text-[#ffb4ab]" />
                    <span className="font-cairo font-bold text-xs text-white">ألوان الهوية المعتمدة (Theme Colors)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Color */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0e12] border border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <input
                                type="color"
                                value={brandColor || "#dc2626"}
                                onChange={(e) => onChangeField("brandColor", e.target.value)}
                                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                            />
                            <div>
                                <span className="font-cairo font-bold text-xs text-white block">اللون الأساسي (Primary)</span>
                                <span className="font-mono text-[11px] text-[#94a3b8]">{brandColor || "#dc2626"}</span>
                            </div>
                        </div>
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: brandColor || "#dc2626" }} />
                    </div>

                    {/* Accent Color */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0e12] border border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <input
                                type="color"
                                value={accentColor || "#ffb95f"}
                                onChange={(e) => onChangeField("accentColor", e.target.value)}
                                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                            />
                            <div>
                                <span className="font-cairo font-bold text-xs text-white block">اللون التكميلي (Accent/VIP)</span>
                                <span className="font-mono text-[11px] text-[#94a3b8]">{accentColor || "#ffb95f"}</span>
                            </div>
                        </div>
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: accentColor || "#ffb95f" }} />
                    </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[11px] font-tajawal text-[#94a3b8]">نماذج ألوان مقترحة:</span>
                    {COLOR_PRESETS.map((preset, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                onChangeField("brandColor", preset.primary);
                                onChangeField("accentColor", preset.accent);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[10px] font-cairo text-[#e4e1e7] border border-white/5 transition-all cursor-pointer"
                        >
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                            <span>{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
