"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Search, User, Heart } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "الرئيسية", icon: Home, href: "/" },
        { label: "الأنمي", icon: Film, href: "/animes" },
        { label: "بحث", icon: Search, href: "/search" },
        { label: "حسابي", icon: User, href: "/profile" },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <nav className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl px-2 py-2 flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label} // Use label as key for uniqueness
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${isActive
                                ? "bg-red-600/10 text-red-500 scale-110"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
