"use client";

import React from "react";
import { Sparkles, Plus, Trash2 } from "lucide-react";

interface ApiAppReleaseNotesSectionProps {
    releaseNotes: string[];
    onAdd: () => void;
    onUpdate: (index: number, val: string) => void;
    onRemove: (index: number) => void;
}

export function ApiAppReleaseNotesSection({
    releaseNotes,
    onAdd,
    onUpdate,
    onRemove,
}: ApiAppReleaseNotesSectionProps) {
    const notes = Array.isArray(releaseNotes) ? releaseNotes : [];

    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-[#ffb95f]" />
                    <h3 className="font-cairo font-bold text-white text-sm">سجل التحديثات وملاحظات الإصدار (Release Notes)</h3>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#dc2626]/20 hover:bg-[#dc2626]/30 text-[#ffb4ab] border border-[#dc2626]/30 text-xs font-cairo font-bold transition-all cursor-pointer"
                >
                    <Plus size={13} />
                    <span>إضافة بند</span>
                </button>
            </div>

            <div className="space-y-2.5">
                {notes.map((note, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-[#94a3b8] shrink-0">
                            {idx + 1}
                        </span>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => onUpdate(idx, e.target.value)}
                            placeholder="تفاصيل التحديث والميزة الجديدة..."
                            className="flex-1 px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.08] text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                        />
                        <button
                            type="button"
                            onClick={() => onRemove(idx)}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-[#94a3b8] hover:text-red-400 border border-white/5 transition-all cursor-pointer shrink-0"
                            title="حذف البند"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
