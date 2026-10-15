"use client";

interface PlayerSkipIntroButtonProps {
    onSkip: () => void;
}

export function PlayerSkipIntroButton({ onSkip }: PlayerSkipIntroButtonProps) {
    return (
        <button
            onClick={onSkip}
            className="absolute top-16 right-space-md sm:right-space-lg z-30 flex items-center gap-1.5 px-space-md py-space-xs rounded-full bg-surface-container-high/85 text-on-surface hover:bg-primary-container hover:text-on-primary-container backdrop-blur-xl shadow-lg transition-all duration-200 group/skip cursor-pointer border border-white/10"
            id="skip-intro-btn"
            type="button"
        >
            <span className="material-symbols-outlined text-[18px] group-hover/skip:animate-pulse">
                fast_forward
            </span>
            <span className="font-label-md text-label-md font-bold">تخطي الشارة (01:30)</span>
        </button>
    );
}
