"use client";

import { useState } from "react";
import { Anime } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2, Save, Film, CheckCircle, Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface AnimeFormProps {
    initialData?: Anime;
    isEdit?: boolean;
}

export default function AnimeForm({ initialData, isEdit = false }: AnimeFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState<Partial<Anime>>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        coverImage: initialData?.coverImage || "",
        type: initialData?.type || "TV Series",
        status: initialData?.status || "Ongoing",
        totalEpisodes: initialData?.totalEpisodes || 0,
        releaseYear: initialData?.releaseYear || "",
        genres: initialData?.genres || [],
    });

    const handleGenreChange = (index: number, value: string) => {
        const newGenres = [...(formData.genres || [])];
        newGenres[index] = value;
        setFormData({ ...formData, genres: newGenres });
    };

    const addGenre = () => {
        setFormData({ ...formData, genres: [...(formData.genres || []), ""] });
    };

    const removeGenre = (index: number) => {
        const newGenres = [...(formData.genres || [])];
        newGenres.splice(index, 1);
        setFormData({ ...formData, genres: newGenres });
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

            setMsg({ type: "success", text: "تم الحفظ بنجاح" });
            if (!isEdit) {
                router.push("/admin/animes");
            }
            router.refresh();
        } catch (error: any) {
            setMsg({ type: "error", text: error.message || "حدث خطأ أثناء الحفظ" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {msg.text && (
                <div className={`p-4 rounded-lg text-center ${msg.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {msg.text}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                            <Film size={20} className="text-red-500" /> تفاصيل العمل
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">عنوان الأنمي</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">الوصف</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">النوع</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                    >
                                        <option value="TV Series">TV Series</option>
                                        <option value="Movie">Movie</option>
                                        <option value="OVA">OVA</option>
                                        <option value="Special">Special</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">الحالة</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                    >
                                        <option value="Ongoing">مستمر</option>
                                        <option value="Completed">مكتمل</option>
                                        <option value="Coming Soon">قريباً</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">عدد الحلقات</label>
                                    <input
                                        type="number"
                                        value={formData.totalEpisodes}
                                        onChange={(e) => setFormData({ ...formData, totalEpisodes: Number(e.target.value) })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">سنة الإصدار</label>
                                    <input
                                        type="text"
                                        value={formData.releaseYear}
                                        onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                        placeholder="YYYY"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                            <CheckCircle size={20} className="text-green-500" /> التصنيفات (Genres)
                        </h2>
                        <div className="space-y-3">
                            {formData.genres?.map((genre, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={genre}
                                        onChange={(e) => handleGenreChange(index, e.target.value)}
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                        placeholder="تصنيف (أكشن، رياضة...)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeGenre(index)}
                                        className="bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 p-3 rounded-lg transition-colors border border-slate-700"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addGenre}
                                className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <Plus size={20} /> إضافة تصنيف
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                            <ImageIcon size={20} className="text-blue-500" /> الصور
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">صورة الغلاف (Portrait)</label>
                                <input
                                    type="text"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                    placeholder="URL"
                                    required
                                />
                                {formData.coverImage && (
                                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-700 max-w-[150px] mx-auto">
                                        <img src={formData.coverImage} alt="Cover" className="w-full h-auto" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all hover:scale-[1.01]"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {isEdit ? "حفظ التعديلات" : "إضافة العمل"}</>}
                    </button>
                </div>
            </div>
        </form>
    );
}
