"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Search, 
    LogOut, 
    Sparkles, 
    ShieldCheck, 
    User as UserIcon,
    Film,
    Users,
    Home,
    Crown,
    Bell,
    Layers,
    ChevronDown,
    Bookmark,
    LogIn
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Track scroll position for header elevation
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 15);
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

    // Close user menu on outside click, Esc, or route change
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        setIsUserMenuOpen(false);
    }, [pathname]);

    // Do not render consumer navbar on admin dashboard pages
    if (pathname.startsWith("/admin")) {
        return null;
    }

    const siteName = settings?.siteName || "أنمي دايز";
    const defaultLogoUrl = "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg";
    const logoUrl = settings?.logoUrl || defaultLogoUrl;

    const navLinks = [
        { label: "الرئيسية", href: "/" },
        { label: "دليل الأنمي", href: "/animes" },
        { label: "كواكب الأنمي", href: "/animes?tab=planets" },
        { label: "جدول الحلقات", href: "/episodes" },
        { label: "المفضلة", href: "/profile" },
        { label: "اشتراك VIP", href: "/pricing", isVip: true },
    ];

    return (
        <>
            <header 
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                    scrolled 
                        ? "bg-[#131317]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.8)]" 
                        : "bg-[#131317]/85 backdrop-blur-xl border-b border-white/[0.05]"
                }`}
            >
                {/* Ambient top highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dc2626]/50 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
                    {/* Brand / Logo (أنمي دايز) */}
                    <div className="flex items-center gap-3 sm:gap-7 flex-shrink-0 min-w-0">
                        <Link 
                            href="/" 
                            className="group flex items-center gap-2 sm:gap-3 focus-visible:outline-none min-w-0"
                            aria-label={siteName}
                        >
                            <img 
                                src={logoUrl} 
                                alt={siteName} 
                                className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(220,38,38,0.4)] shrink-0" 
                            />
                            <div className="flex flex-col min-w-0">
                                <span className="font-cairo font-black text-lg sm:text-2xl tracking-wide text-[#e4e1e7] flex items-center truncate">
                                    {siteName}
                                </span>
                                <span className="hidden xs:inline text-[9px] sm:text-[10px] font-tajawal text-[#ffb95f] tracking-widest font-bold -mt-0.5 truncate">
                                    عالم الأنمي وسبيستون
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links (Desktop) */}
                        <nav className="hidden xl:flex items-center gap-1.5">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3.5 py-2 rounded-xl text-sm font-cairo font-bold transition-all duration-200 flex items-center gap-1.5 ${
                                            isActive
                                                ? "bg-[#dc2626] text-white shadow-[0_0_16px_rgba(220,38,38,0.4)]"
                                                : "text-[#94a3b8] hover:text-[#e4e1e7] hover:bg-[#1f1f23]"
                                        }`}
                                    >
                                        <span>{link.label}</span>
                                        {link.isVip && (
                                            <span className="bg-[#ee9800] text-[#5b3800] text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(238,152,0,0.5)]">
                                                VIP
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Left Actions (RTL: Anchors Left) */}
                    <div className="flex items-center gap-3">
                        {/* Quick Subscribe Button (اشترك الآن) */}
                        <Link
                            href="/pricing"
                            className="hidden sm:flex items-center gap-1.5 bg-[#dc2626] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-cairo font-bold hover:brightness-110 transition-all shadow-[0_0_16px_rgba(220,38,38,0.4)] hover:shadow-[0_0_24px_rgba(220,38,38,0.6)]"
                        >
                            <Sparkles size={15} className="fill-white" />
                            <span>اشترك الآن</span>
                        </Link>

                        {/* Search Bar Button */}
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center gap-2 bg-[#1b1b1f] hover:bg-[#1f1f23] text-[#94a3b8] hover:text-[#e4e1e7] px-3.5 py-2 rounded-xl border border-white/[0.06] text-xs transition-all w-48 lg:w-56"
                        >
                            <Search size={16} className="text-[#94a3b8]" />
                            <span className="truncate">ابحث عن أنمي...</span>
                            <span className="mr-auto font-mono text-[10px] bg-[#2a292e] text-[#94a3b8] px-1.5 py-0.5 rounded border border-white/5">
                                Ctrl+K
                            </span>
                        </button>

                        {/* Search Icon Trigger on Mobile */}
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="md:hidden p-2.5 rounded-xl bg-[#1b1b1f] text-[#94a3b8] hover:text-[#e4e1e7] border border-white/5"
                            aria-label="بحث"
                        >
                            <Search size={18} />
                        </button>

                        {/* Notifications Bell with count */}
                        <button
                            type="button"
                            className="relative p-2.5 rounded-xl bg-[#1b1b1f] hover:bg-[#1f1f23] text-[#94a3b8] hover:text-[#e4e1e7] border border-white/[0.06] transition-all"
                            title="التنبيهات"
                            aria-label="التنبيهات"
                        >
                            <Bell size={18} />
                            <span className="absolute top-1 right-1 w-4 h-4 bg-[#dc2626] text-white rounded-full text-[10px] font-bold flex items-center justify-center font-tajawal ring-2 ring-[#131317]">
                                3
                            </span>
                        </button>

                        {/* Circular User Avatar Trigger & Floating Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen(prev => !prev)}
                                className={`flex items-center gap-1.5 p-1 rounded-full transition-all duration-200 cursor-pointer ${
                                    isUserMenuOpen 
                                        ? "bg-[#2a292e] ring-2 ring-[#dc2626]/70 shadow-[0_0_16px_rgba(220,38,38,0.4)]" 
                                        : "hover:bg-[#1b1b1f] ring-1 ring-white/10 hover:ring-[#dc2626]/40"
                                }`}
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="menu"
                                title={user?.name || "حساب المستخدم"}
                            >
                                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden">
                                    {user ? (
                                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-[#1b1b1f] hover:bg-[#25252b] flex items-center justify-center text-[#e4e1e7] transition-colors">
                                            <UserIcon size={18} />
                                        </div>
                                    )}

                                    {/* VIP / Active Status Ring */}
                                    {user && (
                                        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-[#ee9800] rounded-full ring-2 ring-[#131317] shadow-[0_0_8px_rgba(238,152,0,0.8)]" />
                                    )}
                                </div>

                                <ChevronDown 
                                    size={15} 
                                    className={`text-[#94a3b8] ml-1 transition-transform duration-300 ${
                                        isUserMenuOpen ? "rotate-180 text-white" : ""
                                    }`} 
                                />
                            </button>

                            {/* Dropdown Menu (ملف شخصي، قائمتي، تسجيل الدخول/الخروج) */}
                            {isUserMenuOpen && (
                                <div className="absolute left-0 mt-3 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#19191e]/98 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.85)] z-50 overflow-hidden py-1.5 transition-all">
                                    {/* User Identity Header */}
                                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3 bg-white/[0.02]">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/10 shrink-0">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-cairo font-bold text-sm text-[#e4e1e7] truncate">
                                                {user?.name || "زائر المنصة"}
                                            </span>
                                            {user ? (
                                                <span className="text-[11px] font-tajawal text-[#ffb95f] flex items-center gap-1 font-bold">
                                                    <Crown size={12} className="fill-[#ffb95f]" />
                                                    عضوية VIP نشطة
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-tajawal text-[#94a3b8]">
                                                    سجل دخولك لتفعيل الميزات
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-1">
                                        {/* ملف شخصي */}
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-cairo font-semibold text-[#e4e1e7] hover:text-white hover:bg-white/[0.06] transition-colors group"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-[#dc2626]/20 flex items-center justify-center text-[#94a3b8] group-hover:text-[#ffb4ab] transition-colors">
                                                <UserIcon size={16} />
                                            </div>
                                            <span>ملف شخصي</span>
                                        </Link>

                                        {/* قائمتي */}
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-cairo font-semibold text-[#e4e1e7] hover:text-white hover:bg-white/[0.06] transition-colors group"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-[#ffb95f]/20 flex items-center justify-center text-[#94a3b8] group-hover:text-[#ffb95f] transition-colors">
                                                <Bookmark size={16} />
                                            </div>
                                            <span>قائمتي</span>
                                        </Link>

                                        {/* لوحة الإدارة */}
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-cairo font-semibold text-[#ffb4ab] hover:text-white hover:bg-white/[0.06] transition-colors group"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-[#dc2626]/10 group-hover:bg-[#dc2626]/20 flex items-center justify-center text-[#dc2626] transition-colors">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <span>لوحة الإدارة</span>
                                        </Link>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-white/[0.06] my-1" />

                                    {/* Action: تسجيل الدخول أو الخروج */}
                                    <div className="p-1.5">
                                        {user ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-cairo font-semibold text-[#ffb4ab] hover:text-white hover:bg-[#dc2626]/20 transition-all text-right cursor-pointer"
                                            >
                                                <LogOut size={16} className="text-[#dc2626]" />
                                                <span>تسجيل الخروج</span>
                                            </button>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                <Link
                                                    href="/login"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-cairo font-bold text-white bg-[#dc2626] hover:brightness-110 shadow-[0_0_12px_rgba(220,38,38,0.4)] transition-all"
                                                >
                                                    <LogIn size={16} />
                                                    <span>تسجيل الدخول</span>
                                                </Link>
                                                <Link
                                                    href="/register"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-cairo font-medium text-[#94a3b8] hover:text-[#e4e1e7] hover:bg-white/[0.04] transition-colors"
                                                >
                                                    <span>ليس لديك حساب؟ اشترك الآن</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Global Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
