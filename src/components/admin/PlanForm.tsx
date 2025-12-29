"use client";

import { useState } from "react";
import { Plan } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2, Save, FileText, CheckCircle, Plus, Trash2 } from "lucide-react";

interface PlanFormProps {
    initialData?: Plan;
    isEdit?: boolean;
}

export default function PlanForm({ initialData, isEdit = false }: PlanFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState<Partial<Plan>>({
        name: initialData?.name || "",
        price: initialData?.price || 0,
        duration: initialData?.duration || 30,
        features: initialData?.features || [""],
        isPopular: initialData?.isPopular || false,
        active: initialData?.active ?? true,
    });

    const [currency, setCurrency] = useState("ج.م");

    useState(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.currency) setCurrency(data.currency);
            })
            .catch(err => console.error(err));
    });

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...(formData.features || []), ""] });
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures.splice(index, 1);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ type: "", text: "" });

        const url = isEdit ? `/api/admin/plans/${initialData?.id}` : "/api/admin/plans";
        const method = isEdit ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("فشلت العملية");

            setMsg({ type: "success", text: "تم الحفظ بنجاح" });
            if (!isEdit) {
                router.push("/admin/plans");
            }
            router.refresh();
        } catch (error) {
            setMsg({ type: "error", text: "حدث خطأ أثناء الحفظ" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {msg.text && (
                <div className={`p-4 rounded-lg text-center ${msg.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {msg.text}
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                    <FileText size={20} className="text-blue-500" /> تفاصيل الخطة
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-2 text-sm">اسم الخطة</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">السعر ({currency})</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">المدة (بالأيام)</label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                                type="checkbox"
                                checked={formData.isPopular}
                                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-offset-slate-900"
                            />
                            <span>الأكثر طلباً (Popular)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-offset-slate-900"
                            />
                            <span>نشطة (Active)</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                    <CheckCircle size={20} className="text-green-500" /> المميزات
                </h2>

                <div className="space-y-3">
                    {formData.features?.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                placeholder={`ميزة رقم ${index + 1}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 p-3 rounded-lg transition-colors border border-slate-700 hover:border-red-900/50"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addFeature}
                        className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus size={20} /> إضافة ميزة
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={saving}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all hover:scale-[1.01]"
            >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {isEdit ? "حفظ التعديلات" : "إضافة الخطة"}</>}
            </button>
        </form>
    );
}
