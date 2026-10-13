"use client";

import React, { useState } from "react";
import { 
    Orbit, 
    LayoutGrid, 
    Sliders, 
    Volume2, 
    RefreshCw, 
    Save, 
    Check, 
    Sparkles, 
    MonitorSmartphone,
    Layers
} from "lucide-react";
import { PlanetsSettingsConfig } from "@/lib/planets-presets";

interface PlanetsDisplayModeCardProps {
    settings: PlanetsSettingsConfig;
    onSaveSettings: (settings: PlanetsSettingsConfig) => Promise<void>;
    saving?: boolean;
}

export function PlanetsDisplayModeCard({
    settings: initialSettings,
    onSaveSettings,
    saving = false,
}: PlanetsDisplayModeCardProps) {
    const [settings, setSettings] = useState<PlanetsSettingsConfig>(initialSettings);
    const [isDirty, setIsDirty] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Sync when initialSettings change from server
    React.useEffect(() => {
        setSettings(initialSettings);
        setIsDirty(false);
    }, [initialSettings]);

    const handleModeChange = (mode: "2d_grid" | "3d_spacetoon" | "hybrid") => {
        setSettings(prev => ({ ...prev, displayMode: mode }));
        setIsDirty(true);
        setSavedSuccess(false);
    };

    const handleHomeStyleChange = (style: "compact_grid" | "interactive_3d_orbit") => {
        setSettings(prev => ({ ...prev, homeStyle: style }));
        setIsDirty(true);
        setSavedSuccess(false);
    };

    const handleToggle = (key: keyof PlanetsSettingsConfig) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        setIsDirty(true);
        setSavedSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSaveSettings(settings);
        setIsDirty(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-3xl bg-[#131317] border border-white/[0.08] relative overflow-hidden shadow-xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.06] relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Orbit size={22} className="animate-spin-slow" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-cairo font-black text-lg text-white">
                                تخصيص نمط عرض الكواكب (3D & 2D Engine)
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px] font-bold">
                                Spacetoon Orbit
                            </span>
                        </div>
                        <p className="font-tajawal text-xs text-[#94a3b8] mt-0.5">
                            حدد النمط الافتراضي لعرض الكواكب على صفحة الكواكب الرئيسية والصفحة الرئيسية للموقع.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving || !isDirty}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer shrink-0 ${
                        savedSuccess
                            ? "bg-emerald-600 text-white"
                            : isDirty
                            ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-950/40 hover:brightness-110"
                            : "bg-white/[0.04] text-[#94a3b8]/50 cursor-not-allowed border border-white/5"
                    }`}
                >
                    {savedSuccess ? (
                        <>
                            <Check size={15} />
                            <span>تم الحفظ!</span>
                        </>
                    ) : (
                        <>
                            <Save size={15} />
                            <span>حفظ خيارات العرض</span>
                        </>
                    )}
                </button>
            </div>

            {/* Config Panels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 relative z-10">
                {/* 1. Main Display Mode Selection */}
                <div className="p-4 rounded-2xl bg-[#1b1b22]/70 border border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Layers size={16} className="text-amber-400" />
                            <h3 className="font-cairo font-bold text-sm text-white">
                                النمط الافتراضي في صفحة الكواكب (/planets)
                            </h3>
                        </div>
                        <p className="font-tajawal text-xs text-[#94a3b8] mb-4">
                            اختر كيف تظهر الكواكب للمشاهدين عند الدخول لأول مرة.
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleModeChange("hybrid")}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                                    settings.displayMode === "hybrid"
                                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md"
                                        : "bg-white/[0.02] border-white/5 text-[#94a3b8] hover:text-white"
                                }`}
                            >
                                <Sparkles size={18} />
                                <span className="font-cairo font-bold text-xs">تبديل تفاعلي</span>
                                <span className="text-[10px] text-[#ac8884] font-tajawal">موصى به (تخييري)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleModeChange("3d_spacetoon")}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                                    settings.displayMode === "3d_spacetoon"
                                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md"
                                        : "bg-white/[0.02] border-white/5 text-[#94a3b8] hover:text-white"
                                }`}
                            >
                                <Orbit size={18} />
                                <span className="font-cairo font-bold text-xs">مدار 3D سبيستون</span>
                                <span className="text-[10px] text-[#ac8884] font-tajawal">تجربة فضائية كاملة</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleModeChange("2d_grid")}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                                    settings.displayMode === "2d_grid"
                                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md"
                                        : "bg-white/[0.02] border-white/5 text-[#94a3b8] hover:text-white"
                                }`}
                            >
                                <LayoutGrid size={18} />
                                <span className="font-cairo font-bold text-xs">العرض العادي 2D</span>
                                <span className="text-[10px] text-[#ac8884] font-tajawal">شبكة كلاسيكية سريعة</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Additional 3D Interactive Features */}
                <div className="p-4 rounded-2xl bg-[#1b1b22]/70 border border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sliders size={16} className="text-amber-400" />
                            <h3 className="font-cairo font-bold text-sm text-white">
                                خصائص التفاعل والوسائط الفضائية
                            </h3>
                        </div>
                        <p className="font-tajawal text-xs text-[#94a3b8] mb-4">
                            تحكم بتأثيرات الحركة التلقائية والأصوات الكونية في المنصة.
                        </p>

                        <div className="space-y-3">
                            {/* Toggle 1: Auto Rotate 3D */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-2.5">
                                    <RefreshCw size={15} className="text-amber-400" />
                                    <div>
                                        <span className="font-cairo font-bold text-xs text-white block">الدوران المداري التلقائي</span>
                                        <span className="font-tajawal text-[11px] text-[#94a3b8]">تدوير الكواكب باستمرار في الفضاء</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle("autoRotate3D")}
                                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                        settings.autoRotate3D ? "bg-amber-500" : "bg-white/10"
                                    }`}
                                >
                                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                                        settings.autoRotate3D ? "right-1" : "right-6"
                                    }`} />
                                </button>
                            </div>

                            {/* Toggle 2: Sound Effects */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-2.5">
                                    <Volume2 size={15} className="text-amber-400" />
                                    <div>
                                        <span className="font-cairo font-bold text-xs text-white block">المؤثرات الصوتية الفضائية</span>
                                        <span className="font-tajawal text-[11px] text-[#94a3b8]">نغمة كونية لطيفة عند النقر على الكواكب</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle("soundEffectsEnabled")}
                                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                        settings.soundEffectsEnabled ? "bg-amber-500" : "bg-white/10"
                                    }`}
                                >
                                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                                        settings.soundEffectsEnabled ? "right-1" : "right-6"
                                    }`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
