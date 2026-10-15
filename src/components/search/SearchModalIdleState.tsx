"use client";

import { POPULAR_SEARCH_CHIPS } from "./search.constants";

interface SearchModalIdleStateProps {
    onSelectChip: (chip: string) => void;
}

export function SearchModalIdleState({ onSelectChip }: SearchModalIdleStateProps) {
    return (
        <div className="py-8 space-y-6 text-center">
            <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-[#dc2626]/10 border border-[#dc2626]/20 flex items-center justify-center text-[#ffb4ab] mb-1">
                    <span className="material-symbols-outlined text-3xl">saved_search</span>
                </div>
                <h4 className="font-cairo font-bold text-base text-white">
                    ابدأ الكتابة للبحث الفوري عن عملك أو حلقتك المفضلة..
                </h4>
                <p className="font-tajawal text-xs text-[#94a3b8] max-w-md mx-auto">
                    ابحث باسم الأنمي، رقم الحلقة، أو أسماء أبطال الدبلجة في ثوانٍ معدودة.
                </p>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="pt-2">
                <span className="font-tajawal text-[11px] font-bold text-[#ffb95f] block mb-2.5">
                    عمليات البحث الشائعة:
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap max-w-lg mx-auto">
                    {POPULAR_SEARCH_CHIPS.map((chip) => (
                        <button
                            key={chip}
                            type="button"
                            onClick={() => onSelectChip(chip)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#dc2626]/40 text-xs font-tajawal text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer hover:text-white"
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
