"use client";

import Link from "next/link";
import { Search, User as UserIcon, LogOut, Settings, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import SearchModal from "@/components/SearchModal";

export default function Navbar() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        siteName: "سلام دانك",
        logoUrl: "",
    });
    const [user, setUser] = useState<User | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error("Failed to fetch user");
            }
        }

        fetchSettings();
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout failed");
        }
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt={settings.siteName} className="h-10 object-contain" />
                    ) : (
                        <span className="text-2xl font-bold text-red-600">{settings.siteName}</span>
                    )}
                </Link>

                <div className="hidden md:flex items-center gap-8 text-slate-300">
                    <Link href="/" className="hover:text-white transition-colors">
                        الرئيسية
                    </Link>
                    <Link href="/animes" className="hover:text-white transition-colors">
                        الأنمي
                    </Link>
                    <Link href="/characters" className="hover:text-white transition-colors">
                        الشخصيات
                    </Link>
                    <Link href="/pricing" className="text-yellow-500 hover:text-yellow-400 transition-colors font-bold flex items-center gap-1">
                        <Star size={18} className="fill-yellow-500" /> اشتراك مميز
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <Search size={20} />
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="text-slate-300 hover:text-white flex items-center gap-2"
                                >
                                    <Settings size={18} />
                                    <span className="hidden sm:inline">الإدارة</span>
                                </Link>
                            )}

                            <Link href="/profile" className="flex items-center gap-2 text-slate-300 hover:text-white">
                                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                                    {(user.name || user.email || "U")[0].toUpperCase()}
                                </div>
                                <span className="hidden sm:inline">{user.name || user.email}</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-slate-300 hover:text-white px-3 py-2 transition-colors"
                            >
                                دخول
                            </Link>
                            <Link
                                href="/register"
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                            >
                                تسجيل
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
}
