"use client";

import { useState, useEffect } from "react";
import { PaymentMethod } from "@/types";
import { Loader2, Plus, Trash2, Edit2, Save, X, CreditCard, Wallet, Banknote } from "lucide-react";

export default function PaymentMethodsPage() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<PaymentMethod>>({
        id: "",
        name: "",
        type: "manual",
        details: "",
        icon: "",
        isActive: true
    });

    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        try {
            const res = await fetch("/api/admin/payment-methods");
            if (res.ok) {
                const data = await res.json();
                setMethods(data);
            }
        } catch (error) {
            console.error("Failed to fetch methods", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editId
                ? `/api/admin/payment-methods/${editId}`
                : "/api/admin/payment-methods";

            const method = editId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await fetchMethods();
                resetForm();
            } else {
                const err = await res.text();
                alert(`Error: ${err}`);
            }
        } catch (error) {
            console.error("Failed to save method", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this payment method?")) return;

        try {
            const res = await fetch(`/api/admin/payment-methods/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setMethods(prev => prev.filter(m => m.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete method", error);
        }
    };

    const startEdit = (method: PaymentMethod) => {
        setFormData(method);
        setEditId(method.id);
        setIsEditing(true);
    };

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
            type: "manual",
            details: "",
            icon: "",
            isActive: true
        });
        setEditId(null);
        setIsEditing(false);
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">طرق الدفع</h1>
                    <p className="text-slate-400">إدارة بوابات الدفع والتحويلات البنكية</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} /> إضافة طريقة جديدة
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 animate-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        {editId ? <Edit2 size={20} /> : <Plus size={20} />}
                        {editId ? "تعديل طريقة الدفع" : "إضافة طريقة جديدة"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">المعرف (ID)</label>
                                <input
                                    type="text"
                                    disabled={!!editId}
                                    value={formData.id}
                                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white disabled:opacity-50"
                                    placeholder="e.g., binance_pay"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">يجب أن يكون فريداً وباللغة الإنجليزية</p>
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">الاسم الظاهر</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                    placeholder="مثال: دفع عبر Binance"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">النوع</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                >
                                    <option value="manual">يدوي / تحويل (Manual/Crypto)</option>
                                    <option value="card">بطاقة ائتمان (Mock/Stripe)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">أيقونة (URL)</label>
                                <input
                                    type="text"
                                    value={formData.icon || ""}
                                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                    placeholder="https://example.com/icon.png"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">التفاصيل / التعليمات</label>
                            <textarea
                                value={formData.details || ""}
                                onChange={e => setFormData({ ...formData, details: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white h-32"
                                placeholder={formData.type === 'manual'
                                    ? "أدخل تعليمات التحويل هنا. مثال: عنوان المحفظة، اسم البنك، الايبان..."
                                    : "أدخل مفاتيح API (سيتم تشفيرها مستقبلاً)"}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 accent-red-600 bg-slate-800 border-slate-700 rounded"
                            />
                            <label htmlFor="isActive" className="text-white select-none cursor-pointer">تفعيل طريقة الدفع</label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                حفظ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {methods.map(method => (
                    <div key={method.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                                {method.icon ? (
                                    <img src={method.icon} alt={method.name} className="w-10 h-10 object-contain" />
                                ) : (
                                    method.type === 'card' ? <CreditCard className="text-slate-500" /> :
                                        method.id.includes('binance') ? <Wallet className="text-yellow-500" /> : <Banknote className="text-green-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    {method.name}
                                    {!method.isActive && <span className="text-xs bg-slate-800 text-slate-500 px-2 py-1 rounded">غير مفعل</span>}
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">{method.id} • {method.type === 'manual' ? 'تحويل يدوي' : 'بطاقة ائتمان'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => startEdit(method)}
                                className="flex-1 md:flex-none p-3 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors border border-slate-700"
                                title="تعديل"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(method.id)}
                                className="flex-1 md:flex-none p-3 bg-slate-800 hover:bg-red-900/20 text-red-500 rounded-lg transition-colors border border-slate-700 hover:border-red-900/50"
                                title="حذف"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {methods.length === 0 && !loading && (
                    <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                        لا توجد طرق دفع مضافة حالياً.
                    </div>
                )}
            </div>
        </div>
    );
}
