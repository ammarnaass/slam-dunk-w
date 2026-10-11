"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    Film, 
    Server, 
    ExternalLink,
    ShieldAlert
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // If on login page, don't show the layout
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const navGroups = [
        {
            title: "المحتوى والوسائط",
            items: [
                { href: "/admin", label: "لوحة المؤشرات", icon: LayoutDashboard },
                { href: "/admin/animes", label: "مكتبة الأنمي والمواسم", icon: Tv },
                { href: "/admin/slider", label: "السلايدر الرئيسي", icon: Sparkles },
                { href: "/admin/characters", label: "إدارة الشخصيات", icon: Users },
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
                { href: "/admin/settings", label: "إعدادات المنصة و AdMob", icon: Settings },
            ]
        }
    ];

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

            {/* Fixed RTL Desktop Sidebar */}
            <aside className={`
                fixed inset-y-0 right-0 z-50 w-72 bg-[#0e0e12] border-l border-white/[0.06] flex flex-col justify-between py-6
                transition-transform duration-300 ease-in-out md:translate-x-0
                ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
            `}>
                <div className="flex flex-col gap-6 px-4">
                    {/* Header Brand */}
                    <div className="px-3 flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <Link href="/admin" className="flex items-center gap-3">
                            <img
                                src={LOGO_URL}
                                alt="أنمي دايز"
                                className="h-9 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(220,38,38,0.45)]"
                            />
                            <div>
                                <span className="font-cairo font-black text-base text-white tracking-wide block leading-tight">
                                    أنمي دايز
                                </span>
                                <span className="font-tajawal text-[10px] text-[#ffb95f] tracking-wider uppercase block mt-0.5 font-bold">
                                    CMS Control Core
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Groups */}
                    <nav className="flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">
                        {navGroups.map((group, gIdx) => (
                            <div key={gIdx} className="flex flex-col gap-1">
                                <span className="px-3 text-[11px] font-cairo font-bold text-[#94a3b8]/70 tracking-wider">
                                    {group.title}
                                </span>
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-cairo text-xs font-bold transition-all ${
                                                isActive
                                                    ? "bg-[#dc2626] text-white shadow-[0_4px_16px_rgba(220,38,38,0.35)]"
                                                    : "text-[#94a3b8] hover:text-white hover:bg-[#1b1b1f]"
                                            }`}
                                        >
                                            <Icon size={18} className={isActive ? "text-white" : "text-[#94a3b8]"} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Footer Strip */}
                <div className="px-4 flex flex-col gap-2 pt-4 border-t border-white/[0.06]">
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
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1b1b1f] hover:bg-red-950 text-[#ffb4ab] text-xs font-cairo font-bold transition-all border border-white/5"
                    >
                        <LogOut size={15} />
                        <span>تسجيل خروج آمن</span>
                    </button>
                </div>
            </aside>

            {/* Main Admin Content Wrapper (Shifted for 72 Desktop Sidebar) */}
            <div className="flex-1 md:mr-72 min-h-screen flex flex-col min-w-0 overflow-x-hidden">
                {/* Admin Top Header Bar (Desktop Only) */}
                <header className="hidden md:flex sticky top-0 z-30 h-16 bg-[#0e0e12]/80 backdrop-blur-xl border-b border-white/[0.06] items-center justify-between px-6">
                    <div className="flex items-center gap-3">
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
