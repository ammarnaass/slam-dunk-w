"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowRight } from "lucide-react";
import { Episode } from "@/types";
import Link from "next/link";

interface EpisodeFormProps {
    initialData?: Episode;
    isEdit?: boolean;
}

export default function EpisodeForm({ initialData, isEdit = false }: EpisodeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Episode>>({
        title: "",
        description: "",
        season: 1,
        episode_number: 0,
        thumbnail: "/logoep.jpg",
        duration: "23:30",
        mega_link: "",
        video_url: "",
        ...initialData,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "season" || name === "episode_number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/episodes/${initialData?.id}` : "/api/episodes";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/episodes");
                router.refresh();
            } else {
                alert("حدث خطأ أثناء الحفظ");
            }
        } catch (error) {
            console.error("Error saving episode", error);
            alert("حدث خطأ أثناء الحفظ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/episodes"
                        className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
                    >
                        <ArrowRight size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">
                        {isEdit ? "تعديل الحلقة" : "إضافة حلقة جديدة"}
                    </h1>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">عنوان الحلقة</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">رقم الحلقة</label>
                        <input
                            type="number"
                            name="episode_number"
                            value={formData.episode_number}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">الموسم</label>
                        <select
                            name="season"
                            value={formData.season}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        >
                            <option value={1}>الموسم 1</option>
                            <option value={2}>الموسم 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">المدة</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            placeholder="23:30"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">الوصف</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">رابط Mega</label>
                        <input
                            type="text"
                            name="mega_link"
                            value={formData.mega_link}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            placeholder="https://mega.nz/..."
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">رابط فيديو مباشر (اختياري)</label>
                        <input
                            type="text"
                            name="video_url"
                            value={formData.video_url}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            placeholder="https://example.com/video.mp4"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">رابط الصورة المصغرة</label>
                    <input
                        type="text"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                    />
                    {formData.thumbnail && (
                        <div className="mt-4 w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-slate-800">
                            <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
