"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowRight, Sparkles, Image as ImageIcon, Mic, User, Shield, Info } from "lucide-react";
import { Character, Anime } from "@/types";
import Link from "next/link";

interface CharacterFormProps {
    initialData?: Character;
    isEdit?: boolean;
}

const ROLE_PRESETS = [
    "بطل رئيسي (Main Protagonist)",
    "بطل مشارك (Deuteragonist)",
    "شخصية مساندة (Supporting Character)",
    "خصم ومنافس (Rival / Antagonist)",
    "شرير رئيسي (Main Villain)",
    "معلم ومرشد (Mentor / Sensei)",
];

export default function CharacterForm({ initialData, isEdit = false }: CharacterFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [formData, setFormData] = useState<Partial<Character> & { voiceActorJa?: string; voiceActorAr?: string }>({
        animeId: "",
        name: "",
        name_ar: "",
        name_en: "",
        name_jp: "",
        role: "بطل رئيسي",
        team: "",
        position: "",
        number: "",
        height: "",
        weight: "",
        description: "",
        image: "/hero-bg.jpg",
        voiceActorJa: "",
        voiceActorAr: "",
        ...(initialData as any),
    });

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                const res = await fetch("/api/admin/animes").catch(() => fetch("/api/animes"));
                if (res.ok) {
                    const data = await res.json();
                    const list = Array.isArray(data) ? data : (data?.items || []);
                    setAnimes(list);
                    if (!isEdit && list.length > 0 && !formData.animeId) {
                        setFormData(prev => ({ ...prev, animeId: list[0].id }));
                    }
                }
            } catch (err) {
                console.error("Failed to load animes for character form", err);
            }
        };
        fetchAnimes();
    }, [isEdit]);

    const selectedAnimeObj = animes.find(a => a.id === formData.animeId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRolePreset = (preset: string) => {
        const clean = preset.split(" (")[0];
        setFormData(prev => ({ ...prev, role: clean }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/characters/${initialData?.id}` : "/api/characters";
            const method = isEdit ? "PUT" : "POST";

            const payload = {
                ...formData,
                name: formData.name_ar || formData.name || formData.name_en,
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/admin/characters");
                router.refresh();
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData.error || "حدث خطأ أثناء حفظ الشخصية");
            }
        } catch (error) {
            console.error("Error saving character", error);
            alert("حدث خطأ أثناء حفظ الشخصية");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/characters"
                        className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white p-2.5 rounded-xl transition-colors"
                    >
                        <ArrowRight size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white">
                            {isEdit ? `تعديل شخصية: ${formData.name_ar || formData.name}` : "إضافة شخصية أنمي جديدة"}
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            أدخل التفاصيل الموسوعية للشخصية واربطها بالعمل الفني في ANIME DAZE.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-105 disabled:opacity-50"
                >
                    <Save size={18} />
                    <span>{loading ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
                </button>
            </div>

            {/* Section 1: Anime Association */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                    <Sparkles className="text-amber-400" size={18} />
                    <span>العمل الفني المرتبط (الأنمي)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">اختر الأنمي التابع له</label>
                        <select
                            name="animeId"
                            value={formData.animeId || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                            required
                        >
                            <option value="">اختر العمل</option>
                            {animes.map(anime => (
                                <option key={anime.id} value={anime.id}>{anime.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">الكوكب والتصنيف</label>
                        <div className="flex items-center h-[46px] px-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                            {selectedAnimeObj?.planet ? (
                                <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold">
                                    <Sparkles size={14} />
                                    <span>كوكب {selectedAnimeObj.planet}</span>
                                </span>
                            ) : (
                                <span className="text-slate-500">سيتم تحديد الكوكب تلقائياً حسب العمل</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Multilingual Names */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                    <User className="text-blue-400" size={18} />
                    <span>أسماء الشخصية واللغات</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">
                            الاسم بالعربية <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name_ar"
                            placeholder="مثال: كونان إيدوغاوا / حسان"
                            value={formData.name_ar || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">الاسم بالإنجليزية</label>
                        <input
                            type="text"
                            name="name_en"
                            placeholder="مثال: Conan Edogawa"
                            value={formData.name_en || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">الاسم باليابانية (كانجي)</label>
                        <input
                            type="text"
                            name="name_jp"
                            placeholder="مثال: 江戸川 コナン"
                            value={formData.name_jp || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Section 3: Role & Affiliation */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                    <Shield className="text-rose-400" size={18} />
                    <span>الدور الدرامي والفصيل / الانتماء</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">نوع الدور</label>
                        <input
                            type="text"
                            name="role"
                            placeholder="مثال: بطل رئيسي / محقق"
                            value={formData.role || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                            {ROLE_PRESETS.map(p => (
                                <button
                                    type="button"
                                    key={p}
                                    onClick={() => handleRolePreset(p)}
                                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] transition-colors"
                                >
                                    {p.split(" (")[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">الفصيل / المنظمة / الفريق</label>
                        <input
                            type="text"
                            name="team"
                            placeholder="مثال: فريق التحريات الصغير / شوهوكو"
                            value={formData.team || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">اللقب أو التخصص</label>
                        <input
                            type="text"
                            name="position"
                            placeholder="مثال: شارلوك هولمز المعاصر / مهاجم"
                            value={formData.position || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Section 4: Voice Actors */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                    <Mic className="text-emerald-400" size={18} />
                    <span>مؤدو الأصوات (الأداء الصوتي والدبلجة)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">
                            🇯🇵 مؤدي الصوت الياباني (Seiyuu)
                        </label>
                        <input
                            type="text"
                            name="voiceActorJa"
                            placeholder="مثال: مينامي تاكاياما / تاكيشي كوساو"
                            value={formData.voiceActorJa || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">
                            🎙️ مؤدي الصوت بالدبلجة العربية
                        </label>
                        <input
                            type="text"
                            name="voiceActorAr"
                            placeholder="مثال: آمال سعد الدين / عادل أبو حسون"
                            value={formData.voiceActorAr || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Section 5: Description & Bio */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                    <Info className="text-cyan-400" size={18} />
                    <span>نبذة عن الشخصية والمقاييس الاختيارية</span>
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">النبذة والقصة</label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="اكتب وصفاً جذاباً للشخصية، تاريخها، ودورها في تطور أحداث الأنمي..."
                        value={formData.description || ""}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors leading-relaxed"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">الطول (اختياري)</label>
                        <input
                            type="text"
                            name="height"
                            placeholder="مثال: 174 cm"
                            value={formData.height || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">الوزن (اختياري)</label>
                        <input
                            type="text"
                            name="weight"
                            placeholder="مثال: 68 kg"
                            value={formData.weight || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-1.5">رقم مميز (إن وُجد)</label>
                        <input
                            type="text"
                            name="number"
                            placeholder="مثال: 10 أو 007"
                            value={formData.number || ""}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                        />
                    </div>
                </div>
            </div>

            {/* Section 6: Image & Live Preview */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                    <ImageIcon className="text-purple-400" size={18} />
                    <span>صورة الشخصية والمعاينة الحية</span>
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">رابط الصورة (URL)</label>
                    <input
                        type="text"
                        name="image"
                        placeholder="https://..."
                        value={formData.image || ""}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                    />
                </div>

                {/* Live Preview Box */}
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-6 justify-center">
                    <div className="text-center sm:text-right">
                        <span className="text-[11px] text-slate-500 block mb-2 font-bold">معاينة بطاقة الشخصية في الموقع:</span>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-red-500/50 shadow-lg relative bg-slate-900 shrink-0">
                                <img
                                    src={formData.image || "/hero-bg.jpg"}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">{formData.name_ar || "اسم الشخصية"}</h4>
                                <p className="text-xs text-red-400 font-semibold">{formData.role || "بطل رئيسي"}</p>
                                <p className="text-[11px] text-slate-400">{selectedAnimeObj?.title || "الأنمي المحدد"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
