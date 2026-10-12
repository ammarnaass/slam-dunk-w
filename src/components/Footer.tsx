"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FooterConfig } from "@/server/types/settings.types";
import { DEFAULT_FOOTER_CONFIG } from "@/lib/footer-presets";

interface FooterProps {
    settings?: {
        siteName?: string;
        siteDescription?: string;
        logoUrl?: string | null;
        footer?: FooterConfig;
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

    // Resilient fallback merging with presets
    const rawFooter = settings?.footer;
    const footerConfig: FooterConfig = {
        subtitle: rawFooter?.subtitle ?? DEFAULT_FOOTER_CONFIG.subtitle,
        description: rawFooter?.description || settings?.siteDescription || DEFAULT_FOOTER_CONFIG.description,
        socialLinks: Array.isArray(rawFooter?.socialLinks) && rawFooter.socialLinks.length > 0
            ? rawFooter.socialLinks
            : DEFAULT_FOOTER_CONFIG.socialLinks,
        exploreTitle: rawFooter?.exploreTitle || DEFAULT_FOOTER_CONFIG.exploreTitle,
        exploreLinks: Array.isArray(rawFooter?.exploreLinks) && rawFooter.exploreLinks.length > 0
            ? rawFooter.exploreLinks
            : DEFAULT_FOOTER_CONFIG.exploreLinks,
        helpTitle: rawFooter?.helpTitle || DEFAULT_FOOTER_CONFIG.helpTitle,
        helpLinks: Array.isArray(rawFooter?.helpLinks) && rawFooter.helpLinks.length > 0
            ? rawFooter.helpLinks
            : DEFAULT_FOOTER_CONFIG.helpLinks,
        appCardTitle: rawFooter?.appCardTitle || DEFAULT_FOOTER_CONFIG.appCardTitle,
        appCardDescription: rawFooter?.appCardDescription || DEFAULT_FOOTER_CONFIG.appCardDescription,
        appCardButtonText: rawFooter?.appCardButtonText || DEFAULT_FOOTER_CONFIG.appCardButtonText,
        appCardButtonIcon: rawFooter?.appCardButtonIcon || DEFAULT_FOOTER_CONFIG.appCardButtonIcon,
        isAppCardEnabled: rawFooter?.isAppCardEnabled ?? DEFAULT_FOOTER_CONFIG.isAppCardEnabled,
        copyrightText: rawFooter?.copyrightText || DEFAULT_FOOTER_CONFIG.copyrightText,
        serverStatusText: rawFooter?.serverStatusText ?? DEFAULT_FOOTER_CONFIG.serverStatusText,
        isStatusIndicatorActive: rawFooter?.isStatusIndicatorActive ?? DEFAULT_FOOTER_CONFIG.isStatusIndicatorActive,
    };

    const isAppCardVisible = footerConfig.isAppCardEnabled !== false;
    const activeSocialLinks = (footerConfig.socialLinks || []).filter(item => item.isEnabled !== false);

    const formatCopyright = (text: string) => {
        if (!text) return `© ${new Date().getFullYear()} ${siteName}. جميع الحقوق محفوظة.`;
        if (text.startsWith("©")) return text.replace("{year}", new Date().getFullYear().toString());
        return `© ${new Date().getFullYear()} ${siteName}. ${text.replace("{year}", new Date().getFullYear().toString())}`;
    };

    return (
        <footer className="w-full bg-surface-container-lowest shadow-[0_-4px_24px_rgba(0,0,0,0.5)] pt-8 sm:pt-space-xl pb-8 sm:pb-space-lg border-t border-white/[0.05]" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-1 md:grid-cols-2 ${isAppCardVisible ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-8 lg:gap-gutter-lg pb-8 sm:pb-space-xl`}>
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
                                {footerConfig.subtitle && (
                                    <span className="font-label-sm text-label-sm text-secondary tracking-widest -mt-0.5">
                                        {footerConfig.subtitle}
                                    </span>
                                )}
                            </div>
                        </Link>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
                            {footerConfig.description}
                        </p>

                        {/* Dynamic Social / Media Links */}
                        {activeSocialLinks.length > 0 && (
                            <div className="flex items-center gap-space-sm pt-space-xs flex-wrap">
                                {activeSocialLinks.map((s) => {
                                    const isExternal = s.url.startsWith("http");
                                    return (
                                        <a
                                            key={s.id}
                                            href={s.url || "#"}
                                            target={isExternal ? "_blank" : undefined}
                                            rel={isExternal ? "noreferrer" : undefined}
                                            className="p-space-sm rounded-lg bg-surface-container text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high transition-colors"
                                            aria-label={s.name}
                                            title={s.name}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{s.icon || "share"}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Column 2: Explore */}
                    <div className="flex flex-col gap-space-md">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            {footerConfig.exploreTitle}
                        </h4>
                        <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant">
                            {(footerConfig.exploreLinks || []).map((link) => {
                                const isExternal = link.href.startsWith("http");
                                return (
                                    <li key={link.id} className="hover:text-on-surface transition-colors">
                                        {link.isVip ? (
                                            <Link href={link.href} className="text-secondary hover:text-secondary-fixed flex items-center gap-1.5 font-bold">
                                                <span>{link.label}</span>
                                                <span className="bg-secondary-container text-on-secondary px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider">VIP</span>
                                            </Link>
                                        ) : isExternal ? (
                                            <a href={link.href} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                                                <span>{link.label}</span>
                                            </a>
                                        ) : (
                                            <Link href={link.href}>{link.label}</Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Column 3: Help & Support */}
                    <div className="flex flex-col gap-space-md">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            {footerConfig.helpTitle}
                        </h4>
                        <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant">
                            {(footerConfig.helpLinks || []).map((link) => {
                                const isExternal = link.href.startsWith("http");
                                return (
                                    <li key={link.id} className="hover:text-on-surface transition-colors">
                                        {isExternal ? (
                                            <a href={link.href} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                                                <span>{link.label}</span>
                                            </a>
                                        ) : (
                                            <Link href={link.href}>{link.label}</Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Column 4: PWA App Card */}
                    {isAppCardVisible && (
                        <div className="flex flex-col gap-space-md">
                            <h4 className="font-headline-sm text-headline-sm text-secondary font-bold">
                                {footerConfig.appCardTitle}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                {footerConfig.appCardDescription}
                            </p>
                            <button 
                                onClick={handleInstallClick}
                                className="flex items-center justify-center gap-space-sm px-space-md py-space-sm rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm shadow-[0_4px_16px_rgba(220,38,38,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">{footerConfig.appCardButtonIcon || "download"}</span>
                                <span>{footerConfig.appCardButtonText}</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Strip */}
                <div className="pt-space-lg border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-label-md text-label-md">
                    <p>{formatCopyright(footerConfig.copyrightText)}</p>
                    {footerConfig.serverStatusText && (
                        <div className="flex items-center gap-2">
                            {footerConfig.isStatusIndicatorActive && (
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            )}
                            <span className="text-on-surface font-medium">{footerConfig.serverStatusText}</span>
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
