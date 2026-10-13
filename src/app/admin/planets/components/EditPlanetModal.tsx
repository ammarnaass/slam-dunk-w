"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Loader2, Orbit, Sparkles } from "lucide-react";
import { AdminPlanetItem, Planet3DConfig } from "@/lib/planets-presets";

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

                {/* Form Fields */}
                <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
                    {activeTab === "general" ? (
                        <>
                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">اسم الكوكب</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-cairo font-bold text-xs text-white mb-1.5">الرمز التعبيري (Badge)</label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-cairo font-bold text-xs text-white mb-1.5">التصنيف المرتبط في النظام</label>
                                    <select
                                        value={formData.genreKey}
                                        onChange={(e) => setFormData({ ...formData, genreKey: e.target.value })}
                                        className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-cairo font-bold focus:outline-none focus:border-red-500"
                                    >
                                        <option value="Action">Action (أكشن)</option>
                                        <option value="Sports">Sports (رياضة)</option>
                                        <option value="Adventure">Adventure (مغامرات)</option>
                                        <option value="Comedy">Comedy (كوميديا)</option>
                                        <option value="Drama">Drama (زمردة / دراما)</option>
                                        <option value="Mystery">Mystery (غموض)</option>
                                        <option value="Sci-Fi">Sci-Fi (علوم وخيال)</option>
                                        <option value="Historical">Historical (تاريخ)</option>
                                        <option value="Movie">Movie (أفلام)</option>
                                        <option value="Kids">Kids (بون بون / أطفال)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الشعار الترويجي (Slogan)</label>
                                <input
                                    type="text"
                                    value={formData.slogan}
                                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">شطر من شارة سبيستون (Anthem Snippet)</label>
                                <input
                                    type="text"
                                    value={formData.anthemSnippet || ""}
                                    onChange={(e) => setFormData({ ...formData, anthemSnippet: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                    placeholder="شطر الشارة الخالدة المستوحى من سبيستون..."
                                />
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الوصف الكوني</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الأعمال البارزة (مفصولة بفواصل)</label>
                                <input
                                    type="text"
                                    value={(formData.flagshipWorks || []).join(", ")}
                                    onChange={(e) => setFormData({ 
                                        ...formData, 
                                        flagshipWorks: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                                    })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                    placeholder="سلام دانك, كابتن ماجد, بي بليد..."
                                />
                            </div>
                        </>
                    ) : (
                        /* 3D Spacetoon Settings Tab */
                        <div className="space-y-4">
                            {/* Toggle Rings */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1b1b22] border border-white/5">
                                <div>
                                    <span className="font-cairo font-bold text-xs text-white block">حلقات الكوكب المدارية (Planetary Rings)</span>
                                    <span className="font-tajawal text-[11px] text-[#94a3b8]">حلقات كوكبية مضيئة ثلاثية الأبعاد تحيط بالجرم</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handle3DChange("hasRings", !threeD.hasRings)}
                                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                                        threeD.hasRings ? "bg-amber-500" : "bg-white/10"
                                    }`}
                                >
                                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                                        threeD.hasRings ? "right-1" : "right-6"
                                    }`} />
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
                                        onChange={(e) => handle3DChange("ringTilt", parseInt(e.target.value, 10))}
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
                                    onChange={(e) => handle3DChange("rotationSpeed", parseFloat(e.target.value))}
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
                                    onChange={(e) => handle3DChange("scale", parseFloat(e.target.value))}
                                    className="w-full accent-amber-500 cursor-pointer"
                                />
                            </div>

                            {/* Atmosphere Glow Color */}
                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">لون هالة الغلاف الجوي (Atmosphere Glow)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={threeD.atmosphereGlow?.startsWith("#") ? threeD.atmosphereGlow : (formData.color || "#ea580c")}
                                        onChange={(e) => handle3DChange("atmosphereGlow", e.target.value)}
                                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={threeD.atmosphereGlow || formData.color || "#ea580c"}
                                        onChange={(e) => handle3DChange("atmosphereGlow", e.target.value)}
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
