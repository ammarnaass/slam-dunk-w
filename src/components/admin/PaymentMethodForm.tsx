"use client";

import { useState } from "react";
import { PaymentMethod } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2, Save, FileText, Globe, CreditCard, Banknote } from "lucide-react";

interface PaymentMethodFormProps {
    initialData?: PaymentMethod;
    isEdit?: boolean;
}

export default function PaymentMethodForm({ initialData, isEdit = false }: PaymentMethodFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState<Partial<PaymentMethod>>({
        name: initialData?.name || "",
        type: initialData?.type || "manual",
        instructions: initialData?.instructions || "",
        logoUrl: initialData?.logoUrl || "",
        isActive: initialData?.isActive ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ type: "", text: "" });

        const url = isEdit ? `/api/admin/payment-methods/${initialData?.id}` : "/api/admin/payment-methods";
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
                router.push("/admin/payment-methods");
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
                    <FileText size={20} className="text-blue-500" /> تفاصيل وسيلة الدفع
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-2 text-sm">اسم الوسيلة</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                            placeholder="مثال: فودافون كاش"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2 text-sm">نوع الوسيلة</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${formData.type === 'manual' ? 'bg-red-900/20 border-red-600 text-red-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="manual"
                                    checked={formData.type === 'manual'}
                                    onChange={() => setFormData({ ...formData, type: "manual" })}
                                    className="hidden"
                                />
                                <Banknote size={24} />
                                <span className="font-bold">دفع يدوي</span>
                                <span className="text-xs text-center opacity-70">مثل المحافظ الإلكترونية والتحويلات</span>
                            </label>

                            <label className={`cursor-pointer p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${formData.type === 'card' ? 'bg-red-900/20 border-red-600 text-red-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="card"
                                    checked={formData.type === 'card'}
                                    onChange={() => setFormData({ ...formData, type: "card" })}
                                    className="hidden"
                                />
                                <CreditCard size={24} />
                                <span className="font-bold">بطاقة ائتمان</span>
                                <span className="text-xs text-center opacity-70">فيزا / ماستركارد (بوابة دفع)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2 text-sm">رابط الشعار (اختياري)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.logoUrl || ""}
                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 ltr"
                                placeholder="https://example.com/logo.png"
                            />
                            {formData.logoUrl && (
                                <div className="w-12 h-12 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center overflow-hidden">
                                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2 text-sm">تعليمات الدفع</label>
                        <textarea
                            value={formData.instructions || ""}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 min-h-[100px]"
                            placeholder={formData.type === 'manual' ? "مثال: قم بتحويل المبلغ إلى الرقم 010xxxx ثم أرسل صورة الإيصال." : "سيتم توجيه المستخدم لصفحة الدفع الآمن."}
                            required
                        />
                        <p className="text-xs text-slate-500 mt-1">هذه التعليمات ستظهر للمستخدم عند اختيار وسيلة الدفع هذه.</p>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-offset-slate-900"
                            />
                            <span>نشطة (Active)</span>
                        </label>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={saving}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all hover:scale-[1.01]"
            >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {isEdit ? "حفظ التعديلات" : "إضافة الوسيلة"}</>}
            </button>
        </form>
    );
}
