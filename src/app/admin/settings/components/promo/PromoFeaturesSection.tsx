"use client";

import React from "react";
import { Zap, Plus, Trash2 } from "lucide-react";
import { PromoBannerConfig, PromoFeatureItem } from "@/server/types/settings.types";

interface PromoFeaturesSectionProps {
    data: PromoBannerConfig;
    updateField: <K extends keyof PromoBannerConfig>(field: K, value: PromoBannerConfig[K]) => void;
    availableFeatureIcons: { label: string; icon: string }[];
}

export function PromoFeaturesSection({
    data,
    updateField,
    availableFeatureIcons,
}: PromoFeaturesSectionProps) {
    const updateFeature = (index: number, key: keyof PromoFeatureItem, value: string) => {
        const nextFeatures = [...(data.features || [])];
        if (nextFeatures[index]) {
            nextFeatures[index] = {
                ...nextFeatures[index],
                [key]: value,
            };
            updateField("features", nextFeatures);
        }
    };

    const addFeature = () => {
        const nextId = `feat-${Date.now()}`;
        const newFeat: PromoFeatureItem = {
            id: nextId,
            icon: "star",
            text: "ميزة إضافية",
        };
        updateField("features", [...(data.features || []), newFeat]);
    };

    const removeFeature = (index: number) => {
        const nextFeatures = (data.features || []).filter((_, idx) => idx !== index);
        updateField("features", nextFeatures);
    };

    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <Zap size={18} className="text-[#dc2626]" />
                    <h3 className="font-cairo font-bold text-white text-sm">
                        مزايا التطبيق التنافسية (المربعات الأربعة)
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={addFeature}
                    className="text-xs font-cairo font-bold text-[#ffb4ab] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                    <Plus size={14} />
                    <span>إضافة ميزة</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(data.features || []).map((feat, idx) => (
                    <div
                        key={feat.id || idx}
                        className="p-3 rounded-2xl bg-[#131317] border border-white/[0.06] space-y-2 relative group"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-cairo font-bold text-[#94a3b8]">
                                ميزة #{idx + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeFeature(idx)}
                                className="text-red-400 hover:text-red-300 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5"
                                title="حذف الميزة"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                                <input
                                    type="text"
                                    value={feat.icon}
                                    onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                                    placeholder="رمز الأيقونة"
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1a1a22] border border-white/5 text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                    title="اسم الأيقونة من Material Symbols"
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="text"
                                    value={feat.text}
                                    onChange={(e) => updateFeature(idx, "text", e.target.value)}
                                    placeholder="نص الميزة"
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1a1a22] border border-white/5 text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Icon Presets Hint */}
            <div className="pt-2 border-t border-white/[0.05]">
                <span className="text-[10px] font-cairo text-[#94a3b8] block mb-1.5">
                    رموز أيقونات مقترحة للميزات:
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {availableFeatureIcons.map((item) => (
                        <span
                            key={item.icon}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-[#e4e1e7] border border-white/5"
                        >
                            {item.icon} ({item.label})
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
