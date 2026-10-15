"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { navGroups } from "@/config/admin-nav.config";

interface AdminNavLinksProps {
    isCollapsed: boolean;
    onCloseMobile: () => void;
}

export function AdminNavLinks({ isCollapsed, onCloseMobile }: AdminNavLinksProps) {
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
                                    className={`shrink-0 transition-transform ${
                                        isActive ? "text-white" : "text-[#94a3b8] group-hover:text-white"
                                    }`}
                                />

                                {!isCollapsed && <span className="truncate">{item.label}</span>}

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
