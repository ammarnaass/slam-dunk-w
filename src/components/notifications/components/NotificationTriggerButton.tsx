"use client";

import { Bell } from "lucide-react";

interface NotificationTriggerButtonProps {
    isOpen: boolean;
    unreadCount: number;
    onToggle: () => void;
}

export function NotificationTriggerButton({
    isOpen,
    unreadCount,
    onToggle,
}: NotificationTriggerButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`relative p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center min-w-[38px] min-h-[38px] ${
                isOpen
                    ? "bg-[#2a292e] text-white border-[#dc2626]/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                    : "bg-[#1b1b1f] hover:bg-[#1f1f23] text-[#94a3b8] hover:text-[#e4e1e7] border-white/[0.06]"
            }`}
            title="التنبيهات والإشعارات"
            aria-label="التنبيهات"
            aria-expanded={isOpen}
        >
            <Bell size={17} className={unreadCount > 0 ? "text-[#ffb4ab]" : ""} />

            {/* Unread Count Badge */}
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#dc2626] text-white rounded-full text-[10px] font-black flex items-center justify-center font-cairo ring-2 ring-[#131317] animate-pulse shadow-md shadow-red-950">
                    {unreadCount > 9 ? "+9" : unreadCount}
                </span>
            )}
        </button>
    );
}
