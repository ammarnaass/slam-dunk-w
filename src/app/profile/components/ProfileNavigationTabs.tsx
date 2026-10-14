"use client";

import React from "react";
import { ProfileTab } from "../hooks/useProfileState";

interface ProfileNavigationTabsProps {
    activeTab: ProfileTab;
    onTabChange: (tab: ProfileTab) => void;
    watchlistCount: number;
    isDirty: boolean;
}

export default function ProfileNavigationTabs({
    activeTab,
    onTabChange,
    watchlistCount,
    isDirty
}: ProfileNavigationTabsProps) {
    return (
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-space-sm mb-space-lg overflow-x-auto scrollbar-none">
            <button
                type="button"
                onClick={() => onTabChange("customize")}
                className={`flex items-center gap-2 px-space-md py-space-sm rounded-xl font-cairo font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "customize"
                        ? "bg-primary-container text-on-primary-container shadow"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
            >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>تخصيص وتعديل الملف</span>
                {isDirty && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
            </button>

            <button
                type="button"
                onClick={() => onTabChange("watchlist")}
                className={`flex items-center gap-2 px-space-md py-space-sm rounded-xl font-cairo font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "watchlist"
                        ? "bg-primary-container text-on-primary-container shadow"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
            >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                <span>قائمتي والمفضلة ({watchlistCount})</span>
            </button>

            <button
                type="button"
                onClick={() => onTabChange("badges")}
                className={`flex items-center gap-2 px-space-md py-space-sm rounded-xl font-cairo font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "badges"
                        ? "bg-primary-container text-on-primary-container shadow"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
            >
                <span className="material-symbols-outlined text-[18px]">military_tech</span>
                <span>الأوسمة والإنجازات</span>
            </button>

            <button
                type="button"
                onClick={() => onTabChange("history")}
                className={`flex items-center gap-2 px-space-md py-space-sm rounded-xl font-cairo font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "history"
                        ? "bg-primary-container text-on-primary-container shadow"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
            >
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>سجل المشاهدة</span>
            </button>
        </div>
    );
}
