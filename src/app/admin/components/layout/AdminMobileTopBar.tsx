import React from "react";
import Link from "next/link";
import { Home, Menu, X } from "lucide-react";

interface AdminMobileTopBarProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    logoUrl: string;
}

export const AdminMobileTopBar: React.FC<AdminMobileTopBarProps> = ({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    logoUrl,
}) => {
    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden sticky top-0 z-40 bg-[#131317]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2.5">
                    <img
                        src={logoUrl}
                        alt="أنمي دايز"
                        className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]"
                    />
                    <div>
                        <span className="font-cairo font-bold text-white text-sm block leading-tight">أنمي دايز</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-[#ffb95f] font-mono">CMS متصل 99.9%</span>
                        </div>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="p-2 rounded-xl bg-[#1b1b1f] border border-white/5 text-[#94a3b8] hover:text-white"
                        title="الموقع العام"
                    >
                        <Home size={18} />
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(prev => !prev)}
                        className="p-2 rounded-xl bg-[#1b1b1f] border border-white/5 text-[#94a3b8] hover:text-white"
                        aria-label="القائمة"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Backdrop Overlay */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                />
            )}
        </>
    );
};
