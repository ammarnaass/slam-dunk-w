"use client";

import React from "react";
import { Sparkles, Play, Pause, Volume2, VolumeX, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface PlanetariumControlsBarProps {
    planetsCount: number;
    autoRotate: boolean;
    onToggleAutoRotate: () => void;
    soundEnabled: boolean;
    onToggleSound: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetCamera: () => void;
}

export function PlanetariumControlsBar({
    planetsCount,
    autoRotate,
    onToggleAutoRotate,
    soundEnabled,
    onToggleSound,
    onZoomIn,
    onZoomOut,
    onResetCamera,
}: PlanetariumControlsBarProps) {
    return (
        <div className="absolute top-4 inset-x-4 sm:inset-x-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            {/* Title & Cosmic Badge */}
            <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 pointer-events-auto">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-md">
                    <Sparkles size={16} />
                </div>
                <div>
                    <h3 className="font-cairo font-black text-xs sm:text-sm text-white flex items-center gap-1.5 leading-tight">
                        <span>قبة سبيستون الفلكية 3D</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/30">
                            تفاعلي
                        </span>
                    </h3>
                    <p className="font-tajawal text-[10px] text-[#ac8884] leading-none mt-0.5">
                        اسحب بالماوس للتدوير ثلاثي الأبعاد • انقر لاختيار الكوكب ({planetsCount} كواكب نشطة)
                    </p>
                </div>
            </div>

            {/* View Controls Strip */}
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 pointer-events-auto">
                {/* Auto Rotate Toggle */}
                <button
                    type="button"
                    onClick={onToggleAutoRotate}
                    className={`p-2 rounded-xl text-xs font-cairo transition-all cursor-pointer flex items-center gap-1 ${
                        autoRotate ? "bg-white/15 text-white" : "text-[#ac8884] hover:text-white"
                    }`}
                    title={autoRotate ? "إيقاف الدوران المداري" : "تشغيل الدوران المداري"}
                >
                    {autoRotate ? <Pause size={14} /> : <Play size={14} />}
                    <span className="hidden sm:inline">{autoRotate ? "إيقاف" : "دوران"}</span>
                </button>

                {/* Sound Toggle */}
                <button
                    type="button"
                    onClick={onToggleSound}
                    className={`p-2 rounded-xl text-xs font-cairo transition-all cursor-pointer flex items-center gap-1 ${
                        soundEnabled ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-[#ac8884] hover:text-white"
                    }`}
                    title={soundEnabled ? "كتم المؤثرات الصوتية الكونية" : "تفعيل أصوات الكواكب"}
                >
                    {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>

                <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

                {/* Zoom In */}
                <button
                    type="button"
                    onClick={onZoomIn}
                    className="p-2 rounded-xl text-[#ac8884] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="تقريب الكاميرا"
                >
                    <ZoomIn size={14} />
                </button>

                {/* Zoom Out */}
                <button
                    type="button"
                    onClick={onZoomOut}
                    className="p-2 rounded-xl text-[#ac8884] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="تبعيد الكاميرا"
                >
                    <ZoomOut size={14} />
                </button>

                {/* Reset View */}
                <button
                    type="button"
                    onClick={onResetCamera}
                    className="p-2 rounded-xl text-[#ac8884] hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1 text-xs font-cairo"
                    title="استعادة زاوية الرؤية الكونية المركزية"
                >
                    <RotateCcw size={14} />
                    <span className="hidden sm:inline">إعادة ضبط</span>
                </button>
            </div>
        </div>
    );
}
