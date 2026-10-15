"use client";

import React, { RefObject } from "react";

interface SearchModalBarProps {
    query: string;
    setQuery: (val: string) => void;
    onClose: () => void;
    inputRef: RefObject<HTMLInputElement | null>;
}

export function SearchModalBar({
    query,
    setQuery,
    onClose,
    inputRef,
}: SearchModalBarProps) {
    return (
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center gap-3 bg-[#0a0a0d]/80">
            <span className="material-symbols-outlined text-[#dc2626] text-2xl shrink-0">
                search
            </span>
            <input
                ref={inputRef}
                type="text"
                placeholder="ابحث عن أنمي أو حلقة... (اضغط ESC للإغلاق)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white text-base sm:text-lg placeholder:text-[#94a3b8]/50 font-tajawal"
            />

            {/* Clear input button */}
            {query.length > 0 && (
                <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl hover:bg-white/[0.08] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                    title="مسح النص"
                    aria-label="مسح النص"
                >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                </button>
            )}

            {/* Close modal button */}
            <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 hover:bg-white/[0.08] rounded-xl text-[#94a3b8] hover:text-white transition-colors cursor-pointer shrink-0"
                title="إغلاق النافذة"
                aria-label="إغلاق النافذة"
            >
                <span className="material-symbols-outlined text-xl">close</span>
            </button>
        </div>
    );
}
