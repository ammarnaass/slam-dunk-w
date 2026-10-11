"use client";

import { AURA_GLOW_OPTIONS } from "@/lib/profile-presets";

interface ProfilePreviewSimulatorProps {
    avatar: string;
    auraColor: string;
    bannerImage: string;
    username: string;
    email: string;
    otakuTitle: string;
    bio: string;
    role: string;
}

export default function ProfilePreviewSimulator({
    avatar,
    auraColor,
    bannerImage,
    username,
    email,
    otakuTitle,
    bio,
    role,
}: ProfilePreviewSimulatorProps) {
    const activeAura = AURA_GLOW_OPTIONS.find((a) => a.id === auraColor) || AURA_GLOW_OPTIONS[0];
    const isVip = role?.toUpperCase() === "VIP" || role?.toUpperCase() === "ADMIN";

    return (
        <div className="bg-surface-container-low rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl relative sticky top-24">
            {/* Header Badge */}
            <div className="px-space-md py-space-sm bg-surface-container-high/60 border-b border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary-container">preview</span>
                    <span>معاينة ملف الأوتاكو المباشرة</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    مباشر (Live)
                </span>
            </div>

            {/* Simulated Banner */}
            <div className="relative w-full h-28 overflow-hidden">
                <div
                    className="w-full h-full bg-cover bg-center transition-all duration-500"
                    style={{ backgroundImage: `url('${bannerImage || "/hero-bg.jpg"}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent" />
            </div>

            {/* Simulated Identity */}
            <div className="px-space-md pb-space-md -mt-12 relative z-10 flex flex-col items-center text-center">
                {/* Avatar with selected Aura */}
                <div className="relative group mb-2">
                    <div
                        className="w-20 h-20 rounded-2xl p-1 relative transition-all duration-300"
                        style={{
                            boxShadow: `0 0 20px ${activeAura.borderGlow}`,
                            background: activeAura.gradient,
                        }}
                    >
                        <img
                            src={avatar || "/logoep.jpg"}
                            alt={username || "User"}
                            className="w-full h-full object-cover rounded-xl bg-surface-container-highest"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/logoep.jpg";
                            }}
                        />
                    </div>
                    <span
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full text-[9px] font-extrabold border ${activeAura.badgeColor} shadow whitespace-nowrap`}
                    >
                        {isVip ? "👑 VIP DAZER" : "🌟 OTAKU"}
                    </span>
                </div>

                {/* Name & Handle */}
                <div className="space-y-0.5 mt-1">
                    <h4 className="font-extrabold text-sm text-on-surface line-clamp-1">
                        {username || "صديق الأنمي"}
                    </h4>
                    <span className="text-[11px] text-on-surface-variant font-mono block">
                        @{email ? email.split("@")[0] : "user"}
                    </span>
                </div>

                {/* Honorary Title Badge */}
                {otakuTitle && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-primary-container/15 text-primary-container border border-primary-container/30">
                        <span className="material-symbols-outlined text-[14px]">military_tech</span>
                        <span>{otakuTitle}</span>
                    </div>
                )}

                {/* Bio Snippet */}
                <p className="mt-2.5 text-xs text-on-surface-variant leading-relaxed line-clamp-3 bg-surface-container/60 p-2.5 rounded-xl border border-white/[0.03] w-full text-right">
                    {bio || "لا توجد نبذة تعريفية مضافة حتى الآن..."}
                </p>

                {/* Micro Badges Footer */}
                <div className="grid grid-cols-2 gap-2 w-full mt-3 pt-2.5 border-t border-white/[0.04]">
                    <div className="bg-surface-container p-2 rounded-xl text-center">
                        <span className="text-[10px] text-on-surface-variant block">رتبة المشاهدة</span>
                        <span className="text-xs font-bold text-secondary">عضو النخبة</span>
                    </div>
                    <div className="bg-surface-container p-2 rounded-xl text-center">
                        <span className="text-[10px] text-on-surface-variant block">هالة الطاقة</span>
                        <span className="text-xs font-bold text-primary-container">{activeAura.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
