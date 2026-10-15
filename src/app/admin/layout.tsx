"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { ADMIN_LOGO_URL } from "@/config/admin-nav.config";
import {
    AdminMobileTopBar,
    AdminDesktopHeader,
    AdminSidebar,
} from "./components/layout";

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

    return (
        <div className="min-h-screen bg-[#0b0b0f] flex flex-col md:flex-row text-[#e4e1e7] font-tajawal" dir="rtl">
            {/* Mobile Top Bar & Overlay */}
            <AdminMobileTopBar
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                logoUrl={ADMIN_LOGO_URL}
            />

            {/* Fixed RTL Desktop Sidebar */}
            <AdminSidebar
                isCollapsed={isCollapsed}
                isMobileMenuOpen={isMobileMenuOpen}
                toggleSidebar={toggleSidebar}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
                onLogout={handleLogout}
                logoUrl={ADMIN_LOGO_URL}
            />

            {/* Main Admin Content Wrapper */}
            <div
                className={`flex-1 transition-all duration-300 ease-in-out min-h-screen flex flex-col min-w-0 overflow-x-hidden ${
                    isCollapsed ? "md:mr-20" : "md:mr-72"
                }`}
            >
                {/* Desktop Top Header Bar */}
                <AdminDesktopHeader
                    isCollapsed={isCollapsed}
                    toggleSidebar={toggleSidebar}
                    userName={user?.name}
                />

                {/* Main Dynamic View */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
