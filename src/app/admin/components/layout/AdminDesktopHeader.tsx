import React from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

interface AdminDesktopHeaderProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    userName?: string;
}

export const AdminDesktopHeader: React.FC<AdminDesktopHeaderProps> = ({
    isCollapsed,
    toggleSidebar,
    userName,
}) => {
    return (
        <header className="hidden md:flex sticky top-0 z-30 h-16 bg-[#0e0e12]/80 backdrop-blur-xl border-b border-white/[0.06] items-center justify-between px-6">
            <div className="flex items-center gap-3">
                {/* Desktop Header Toggle Button */}
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="p-2 rounded-xl bg-[#181820] hover:bg-[#22222c] border border-white/5 text-[#94a3b8] hover:text-white transition-all cursor-pointer flex items-center justify-center"
                    title={isCollapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية (أيقونات فقط)"}
                    aria-label="تبديل القائمة الجانبية"
                >
                    {isCollapsed ? <PanelRightOpen size={19} className="text-secondary" /> : <PanelRightClose size={19} />}
                </button>

                <span className="font-cairo font-bold text-sm text-white">لوحة الإدارة المركزية</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1b1b1f] text-emerald-400 border border-emerald-800/40">
                    /api/v1/admin: متصل 99.98%
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-right">
                    <div className="flex flex-col">
                        <span className="font-cairo font-bold text-xs text-white">
                            {userName || "مدير النظام"}
                        </span>
                        <span className="text-[10px] text-[#ffb95f]">Super Admin</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#dc2626] flex items-center justify-center text-white font-bold text-xs">
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
};
