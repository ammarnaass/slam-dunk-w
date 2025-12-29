"use client";

import { useEffect, useState } from "react";
import { PaymentMethod } from "@/types";
import { Loader2, Plus, Edit, Trash2, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentMethodsPage() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchMethods = async () => {
        try {
            const res = await fetch("/api/admin/payment-methods");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setMethods(data);
        } catch (error) {
            console.error("Error fetching methods:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف وسيلة الدفع؟")) return;

        try {
            const res = await fetch(`/api/admin/payment-methods/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setMethods(prev => prev.filter(m => m.id !== id));
            } else {
                alert("فشل الحذف");
            }
        } catch (error) {
            console.error("Error deleting method:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">طرق الدفع</h1>
                    <p className="text-slate-400">إدارة وسائل الدفع المتاحة للمستخدمين</p>
                </div>
                <Link
                    href="/admin/payment-methods/new"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                >
                    <Plus size={20} /> إضافة وسيلة دفع
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {methods.map((method) => (
                    <div key={method.id} className={`bg-slate-900 border rounded-xl p-6 relative transition-all hover:-translate-y-1 ${method.active ? 'border-green-500/50' : 'border-slate-800 opacity-70'}`}>
                        {!method.active && (
                            <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 px-3 py-1 rounded-bl-xl rounded-tr-xl font-bold text-xs">
                                غير نشط
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-slate-800 rounded-lg text-white">
                                    {method.type === 'card' ? <CreditCard size={24} /> : <Banknote size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{method.name}</h3>
                                    <div className="text-sm text-slate-400 mt-1 capitalize">
                                        {method.type === 'card' ? 'بطاقة ائتمان' : 'دفع يدوي'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-300 text-sm mb-6 min-h-[40px] line-clamp-2">
                            {method.instructions}
                        </p>

                        <div className="flex gap-3 pt-4 border-t border-slate-800">
                            <Link
                                href={`/admin/payment-methods/${method.id}`}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                <Edit size={16} /> تعديل
                            </Link>
                            <button
                                onClick={() => handleDelete(method.id)}
                                className="bg-red-900/20 hover:bg-red-900/40 text-red-400 p-2 rounded-lg transition-colors border border-red-900/30"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
