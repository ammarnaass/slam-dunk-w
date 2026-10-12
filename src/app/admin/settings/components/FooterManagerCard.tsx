"use client";

import { useState } from "react";
import { 
    LayoutTemplate, 
    RotateCcw, 
    Plus, 
    Trash2, 
    Link as LinkIcon, 
    Share2, 
    HelpCircle, 
    Compass, 
    Smartphone, 
    Eye, 
    Activity, 
    Crown,
    ExternalLink
} from "lucide-react";
import { FooterConfig, FooterLinkItem, FooterSocialItem } from "@/server/types/settings.types";
import { DEFAULT_FOOTER_CONFIG } from "@/lib/footer-presets";

interface FooterManagerCardProps {
    footer?: FooterConfig;
    onChange: (updated: FooterConfig) => void;
    siteName?: string;
    logoUrl?: string;
}

export default function FooterManagerCard({ 
    footer, 
    onChange,
    siteName = "أنمي دايز",
    logoUrl = "/logo.png"
}: FooterManagerCardProps) {
    const data: FooterConfig = footer || DEFAULT_FOOTER_CONFIG;
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

    const updateField = <K extends keyof FooterConfig>(field: K, value: FooterConfig[K]) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    // Social Links Helpers
    const updateSocial = (id: string, field: keyof FooterSocialItem, value: any) => {
        const next = (data.socialLinks || []).map((s) => 
            s.id === id ? { ...s, [field]: value } : s
        );
        updateField("socialLinks", next);
    };

    // Explore Links Helpers
    const updateExploreLink = (id: string, field: keyof FooterLinkItem, value: any) => {
        const next = (data.exploreLinks || []).map((item) => 
            item.id === id ? { ...item, [field]: value } : item
        );
        updateField("exploreLinks", next);
    };

    const addExploreLink = () => {
        const newItem: FooterLinkItem = {
            id: `exp-${Date.now()}`,
            label: "رابط جديد",
            href: "/animes",
            isVip: false
        };
        updateField("exploreLinks", [...(data.exploreLinks || []), newItem]);
    };

    const removeExploreLink = (id: string) => {
        updateField("exploreLinks", (data.exploreLinks || []).filter(item => item.id !== id));
    };

    // Help Links Helpers
    const updateHelpLink = (id: string, field: keyof FooterLinkItem, value: any) => {
        const next = (data.helpLinks || []).map((item) => 
            item.id === id ? { ...item, [field]: value } : item
        );
        updateField("helpLinks", next);
    };

    const addHelpLink = () => {
        const newItem: FooterLinkItem = {
            id: `hlp-${Date.now()}`,
            label: "رابط مساعدة جديد",
            href: "/terms"
        };
        updateField("helpLinks", [...(data.helpLinks || []), newItem]);
    };

    const removeHelpLink = (id: string) => {
        updateField("helpLinks", (data.helpLinks || []).filter(item => item.id !== id));
    };

    const handleResetDefaults = () => {
        if (!confirm("هل أنت متأكد من استعادة كافة نصوص وروابط الشريط السفلي الافتراضية؟")) return;
        onChange(DEFAULT_FOOTER_CONFIG);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-[#181820]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] p-0.5 shadow-lg shadow-red-950/50 shrink-0">
                        <div className="w-full h-full bg-[#131317] rounded-[14px] flex items-center justify-center text-[#ffb4ab]">
                            <LayoutTemplate size={24} />
                        </div>
                    </div>
                    <div>
                        <h2 className="font-cairo font-black text-lg sm:text-xl text-white">
                            إدارة الشريط السفلي (Footer)
                        </h2>
                        <p className="font-tajawal text-xs text-[#94a3b8] mt-0.5">
                            التحكم الكامل في نصوص وأعمدة وروابط الشريط السفلي، شبكات التواصل، وبطاقة التطبيق
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer self-end sm:self-auto"
                    title="استرجاع نصوص وروابط الفوتر الافتراضية"
                >
                    <RotateCcw size={14} className="text-[#ffb95f]" />
                    <span>استعادة الافتراضي</span>
                </button>
            </div>

            {/* Main Form & Simulator Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Controls (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Section 1: Brand Subtitle & Description */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                            <Compass size={18} className="text-[#dc2626]" />
                            <h3 className="font-cairo font-bold text-white text-sm">هوية الشريط السفلي والنص الوصفي</h3>
                        </div>

                        <div>
                            <label className="block font-cairo font-bold text-xs text-[#e4e1e7] mb-1.5">
                                العنوان الفرعي أسفل الشعار
                            </label>
                            <input
                                type="text"
                                value={data.subtitle}
                                onChange={(e) => updateField("subtitle", e.target.value)}
                                placeholder="مثال: سبيس تون & أنمي كلاسيك"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626] transition-colors"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block font-cairo font-bold text-xs text-[#e4e1e7]">
                                    النص التعريفي في الشريط السفلي
                                </label>
                                <span className="text-[10px] text-[#94a3b8] font-mono">
                                    {data.description.length} حرفاً
                                </span>
                            </div>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                placeholder="منصة البث السينمائية الأولى لعشاق الأنمي..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white leading-relaxed focus:outline-none focus:border-[#dc2626] transition-colors resize-none"
                            />
                        </div>

                        {/* Social Links Manager */}
                        <div className="pt-3 border-t border-white/[0.05] space-y-3">
                            <div className="flex items-center gap-2">
                                <Share2 size={16} className="text-[#ffb95f]" />
                                <span className="font-cairo font-bold text-xs text-white">روابط التواصل والبودكاست</span>
                            </div>
                            <div className="space-y-2">
                                {(data.socialLinks || []).map((social) => (
                                    <div key={social.id} className="p-3 rounded-2xl bg-[#131317] border border-white/5 flex items-center gap-3">
                                        <div className="flex items-center gap-2 w-28 shrink-0">
                                            <input
                                                type="checkbox"
                                                id={`soc-en-${social.id}`}
                                                checked={social.isEnabled}
                                                onChange={(e) => updateSocial(social.id, "isEnabled", e.target.checked)}
                                                className="rounded bg-[#1f1f23] border-white/10 text-red-600 focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor={`soc-en-${social.id}`} className="font-cairo font-bold text-xs text-[#e4e1e7] flex items-center gap-1 cursor-pointer">
                                                <span className="material-symbols-outlined text-sm text-[#ffb95f]">{social.icon}</span>
                                                <span className="truncate">{social.name}</span>
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            value={social.url}
                                            onChange={(e) => updateSocial(social.id, "url", e.target.value)}
                                            placeholder="https://..."
                                            disabled={!social.isEnabled}
                                            className="flex-1 px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-mono text-white disabled:opacity-30 focus:outline-none focus:border-[#dc2626]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Explore Column Links */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <LinkIcon size={18} className="text-[#dc2626]" />
                                <h3 className="font-cairo font-bold text-white text-sm">عمود: {data.exploreTitle}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addExploreLink}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-cairo font-bold transition-colors cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>إضافة رابط</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-[11px] font-cairo font-bold text-[#94a3b8] mb-1">عنوان العمود</label>
                            <input
                                type="text"
                                value={data.exploreTitle}
                                onChange={(e) => updateField("exploreTitle", e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>

                        <div className="space-y-2.5 pt-2">
                            {(data.exploreLinks || []).map((link) => (
                                <div key={link.id} className="p-3 rounded-2xl bg-[#131317] border border-white/5 flex items-center gap-2.5">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={link.label}
                                            onChange={(e) => updateExploreLink(link.id, "label", e.target.value)}
                                            placeholder="نص الرابط"
                                            className="px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                                        />
                                        <input
                                            type="text"
                                            value={link.href}
                                            onChange={(e) => updateExploreLink(link.id, "href", e.target.value)}
                                            placeholder="/animes..."
                                            className="px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                        />
                                    </div>
                                    <label className="flex items-center gap-1 text-[11px] font-cairo text-[#ffb95f] px-2 py-1 rounded-lg bg-[#ffb95f]/10 cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={!!link.isVip}
                                            onChange={(e) => updateExploreLink(link.id, "isVip", e.target.checked)}
                                            className="rounded bg-[#1f1f23] text-amber-500 focus:ring-0"
                                        />
                                        <span>VIP</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeExploreLink(link.id)}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer shrink-0"
                                        title="حذف الرابط"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Help & Support Links */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <HelpCircle size={18} className="text-[#ffb95f]" />
                                <h3 className="font-cairo font-bold text-white text-sm">عمود: {data.helpTitle}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addHelpLink}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-cairo font-bold transition-colors cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>إضافة رابط</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-[11px] font-cairo font-bold text-[#94a3b8] mb-1">عنوان العمود</label>
                            <input
                                type="text"
                                value={data.helpTitle}
                                onChange={(e) => updateField("helpTitle", e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>

                        <div className="space-y-2.5 pt-2">
                            {(data.helpLinks || []).map((link) => (
                                <div key={link.id} className="p-3 rounded-2xl bg-[#131317] border border-white/5 flex items-center gap-2.5">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={link.label}
                                            onChange={(e) => updateHelpLink(link.id, "label", e.target.value)}
                                            placeholder="نص الرابط"
                                            className="px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                                        />
                                        <input
                                            type="text"
                                            value={link.href}
                                            onChange={(e) => updateHelpLink(link.id, "href", e.target.value)}
                                            placeholder="/terms..."
                                            className="px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeHelpLink(link.id)}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer shrink-0"
                                        title="حذف الرابط"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: PWA App Card & Bottom Strip */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <Smartphone size={18} className="text-[#dc2626]" />
                                <h3 className="font-cairo font-bold text-white text-sm">بطاقة تطبيق PWA في الشريط السفلي</h3>
                            </div>
                            <label className="flex items-center gap-2 text-xs font-cairo font-bold text-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.isAppCardEnabled}
                                    onChange={(e) => updateField("isAppCardEnabled", e.target.checked)}
                                    className="rounded bg-[#1f1f23] text-red-600 focus:ring-0"
                                />
                                <span>إظهار بطاقة التطبيق</span>
                            </label>
                        </div>

                        {data.isAppCardEnabled && (
                            <div className="space-y-3.5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">عنوان البطاقة</label>
                                        <input
                                            type="text"
                                            value={data.appCardTitle}
                                            onChange={(e) => updateField("appCardTitle", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">نص زر التثبيت</label>
                                        <input
                                            type="text"
                                            value={data.appCardButtonText}
                                            onChange={(e) => updateField("appCardButtonText", e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">الوصف المختصر</label>
                                    <textarea
                                        rows={2}
                                        value={data.appCardDescription}
                                        onChange={(e) => updateField("appCardDescription", e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white leading-relaxed focus:outline-none focus:border-[#dc2626] resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bottom Copyright & Status */}
                        <div className="pt-4 border-t border-white/[0.06] space-y-3">
                            <div className="flex items-center gap-2">
                                <Activity size={16} className="text-emerald-400" />
                                <span className="font-cairo font-bold text-xs text-white">شريط الحقوق وحالة الخوادم</span>
                            </div>

                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">نص حقوق الملكية والنشر</label>
                                <input
                                    type="text"
                                    value={data.copyrightText}
                                    onChange={(e) => updateField("copyrightText", e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">نص حالة الخوادم المباشرة</label>
                                    <input
                                        type="text"
                                        value={data.serverStatusText}
                                        onChange={(e) => updateField("serverStatusText", e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                                    />
                                </div>
                                <label className="flex items-center gap-1.5 text-xs font-cairo font-bold text-emerald-400 mt-5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.isStatusIndicatorActive}
                                        onChange={(e) => updateField("isStatusIndicatorActive", e.target.checked)}
                                        className="rounded bg-[#1f1f23] text-emerald-600 focus:ring-0"
                                    />
                                    <span>نقطة خضراء نابضة</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Simulator Preview (5 Cols Sticky) */}
                <div className="lg:col-span-5 sticky top-24 space-y-4">
                    <div className="p-4 rounded-3xl bg-[#181820]/95 border border-white/[0.08] shadow-2xl backdrop-blur-2xl">
                        {/* Simulator Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-[#ffb95f]" />
                                <span className="font-cairo font-bold text-xs text-white">المعاينة الحية للشريط السفلي</span>
                            </div>
                            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#131317] border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice("desktop")}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-cairo font-bold transition-all ${
                                        previewDevice === "desktop" ? "bg-[#dc2626] text-white" : "text-[#94a3b8]"
                                    }`}
                                >
                                    حاسوب
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewDevice("mobile")}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-cairo font-bold transition-all ${
                                        previewDevice === "mobile" ? "bg-[#dc2626] text-white" : "text-[#94a3b8]"
                                    }`}
                                >
                                    هاتف
                                </button>
                            </div>
                        </div>

                        {/* Simulated Canvas */}
                        <div className="rounded-2xl bg-[#0c0c10] border border-white/[0.08] p-4 text-right space-y-5 overflow-hidden text-xs shadow-inner" dir="rtl">
                            {/* Brand Header */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-red-600/30 flex items-center justify-center text-red-500 font-bold text-[10px]">
                                        AD
                                    </div>
                                    <div>
                                        <span className="font-cairo font-black text-xs text-white block leading-tight">{siteName}</span>
                                        <span className="text-[9px] font-tajawal text-[#ffb95f] font-bold block">{data.subtitle}</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-[#94a3b8] leading-relaxed line-clamp-2">
                                    {data.description}
                                </p>
                                <div className="flex items-center gap-1.5 pt-1">
                                    {(data.socialLinks || []).filter(s => s.isEnabled).map((soc) => (
                                        <span key={soc.id} className="p-1 rounded-md bg-white/[0.05] text-[#ffb95f] material-symbols-outlined text-xs">
                                            {soc.icon}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Two Columns Grid */}
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.05]">
                                <div>
                                    <span className="font-cairo font-bold text-[11px] text-white block mb-1.5">{data.exploreTitle}</span>
                                    <ul className="space-y-1 text-[10px] text-[#94a3b8]">
                                        {(data.exploreLinks || []).slice(0, 4).map(l => (
                                            <li key={l.id} className="truncate flex items-center gap-1">
                                                <span>• {l.label}</span>
                                                {l.isVip && <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1 rounded">VIP</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <span className="font-cairo font-bold text-[11px] text-white block mb-1.5">{data.helpTitle}</span>
                                    <ul className="space-y-1 text-[10px] text-[#94a3b8]">
                                        {(data.helpLinks || []).slice(0, 4).map(l => (
                                            <li key={l.id} className="truncate">• {l.label}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* PWA Card Simulation */}
                            {data.isAppCardEnabled && (
                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                                    <span className="font-cairo font-bold text-[10px] text-[#ffb95f] block">{data.appCardTitle}</span>
                                    <p className="text-[9px] text-[#94a3b8] line-clamp-2 leading-tight">{data.appCardDescription}</p>
                                    <div className="w-full py-1 rounded-lg bg-[#dc2626] text-white text-[10px] font-cairo font-bold text-center flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined text-[11px]">{data.appCardButtonIcon}</span>
                                        <span>{data.appCardButtonText}</span>
                                    </div>
                                </div>
                            )}

                            {/* Bottom Strip Simulation */}
                            <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between gap-2 text-[9px] text-[#94a3b8]">
                                <span className="truncate">© {new Date().getFullYear()} {siteName}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                    {data.isStatusIndicatorActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    )}
                                    <span className="text-[8px] text-slate-400">{data.serverStatusText}</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] text-center text-[#94a3b8] font-tajawal mt-3">
                            💡 تذكر الضغط على زر <strong className="text-white">"حفظ التغييرات"</strong> في أسفل الصفحة بعد الانتهاء.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
