"use client";

import React from "react";
import Link from "next/link";
import { X, User as UserIcon, ShieldCheck, LogOut, LogIn } from "lucide-react";

interface NavbarMobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    logout: () => void;
    logoUrl: string;
    siteName: string;
    navLinks: { label: string; href: string; isVip?: boolean }[];
    planetLinks: { name: string; href: string; badge: string; color: string }[];
    pathname: string;
}

export function NavbarMobileDrawer({
    isOpen,
    onClose,
    user,
    logout,
    logoUrl,
    siteName,
    navLinks,
    planetLinks,
    pathname
}: NavbarMobileDrawerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Overlay */}
            <div 
                className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer Content (Pinned Right in RTL) */}
            <div 
                className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-[#121217] border-l border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between p-5 overflow-y-auto no-scrollbar z-50 animate-in slide-in-from-right duration-300"
                dir="rtl"
            >
                {/* Drawer Header */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <Link 
                            href="/"
                            onClick={onClose}
                            className="flex items-center gap-2.5"
                        >
                            <img 
                                src={logoUrl} 
                                alt={siteName} 
                                className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" 
                            />
                            <div>
                                <span className="font-cairo font-black text-lg text-white block leading-tight">
                                    {siteName}
                                </span>
                                <span className="text-[9px] font-tajawal text-[#ffb95f] font-bold block">
                                    بوابة الأنمي وسبيستون
                                </span>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#1b1b1f] hover:bg-[#25252b] text-[#94a3b8] hover:text-white border border-white/5 cursor-pointer active:scale-95"
                            aria-label="إغلاق القائمة"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User Profile Mini Banner in Drawer */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-[#181820] to-[#1c1c24] border border-white/[0.05] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] flex items-center justify-center text-white font-bold text-sm shadow">
                                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-cairo font-bold text-xs text-white">
                                    {user?.name || "زائر المنصة"}
                                </span>
                                <span className="text-[10px] text-[#ffb95f] font-bold">
                                    {user ? "عضوية VIP مفعّلة" : "سجل الدخول للمتابعة"}
                                </span>
                            </div>
                        </div>

                        {!user && (
                            <Link
                                href="/login"
                                onClick={onClose}
                                className="min-h-[44px] px-4 rounded-xl bg-[#dc2626] text-white text-xs font-cairo font-bold hover:brightness-110 shadow flex items-center justify-center active:scale-95"
                            >
                                دخول
                            </Link>
                        )}
                    </div>

                    {/* Navigation Links in Drawer */}
                    <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-cairo font-bold text-[#94a3b8]/60 px-2 block">
                            أقسام المنصة
                        </span>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={onClose}
                                    className={`flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-cairo font-bold transition-all active:scale-98 ${
                                        isActive
                                            ? "bg-[#dc2626] text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                                            : "text-[#94a3b8] hover:text-[#e4e1e7] hover:bg-white/[0.04]"
                                    }`}
                                >
                                    <span>{link.label}</span>
                                    {link.isVip && (
                                        <span className="bg-[#ee9800] text-[#5b3800] text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                            VIP
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Spacetoon Planets Navigation */}
                    <div className="space-y-1.5 pt-2 border-t border-white/[0.05]">
                        <span className="text-[11px] font-cairo font-bold text-[#94a3b8]/60 px-2 block">
                            كواكب سبيستون الذهبية
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                            {planetLinks.map((planet) => (
                                <Link
                                    key={planet.name}
                                    href={planet.href}
                                    onClick={onClose}
                                    className="flex items-center gap-1.5 p-2 min-h-[44px] rounded-xl bg-[#181820]/80 hover:bg-[#20202a] border border-white/[0.03] text-xs font-cairo font-bold text-[#e4e1e7] transition-all active:scale-95"
                                >
                                    <span className="text-sm">{planet.badge}</span>
                                    <span className="truncate">{planet.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="pt-4 border-t border-white/[0.06] space-y-2 mt-4">
                    <Link
                        href="/admin"
                        onClick={onClose}
                        className="flex items-center justify-between px-3.5 py-2 min-h-[44px] rounded-xl bg-[#181820] text-xs font-cairo font-bold text-[#ffb4ab] hover:bg-[#dc2626]/20 transition-all border border-white/5 active:scale-98"
                    >
                        <span className="flex items-center gap-2">
                            <ShieldCheck size={16} className="text-[#dc2626]" />
                            <span>لوحة إدارة النظام</span>
                        </span>
                    </Link>

                    {user ? (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                logout();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#dc2626]/10 text-xs font-cairo font-bold text-[#ffb4ab] hover:bg-[#dc2626]/20 transition-all cursor-pointer active:scale-98"
                        >
                            <LogOut size={16} className="text-[#dc2626]" />
                            <span>تسجيل الخروج</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={onClose}
                            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#dc2626] text-white text-xs font-cairo font-bold hover:brightness-110 shadow-[0_0_12px_rgba(220,38,38,0.4)] transition-all active:scale-98"
                        >
                            <LogIn size={16} />
                            <span>تسجيل الدخول إلى حسابك</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
