"use client";

import { CheckCheck } from "lucide-react";

interface NotificationEmptyStateProps {
    filter: "all" | "unread";
}

export function NotificationEmptyState({ filter }: NotificationEmptyStateProps) {
    return (
        <div className="p-8 text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#94a3b8] mx-auto">
                <CheckCheck size={22} className="text-emerald-400" />
            </div>
            <p className="font-cairo font-bold text-xs text-white">
                {filter === "unread" ? "لا توجد تنبيهات جديدة غير مقروءة" : "لا توجد إشعارات حالياً"}
            </p>
            <p className="font-tajawal text-[11px] text-[#94a3b8]">
                أنت مطلع على أحدث الحلقات وسيرفرات البث والعروض الحصرية!
            </p>
        </div>
    );
}
