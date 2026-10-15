"use client";

import React from "react";
import { AdminPlanetItem } from "@/lib/planets-presets";

interface PlanetGeneralTabProps {
    formData: AdminPlanetItem;
    onChange: (updated: AdminPlanetItem) => void;
}

export function PlanetGeneralTab({ formData, onChange }: PlanetGeneralTabProps) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block font-cairo font-bold text-xs text-white mb-1.5">اسم الكوكب</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => onChange({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block font-cairo font-bold text-xs text-white mb-1.5">الرمز التعبيري (Badge)</label>
                    <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => onChange({ ...formData, badge: e.target.value })}
                        className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                    />
                </div>
                <div>
                    <label className="block font-cairo font-bold text-xs text-white mb-1.5">التصنيف المرتبط في النظام</label>
                    <select
                        value={formData.genreKey}
                        onChange={(e) => onChange({ ...formData, genreKey: e.target.value })}
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
                    onChange={(e) => onChange({ ...formData, slogan: e.target.value })}
                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                />
            </div>

            <div>
                <label className="block font-cairo font-bold text-xs text-white mb-1.5">شطر من شارة سبيستون (Anthem Snippet)</label>
                <input
                    type="text"
                    value={formData.anthemSnippet || ""}
                    onChange={(e) => onChange({ ...formData, anthemSnippet: e.target.value })}
                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                    placeholder="شطر الشارة الخالدة المستوحى من سبيستون..."
                />
            </div>

            <div>
                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الوصف الكوني</label>
                <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => onChange({ ...formData, description: e.target.value })}
                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                />
            </div>

            <div>
                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الأعمال البارزة (مفصولة بفواصل)</label>
                <input
                    type="text"
                    value={(formData.flagshipWorks || []).join(", ")}
                    onChange={(e) => onChange({ 
                        ...formData, 
                        flagshipWorks: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                    })}
                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                    placeholder="سلام دانك, كابتن ماجد, بي بليد..."
                />
            </div>
        </div>
    );
}
