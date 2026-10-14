"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, Upload, Link as LinkIcon, Flame, Check } from "lucide-react";
import { PromoBannerConfig } from "@/server/types/settings.types";
import { PRESET_POSTER_OPTIONS, PresetPosterOption } from "@/lib/promo-presets";

interface PromoPosterSectionProps {
    data: PromoBannerConfig;
    updateField: <K extends keyof PromoBannerConfig>(field: K, value: PromoBannerConfig[K]) => void;
}

export function PromoPosterSection({ data, updateField }: PromoPosterSectionProps) {
    const [imageSourceMode, setImageSourceMode] = useState<"upload" | "url">("upload");
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const imageFileInputRef = useRef<HTMLInputElement>(null);

    const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميجابايت.");
            return;
        }

        setIsUploadingImage(true);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            updateField("imageUrl", result);
            setIsUploadingImage(false);
        };
        reader.onerror = () => {
            alert("حدث خطأ أثناء قراءة ملف الصورة.");
            setIsUploadingImage(false);
        };
        reader.readAsDataURL(file);
    };

    const handleApplyPreset = (preset: PresetPosterOption) => {
        updateField("imageUrl", preset.url);
        updateField("imageCaption", preset.caption);
    };

    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <ImageIcon size={18} className="text-[#dc2626]" />
                    <h3 className="font-cairo font-bold text-white text-sm">
                        صورة التطبيق الترويجية والشارة
                    </h3>
                </div>

                {/* Mode Toggle: Upload vs URL */}
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#131317] border border-white/5">
                    <button
                        type="button"
                        onClick={() => setImageSourceMode("upload")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-cairo font-bold transition-all cursor-pointer ${
                            imageSourceMode === "upload"
                                ? "bg-[#dc2626] text-white"
                                : "text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        <Upload size={12} />
                        <span>رفع ملف</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setImageSourceMode("url")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-cairo font-bold transition-all cursor-pointer ${
                            imageSourceMode === "url"
                                ? "bg-[#dc2626] text-white"
                                : "text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        <LinkIcon size={12} />
                        <span>رابط URL</span>
                    </button>
                </div>
            </div>

            {/* File Upload Zone or URL Input */}
            {imageSourceMode === "upload" ? (
                <div className="space-y-3">
                    <input
                        ref={imageFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePosterFileUpload}
                        className="hidden"
                    />
                    <div
                        onClick={() => imageFileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/10 hover:border-[#dc2626]/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#131317]/50 hover:bg-[#131317] flex flex-col items-center justify-center gap-2.5 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/10 group-hover:bg-[#dc2626]/20 border border-[#dc2626]/30 flex items-center justify-center text-[#ffb4ab] transition-transform group-hover:scale-105">
                            <Upload size={22} />
                        </div>
                        <div>
                            <p className="font-cairo font-bold text-xs text-white">
                                {isUploadingImage
                                    ? "جاري قراءة ومعالجة الصورة..."
                                    : "اضغط لرفع صورة البوستر الترويجية من جهازك"}
                            </p>
                            <p className="font-tajawal text-[11px] text-[#94a3b8] mt-0.5">
                                يدعم صيغ JPG و PNG و WEBP (أقل من 4 ميجابايت)
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                        رابط الصورة (URL)
                    </label>
                    <input
                        type="text"
                        value={data.imageUrl}
                        onChange={(e) => updateField("imageUrl", e.target.value)}
                        placeholder="/hero-bg.jpg أو رابط خارجي"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>
            )}

            {/* Image Caption / Bottom Badge */}
            <div>
                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                    الشارة أسفل الصورة الترويجية
                </label>
                <input
                    type="text"
                    value={data.imageCaption}
                    onChange={(e) => updateField("imageCaption", e.target.value)}
                    placeholder="تجربة سبيستون الكلاسيكية الحديثة"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                />
            </div>

            {/* One-Click Presets Section */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
                <span className="text-xs font-cairo font-bold text-white flex items-center gap-1.5">
                    <Flame size={14} className="text-[#ffb95f]" />
                    <span>عينات جاهزة (بنقرة واحدة لتطبيق الصورة والشارة):</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {PRESET_POSTER_OPTIONS.map((preset) => {
                        const isSelected = data.imageUrl === preset.url;
                        return (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => handleApplyPreset(preset)}
                                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                    isSelected
                                        ? "bg-[#dc2626]/20 border-[#dc2626] shadow-lg shadow-red-950/40"
                                        : "bg-[#131317] border-white/5 hover:border-white/20 hover:bg-[#1a1a22]"
                                }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-cairo font-bold text-xs text-white">
                                        {preset.label}
                                    </span>
                                    {isSelected && <Check size={14} className="text-[#ffb4ab]" />}
                                </div>
                                <span className="font-tajawal text-[10px] text-[#94a3b8] line-clamp-2">
                                    {preset.caption}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
