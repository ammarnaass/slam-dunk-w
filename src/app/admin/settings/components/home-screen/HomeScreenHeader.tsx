"use client";

import React from "react";
import { LayoutGrid, RotateCcw } from "lucide-react";

interface HomeScreenHeaderProps {
    enabledCount: number;
    totalCount: number;
    onResetToDefault: () => void;
}

export function HomeScreenHeader({
    enabledCount,
    totalCount,
    onResetToDefault
}: HomeScreenHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] relative z-10">
            <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/20 border border-[#dc2626]/40 flex items-center justify-center text-[#ffb4ab] shrink-0">
                    <LayoutGrid size={24} />
                </div>
                <div>
                    <h2 className="font-cairo font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                        <span>تخصيص وترتيب أقسام الصفحة الرئيسية</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-cairo text-[11px] font-bold">
                            {enabledCount} من {totalCount} مفعل
                        </span>
                    </h2>
                    <p className="font-tajawal text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        يمكنك تفعيل أو إخفاء أي قسم، إعادة ترتيب الأقسام صعوداً وهبوطاً، وتعديل العناوين والشارات وحدود العرض.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onResetToDefault}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all self-start sm:self-auto cursor-pointer"
                title="إعادة ضبط ترتيب وعناوين الأقسام للوضع الافتراضي"
            >
                <RotateCcw size={14} className="text-[#ffb95f]" />
                <span>استعادة الترتيب الافتراضي</span>
            </button>
        </div>
    );
}
