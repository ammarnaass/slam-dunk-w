"use client";

import { 
    AlertTriangle, 
    Share2, 
    Smartphone, 
    Coins, 
    Facebook, 
    Twitter, 
    Instagram, 
    Youtube, 
    Send, 
    MessageSquare,
    ShieldAlert
} from "lucide-react";
import { SiteSocialLinks, SiteAdmobConfig } from "@/server/types/settings.types";

interface SystemStatusCardProps {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    currency: string;
    socialLinks: SiteSocialLinks;
    admob: SiteAdmobConfig;
    onChangeField: (field: string, value: any) => void;
    onChangeSocial: (platform: string, value: string) => void;
    onChangeAdmob: (field: string, value: any) => void;
}

export default function SystemStatusCard({
    maintenanceMode,
    maintenanceMessage,
    currency,
    socialLinks,
    admob,
    onChangeField,
    onChangeSocial,
    onChangeAdmob
}: SystemStatusCardProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Maintenance Mode & Currency Card */}
            <div className="bg-[#131317] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h3 className="font-cairo font-bold text-base text-white">حالة المنظومة ونمط الصيانة</h3>
                            <p className="font-tajawal text-xs text-[#94a3b8]">التحكم في إتاحة المنصة للزوار وعملة العرض</p>
                        </div>
                    </div>

                    {/* Maintenance Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <span className={`font-cairo text-xs font-bold ${maintenanceMode ? "text-amber-400" : "text-[#94a3b8]"}`}>
                            {maintenanceMode ? "وضع الصيانة مفعّل" : "المنصة متاحة للجميع"}
                        </span>
                        <div className="relative inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={maintenanceMode}
                                onChange={(e) => onChangeField("maintenanceMode", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[#1a1a22] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        </div>
                    </label>
                </div>

                {/* Maintenance Warning if Enabled */}
                {maintenanceMode && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-amber-300 text-xs font-tajawal">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-400" />
                        <div>
                            <span className="font-bold block font-cairo text-amber-200">تنبيه وضع الصيانة مفعل!</span>
                            الزوار العاديون سيرون رسالة الصيانة المقررة أدناه ولن يتمكنوا من مشاهدة الحلقات حتى يتم إلغاء التفعيل. سيبقى المشرفون قادرين على استخدام لوحة الإدارة.
                        </div>
                    </div>
                )}

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Maintenance message */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="font-cairo font-bold text-xs text-white">رسالة الصيانة (تظهر للزوار عند التفعيل)</label>
                        <input
                            type="text"
                            value={maintenanceMessage || ""}
                            onChange={(e) => onChangeField("maintenanceMessage", e.target.value)}
                            placeholder="المنصة تخضع للتحديث حالياً، سنعود قريباً..."
                            className="bg-[#0e0e12] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-amber-500 font-tajawal"
                        />
                    </div>

                    {/* Currency */}
                    <div className="flex flex-col gap-2">
                        <label className="font-cairo font-bold text-xs text-white flex items-center gap-1.5">
                            <Coins size={14} className="text-[#ffb95f]" />
                            <span>رمز العملة</span>
                        </label>
                        <input
                            type="text"
                            value={currency || "ج.م"}
                            onChange={(e) => onChangeField("currency", e.target.value)}
                            placeholder="ج.م"
                            className="bg-[#0e0e12] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#dc2626] font-cairo font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Social Media Links Card */}
            <div className="bg-[#131317] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Share2 size={20} />
                    </div>
                    <div>
                        <h3 className="font-cairo font-bold text-base text-white">روابط التواصل الاجتماعي</h3>
                        <p className="font-tajawal text-xs text-[#94a3b8]">الروابط التي تظهر في تذييل الموقع وصفحات التواصل</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Facebook */}
                    <div className="flex items-center gap-3 bg-[#0e0e12] border border-white/[0.08] rounded-xl px-4 py-2.5 focus-within:border-blue-500 transition-colors">
                        <Facebook size={18} className="text-blue-500 shrink-0" />
                        <input
                            type="text"
                            value={socialLinks?.facebook || ""}
                            onChange={(e) => onChangeSocial("facebook", e.target.value)}
                            placeholder="https://facebook.com/..."
                            className="bg-transparent border-none outline-none text-white text-xs font-mono flex-1 placeholder-[#94a3b8]/40"
                            dir="ltr"
                        />
                    </div>

                    {/* Twitter / X */}
                    <div className="flex items-center gap-3 bg-[#0e0e12] border border-white/[0.08] rounded-xl px-4 py-2.5 focus-within:border-sky-400 transition-colors">
                        <Twitter size={18} className="text-sky-400 shrink-0" />
                        <input
                            type="text"
                            value={socialLinks?.twitter || ""}
                            onChange={(e) => onChangeSocial("twitter", e.target.value)}
                            placeholder="https://twitter.com/..."
                            className="bg-transparent border-none outline-none text-white text-xs font-mono flex-1 placeholder-[#94a3b8]/40"
                            dir="ltr"
                        />
                    </div>

                    {/* Instagram */}
                    <div className="flex items-center gap-3 bg-[#0e0e12] border border-white/[0.08] rounded-xl px-4 py-2.5 focus-within:border-pink-500 transition-colors">
                        <Instagram size={18} className="text-pink-500 shrink-0" />
                        <input
                            type="text"
                            value={socialLinks?.instagram || ""}
                            onChange={(e) => onChangeSocial("instagram", e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="bg-transparent border-none outline-none text-white text-xs font-mono flex-1 placeholder-[#94a3b8]/40"
                            dir="ltr"
                        />
                    </div>

                    {/* YouTube */}
                    <div className="flex items-center gap-3 bg-[#0e0e12] border border-white/[0.08] rounded-xl px-4 py-2.5 focus-within:border-red-600 transition-colors">
                        <Youtube size={18} className="text-red-500 shrink-0" />
                        <input
                            type="text"
                            value={socialLinks?.youtube || ""}
                            onChange={(e) => onChangeSocial("youtube", e.target.value)}
                            placeholder="https://youtube.com/..."
                            className="bg-transparent border-none outline-none text-white text-xs font-mono flex-1 placeholder-[#94a3b8]/40"
                            dir="ltr"
                        />
                    </div>

                    {/* Telegram */}
                    <div className="flex items-center gap-3 bg-[#0e0e12] border border-white/[0.08] rounded-xl px-4 py-2.5 focus-within:border-sky-500 transition-colors">
                        <Send size={18} className="text-sky-500 shrink-0" />
                        <input
                            type="text"
                            value={socialLinks?.telegram || ""}
                            onChange={(e) => onChangeSocial("telegram", e.target.value)}
                            placeholder="https://t.me/..."
                            className="bg-transparent border-none outline-none text-white text-xs font-mono flex-1 placeholder-[#94a3b8]/40"
                            dir="ltr"
                        />
                    </div>

                    {/* Discord */}
                    <div className="flex items-center gap-3 bg-[#0e0e12] border border-white/[0.08] rounded-xl px-4 py-2.5 focus-within:border-indigo-500 transition-colors">
                        <MessageSquare size={18} className="text-indigo-400 shrink-0" />
                        <input
                            type="text"
                            value={socialLinks?.discord || ""}
                            onChange={(e) => onChangeSocial("discord", e.target.value)}
                            placeholder="https://discord.gg/..."
                            className="bg-transparent border-none outline-none text-white text-xs font-mono flex-1 placeholder-[#94a3b8]/40"
                            dir="ltr"
                        />
                    </div>
                </div>
            </div>

            {/* Android AdMob Configuration */}
            <div className="bg-[#131317] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <h3 className="font-cairo font-bold text-base text-white">إعلانات AdMob (تطبيق الأندرويد)</h3>
                            <p className="font-tajawal text-xs text-[#94a3b8]">التحكم في معرّفات إعلانات جوجل لتطبيق الهاتف</p>
                        </div>
                    </div>

                    {/* AdMob Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <span className={`font-cairo text-xs font-bold ${admob?.isEnabled ? "text-emerald-400" : "text-[#94a3b8]"}`}>
                            {admob?.isEnabled ? "الإعلانات مفعّلة" : "الإعلانات متوقفة"}
                        </span>
                        <div className="relative inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={!!admob?.isEnabled}
                                onChange={(e) => onChangeAdmob("isEnabled", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[#1a1a22] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </div>
                    </label>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity ${admob?.isEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                    <div className="flex flex-col gap-2">
                        <label className="font-cairo font-bold text-xs text-white">App ID</label>
                        <input
                            type="text"
                            value={admob?.appId || ""}
                            onChange={(e) => onChangeAdmob("appId", e.target.value)}
                            placeholder="ca-app-pub-xxxxxxxx~xxxxxxxx"
                            className="bg-[#0e0e12] border border-white/[0.1] rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                            dir="ltr"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-cairo font-bold text-xs text-white">Banner Unit ID</label>
                        <input
                            type="text"
                            value={admob?.bannerId || ""}
                            onChange={(e) => onChangeAdmob("bannerId", e.target.value)}
                            placeholder="ca-app-pub-xxxxxxxx/xxxxxxxx"
                            className="bg-[#0e0e12] border border-white/[0.1] rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                            dir="ltr"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-cairo font-bold text-xs text-white">Interstitial Unit ID</label>
                        <input
                            type="text"
                            value={admob?.interstitialId || ""}
                            onChange={(e) => onChangeAdmob("interstitialId", e.target.value)}
                            placeholder="ca-app-pub-xxxxxxxx/xxxxxxxx"
                            className="bg-[#0e0e12] border border-white/[0.1] rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                            dir="ltr"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
