import React from "react";
import {
    LayoutDashboard,
    Tv,
    Users,
    Settings,
    User as UserIcon,
    CreditCard,
    Banknote,
    Smartphone,
    Sparkles,
    Layers,
    Film,
    Palette,
    Compass,
} from "lucide-react";

export interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    tab?: string;
    altMatch?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export const ADMIN_LOGO_URL =
    "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg";

export const navGroups: NavGroup[] = [
    {
        title: "المحتوى والوسائط",
        items: [
            { href: "/admin", label: "لوحة المؤشرات", icon: LayoutDashboard },
            { href: "/admin/animes", label: "مكتبة الأنمي والمواسم", icon: Tv },
            { href: "/admin/characters", label: "إدارة الشخصيات", icon: Users },
            { href: "/admin/planets", label: "إدارة كواكب الأنمي", icon: Compass },
        ],
    },
    {
        title: "تخصيص الواجهة والهوية",
        items: [
            { href: "/admin/settings?tab=home", label: "أقسام الصفحة الرئيسية", icon: Layers, tab: "home" },
            { href: "/admin/settings?tab=slider", label: "السلايدر السينمائي", icon: Film, tab: "slider", altMatch: "/admin/slider" },
            { href: "/admin/settings?tab=logo", label: "الشعار والمحاكاة", icon: Sparkles, tab: "logo" },
            { href: "/admin/settings?tab=identity", label: "الهوية والتسمية والألوان", icon: Palette, tab: "identity" },
        ],
    },
    {
        title: "المشتركون وباقات VIP",
        items: [
            { href: "/admin/users", label: "المشتركون والأعضاء", icon: UserIcon },
            { href: "/admin/plans", label: "خطط وباقات VIP", icon: CreditCard },
            { href: "/admin/payment-methods", label: "طرق الدفع والتحويل", icon: Banknote },
        ],
    },
    {
        title: "النظام والـ API",
        items: [
            { href: "/admin/api-app", label: "تطبيق الهاتف (API Core)", icon: Smartphone },
            { href: "/admin/settings?tab=system", label: "إعدادات المنصة و AdMob", icon: Settings, tab: "system" },
        ],
    },
];
