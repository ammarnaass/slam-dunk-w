"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
    Search, 
    Menu, 
    Sparkles
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import SearchModal from "./SearchModal";
import NotificationDropdown from "./notifications/NotificationDropdown";
import NotificationBottomModal from "./notifications/NotificationBottomModal";
import { NavbarUserMenu } from "./navbar/NavbarUserMenu";
import { NavbarMobileDrawer } from "./navbar/NavbarMobileDrawer";

interface NavbarProps {
    settings?: {
        siteName?: string;
        logoUrl?: string;
    };
}

export const Navbar = ({ settings }: NavbarProps) => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    // Dynamic scroll background styling
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close drawers on route change
    useEffect(() => {
        setIsUserMenuOpen(false);
        setIsMobileDrawerOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile drawer is open
    useEffect(() => {
        if (isMobileDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileDrawerOpen]);

    const siteName = settings?.siteName || "أنمي دايز";
    const defaultLogoUrl = "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg";
    const logoUrl = settings?.logoUrl || defaultLogoUrl;

    const navLinks: { label: string; href: string; isVip?: boolean }[] = [
        { label: "الرئيسية", href: "/" },
        { label: "دليل الأنمي", href: "/animes" },
        { label: "كواكب الأنمي", href: "/planets" },
    ];

    const planetLinks = [
        { name: "كوكب رياضة", href: "/planets?planet=sports", badge: "🏀", color: "text-red-400" },
        { name: "كوكب مغامرات", href: "/planets?planet=adventure", badge: "🚀", color: "text-amber-400" },
        { name: "كوكب أكشن", href: "/planets?planet=action", badge: "⚡", color: "text-orange-400" },
        { name: "كوكب غموض", href: "/planets?planet=mystery", badge: "🔍", color: "text-cyan-400" },
        { name: "كوكب كوميديا", href: "/planets?planet=comedy", badge: "😄", color: "text-emerald-400" },
        { name: "كوكب زمردة", href: "/planets?planet=zomoroda", badge: "💎", color: "text-pink-400" },
        { name: "كوكب علوم", href: "/planets?planet=science", badge: "🔬", color: "text-teal-400" },
        { name: "كوكب تاريخ", href: "/planets?planet=history", badge: "📜", color: "text-amber-300" },
        { name: "كوكب أفلام", href: "/planets?planet=movies", badge: "🎬", color: "text-purple-400" },
    ];

    return (
        <>
            <header 
                className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 pt-[env(safe-area-inset-top,0px)] ${
                    scrolled 
                        ? "bg-[#131317]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.85)]" 
                        : "bg-[#131317]/85 backdrop-blur-xl border-b border-white/[0.05]"
                }`}
            >
                {/* Ambient top highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#dc2626]/50 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
                    {/* Brand / Logo */}
                    <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 flex-shrink-0 min-w-0">
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
                                <span className="font-cairo font-black text-base sm:text-xl lg:text-2xl tracking-wide text-[#e4e1e7] flex items-center truncate">
                                    {siteName}
                                </span>
                                <span className="hidden xs:inline text-[9px] sm:text-[10px] font-tajawal text-[#ffb95f] tracking-widest font-bold -mt-0.5 truncate">
                                    عالم الأنمي وسبيستون
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links (Desktop) */}
                        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm font-cairo font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
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

                    {/* Left Actions (RTL) */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Quick Subscribe Button */}
                        <Link
                            href="/pricing"
                            className="hidden sm:flex items-center gap-1.5 bg-[#dc2626] text-white px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-cairo font-bold hover:brightness-110 transition-all shadow-[0_0_16px_rgba(220,38,38,0.4)] hover:shadow-[0_0_24px_rgba(220,38,38,0.6)] whitespace-nowrap"
                        >
                            <Sparkles size={15} className="fill-white" />
                            <span>اشترك الآن</span>
                        </Link>

                        {/* Search Bar Button */}
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center gap-2 bg-[#1b1b1f] hover:bg-[#1f1f23] text-[#94a3b8] hover:text-[#e4e1e7] px-3 py-2 rounded-xl border border-white/[0.06] text-xs transition-all w-36 lg:w-48 xl:w-56 cursor-pointer"
                        >
                            <Search size={15} className="text-[#94a3b8]" />
                            <span className="font-cairo truncate">ابحث عن أنمي، شخصية...</span>
                        </button>

                        {/* Mobile Search Icon Button */}
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="md:hidden p-2 sm:p-2.5 rounded-xl bg-[#1b1b1f] hover:bg-[#25252b] text-[#94a3b8] hover:text-[#e4e1e7] border border-white/5 transition-all cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                            aria-label="البحث"
                        >
                            <Search size={17} />
                        </button>

                        {/* Notifications Dropdown */}
                        <NotificationDropdown />

                        {/* User Menu Dropdown Component */}
                        <NavbarUserMenu
                            user={user}
                            isUserMenuOpen={isUserMenuOpen}
                            setIsUserMenuOpen={setIsUserMenuOpen}
                            logout={logout}
                        />

                        {/* Hamburger Menu Toggle (Mobile) */}
                        <button
                            type="button"
                            onClick={() => setIsMobileDrawerOpen(prev => !prev)}
                            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[#1b1b1f] hover:bg-[#25252b] text-[#94a3b8] hover:text-white border border-white/5 transition-all cursor-pointer flex items-center justify-center min-w-[38px] min-h-[38px]"
                            aria-label="القائمة الشاملة"
                            aria-expanded={isMobileDrawerOpen}
                        >
                            <Menu size={19} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Slide-Over Navigation Drawer Component */}
            <NavbarMobileDrawer
                isOpen={isMobileDrawerOpen}
                onClose={() => setIsMobileDrawerOpen(false)}
                user={user}
                logout={logout}
                logoUrl={logoUrl}
                siteName={siteName}
                navLinks={navLinks}
                planetLinks={planetLinks}
                pathname={pathname}
            />

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Floating Notifications Modal on Left Bottom */}
            <NotificationBottomModal />
        </>
    );
};

export default Navbar;
