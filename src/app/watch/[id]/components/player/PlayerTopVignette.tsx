"use client";

interface PlayerTopVignetteProps {
    quality: string;
    audioTrack: "arabic" | "japanese";
}

export function PlayerTopVignette({ quality, audioTrack }: PlayerTopVignetteProps) {
    return (
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface-container-lowest/90 via-surface-container-lowest/40 to-transparent p-space-md flex items-center justify-between pointer-events-none z-20 transition-opacity duration-300">
            <div className="flex items-center gap-space-xs pointer-events-auto flex-wrap">
                <span className="px-space-sm py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm tracking-widest uppercase font-extrabold shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                    {quality}
                </span>
                <span className="px-space-sm py-0.5 rounded bg-surface-container-high/90 text-on-surface font-label-sm text-label-sm backdrop-blur-md">
                    صوت محيطي 5.1
                </span>
                <span className="px-space-sm py-0.5 rounded bg-surface-container-high/90 text-secondary font-label-sm text-label-sm flex items-center gap-1 backdrop-blur-md">
                    <span className="material-symbols-outlined text-[14px]">translate</span>
                    {audioTrack === "arabic" ? "دبلجة مركز الزهرة" : "ياباني أصلي + ترجمة"}
                </span>
            </div>

            {/* Watermark / Brand */}
            <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity pointer-events-auto">
                <span className="font-headline-sm text-headline-sm tracking-widest font-extrabold text-on-surface">
                    ANIME<span className="text-primary-container">DAZE</span>
                </span>
                <span className="material-symbols-outlined text-primary-container text-[18px]">stream</span>
            </div>
        </div>
    );
}
