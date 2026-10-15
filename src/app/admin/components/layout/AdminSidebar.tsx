import React, { Suspense } from "react";
import Link from "next/link";
import {
    PanelRightClose,
    PanelRightOpen,
    Home,
    LogOut,
    ExternalLink,
} from "lucide-react";
import { AdminNavLinks } from "./AdminNavLinks";

interface AdminSidebarProps {
    isCollapsed: boolean;
    isMobileMenuOpen: boolean;
    toggleSidebar: () => void;
    onCloseMobile: () => void;
    onLogout: () => void;
    logoUrl: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    isCollapsed,
    isMobileMenuOpen,
    toggleSidebar,
    onCloseMobile,
    onLogout,
    logoUrl,
}) => {
    return (
        <aside
            className={`
            fixed inset-y-0 right-0 z-50 bg-[#0e0e12] border-l border-white/[0.06] flex flex-col justify-between py-5
            transition-all duration-300 ease-in-out md:translate-x-0
            ${isCollapsed ? "md:w-20" : "md:w-72"}
            ${isMobileMenuOpen ? "translate-x-0 w-72" : "translate-x-full md:translate-x-0"}
        `}
        >
            <div className={`flex flex-col gap-5 ${isCollapsed ? "px-2" : "px-4"}`}>
                {/* Header Brand & Toggle Button */}
                {isCollapsed ? (
                    // Collapsed Header View (Icon only + Expand Toggle)
                    <div className="flex flex-col items-center gap-3 pb-3 border-b border-white/[0.06]">
                        <Link
                            href="/admin"
                            className="flex items-center justify-center p-1.5 rounded-xl hover:bg-[#1b1b1f] transition-colors"
                            title="أنمي دايز - لوحة التحكم"
                        >
                            <img
                                src={logoUrl}
                                alt="أنمي دايز"
                                className="h-8 w-8 object-contain filter drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                            />
                        </Link>

                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="w-10 h-10 rounded-xl bg-[#181820] hover:bg-[#22222c] border border-white/5 text-[#94a3b8] hover:text-white flex items-center justify-center transition-all cursor-pointer group relative"
                            title="توسيع القائمة الجانبية"
                            aria-label="توسيع القائمة الجانبية"
                        >
                            <PanelRightOpen size={18} className="transition-transform group-hover:scale-110 text-secondary" />

                            {/* Tooltip */}
                            <div className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-[#16161d]/95 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50">
                                توسيع القائمة
                            </div>
                        </button>
                    </div>
                ) : (
                    // Expanded Header View (Full Logo + Brand + Collapse Toggle)
                    <div className="px-2 flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <Link href="/admin" className="flex items-center gap-3 min-w-0">
                            <img
                                src={logoUrl}
                                alt="أنمي دايز"
                                className="h-9 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(220,38,38,0.45)]"
                            />
                            <div className="truncate">
                                <span className="font-cairo font-black text-base text-white tracking-wide block leading-tight truncate">
                                    أنمي دايز
                                </span>
                                <span className="font-tajawal text-[10px] text-[#ffb95f] tracking-wider uppercase block mt-0.5 font-bold">
                                    CMS Control Core
                                </span>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="p-2 rounded-xl bg-[#181820] hover:bg-[#22222c] border border-white/5 text-[#94a3b8] hover:text-white flex items-center justify-center transition-all cursor-pointer group shrink-0"
                            title="طي القائمة الجانبية (أيقونات فقط)"
                            aria-label="طي القائمة الجانبية"
                        >
                            <PanelRightClose size={18} className="transition-transform group-hover:scale-110" />
                        </button>
                    </div>
                )}

                {/* Navigation Groups */}
                <Suspense
                    fallback={
                        <div className="flex flex-col gap-3 py-2 px-2">
                            <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                            <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                            <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                            <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                        </div>
                    }
                >
                    <AdminNavLinks isCollapsed={isCollapsed} onCloseMobile={onCloseMobile} />
                </Suspense>
            </div>

            {/* Footer Strip */}
            <div className={`flex flex-col gap-2 pt-4 border-t border-white/[0.06] ${isCollapsed ? "px-2" : "px-4"}`}>
                {isCollapsed ? (
                    // Collapsed Footer Actions
                    <>
                        <Link
                            href="/"
                            className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-[#15151c] text-[#94a3b8] hover:text-white hover:bg-[#1f1f23] transition-all group relative"
                            title="الموقع العام"
                        >
                            <Home size={18} />
                            <div className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#16161d]/95 backdrop-blur-xl border border-white/10 text-white text-xs font-bold font-cairo shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 flex items-center gap-1.5">
                                <span>الموقع العام</span>
                                <ExternalLink size={12} className="text-[#94a3b8]" />
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-[#1b1b1f] hover:bg-red-950 text-[#ffb4ab] transition-all border border-white/5 cursor-pointer group relative"
                            title="تسجيل خروج آمن"
                        >
                            <LogOut size={18} />
                            <div className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-red-950/95 backdrop-blur-xl border border-red-500/30 text-[#ffb4ab] text-xs font-bold font-cairo shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50">
                                تسجيل خروج
                            </div>
                        </button>
                    </>
                ) : (
                    // Expanded Footer Actions
                    <>
                        <Link
                            href="/"
                            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#15151c] text-xs font-tajawal text-[#94a3b8] hover:text-white hover:bg-[#1f1f23] transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <Home size={15} />
                                <span>الموقع العام</span>
                            </span>
                            <ExternalLink size={13} />
                        </Link>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1b1b1f] hover:bg-red-950 text-[#ffb4ab] text-xs font-cairo font-bold transition-all border border-white/5 cursor-pointer"
                        >
                            <LogOut size={15} />
                            <span>تسجيل خروج آمن</span>
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
};
