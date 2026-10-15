"use client";

import { Trash2 } from "lucide-react";

interface NotificationDropdownFooterProps {
    onClearAll: () => void;
    onOpenModalView: () => void;
}

export function NotificationDropdownFooter({
    onClearAll,
    onOpenModalView,
}: NotificationDropdownFooterProps) {
    return (
        <div className="p-3 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-cairo">
            <button
                type="button"
                onClick={onClearAll}
                className="text-red-400/80 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
                <Trash2 size={12} />
                <span>مسح جميع الإشعارات</span>
            </button>

            <button
                type="button"
                onClick={onOpenModalView}
                className="text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
            >
                عرض كنافذة عائمة
            </button>
        </div>
    );
}
