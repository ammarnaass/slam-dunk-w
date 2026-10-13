"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { AdminPlanetItem } from "@/lib/planets-presets";

interface EditPlanetModalProps {
    planet: AdminPlanetItem | null;
    isOpen?: boolean;
    onClose: () => void;
    onSave: (updatedPlanet: AdminPlanetItem) => Promise<void>;
    saving: boolean;
}

export function EditPlanetModal({
    planet,
    isOpen = true,
    onClose,
    onSave,
    saving,
}: EditPlanetModalProps) {
    const [formData, setFormData] = useState<AdminPlanetItem | null>(planet);

    useEffect(() => {
        setFormData(planet);
    }, [planet]);

    if (!formData || (!planet && !isOpen)) return null;

    const handleFormSubmit = async () => {
        if (!formData) return;
        await onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#131317] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" dir="rtl">
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

                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
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

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div>
                            <span className="font-cairo font-bold text-xs text-white block">حالة تفعيل الكوكب</span>
                            <span className="font-tajawal text-[11px] text-[#94a3b8]">إظهاره للمستخدمين في القوائم والصفحات</span>
                        </div>
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
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
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
    );
}
