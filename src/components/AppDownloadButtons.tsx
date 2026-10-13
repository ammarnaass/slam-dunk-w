"use client";

import React from "react";

interface AppDownloadButtonsProps {
    googlePlayUrl?: string;
    appStoreUrl?: string;
    directApkUrl?: string;
    externalUrl?: string;
    onPwaInstall?: () => void;
    showPwa?: boolean;
    layout?: "row" | "column" | "grid" | "compact";
    className?: string;
}

export function AppDownloadButtons({
    googlePlayUrl = "https://play.google.com/store/apps/details?id=com.animedaze.app",
    appStoreUrl = "https://apps.apple.com/app/animedaze/id123456789",
    directApkUrl = "https://slam-dunk-w.vercel.app/downloads/animedaze-latest.apk",
    externalUrl = "https://github.com/ammarnaass/slam-dunk-w/releases",
    onPwaInstall,
    showPwa = true,
    layout = "row",
    className = "",
}: AppDownloadButtonsProps) {

    const layoutClasses = {
        row: "flex flex-wrap items-center gap-3",
        column: "flex flex-col gap-2.5 w-full",
        grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full",
        compact: "flex flex-col gap-2 w-full",
    }[layout];

    return (
        <div className={`${layoutClasses} ${className}`} dir="rtl">
            {/* 1. Google Play Store Button */}
            <a
                href={googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#141419] hover:bg-[#1e1e26] border border-white/10 hover:border-[#00C3FF]/50 shadow-md hover:shadow-[0_4px_20px_rgba(0,195,255,0.2)] transition-all duration-200 group text-right"
                aria-label="تحميل تطبيق ANIME DAZE من Google Play"
            >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.609 1.814L13.793 12 3.61 22.186c-.366-.37-.585-.89-.585-1.464V3.278c0-.573.22-1.094.584-1.464z" fill="#00C3FF"/>
                        <path d="M17.18 8.613l-3.387 3.387 3.387 3.387 3.824-2.185c1.09-.623 1.09-1.98 0-2.604L17.18 8.613z" fill="#FFC800"/>
                        <path d="M3.61 1.814l10.183 10.186 3.387-3.387-11.458-6.55C4.945 1.61 4.137 1.48 3.61 1.814z" fill="#00F076"/>
                        <path d="M13.793 12L3.61 22.186c.527.334 1.335.205 2.112-.249l11.458-6.55-3.387-3.387z" fill="#FF3A44"/>
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-200 font-tajawal leading-none">
                        تنزيل من متجر
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-[#00C3FF] font-cairo leading-tight mt-0.5">
                        Google Play
                    </span>
                </div>
            </a>

            {/* 2. Apple App Store Button */}
            <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#141419] hover:bg-[#1e1e26] border border-white/10 hover:border-white/40 shadow-md hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all duration-200 group text-right"
                aria-label="تحميل تطبيق ANIME DAZE من App Store"
            >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 shrink-0 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.76-1.03 2.81 1.07.08 2.22-.64 2.84-1.39z"/>
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-200 font-tajawal leading-none">
                        تنزيل لأجهزة iOS
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-slate-200 font-cairo leading-tight mt-0.5">
                        App Store
                    </span>
                </div>
            </a>

            {/* 3. Direct APK Download / External Link */}
            <a
                href={directApkUrl || externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#141419] hover:bg-[#1e1e26] border border-white/10 hover:border-[#3DDC84]/50 shadow-md hover:shadow-[0_4px_20px_rgba(61,220,132,0.2)] transition-all duration-200 group text-right"
                aria-label="تحميل تطبيق ANIME DAZE بصيغة APK مباشرة أو رابط خارجي"
            >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 shrink-0 fill-[#3DDC84]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-200 font-tajawal leading-none">
                        تحميل مباشر / خارجي
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-[#3DDC84] font-cairo leading-tight mt-0.5">
                        ملف APK أندرويد
                    </span>
                </div>
            </a>

            {/* 4. PWA Web Install Button */}
            {showPwa && (
                <button
                    type="button"
                    onClick={onPwaInstall}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white shadow-md hover:shadow-[0_4px_24px_rgba(220,38,38,0.4)] transition-all duration-200 active:scale-95 cursor-pointer text-right border border-[#dc2626]/40"
                    aria-label="تثبيت تطبيق ANIME DAZE كـ PWA"
                >
                    <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-white">install_mobile</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/80 font-tajawal leading-none">
                            تثبيت فوري
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-white font-cairo leading-tight mt-0.5">
                            تطبيق الويب (PWA)
                        </span>
                    </div>
                </button>
            )}
        </div>
    );
}
