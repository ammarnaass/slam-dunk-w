"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Crown, User, Sparkles } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    // Do not render consumer bottom nav on admin dashboard pages or full-screen watch pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/watch")) {
        return null;
    }

    const navItems = [
        { label: "الرئيسية", icon: Home, href: "/" },
        { label: "دليل الأنمي", icon: Film, href: "/animes" },
        { label: "باقات VIP", icon: Crown, href: "/pricing", isVip: true },
        { label: "حسابي", icon: User, href: "/profile" },
    ];

    return (
        <div className="lg:hidden fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] inset-x-3 sm:inset-x-4 z-50 pointer-events-none">
            <nav className="pointer-events-auto max-w-md mx-auto bg-[#131317]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.85)] px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? "text-white"
                                    : "text-[#94a3b8] hover:text-[#e4e1e7]"
                            }`}
                        >
                            {isActive && (
                                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-[#dc2626] shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
                            )}
                            <div className="relative">
                                <Icon 
                                    size={20} 
                                    className={isActive ? (item.isVip ? "text-[#f59e0b]" : "text-[#dc2626]") : "text-inherit"} 
                                    strokeWidth={isActive ? 2.5 : 2} 
                                />
                                {item.isVip && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ee9800] animate-pulse" />
                                )}
                            </div>
                            <span className={`text-[11px] font-cairo font-bold ${isActive ? "text-white" : "text-inherit"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
