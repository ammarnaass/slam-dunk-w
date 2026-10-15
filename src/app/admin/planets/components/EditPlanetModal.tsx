"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Loader2, Orbit } from "lucide-react";
import { AdminPlanetItem, Planet3DConfig } from "@/lib/planets-presets";
import { PlanetGeneralTab, Planet3DTab } from "./edit-planet";

interface EditPlanetModalProps {
    planet: AdminPlanetItem | null;
    isOpen?: boolean;
    onClose: () => void;
    onSave: (updatedPlanet: AdminPlanetItem) => Promise<void>;
    saving: boolean;
    onPreview3D?: (planet: AdminPlanetItem) => void;
}

export function EditPlanetModal({
    planet,
    isOpen = true,
    onClose,
    onSave,
    saving,
    onPreview3D,
}: EditPlanetModalProps) {
    const [formData, setFormData] = useState<AdminPlanetItem | null>(planet);
    const [activeTab, setActiveTab] = useState<"general" | "3d">("general");

    useEffect(() => {
        setFormData(planet);
    }, [planet]);

    if (!formData || (!planet && !isOpen)) return null;

    const handleFormSubmit = async () => {
        if (!formData) return;
        await onSave(formData);
    };

    const handle3DChange = (key: keyof Planet3DConfig, value: any) => {
        const current3D = formData.threeDConfig || {
            hasRings: false,
            ringColor: formData.color || "rgba(234, 88, 12, 0.8)",
            ringTilt: 25,
            textureStyle: formData.id,
            rotationSpeed: 1.0,
            atmosphereGlow: formData.color || "#ea580c",
            scale: 1.0
        };

        setFormData({
            ...formData,
            threeDConfig: {
                ...current3D,
                [key]: value
            }
        });
    };

    const threeD = formData.threeDConfig || {
        hasRings: false,
        ringColor: formData.color || "rgba(234, 88, 12, 0.8)",
        ringTilt: 25,
        textureStyle: formData.id,
        rotationSpeed: 1.0,
        atmosphereGlow: formData.color || "#ea580c",
        scale: 1.0
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#131317] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" dir="rtl">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{formData.badge}</span>
                        <div>
                            <h3 className="font-cairo font-black text-lg text-white">تعديل {formData.name}</h3>
                            <span className="font-mono text-xs text-[#94a3b8]">ID: {formData.id}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs Switcher: General vs 3D */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-[#1b1b22] border border-white/5">
                    <button
                        type="button"
                        onClick={() => setActiveTab("general")}
                        className={`flex-1 py-2 rounded-lg font-cairo font-bold text-xs transition-all cursor-pointer ${
                            activeTab === "general"
                                ? "bg-red-600 text-white shadow-md"
                                : "text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        البيانات العامة والهوية
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("3d")}
                        className={`flex-1 py-2 rounded-lg font-cairo font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            activeTab === "3d"
                                ? "bg-amber-500 text-black shadow-md font-black"
                                : "text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        <Orbit size={14} />
                        <span>خصائص المدار ثلاثي الأبعاد 3D</span>
                    </button>
                </div>

                {/* Form Fields Content */}
                <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
                    {activeTab === "general" ? (
                        <PlanetGeneralTab
                            formData={formData}
                            onChange={setFormData}
                        />
                    ) : (
                        <Planet3DTab
                            formData={formData}
                            threeD={threeD}
                            onThreeDChange={handle3DChange}
                            onPreview3D={onPreview3D}
                        />
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isEnabled: !formData.isEnabled })}
                        className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                            formData.isEnabled 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                    >
                        {formData.isEnabled ? "الكوكب نشط" : "الكوكب معطل"}
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            disabled={saving}
                            onClick={handleFormSubmit}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-xs font-cairo font-bold text-white shadow-lg shadow-red-950/40 transition-all cursor-pointer"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            <span>حفظ التعديلات</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
