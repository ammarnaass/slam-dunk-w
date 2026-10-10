"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Search, 
    LogOut, 
    Sparkles, 
    ShieldCheck, 
    User as UserIcon,
    Flame,
    Film,
    Users,
    Home
} from "lucide-react";
import { useState, useEffect } from "react";
import SearchModal from "@/components/SearchModal";
import { useAuth } from "@/providers/AuthProvider";

interface NavbarProps {
    settings?: {
        siteName?: string;
        logoUrl?: string | null;
        [key: string]: any;
    };
}

export default function Navbar({ settings }: NavbarProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Track scroll position to enhance background blur
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Global keyboard shortcut for Search (⌘K / Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    const siteName = settings?.siteName || "سلام دانك";

    const navLinks = [
        { label: "الرئيسية", href: "/", icon: Home },
        { label: "دليل الأنميات", href: "/animes", icon: Film },
        { label: "الشخصيات", href: "/characters", icon: Users },
    ];

    return (
        <header 
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.6)]" 
                    : "bg-slate-950/75 backdrop-blur-md border-b border-white/[0.05]"
            }`}
        >
            {/* Top ambient hairline highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 h-16 sm:h-18 flex items-center justify-between gap-4">
                {/* Brand / Logo */}
                <div className="flex items-center gap-6">
                    <Link 
                        href="/" 
                        className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xl p-1"
                        aria-label="الرئيسية"
                    >
                        {settings?.logoUrl ? (
                            <img 
                                src={settings.logoUrl} 
                                alt={siteName} 
                                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                            />
                        ) : (
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                                    <Flame size={22} className="fill-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-1 group-hover:text-red-400 transition-colors">
                                        {siteName}
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold tracking-wider">
                                        ANIME STREAM
                                    </span>
                                </div>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-white/[0.05]">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                                        isActive
                                            ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30"
                                            : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                                    }`}
                                >
                                    <Icon size={14} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}

                        {/* VIP Subscription Link */}
                        <Link
                            href="/pricing"
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                                pathname === "/pricing"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/20"
                                    : "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                            }`}
                        >
                            <Sparkles size={13} className="fill-amber-400 text-amber-400" />
                            <span>اشتراك مميز</span>
                        </Link>
                    </nav>
                </div>

                {/* Center / Right: Search & User Controls */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* Search Bar Trigger (Expanded on desktop, icon on mobile) */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 px-3 sm:px-3.5 py-2 rounded-xl text-xs transition-all shadow-inner group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        title="البحث عن أنمي أو حلقة (⌘K)"
                        aria-label="فتح نافذة البحث"
                    >
                        <Search size={16} className="text-slate-400 group-hover:text-red-400 transition-colors" />
                        <span className="hidden md:inline text-slate-400 group-hover:text-slate-300 transition-colors">
                            ابحث عن أنمي أو حلقة...
                        </span>
                        <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] bg-slate-800 text-slate-400 border border-slate-700/80 px-1.5 py-0.5 rounded font-mono font-medium">
                            ⌘K
                        </kbd>
                    </button>

                    {/* User Auth Controls */}
                    {user ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Admin Panel Button */}
                            {(user.role === "ADMIN" || user.name === "admin" || user.email === "admin@example.com") && (
                                <Link
                                    href="/admin"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-red-500/50 hover:bg-slate-800 transition-all"
                                >
                                    <ShieldCheck size={15} className="text-red-500" />
                                    <span>لوحة الإدارة</span>
                                </Link>
                            )}

                            {/* User Profile Pill */}
                            <Link 
                                href="/profile" 
                                className="flex items-center gap-2 p-1 sm:pr-2.5 sm:pl-1 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all group"
                            >
                                <span className="hidden sm:inline text-xs font-bold text-slate-300 group-hover:text-white max-w-[100px] truncate">
                                    {user.name || user.email}
                                </span>
                                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                                    {(user.name || user.email || "U")[0].toUpperCase()}
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                                </div>
                            </Link>

                            {/* Logout Action */}
                            <button
                                onClick={handleLogout}
                                title="تسجيل الخروج"
                                aria-label="تسجيل الخروج"
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-all"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {/* Login */}
                            <Link
                                href="/login"
                                className="text-slate-300 hover:text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors"
                            >
                                دخول
                            </Link>

                            {/* Register Button */}
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-lg shadow-red-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <UserIcon size={14} className="hidden sm:inline" />
                                <span>حساب جديد</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Global Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    );
}
