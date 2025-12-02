"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [settings, setSettings] = useState({
        siteName: "سلام دانك",
        logoUrl: "",
    });

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

        fetchSettings();
    }, []);

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
                    <Link href="/episodes" className="hover:text-white transition-colors">
                        الحلقات
                    </Link>
                    <Link href="/characters" className="hover:text-white transition-colors">
                        الشخصيات
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <Search size={20} />
                    </button>
                    <Link
                        href="/episodes"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        شاهد الآن
                    </Link>
                </div>
            </div>
        </nav>
    );
}
