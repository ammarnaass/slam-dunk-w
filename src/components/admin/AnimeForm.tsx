"use client";

import { useState } from "react";
import { Anime } from "@/types";
import { useRouter } from "next/navigation";
import { Save, ArrowRight } from "lucide-react";
import Link from "next/link";

import AnimeIdentityCard from "@/app/admin/animes/components/AnimeIdentityCard";
import AnimePlanetAndGenresCard from "@/app/admin/animes/components/AnimePlanetAndGenresCard";
import AnimeMediaAndStreamingCard from "@/app/admin/animes/components/AnimeMediaAndStreamingCard";
import AnimePromotionCard from "@/app/admin/animes/components/AnimePromotionCard";
import AnimeLivePreviewSimulator from "@/app/admin/animes/components/AnimeLivePreviewSimulator";

interface AnimeFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function AnimeForm({ initialData, isEdit = false }: AnimeFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        id: initialData?.id || "",
        title: initialData?.title || "",
        title_en: initialData?.title_en || "",
        title_jp: initialData?.title_jp || "",
        description: initialData?.description || "",
        coverImage: initialData?.coverImage || "",
        bannerImage: initialData?.bannerImage || "",
        trailerUrl: initialData?.trailerUrl || "",
        type: initialData?.type || "TV Series",
        status: initialData?.status || "Ongoing",
        totalEpisodes: initialData?.totalEpisodes || 0,
        releaseYear: initialData?.releaseYear || new Date().getFullYear(),
        genres: initialData?.genres || ["رياضة", "حماسي"],
        rating: initialData?.rating || 9.2,
        isFeatured: initialData?.isFeatured || false,
        isTrending: initialData?.isTrending || false,
        planet: initialData?.planet || "رياضة",
        studio: initialData?.studio || "Toei Animation",
        ageRating: initialData?.ageRating || "+16",
        audioLanguage: initialData?.audioLanguage || "dubbed",
        quality: initialData?.quality || "4K"
    });

    const handleChangeField = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // Auto-generate clean slug
    const handleGenerateSlug = () => {
        const source = formData.title_en?.trim() || formData.title.trim();
        let slug = source
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        if (!slug) {
            slug = "anime-" + Math.random().toString(36).substring(2, 6);
        }
        setFormData(prev => ({ ...prev, id: slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ type: "", text: "" });

        const url = isEdit ? `/api/admin/animes/${initialData?.id}` : "/api/admin/animes";
        const method = isEdit ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "فشلت العملية");
            }

            setMsg({ type: "success", text: isEdit ? "تم تحديث العمل بنجاح! 🎉" : "تمت إضافة العمل بنجاح إلى المنصة! 🎉" });
            
            setTimeout(() => {
                router.push("/admin/animes");
                router.refresh();
            }, 1200);
        } catch (error: any) {
            setMsg({ type: "error", text: error.message || "حدث خطأ أثناء الحفظ" });
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Feedback Message */}
            {msg.text && (
                <div className={`p-4 rounded-2xl text-center text-xs font-bold border backdrop-blur-xl animate-in zoom-in-95 duration-200 ${
                    msg.type === "success" 
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                        : "bg-red-950/80 text-red-300 border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                }`}>
                    {msg.text}
                </div>
            )}

            {/* Main 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Right Primary Form Column (8 Cols in LG) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* 1. Identity & Titles */}
                    <AnimeIdentityCard
                        title={formData.title}
                        titleEn={formData.title_en}
                        titleJp={formData.title_jp}
                        slug={formData.id}
                        description={formData.description}
                        onChangeField={handleChangeField}
                        onGenerateSlug={handleGenerateSlug}
                    />

                    {/* 2. Spacetoon Planets & Genres */}
                    <AnimePlanetAndGenresCard
                        currentPlanet={formData.planet}
                        genres={formData.genres}
                        ageRating={formData.ageRating}
                        onChangeField={handleChangeField}
                    />

                    {/* 3. Media Assets & Streaming Settings */}
                    <AnimeMediaAndStreamingCard
                        coverImage={formData.coverImage}
                        bannerImage={formData.bannerImage}
                        trailerUrl={formData.trailerUrl}
                        audioLanguage={formData.audioLanguage}
                        quality={formData.quality}
                        onChangeField={handleChangeField}
                    />

                    {/* 4. Production Specifications & Promotions */}
                    <AnimePromotionCard
                        type={formData.type}
                        status={formData.status}
                        totalEpisodes={formData.totalEpisodes}
                        releaseYear={formData.releaseYear}
                        studio={formData.studio}
                        rating={formData.rating}
                        isFeatured={formData.isFeatured}
                        isTrending={formData.isTrending}
                        onChangeField={handleChangeField}
                    />
                </div>

                {/* Left Live Preview Simulator Column (4 Cols in LG) */}
                <div className="lg:col-span-4 space-y-6">
                    <AnimeLivePreviewSimulator
                        title={formData.title}
                        description={formData.description}
                        coverImage={formData.coverImage}
                        bannerImage={formData.bannerImage}
                        planet={formData.planet}
                        genres={formData.genres}
                        rating={formData.rating}
                        status={formData.status}
                        type={formData.type}
                        totalEpisodes={formData.totalEpisodes}
                        quality={formData.quality}
                        isFeatured={formData.isFeatured}
                        isTrending={formData.isTrending}
                    />

                    {/* Save Action Card */}
                    <div className="bg-[#121217] rounded-2xl border border-white/[0.06] p-5 shadow-xl space-y-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-cairo font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.45)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
                        >
                            {saving ? (
                                <>
                                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    <span>جاري حفظ العمل...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>{isEdit ? "حفظ التعديلات والتحديث" : "نشر وإضافة العمل للمنصة"}</span>
                                </>
                            )}
                        </button>

                        <Link
                            href="/admin/animes"
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#181820] hover:bg-[#20202a] text-[#94a3b8] hover:text-white text-xs font-bold transition-all border border-white/5"
                        >
                            <ArrowRight size={14} />
                            <span>إلغاء والعودة للقائمة</span>
                        </Link>
                    </div>
                </div>

            </div>
        </form>
    );
}
