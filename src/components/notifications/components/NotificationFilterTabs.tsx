"use client";

import { Sparkles } from "lucide-react";

interface NotificationFilterTabsProps {
    filter: "all" | "unread";
    totalCount: number;
    unreadCount: number;
    onFilterChange: (f: "all" | "unread") => void;
    onSendTest: () => void;
}

export function NotificationFilterTabs({
    filter,
    totalCount,
    unreadCount,
    onFilterChange,
    onSendTest,
}: NotificationFilterTabsProps) {
    return (
        <div className="px-4 py-2 bg-black/30 border-b border-white/[0.04] flex items-center justify-between text-xs font-cairo">
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => onFilterChange("all")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                        filter === "all" ? "bg-white/10 text-white" : "text-[#94a3b8] hover:text-white"
                    }`}
                >
                    الكل ({totalCount})
                </button>
                <button
                    type="button"
                    onClick={() => onFilterChange("unread")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                        filter === "unread"
                            ? "bg-[#dc2626]/20 text-[#ffb4ab] border border-[#dc2626]/30"
                            : "text-[#94a3b8] hover:text-white"
                    }`}
                >
                    غير مقروءة ({unreadCount})
                </button>
            </div>

            <button
                type="button"
                onClick={onSendTest}
                className="flex items-center gap-1 text-[10px] text-[#94a3b8] hover:text-[#ffb95f] transition-colors cursor-pointer"
                title="إرسال إشعار فوري تجريبي"
            >
                <Sparkles size={11} className="text-[#ffb95f]" />
                <span>إشعار تجريبي</span>
            </button>
        </div>
    );
}
