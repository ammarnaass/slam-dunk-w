"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowRight } from "lucide-react";
import { Character } from "@/types";
import Link from "next/link";

interface CharacterFormProps {
    initialData?: Character;
    isEdit?: boolean;
}

export default function CharacterForm({ initialData, isEdit = false }: CharacterFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Character>>({
        name_ar: "",
        name_en: "",
        name_jp: "",
        role: "",
        number: 0,
        height: "",
        weight: "",
        team: "Shohoku",
        bio: "",
        image: "/logoep.jpg",
        ...initialData,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/characters/${initialData?.id}` : "/api/characters";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/characters");
                router.refresh();
            } else {
                alert("حدث خطأ أثناء الحفظ");
            }
        } catch (error) {
            console.error("Error saving character", error);
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
                        href="/admin/characters"
                        className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
                    >
                        <ArrowRight size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">
                        {isEdit ? "تعديل الشخصية" : "إضافة شخصية جديدة"}
                    </h1>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">الاسم (عربي)</label>
                        <input
                            type="text"
                            name="name_ar"
                            value={formData.name_ar}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-600 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">الاسم (إنجليزي)</label>
                        <input
                            type="text"
                            name="name_en"
                            value={formData.name_en}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-600 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">المركز / الدور</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-600 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">الطول</label>
                        <input
                            type="text"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-600 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">الوزن</label>
                        <input
                            type="text"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-600 transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">الوصف (Bio)</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-600 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">رابط الصورة</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-600 transition-colors"
                    />
                    {formData.image && (
                        <div className="mt-4 w-32 h-32 rounded-full overflow-hidden border border-slate-800 mx-auto">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
