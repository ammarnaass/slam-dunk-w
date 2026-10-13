import React from "react";
import Link from "next/link";
import { UserProfileData } from "@/server/types/profile.types";

interface ProfileHeroSectionProps {
    formData: any;
    user: UserProfileData;
    activeAura: any;
    isVip: boolean;
    watchlistCount: number;
    activeTab: "customize" | "watchlist" | "badges" | "history";
    onTabChange: (tab: "customize" | "watchlist" | "badges" | "history") => void;
    onLogout: () => void;
}

export default function ProfileHeroSection({
    formData,
    user,
    activeAura,
    isVip,
    watchlistCount,
    activeTab,
    onTabChange,
    onLogout,
}: ProfileHeroSectionProps) {
    return (
        <section className="relative w-full">
            {/* Cinematic Banner Backdrop */}
            <div className="relative w-full h-72 md:h-80 overflow-hidden bg-surface-container-highest">
                <div
                    className="w-full h-full bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url('${formData.bannerImage || user.bannerImage || "/hero-bg.jpg"}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-transparent to-surface-container-lowest/80" />
            </div>

            {/* Identity & Stats Row */}
            <div className="w-full max-w-7xl mx-auto px-gutter-lg -mt-20 md:-mt-24 pb-space-lg relative z-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-space-xl">
                    
                    {/* User Identity Details */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-space-lg text-center sm:text-right">
                        {/* Avatar with selected Aura Glow Ring */}
                        <div className="relative group">
                            <div
                                className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden p-1 shadow-2xl relative transition-all duration-300"
                                style={{
                                    boxShadow: `0 0 28px ${activeAura.borderGlow}`,
                                    background: activeAura.gradient
                                }}
                            >
                                <img
                                    src={formData.avatar || user.avatar || "/logoep.jpg"}
                                    alt={user.name || "User"}
                                    className="w-full h-full object-cover rounded-xl relative z-10 bg-surface-container-highest"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/logoep.jpg";
                                    }}
                                />
                            </div>
                            <span
                                className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-0.5 rounded-full shadow-lg text-[11px] font-extrabold uppercase whitespace-nowrap border ${activeAura.badgeColor}`}
                            >
                                <span className="material-symbols-outlined text-[14px]">star</span>
                                {isVip ? "VIP DAZER" : "OTAKU MEMBER"}
                            </span>
                        </div>

                        {/* Text Metadata */}
                        <div className="flex flex-col gap-space-xs pb-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-space-sm">
                                <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                                    {formData.username || user.name || "صديق الأنمي"}
                                </h1>
                                <span className="font-label-md text-label-md px-space-sm py-0.5 rounded-md bg-surface-container-highest text-secondary font-mono">
                                    @{user.email?.split("@")[0] || "user"}
                                </span>
                                {formData.otakuTitle && (
                                    <span className="flex items-center gap-1 text-label-sm font-label-sm text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-bold">
                                        <span className="material-symbols-outlined text-[14px]">military_tech</span>
                                        {formData.otakuTitle}
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-space-md text-on-surface-variant font-body-md text-body-md pt-1">
                                <span className="flex items-center gap-1 text-xs">
                                    <span className="material-symbols-outlined text-[16px] text-primary-container">record_voice_over</span>
                                    {formData.preferences?.audioLanguage === "dubbed" ? "صوت سبيستون الذهبي (مدبلج)" : "ياباني أصلي (مترجم)"}
                                </span>
                                <span className="flex items-center gap-1 text-xs">
                                    <span className="material-symbols-outlined text-[16px] text-secondary">hd</span>
                                    دقة المشغل: {formData.preferences?.quality?.toUpperCase() || "1080P"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Top CTA Actions */}
                    <div className="flex items-center gap-space-sm w-full lg:w-auto justify-center sm:justify-end flex-wrap">
                        <button
                            type="button"
                            onClick={() => onTabChange("customize")}
                            className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-xl font-headline-sm text-headline-sm transition-all cursor-pointer ${
                                activeTab === "customize"
                                    ? "bg-primary-container text-on-primary-container shadow-lg"
                                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                            }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">palette</span>
                            <span>تخصيص الملف</span>
                        </button>
                        <Link
                            href="/pricing"
                            className="flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-secondary-container text-on-secondary font-headline-sm text-headline-sm shadow-md hover:brightness-110 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">diamond</span>
                            <span>باقات VIP</span>
                        </Link>
                        <button
                            type="button"
                            onClick={onLogout}
                            className="flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-surface-container text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-all font-headline-sm text-headline-sm cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            <span>خروج</span>
                        </button>
                    </div>

                </div>

                {/* Bento Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mt-space-xl">
                    {/* Metric 1 */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between shadow-md border border-white/[0.04]">
                        <div className="flex flex-col">
                            <span className="font-body-sm text-body-sm text-on-surface-variant">الأعمال المفضلة</span>
                            <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold">{watchlistCount}</span>
                            <span className="font-label-sm text-label-sm text-secondary">في قائمتك</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[26px]">favorite</span>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between shadow-md border border-white/[0.04]">
                        <div className="flex flex-col">
                            <span className="font-body-sm text-body-sm text-on-surface-variant">كوكب الأوتاكو</span>
                            <span className="font-headline-md text-headline-md text-on-surface font-extrabold">{formData.preferences?.favoritePlanet || "مغامرات"}</span>
                            <span className="font-label-sm text-label-sm text-secondary">تصنيفك المفضل</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[26px]">public</span>
                        </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between shadow-md border border-white/[0.04]">
                        <div className="flex flex-col">
                            <span className="font-body-sm text-body-sm text-on-surface-variant">هالة الطاقة</span>
                            <span className="font-headline-md text-headline-md text-on-surface font-extrabold">{activeAura.nameEn}</span>
                            <span className="font-label-sm text-label-sm text-primary-container">{activeAura.name}</span>
                        </div>
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                            style={{ background: activeAura.gradient }}
                        >
                            <span className="material-symbols-outlined text-[26px]">bolt</span>
                        </div>
                    </div>

                    {/* Metric 4 */}
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between shadow-md border border-white/[0.04]">
                        <div className="flex flex-col">
                            <span className="font-body-sm text-body-sm text-on-surface-variant">اللقب المجتمعي</span>
                            <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold line-clamp-1">{formData.otakuTitle || "صقر شوهوكو"}</span>
                            <span className="font-label-sm text-label-sm text-secondary">رتبة فخرية</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[26px]">military_tech</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
