"use client";

import { useState } from "react";
import { 
    Image as ImageIcon, 
    Upload, 
    Link as LinkIcon, 
    RotateCcw, 
    Check, 
    Eye, 
    Sparkles, 
    AlertCircle 
} from "lucide-react";

interface LogoManagerCardProps {
    logoUrl: string;
    faviconUrl: string;
    siteName: string;
    onChangeLogo: (url: string) => void;
    onChangeFavicon: (url: string) => void;
    onResetDefault: () => void;
}

const OFFICIAL_LOGO_URL = "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg";

export default function LogoManagerCard({
    logoUrl,
    faviconUrl,
    siteName,
    onChangeLogo,
    onChangeFavicon,
    onResetDefault
}: LogoManagerCardProps) {
    const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
    const [urlInput, setUrlInput] = useState(logoUrl || "");
    const [previewTab, setPreviewTab] = useState<"navbar" | "sidebar">("navbar");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("حجم الملف كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت.");
            return;
        }

        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            onChangeLogo(result);
            setIsProcessing(false);
        };
        reader.onerror = () => {
            alert("تعذر قراءة ملف الصورة.");
            setIsProcessing(false);
        };
        reader.readAsDataURL(file);
    };

    const handleUrlApply = () => {
        if (!urlInput.trim()) return;
        onChangeLogo(urlInput.trim());
    };

    const currentLogo = logoUrl || OFFICIAL_LOGO_URL;

    return (
        <div className="bg-[#131317] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#ffb4ab]">
                        <ImageIcon size={20} />
                    </div>
                    <div>
                        <h3 className="font-cairo font-bold text-base text-white">إدارة الشعار والأيقونة</h3>
                        <p className="font-tajawal text-xs text-[#94a3b8]">تحكم في الشعار الرسمي وأيقونة المتصفح مع معاينة مباشرة في الهيدر والكونسول</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onResetDefault}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#ffb95f] text-xs font-cairo font-bold border border-[#ffb95f]/20 transition-all cursor-pointer"
                >
                    <RotateCcw size={13} />
                    <span>استعادة الشعار الرسمي المعتمد</span>
                </button>
            </div>

            {/* Input Selection: Upload vs URL */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 bg-[#0e0e12] p-1 rounded-xl border border-white/[0.06] w-fit">
                    <button
                        type="button"
                        onClick={() => setUploadMode("file")}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-cairo font-bold transition-all ${
                            uploadMode === "file" 
                                ? "bg-[#dc2626] text-white shadow-md" 
                                : "text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        <Upload size={14} />
                        <span>رفع صورة من الجهاز</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadMode("url")}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-cairo font-bold transition-all ${
                            uploadMode === "url" 
                                ? "bg-[#dc2626] text-white shadow-md" 
                                : "text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        <LinkIcon size={14} />
                        <span>رابط صورة خارجي (URL)</span>
                    </button>
                </div>

                {uploadMode === "file" ? (
                    <div className="relative border-2 border-dashed border-white/[0.12] hover:border-[#dc2626]/50 rounded-2xl p-6 text-center bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-xl bg-[#dc2626]/10 text-[#ffb4ab] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload size={22} />
                            </div>
                            <span className="font-cairo font-bold text-sm text-white">
                                اضغط هنا لاختيار الشعار أو اسحب الصورة وأفلتها
                            </span>
                            <span className="text-[11px] font-tajawal text-[#94a3b8]">
                                يدعم PNG, WebP, SVG, JPG (يفضل خلفية شفافة، أقصى حجم 2MB)
                            </span>
                            {isProcessing && (
                                <span className="text-xs text-[#ffb95f] animate-pulse font-bold mt-1">
                                    جاري معالجة الصورة...
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/logo.png"
                            className="flex-1 bg-[#0e0e12] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#dc2626]"
                        />
                        <button
                            type="button"
                            onClick={handleUrlApply}
                            className="px-4 py-2.5 bg-[#dc2626] hover:brightness-110 text-white rounded-xl text-xs font-cairo font-bold shadow-md transition-all cursor-pointer"
                        >
                            تطبيق الرابط
                        </button>
                    </div>
                )}
            </div>

            {/* Favicon URL */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.04]">
                <label className="font-cairo font-semibold text-xs text-[#94a3b8]">
                    رابط أيقونة المتصفح (Favicon URL):
                </label>
                <input
                    type="text"
                    value={faviconUrl || ""}
                    onChange={(e) => onChangeFavicon(e.target.value)}
                    placeholder="/favicon.ico أو رابط أيقونة"
                    className="bg-[#0e0e12] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-[#dc2626]"
                />
            </div>

            {/* Live Interactive Simulator Preview */}
            <div className="bg-[#0e0e12] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye size={16} className="text-[#ffb95f]" />
                        <span className="font-cairo font-bold text-xs text-white">محاكي المعاينة المباشرة (Live Preview)</span>
                    </div>

                    <div className="flex items-center gap-1 bg-[#1b1b1f] p-1 rounded-lg border border-white/5">
                        <button
                            type="button"
                            onClick={() => setPreviewTab("navbar")}
                            className={`px-3 py-1 rounded-md text-[11px] font-cairo font-bold transition-all ${
                                previewTab === "navbar" ? "bg-[#dc2626] text-white" : "text-[#94a3b8]"
                            }`}
                        >
                            الهيدر العام للموقع
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewTab("sidebar")}
                            className={`px-3 py-1 rounded-md text-[11px] font-cairo font-bold transition-all ${
                                previewTab === "sidebar" ? "bg-[#dc2626] text-white" : "text-[#94a3b8]"
                            }`}
                        >
                            القائمة الجانبية للإدارة
                        </button>
                    </div>
                </div>

                {previewTab === "navbar" ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#131317]/95 p-3.5 flex items-center justify-between shadow-inner">
                        <div className="flex items-center gap-3">
                            <img
                                src={currentLogo}
                                alt="Logo Preview"
                                className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                            />
                            <span className="font-cairo font-extrabold text-sm text-white">
                                {siteName || "أنمي دايز"}
                            </span>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-[11px] font-cairo text-[#94a3b8]">
                            <span className="px-2 py-1 rounded bg-[#dc2626] text-white font-bold">الرئيسية</span>
                            <span className="px-2 py-1">دليل الأنمي</span>
                            <span className="px-2 py-1">كواكب الأنمي</span>
                            <span className="px-2 py-1 text-[#ffb95f] font-bold">VIP</span>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                            AD
                        </div>
                    </div>
                ) : (
                    <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#0e0e12] p-4 flex items-center justify-between max-w-sm">
                        <div className="flex items-center gap-3">
                            <img
                                src={currentLogo}
                                alt="Sidebar Logo Preview"
                                className="h-9 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                            />
                            <div>
                                <span className="font-cairo font-black text-sm text-white tracking-wide block leading-tight">
                                    {siteName || "أنمي دايز"}
                                </span>
                                <span className="font-tajawal text-[9px] text-[#ffb95f] tracking-wider uppercase block mt-0.5 font-bold">
                                    CMS Control Core
                                </span>
                            </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1b1b1f] text-emerald-400 border border-emerald-800/40">
                            متصل
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
