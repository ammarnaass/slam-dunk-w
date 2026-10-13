"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
    LayoutDashboard, 
    Tv, 
    Users, 
    LogOut, 
    Home, 
    Settings, 
    User as UserIcon, 
    CreditCard, 
    Banknote, 
    Smartphone, 
    Sparkles, 
    Menu, 
    X, 
    ExternalLink,
    PanelRightClose,
    PanelRightOpen,
    Layers,
    Film,
    Palette,
    Compass
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/providers/AuthProvider";

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    tab?: string;
    altMatch?: string;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const navGroups: NavGroup[] = [
    {
        title: "المحتوى والوسائط",
        items: [
            { href: "/admin", label: "لوحة المؤشرات", icon: LayoutDashboard },
            { href: "/admin/animes", label: "مكتبة الأنمي والمواسم", icon: Tv },
            { href: "/admin/characters", label: "إدارة الشخصيات", icon: Users },
            { href: "/admin/planets", label: "إدارة كواكب الأنمي", icon: Compass },
        ]
    },
    {
        title: "تخصيص الواجهة والهوية",
        items: [
            { href: "/admin/settings?tab=home", label: "أقسام الصفحة الرئيسية", icon: Layers, tab: "home" },
            { href: "/admin/settings?tab=slider", label: "السلايدر السينمائي", icon: Film, tab: "slider", altMatch: "/admin/slider" },
            { href: "/admin/settings?tab=logo", label: "الشعار والمحاكاة", icon: Sparkles, tab: "logo" },
            { href: "/admin/settings?tab=identity", label: "الهوية والتسمية والألوان", icon: Palette, tab: "identity" },
        ]
    },
    {
        title: "المشتركون وباقات VIP",
        items: [
            { href: "/admin/users", label: "المشتركون والأعضاء", icon: UserIcon },
            { href: "/admin/plans", label: "خطط وباقات VIP", icon: CreditCard },
            { href: "/admin/payment-methods", label: "طرق الدفع والتحويل", icon: Banknote },
        ]
    },
    {
        title: "النظام والـ API",
        items: [
            { href: "/admin/api-app", label: "تطبيق الهاتف (API Core)", icon: Smartphone },
            { href: "/admin/settings?tab=system", label: "إعدادات المنصة و AdMob", icon: Settings, tab: "system" },
        ]
    }
];

function AdminNavLinks({
    isCollapsed,
    onCloseMobile,
}: {
    isCollapsed: boolean;
    onCloseMobile: () => void;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams ? searchParams.get("tab") : null;

    return (
        <nav className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-210px)] no-scrollbar">
            {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="flex flex-col gap-1">
                    {isCollapsed ? (
                        <div className="h-[1px] bg-white/[0.06] my-1.5 w-8 mx-auto" />
                    ) : (
                        <span className="px-3 text-[11px] font-cairo font-bold text-[#94a3b8]/70 tracking-wider">
                            {group.title}
                        </span>
                    )}

                    {group.items.map((item) => {
                        const isActive = (() => {
                            if (item.tab) {
                                if (pathname === "/admin/settings") {
                                    const effectiveTab = currentTab || "home";
                                    return effectiveTab === item.tab;
                                }
                                if (item.altMatch && pathname === item.altMatch) {
                                    return true;
                                }
                                return false;
                            }
                            return pathname === item.href;
                        })();
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onCloseMobile}
                                className={`relative group flex items-center rounded-xl font-cairo text-xs font-bold transition-all ${
                                    isCollapsed
                                        ? "w-12 h-12 mx-auto justify-center p-0"
                                        : "px-3.5 py-2.5 gap-3"
                                } ${
                                    isActive
                                        ? "bg-[#dc2626] text-white shadow-[0_4px_16px_rgba(220,38,38,0.35)]"
                                        : "text-[#94a3b8] hover:text-white hover:bg-[#1b1b1f]"
                                }`}
                            >
                                <Icon 
                                    size={isCollapsed ? 20 : 18} 
                                    className={`shrink-0 transition-transform ${isActive ? "text-white" : "text-[#94a3b8] group-hover:text-white"}`} 
                                />
                                
                                {!isCollapsed && (
                                    <span className="truncate">{item.label}</span>
                                )}

                                {isCollapsed && (
                                    <div className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#16161d]/95 backdrop-blur-xl border border-white/10 text-white text-xs font-bold font-cairo shadow-[0_10px_25px_rgba(0,0,0,0.7)] pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap z-50 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                                        <span>{item.label}</span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Initialize collapsed state from localStorage on client mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("admin_sidebar_collapsed");
            if (saved !== null) {
                setIsCollapsed(saved === "true");
            }
        } catch (_) {}
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem("admin_sidebar_collapsed", String(next));
            } catch (_) {}
            return next;
        });
    };

    // If on login page, don't show the layout
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const LOGO_URL = "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg";

    return (
        <div className="min-h-screen bg-[#0b0b0f] flex flex-col md:flex-row text-[#e4e1e7] font-tajawal" dir="rtl">
            {/* Mobile Top Bar */}
            <div className="md:hidden sticky top-0 z-40 bg-[#131317]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2.5">
                    <img 
                        src={LOGO_URL} 
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
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

            {/* Fixed RTL Desktop Sidebar (Collapsible Mini/Full) */}
            <aside className={`
                fixed inset-y-0 right-0 z-50 bg-[#0e0e12] border-l border-white/[0.06] flex flex-col justify-between py-5
                transition-all duration-300 ease-in-out md:translate-x-0
                ${isCollapsed ? "md:w-20" : "md:w-72"}
                ${isMobileMenuOpen ? "translate-x-0 w-72" : "translate-x-full md:translate-x-0"}
            `}>
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
                                    src={LOGO_URL}
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
                                    src={LOGO_URL}
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
                    <Suspense fallback={
                        <div className="flex flex-col gap-3 py-2 px-2">
                            <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                            <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                            <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                            <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                        </div>
                    }>
                        <AdminNavLinks 
                            isCollapsed={isCollapsed} 
                            onCloseMobile={() => setIsMobileMenuOpen(false)} 
                        />
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
                                onClick={handleLogout}
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
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1b1b1f] hover:bg-red-950 text-[#ffb4ab] text-xs font-cairo font-bold transition-all border border-white/5 cursor-pointer"
                            >
                                <LogOut size={15} />
                                <span>تسجيل خروج آمن</span>
                            </button>
                        </>
                    )}
                </div>
            </aside>

            {/* Main Admin Content Wrapper (Shifted dynamically based on collapsed state) */}
            <div className={`flex-1 transition-all duration-300 ease-in-out min-h-screen flex flex-col min-w-0 overflow-x-hidden ${
                isCollapsed ? "md:mr-20" : "md:mr-72"
            }`}>
                {/* Admin Top Header Bar (Desktop Only) */}
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
                                    {user?.name || "مدير النظام"}
                                </span>
                                <span className="text-[10px] text-[#ffb95f]">Super Admin</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-[#dc2626] flex items-center justify-center text-white font-bold text-xs">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Dynamic View */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
