"use client";

import React from "react";
import { Orbit } from "lucide-react";
import { AdminPlanetItem, Planet3DConfig } from "@/lib/planets-presets";

interface Planet3DTabProps {
    formData: AdminPlanetItem;
    threeD: Planet3DConfig;
    onThreeDChange: (key: keyof Planet3DConfig, value: any) => void;
    onPreview3D?: (planet: AdminPlanetItem) => void;
}

export function Planet3DTab({
    formData,
    threeD,
    onThreeDChange,
    onPreview3D
}: Planet3DTabProps) {
    return (
        <div className="space-y-4">
            {/* Toggle Rings */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                <div>
                    <span className="font-cairo font-bold text-xs text-white block">
                        حلقات الكوكب المدارية (Planetary Rings)
                    </span>
                    <span className="font-tajawal text-[11px] text-[#94a3b8]">
                        حلقات كوكبية مضيئة ثلاثية الأبعاد تحيط بالجرم
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => onThreeDChange("hasRings", !threeD.hasRings)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        threeD.hasRings ? "bg-amber-500" : "bg-white/10"
                    }`}
                >
                    <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                            threeD.hasRings ? "right-1" : "right-6"
                        }`}
                    />
                </button>
            </div>

            {/* Ring Tilt Angle */}
            {threeD.hasRings && (
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="font-cairo font-bold text-xs text-white">درجة ميلان الحلقة المدارية</label>
                        <span className="font-mono text-xs text-amber-400">{threeD.ringTilt || 25}°</span>
                    </div>
                    <input
                        type="range"
                        min="-60"
                        max="60"
                        step="5"
                        value={threeD.ringTilt || 25}
                        onChange={(e) => onThreeDChange("ringTilt", parseInt(e.target.value, 10))}
                        className="w-full accent-amber-500 cursor-pointer"
                    />
                </div>
            )}

            {/* Rotation Speed */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="font-cairo font-bold text-xs text-white">سرعة دوران الكوكب حول نفسه</label>
                    <span className="font-mono text-xs text-amber-400">{threeD.rotationSpeed || 1.0}x</span>
                </div>
                <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.1"
                    value={threeD.rotationSpeed || 1.0}
                    onChange={(e) => onThreeDChange("rotationSpeed", parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                />
            </div>

            {/* Scale / Relative Size */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="font-cairo font-bold text-xs text-white">الحجم النسبي للجرم الكروي</label>
                    <span className="font-mono text-xs text-amber-400">{threeD.scale || 1.0}x</span>
                </div>
                <input
                    type="range"
                    min="0.8"
                    max="1.4"
                    step="0.05"
                    value={threeD.scale || 1.0}
                    onChange={(e) => onThreeDChange("scale", parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                />
            </div>

            {/* Atmosphere Glow Color */}
            <div>
                <label className="block font-cairo font-bold text-xs text-white mb-1.5">
                    لون هالة الغلاف الجوي (Atmosphere Glow)
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={threeD.atmosphereGlow?.startsWith("#") ? threeD.atmosphereGlow : (formData.color || "#ea580c")}
                        onChange={(e) => onThreeDChange("atmosphereGlow", e.target.value)}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                        type="text"
                        value={threeD.atmosphereGlow || formData.color || "#ea580c"}
                        onChange={(e) => onThreeDChange("atmosphereGlow", e.target.value)}
                        className="flex-1 bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                </div>
            </div>

            {/* 3D Preview Button inside Modal */}
            {onPreview3D && (
                <button
                    type="button"
                    onClick={() => onPreview3D(formData)}
                    className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-cairo font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                    <Orbit size={16} />
                    <span>معاينة الجرم ثلاثي الأبعاد الآن في نافذة حية</span>
                </button>
            )}
        </div>
    );
}
