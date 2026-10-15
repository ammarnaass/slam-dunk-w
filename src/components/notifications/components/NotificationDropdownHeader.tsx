"use client";

import { BellRing, CheckCheck } from "lucide-react";

interface NotificationDropdownHeaderProps {
    unreadCount: number;
    onMarkAllAsRead: () => void;
}

export function NotificationDropdownHeader({
    unreadCount,
    onMarkAllAsRead,
}: NotificationDropdownHeaderProps) {
    return (
        <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#ffb4ab]">
                    <BellRing size={16} />
                </div>
                <div>
                    <h3 className="font-cairo font-black text-sm text-white leading-tight">
                        التنبيهات والإشعارات
                    </h3>
                    <span className="font-tajawal text-[11px] text-[#94a3b8]">
                        {unreadCount > 0
                            ? `لديك ${unreadCount} تنبيهات غير مقروءة`
                            : "جميع التنبيهات مقروءة"}
                    </span>
                </div>
            </div>

            {unreadCount > 0 && (
                <button
                    type="button"
                    onClick={onMarkAllAsRead}
                    className="flex items-center gap-1 text-[11px] font-cairo font-bold text-[#ffb95f] hover:text-white transition-colors cursor-pointer"
                    title="تحديد جميع التنبيهات كمقروءة"
                >
                    <CheckCheck size={14} />
                    <span>مقروء للكل</span>
                </button>
            )}
        </div>
    );
}
