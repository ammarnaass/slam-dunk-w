"use client";

import { useState } from "react";
import { ANIME_AVATAR_PRESETS, AURA_GLOW_OPTIONS, AuraGlowOption } from "@/lib/profile-presets";
import { AnimeAvatarPreset } from "@/server/types/profile.types";

interface AvatarCustomizerCardProps {
    currentAvatar: string;
    currentAura: string;
    userName: string;
    onChangeAvatar: (avatarUrl: string) => void;
    onChangeAura: (auraId: string) => void;
}

export default function AvatarCustomizerCard({
    currentAvatar,
    currentAura,
    userName,
    onChangeAvatar,
    onChangeAura,
}: AvatarCustomizerCardProps) {
    const [customUrl, setCustomUrl] = useState("");
    const [uploadError, setUploadError] = useState("");

    const activeAura = AURA_GLOW_OPTIONS.find((a) => a.id === currentAura) || AURA_GLOW_OPTIONS[0];

    const handleApplyCustomUrl = () => {
        if (!customUrl.trim()) return;
        onChangeAvatar(customUrl.trim());
        setCustomUrl("");
        setUploadError("");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setUploadError("حجم الصورة يجب ألا يتجاوز 2 ميجابايت");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                onChangeAvatar(reader.result);
                setUploadError("");
            }
        };
        reader.onerror = () => {
            setUploadError("فشل قراءة ملف الصورة");
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-surface-container-low rounded-2xl border border-white/[0.06] p-space-lg shadow-xl space-y-space-lg">
            {/* Header */}
            <div className="flex items-center justify-between pb-space-sm border-b border-white/[0.05]">
                <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">face</span>
                    </div>
                    <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                            الصورة الرمزية وهالة الأوتاكو
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                            اختر شخصيتك المفضلة وتوهج الهالة الخاصة بك على المنصة
                        </p>
                    </div>
                </div>
            </div>

            {/* Avatar & Aura Live Focus Display */}
            <div className="flex flex-col sm:flex-row items-center gap-space-lg p-space-md bg-surface-container rounded-2xl border border-white/[0.04]">
                <div className="relative group">
                    <div
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 relative transition-all duration-300"
                        style={{
                            boxShadow: `0 0 24px ${activeAura.borderGlow}`,
                            background: activeAura.gradient
                        }}
                    >
                        <img
                            src={currentAvatar || "/logoep.jpg"}
                            alt={userName || "Avatar"}
                            className="w-full h-full object-cover rounded-xl bg-surface-container-highest"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/logoep.jpg";
                            }}
                        />
                    </div>
                    <span
                        className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${activeAura.badgeColor} shadow-md whitespace-nowrap`}
                    >
                        {activeAura.nameEn}
                    </span>
                </div>

                <div className="flex-1 text-center sm:text-right space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-bold text-on-surface">الهالة النشطة:</span>
                        <span className="text-xs font-extrabold text-primary-container">{activeAura.name}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                        تظهر هذه الهالة المتوهجة حول صورتك الشخصية في التعليقات، المحادثات، وقائمة المتصدرين.
                    </p>

                    {/* Aura Selector Pills */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        {AURA_GLOW_OPTIONS.map((aura: AuraGlowOption) => {
                            const isSelected = currentAura === aura.id;
                            return (
                                <button
                                    key={aura.id}
                                    type="button"
                                    onClick={() => onChangeAura(aura.id)}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                                        isSelected
                                            ? `${aura.badgeColor} scale-105 shadow-md`
                                            : "bg-surface-container-high/60 text-on-surface-variant border-transparent hover:border-white/10"
                                    }`}
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ background: aura.gradient }}
                                    />
                                    <span>{aura.name}</span>
                                    {isSelected && (
                                        <span className="material-symbols-outlined text-[14px]">check</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Iconic Anime Avatar Presets */}
            <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">stars</span>
                        أفاتار شخصيات الأنمي الكلاسيكية والأسطورية
                    </span>
                    <span className="text-[11px] text-on-surface-variant">انقر للاختيار الفوري</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 gap-3">
                    {ANIME_AVATAR_PRESETS.map((preset: AnimeAvatarPreset) => {
                        const isSelected = currentAvatar === preset.url;
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => onChangeAvatar(preset.url)}
                                className={`group relative flex flex-col items-center p-2 rounded-xl transition-all duration-200 cursor-pointer text-right border ${
                                    isSelected
                                        ? "bg-primary-container/15 border-primary-container ring-2 ring-primary-container/40"
                                        : "bg-surface-container-high/50 border-white/[0.04] hover:border-white/20 hover:bg-surface-container-high"
                                }`}
                            >
                                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden mb-1.5">
                                    <img
                                        src={preset.url}
                                        alt={preset.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-primary-container/40 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-[20px] font-bold">check_circle</span>
                                        </div>
                                    )}
                                </div>
                                <span className="font-bold text-[11px] text-on-surface text-center line-clamp-1 w-full">
                                    {preset.name}
                                </span>
                                <span className="text-[9px] text-on-surface-variant text-center line-clamp-1">
                                    {preset.anime}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Custom Avatar Upload or External URL */}
            <div className="p-space-md rounded-2xl bg-surface-container/60 border border-white/[0.04] space-y-space-sm">
                <span className="text-xs font-bold text-on-surface-variant block">
                    أو ارفع صورة خاصة / رابط خارجي (URL)
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
                            link
                        </span>
                        <input
                            type="url"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="https://example.com/my-anime-avatar.jpg"
                            className="w-full bg-surface-container-high rounded-xl pr-10 pl-3 py-2.5 text-xs text-on-surface border border-white/5 focus:border-primary-container outline-none font-mono"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleApplyCustomUrl}
                        disabled={!customUrl.trim()}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-container text-xs font-bold transition-all disabled:opacity-40 cursor-pointer whitespace-nowrap"
                    >
                        تطبيق الرابط
                    </button>

                    <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary-container/20 text-primary-container hover:bg-primary-container hover:text-on-primary-container text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap">
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        <span>رفع صورة</span>
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
