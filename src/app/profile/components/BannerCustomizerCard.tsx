"use client";

import { useState } from "react";
import { COVER_BANNER_PRESETS } from "@/lib/profile-presets";
import { CoverBannerPreset } from "@/server/types/profile.types";

interface BannerCustomizerCardProps {
    currentBanner: string;
    onChangeBanner: (bannerUrl: string) => void;
}

export default function BannerCustomizerCard({
    currentBanner,
    onChangeBanner,
}: BannerCustomizerCardProps) {
    const [customUrl, setCustomUrl] = useState("");
    const [uploadError, setUploadError] = useState("");

    const handleApplyCustomUrl = () => {
        if (!customUrl.trim()) return;
        onChangeBanner(customUrl.trim());
        setCustomUrl("");
        setUploadError("");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            setUploadError("حجم غلاف الملف يجب ألا يتجاوز 4 ميجابايت");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                onChangeBanner(reader.result);
                setUploadError("");
            }
        };
        reader.onerror = () => {
            setUploadError("فشل قراءة ملف صورة الغلاف");
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-surface-container-low rounded-2xl border border-white/[0.06] p-space-lg shadow-xl space-y-space-lg">
            {/* Header */}
            <div className="flex items-center justify-between pb-space-sm border-b border-white/[0.05]">
                <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">panorama</span>
                    </div>
                    <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                            غلاف الملف الشخصي (Banner Art)
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                            اختر لوحة الخلفية السينمائية التي تعبر عن ذوقك في عالم الأنمي
                        </p>
                    </div>
                </div>
            </div>

            {/* Live Banner Preview Box */}
            <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div
                    className="w-full h-full bg-cover bg-center transition-all duration-500"
                    style={{ backgroundImage: `url('${currentBanner || "/hero-bg.jpg"}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
                <div className="absolute bottom-3 right-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        معاينة الغلاف الحي
                    </span>
                </div>
            </div>

            {/* Preset Banners Grid */}
            <div className="space-y-space-sm">
                <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary-container">palette</span>
                    لوحات فنية جاهزة مستوحاة من عوالم الأنمي
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {COVER_BANNER_PRESETS.map((preset: CoverBannerPreset) => {
                        const isSelected = currentBanner === preset.url;
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => onChangeBanner(preset.url)}
                                className={`group relative flex flex-col p-2 rounded-xl transition-all duration-200 cursor-pointer text-right border ${
                                    isSelected
                                        ? "bg-secondary-container/15 border-secondary ring-2 ring-secondary/40 shadow-lg"
                                        : "bg-surface-container-high/50 border-white/[0.04] hover:border-white/20 hover:bg-surface-container-high"
                                }`}
                            >
                                <div className="relative w-full h-20 rounded-lg overflow-hidden mb-2">
                                    <img
                                        src={preset.url}
                                        alt={preset.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-secondary text-on-secondary rounded-full p-0.5">
                                            <span className="material-symbols-outlined text-[16px] font-bold block">check</span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-0.5">
                                    <span className="font-bold text-xs text-on-surface block">
                                        {preset.name}
                                    </span>
                                    <span className="text-[10px] text-on-surface-variant line-clamp-1 block">
                                        {preset.description}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Custom Banner Upload or URL */}
            <div className="p-space-md rounded-2xl bg-surface-container/60 border border-white/[0.04] space-y-space-sm">
                <span className="text-xs font-bold text-on-surface-variant block">
                    أو أدخل رابط غلاف مخصص (URL) أو ارفع صورة
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
                            image
                        </span>
                        <input
                            type="url"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="https://example.com/anime-banner.jpg"
                            className="w-full bg-surface-container-high rounded-xl pr-10 pl-3 py-2.5 text-xs text-on-surface border border-white/5 focus:border-secondary outline-none font-mono"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleApplyCustomUrl}
                        disabled={!customUrl.trim()}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-highest hover:bg-secondary hover:text-on-secondary text-xs font-bold transition-all disabled:opacity-40 cursor-pointer whitespace-nowrap"
                    >
                        تطبيق الغلاف
                    </button>

                    <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-secondary-container/20 text-secondary hover:bg-secondary hover:text-on-secondary text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <span className="material-symbols-outlined text-[16px]">upload_file</span>
                        <span>رفع غلاف</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                {uploadError && (
                    <p className="text-xs text-error font-bold">{uploadError}</p>
                )}
            </div>
        </div>
    );
}
