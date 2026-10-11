"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface FooterProps {
    settings?: {
        siteName?: string;
        siteDescription?: string;
        logoUrl?: string | null;
        [key: string]: any;
    };
}

export default function Footer({ settings }: FooterProps) {
    const pathname = usePathname();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstall = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };
        window.addEventListener("beforeinstallprompt", handleBeforeInstall);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            alert("لتثبيت التطبيق على جهازك: اضغط على زر المشاركة أو الإعدادات في متصفحك ثم اختر 'إضافة إلى الشاشة الرئيسية' (Add to Home Screen)");
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setIsInstallable(false);
            setDeferredPrompt(null);
        }
    };

    // Do not render consumer footer on admin dashboard pages
    if (pathname.startsWith("/admin")) {
        return null;
    }

    const siteName = settings?.siteName || "أنمي دايز";
    const defaultLogoUrl = "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg";
    const logoUrl = settings?.logoUrl || defaultLogoUrl;
    const siteDescription = settings?.siteDescription || 
        "منصة البث السينمائية الأولى لعشاق الأنمي في العالم العربي. مكتبة حصرية تجمع بين روائع الجيل الذهبي وأحدث إصدارات الأنمي المترجمة والمدبلجة بجودة فائقة 4K.";

    return (
        <footer className="w-full bg-surface-container-lowest shadow-[0_-4px_24px_rgba(0,0,0,0.5)] pt-8 sm:pt-space-xl pb-8 sm:pb-space-lg border-t border-white/[0.05]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-gutter-lg pb-8 sm:pb-space-xl">
                    {/* Brand Info (2 Columns) */}
                    <div className="lg:col-span-2 flex flex-col gap-space-md">
                        <Link href="/" className="flex items-center gap-space-sm group" aria-label={siteName}>
                            <img
                                src={logoUrl}
                                alt={siteName}
                                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                            />
                            <div className="flex flex-col">
                                <span className="font-cairo font-black text-xl tracking-wide text-on-surface">
                                    {siteName}
                                </span>
                                <span className="font-label-sm text-label-sm text-secondary tracking-widest -mt-0.5">
                                    سبيس تون & أنمي كلاسيك
                                </span>
                            </div>
                        </Link>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
                            {siteDescription}
                        </p>
                        {/* Social / Media Links */}
                        <div className="flex items-center gap-space-sm pt-space-xs">
                            <a 
                                href="https://youtube.com" 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high transition-colors"
                                aria-label="يوتيوب"
                            >
                                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                            </a>
                            <a 
                                href="https://t.me" 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high transition-colors"
                                aria-label="تيليغرام"
                            >
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </a>
                            <a 
                                href="https://discord.com" 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high transition-colors"
                                aria-label="ديسكورد"
                            >
                                <span className="material-symbols-outlined text-[20px]">forum</span>
                            </a>
                            <a 
                                href="#" 
                                className="p-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high transition-colors"
                                aria-label="بودكاست"
                            >
                                <span className="material-symbols-outlined text-[20px]">podcasts</span>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Explore */}
                    <div className="flex flex-col gap-space-md">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            استكشف المنصة
                        </h4>
                        <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant">
                            <li className="hover:text-on-surface transition-colors">
                                <Link href="/animes">أحدث الحلقات المضافة</Link>
                            </li>
                            <li className="hover:text-on-surface transition-colors">
                                <Link href="/animes?genre=Action">كواكب الأكشن والمغامرة</Link>
                            </li>
                            <li className="hover:text-on-surface transition-colors">
                                <Link href="/animes?planet=spacetoon">الأعمال المدبلجة كلاسيك</Link>
                            </li>
                            <li className="hover:text-on-surface transition-colors">
                                <Link href="/animes?tab=schedule">جدول العرض الأسبوعي</Link>
                            </li>
                            <li className="hover:text-on-surface transition-colors">
                                <Link href="/pricing" className="text-secondary hover:text-secondary-fixed flex items-center gap-1 font-bold">
                                    <span>اشتراكات الدايزر VIP</span>
                                    <span className="bg-secondary-container text-on-secondary px-1.5 py-0.2 rounded text-[10px] font-bold">VIP</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Help & Support */}
                    <div className="flex flex-col gap-space-md">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            المساعدة والدعم
                        </h4>
                        <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant">
                            <li className="hover:text-on-surface transition-colors">
                                <Link href="/terms">مركز المساعدة والأسئلة الشائعة</Link>
                            </li>
                            <li className="hover:text-on-surface transition-colors">
                                <Link href="/terms">الأجهزة المدعومة (Smart TV)</Link>
                            </li>
                            <li className="hover:text-on-surface transition-colors">
                                <Link href="/terms">شروط الاستخدام والخصوصية</Link>
                            </li>
                            <li className="hover:text-on-surface transition-colors">
                                <Link href="/terms">تواصل مع فريق الدعم</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: PWA App Card */}
                    <div className="flex flex-col gap-space-md">
                        <h4 className="font-headline-sm text-headline-sm text-secondary font-bold">
                            تطبيق ANIME DAZE
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                            ثبّت التطبيق الآن على جهازك واستمتع بالمشاهدة بلا انقطاع وبدون اتصال بالإنترنت وتجربة شاشة كاملة.
                        </p>
                        <button 
                            onClick={handleInstallClick}
                            className="flex items-center justify-center gap-space-sm px-space-md py-space-sm rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm shadow-[0_4px_16px_rgba(220,38,38,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            <span>تثبيت التطبيق (PWA)</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Strip */}
                <div className="pt-space-lg border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-label-md text-label-md">
                    <p>© {new Date().getFullYear()} {siteName}. جميع الحقوق محفوظة لروائع الرسوم المتحركة وعشاق الأنمي في العالم العربي.</p>
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        <span className="text-on-surface font-medium">خوادم البث المباشر نشطة ومستقرة</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
