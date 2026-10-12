"use client";

import { Sparkles } from "lucide-react";

interface AnimeIdentityCardProps {
    title: string;
    titleEn?: string;
    titleJp?: string;
    slug: string;
    description: string;
    onChangeField: (field: string, value: any) => void;
    onGenerateSlug: () => void;
}

export default function AnimeIdentityCard({
    title,
    titleEn = "",
    titleJp = "",
    slug,
    description,
    onChangeField,
    onGenerateSlug,
}: AnimeIdentityCardProps) {
    const descLength = description?.length || 0;

    return (
        <div className="bg-[#121217] rounded-2xl border border-white/[0.06] p-6 shadow-xl space-y-5 text-right">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600/20 text-[#dc2626] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">badge</span>
                    </div>
                    <div>
                        <h3 className="font-cairo font-bold text-base text-white">هوية وعناوين العمل</h3>
                        <p className="text-xs text-[#94a3b8]">العنوان العربي، المعرف الرابطي، وقصة وسيناريو العمل</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Main Arabic Title */}
                <div>
                    <label className="block text-xs font-bold text-[#e4e1e7] mb-1.5">
                        عنوان الأنمي باللغة العربية <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onChangeField("title", e.target.value)}
                        placeholder="مثال: سلام دانك (الموسم الأول)"
                        className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-4 py-3 text-sm text-white font-bold outline-none transition-all"
                        required
                    />
                </div>

                {/* English & Japanese Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-[#94a3b8] mb-1.5">
                            العنوان بالإنجليزية (English Title)
                        </label>
                        <input
                            type="text"
                            value={titleEn || ""}
                            onChange={(e) => onChangeField("title_en", e.target.value)}
                            placeholder="e.g. Slam Dunk"
                            className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#94a3b8] mb-1.5">
                            العنوان الأصلي باليابانية (Japanese Title)
                        </label>
                        <input
                            type="text"
                            value={titleJp || ""}
                            onChange={(e) => onChangeField("title_jp", e.target.value)}
                            placeholder="スラムダンク"
                            className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                        />
                    </div>
                </div>

                {/* Slug Identifier */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#e4e1e7] flex items-center gap-1.5">
                            <span>معرف الرابط SEO (Slug / ID)</span>
                            <span className="text-[10px] text-[#94a3b8] font-normal">رابط صفحة العمل على الموقع</span>
                        </label>
                        <button
                            type="button"
                            onClick={onGenerateSlug}
                            className="text-[11px] font-bold text-[#ffb95f] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <Sparkles size={12} />
                            <span>توليد تلقائي ذكي</span>
                        </button>
                    </div>

                    <div className="flex items-center bg-[#181820] rounded-xl border border-white/5 px-3 py-2 text-xs font-mono text-[#94a3b8] focus-within:border-[#dc2626] transition-all" dir="ltr">
                        <span className="text-slate-500 select-none">/animes/</span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => onChangeField("id", e.target.value)}
                            placeholder="slam-dunk"
                            className="bg-transparent text-white px-1 py-0.5 outline-none flex-1 font-bold"
                        />
                    </div>
                </div>

                {/* Description & Story */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#e4e1e7]">
                            قصة العمل ونبذة السيناريو <span className="text-[#dc2626]">*</span>
                        </label>
                        <span className="text-[11px] font-mono text-[#94a3b8]">
                            {descLength} حرف
                        </span>
                    </div>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => onChangeField("description", e.target.value)}
                        placeholder="اكتب تفاصيل وحبكة العمل والشخصيات الرئيسية..."
                        className="w-full bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl p-3.5 text-xs text-white outline-none leading-relaxed transition-all resize-y"
                        required
                    />
                </div>
            </div>
        </div>
    );
}
