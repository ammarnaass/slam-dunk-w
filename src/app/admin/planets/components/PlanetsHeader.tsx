"use client";

import React from "react";
import Link from "next/link";
import { Compass, RotateCcw, Plus, ExternalLink } from "lucide-react";

interface PlanetsHeaderProps {
    saving: boolean;
    onResetDefaults: () => void;
    onOpenCreateModal: () => void;
}

export const PlanetsHeader: React.FC<PlanetsHeaderProps> = ({
    saving,
    onResetDefaults,
    onOpenCreateModal,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-red-600 to-purple-600 p-0.5 shadow-xl shadow-red-950/40 shrink-0">
                    <div className="w-full h-full bg-[#131317] rounded-[14px] flex items-center justify-center text-amber-400">
                        <Compass size={28} />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="font-cairo font-black text-2xl text-white">إدارة كواكب الأنمي وسبيستون</h1>
                        <span className="px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                            Cosmic Universe CMS
                        </span>
                    </div>
                    <p className="font-tajawal text-xs sm:text-sm text-[#94a3b8] mt-1">
                        تحكم في عوالم وتصنيفات الكواكب (رياضة، أكشن، مغامرات، زمردة، كوميديا...)، وإدارتها وتخصيص ظهورها على الصفحة الرئيسية وصفحة الكواكب.
                    </p>
                </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 flex-wrap">
                <button
                    type="button"
                    onClick={onResetDefaults}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer"
                    title="استعادة كواكب سبيستون الأصلية"
                >
                    <RotateCcw size={15} className="text-amber-400" />
                    <span>استعادة الافتراضي</span>
                </button>

                <button
                    type="button"
                    onClick={onOpenCreateModal}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-xs font-cairo font-bold text-white shadow-lg shadow-red-950/40 transition-all cursor-pointer"
                >
                    <Plus size={16} />
                    <span>إضافة كوكب جديد</span>
                </button>

                <Link
                    href="/planets"
                    target="_blank"
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1b1b22] hover:bg-[#252530] text-xs font-cairo font-bold text-[#94a3b8] hover:text-white border border-white/5 transition-all"
                >
                    <ExternalLink size={14} />
                    <span>عرض صفحة الكواكب</span>
                </Link>
            </div>
        </div>
    );
};
