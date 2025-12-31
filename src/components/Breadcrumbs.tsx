"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
    customLabels?: Record<string, string>;
}

export default function Breadcrumbs({ customLabels = {} }: BreadcrumbsProps) {
    const pathname = usePathname();
    const paths = pathname.split("/").filter(path => path);

    if (pathname === "/") return null;

    // Map common paths to Arabic labels
    const defaultLabels: Record<string, string> = {
        animes: "قائمة الأنمي",
        characters: "الشخصيات",
        pricing: "الاشتراكات",
        profile: "الملف الشخصي",
        watch: "مشاهدة",
        admin: "لوحة التحكم",
        users: "المشتركين",
        settings: "الإعدادات",
        ...customLabels
    };

    return (
        <nav className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm">
            <Link
                href="/"
                className="text-slate-500 hover:text-white transition-colors flex items-center gap-1"
            >
                <Home size={14} />
                <span>الرئيسية</span>
            </Link>

            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join("/")}`;
                const isLast = index === paths.length - 1;
                const label = defaultLabels[path] || path;

                return (
                    <div key={path} className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-slate-700" />
                        {isLast ? (
                            <span className="text-red-500 font-bold">{label}</span>
                        ) : (
                            <Link
                                href={href}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
