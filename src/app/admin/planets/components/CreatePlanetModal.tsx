"use client";

import React, { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { AdminPlanetItem } from "@/lib/planets-presets";

interface CreatePlanetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (planetData: AdminPlanetItem) => Promise<void>;
    saving: boolean;
}

const DEFAULT_NEW_PLANET = {
    id: "",
    name: "",
    arabicGenre: "",
    genreKey: "Action",
    badge: "🪐",
    icon: "explore",
    slogan: "",
    description: "",
    color: "#dc2626",
    flagshipWorks: [],
    isEnabled: true
};

export function CreatePlanetModal({
    isOpen,
    onClose,
    onCreate,
    saving,
}: CreatePlanetModalProps) {
    const [form, setForm] = useState<Partial<AdminPlanetItem>>(DEFAULT_NEW_PLANET);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!form.name?.trim()) {
            alert("يرجى إدخال اسم الكوكب");
            return;
        }

        const id = form.id?.trim() || `planet-${Date.now()}`;
        const planetPayload: AdminPlanetItem = {
            id,
            name: form.name.trim(),
            arabicGenre: form.arabicGenre?.trim() || form.name.replace(/^كوكب\s*/, ""),
            genreKey: form.genreKey || "Action",
            badge: form.badge || "🪐",
            icon: form.icon || "explore",
            slogan: form.slogan || "كوكب المغامرات والبطولة",
            description: form.description || "رحلة لاكتشاف عوالم الأنمي الفريدة.",
            color: form.color || "#dc2626",
            bgClass: "bg-red-500/15 border-red-500/30 text-red-400",
            glowColor: "rgba(220, 38, 38, 0.4)",
            flagshipWorks: typeof form.flagshipWorks === "string" 
                ? (form.flagshipWorks as string).split(",").map(s => s.trim()).filter(Boolean)
                : (form.flagshipWorks || []),
            isEnabled: true,
            order: 999,
            isCustom: true
        };

        await onCreate(planetPayload);
        setForm(DEFAULT_NEW_PLANET);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#131317] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" dir="rtl">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <Plus size={20} />
                        </div>
                        <div>
                            <h3 className="font-cairo font-black text-lg text-white">إضافة كوكب جديد للمنصة</h3>
                            <span className="font-tajawal text-xs text-[#94a3b8]">إنشاء تصنيف وعالم كوني مخصص</span>
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
                        <label className="block font-cairo font-bold text-xs text-white mb-1.5">اسم الكوكب (مثال: كوكب النينجا)</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                            placeholder="كوكب..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-cairo font-bold text-xs text-white mb-1.5">المعرف الإنجليزي (Slug)</label>
                            <input
                                type="text"
                                value={form.id}
                                onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                                className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                                placeholder="ninja, super-heroes..."
                            />
                        </div>
                        <div>
                            <label className="block font-cairo font-bold text-xs text-white mb-1.5">الرمز التعبيري (Badge)</label>
                            <input
                                type="text"
                                value={form.badge}
                                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                                className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                placeholder="🥷, ⚡, 🌟..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-cairo font-bold text-xs text-white mb-1.5">التصنيف المطابق في الأنمي</label>
                        <select
                            value={form.genreKey}
                            onChange={(e) => setForm({ ...form, genreKey: e.target.value })}
                            className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-cairo font-bold focus:outline-none focus:border-red-500"
                        >
                            <option value="Action">Action (أكشن)</option>
                            <option value="Sports">Sports (رياضة)</option>
                            <option value="Adventure">Adventure (مغامرات)</option>
                            <option value="Comedy">Comedy (كوميديا)</option>
                            <option value="Drama">Drama (دراما)</option>
                            <option value="Mystery">Mystery (غموض)</option>
                            <option value="Sci-Fi">Sci-Fi (خيال علمي)</option>
                            <option value="Historical">Historical (تاريخي)</option>
                            <option value="Fantasy">Fantasy (فانتازيا)</option>
                            <option value="Shounen">Shounen (شونين)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-cairo font-bold text-xs text-white mb-1.5">الشعار الترويجي (Slogan)</label>
                        <input
                            type="text"
                            value={form.slogan}
                            onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                            className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                            placeholder="كوكب القوة والسرعة..."
                        />
                    </div>

                    <div>
                        <label className="block font-cairo font-bold text-xs text-white mb-1.5">الوصف الكوني</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                            placeholder="اكتب وصفاً جذاباً لعالم هذا الكوكب..."
                        />
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
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-xs font-cairo font-bold text-white shadow-lg shadow-red-950/40 transition-all cursor-pointer"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        <span>إضافة الكوكب</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
