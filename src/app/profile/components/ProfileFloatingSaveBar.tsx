"use client";

import React from "react";

interface ProfileFloatingSaveBarProps {
    saving: boolean;
    onReset: () => void;
    onSave: () => void;
}

export default function ProfileFloatingSaveBar({
    saving,
    onReset,
    onSave
}: ProfileFloatingSaveBarProps) {
    return (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-surface-container-high/95 backdrop-blur-xl border border-primary-container/40 rounded-2xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 sm:gap-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2.5 text-xs font-bold text-on-surface">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span className="line-clamp-1">لديك تغييرات غير محفوظة!</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button
                    type="button"
                    onClick={onReset}
                    disabled={saving}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all cursor-pointer flex items-center justify-center"
                >
                    تراجع
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className="min-h-[44px] px-4 sm:px-5 py-2 rounded-xl bg-primary-container text-on-primary-container font-cairo font-bold text-xs shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                    {saving ? (
                        <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            <span>جاري الحفظ...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[16px]">save</span>
                            <span>حفظ التعديلات</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
