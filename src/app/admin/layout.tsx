"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    Film, 
    Users, 
    LogOut, 
    Home, 
    Settings, 
    User as UserIcon, 
    CreditCard, 
    Banknote, 
    Smartphone, 
    Sparkles, 
    Flame,
    Tv,
    Shield,
    Menu,
    X,
    ExternalLink,
    ChevronLeft
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
        router.push("/admin/login");
    };

    const navGroups = [
        {
            title: "المحتوى والوسائط",
            items: [
                { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
                { href: "/admin/animes", label: "مسلسلات الأنمي", icon: Tv },
                { href: "/admin/slider", label: "السلايدر الرئيسي", icon: Sparkles },
                { href: "/admin/characters", label: "إدارة الشخصيات", icon: Users },
            ]
        },
        {
            title: "المشتركين والمالية",
            items: [
                { href: "/admin/users", label: "إدارة المشتركين", icon: UserIcon },
                { href: "/admin/plans", label: "خطط الاشتراكات", icon: CreditCard },
                { href: "/admin/payment-methods", label: "طرق الدفع", icon: Banknote },
            ]
        },
        {
            title: "إعدادات المنصة",
            items: [
                { href: "/admin/api-app", label: "تطبيق الهاتف (API)", icon: Smartphone },
                { href: "/admin/settings", label: "إعدادات الموقع و AdMob", icon: Settings },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 font-sans" dir="rtl">
            {/* Top Bar for Mobile */}
            <div className="md:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md">
                        <Flame size={18} className="fill-white" />
                    </div>
                    <div>
                        <span className="font-bold text-white text-sm">لوحة الإدارة</span>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-slate-400">متصل</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    aria-label="القائمة"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <aside className={`
                fixed md:static inset-y-0 right-0 z-50 md:z-auto
                w-72 bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-2xl
                border-l border-white/[0.08] flex flex-col justify-between
                transition-transform duration-300 ease-in-out shrink-0
                ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
            `}>
                {/* Sidebar Header */}
                <div>
                    <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                        <Link href="/admin" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                                <Flame size={22} className="fill-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-black text-white tracking-tight flex items-center gap-1">
                                    لوحة التحكم
                                    <span className="text-red-500">.</span>
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PRO v2.4</span>
                                </div>
                            </div>
                        </Link>

                        {/* Mobile close button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden text-slate-400 hover:text-white p-1"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Nav Items List */}
                    <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)]">
                        {navGroups.map((group, gIdx) => (
                            <div key={gIdx} className="space-y-1.5">
                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
                                    {group.title}
                                </div>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group ${
                                                isActive
                                                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 font-bold"
                                                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
                                                <span>{item.label}</span>
                                            </div>
                                            {isActive && (
                                                <ChevronLeft size={14} className="text-white/80" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/[0.08] bg-slate-950/60 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
                    >
                        <div className="flex items-center gap-2.5">
                            <Home size={16} />
                            <span>معاينة الموقع الرئيسي</span>
                        </div>
                        <ExternalLink size={13} className="text-slate-500" />
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all"
                    >
                        <LogOut size={16} />
                        <span>تسجيل الخروج من الإدارة</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                />
            )}

            {/* Main Content Viewport */}
            <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
