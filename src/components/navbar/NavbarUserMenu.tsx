"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { User as UserIcon, Crown, Bookmark, ShieldCheck, LogOut, LogIn, ChevronDown } from "lucide-react";

interface NavbarUserMenuProps {
    user: any;
    isUserMenuOpen: boolean;
    setIsUserMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    logout: () => void;
}

export function NavbarUserMenu({
    user,
    isUserMenuOpen,
    setIsUserMenuOpen,
    logout
}: NavbarUserMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        if (isUserMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isUserMenuOpen, setIsUserMenuOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-[#181820]/80 hover:bg-[#202028] border border-white/[0.06] hover:border-white/10 transition-all cursor-pointer focus-visible:outline-none"
                aria-label="قائمة المستخدم"
                aria-expanded={isUserMenuOpen}
            >
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0">
                    {user?.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt={user.name || "المستخدم"} 
                            className="w-full h-full object-cover" 
                        />
                    ) : user ? (
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] flex items-center justify-center text-white font-bold text-xs shadow-inner">
                            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
                        </div>
                    ) : (
                        <div className="w-full h-full rounded-full bg-[#1b1b1f] hover:bg-[#25252b] flex items-center justify-center text-[#e4e1e7] transition-colors">
                            <UserIcon size={16} />
                        </div>
                    )}

                    {/* VIP / Active Status Ring */}
                    {user && (
                        <span className="absolute bottom-0 left-0 w-2 h-2 bg-[#ee9800] rounded-full ring-2 ring-[#131317] shadow-[0_0_8px_rgba(238,152,0,0.8)]" />
                    )}
                </div>

                <ChevronDown 
                    size={14} 
                    className={`text-[#94a3b8] transition-transform duration-300 hidden sm:block ${
                        isUserMenuOpen ? "rotate-180 text-white" : ""
                    }`} 
                />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
                <div className="absolute left-0 mt-3 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-[#19191e]/98 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.9)] z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200">
                    {/* User Identity Header */}
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3 bg-white/[0.02]">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] flex items-center justify-center text-white font-bold text-xs shadow-md ring-2 ring-white/10 shrink-0">
                            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
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
                        <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-cairo font-semibold text-[#e4e1e7] hover:text-white hover:bg-white/[0.06] transition-colors group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-[#dc2626]/20 flex items-center justify-center text-[#94a3b8] group-hover:text-[#ffb4ab] transition-colors">
                                <UserIcon size={15} />
                            </div>
                            <span>ملف شخصي وتخصيص</span>
                        </Link>

                        <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-cairo font-semibold text-[#e4e1e7] hover:text-white hover:bg-white/[0.06] transition-colors group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-[#ffb95f]/20 flex items-center justify-center text-[#94a3b8] group-hover:text-[#ffb95f] transition-colors">
                                <Bookmark size={15} />
                            </div>
                            <span>قائمتي والمفضلة</span>
                        </Link>

                        <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-cairo font-semibold text-[#ffb4ab] hover:text-white hover:bg-white/[0.06] transition-colors group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-[#dc2626]/10 group-hover:bg-[#dc2626]/20 flex items-center justify-center text-[#dc2626] transition-colors">
                                <ShieldCheck size={15} />
                            </div>
                            <span>لوحة الإدارة</span>
                        </Link>
                    </div>

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
                                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-cairo font-semibold text-[#ffb4ab] hover:text-white hover:bg-[#dc2626]/20 transition-all text-right cursor-pointer"
                            >
                                <LogOut size={15} className="text-[#dc2626]" />
                                <span>تسجيل الخروج</span>
                            </button>
                        ) : (
                            <div className="flex flex-col gap-1">
                                <Link
                                    href="/login"
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-cairo font-bold text-white bg-[#dc2626] hover:brightness-110 shadow-[0_0_12px_rgba(220,38,38,0.4)] transition-all"
                                >
                                    <LogIn size={15} />
                                    <span>تسجيل الدخول</span>
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-cairo font-medium text-[#94a3b8] hover:text-[#e4e1e7] hover:bg-white/[0.04] transition-colors"
                                >
                                    <span>ليس لديك حساب؟ اشترك الآن</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
