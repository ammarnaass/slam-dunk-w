"use client";

import { useEffect, useState } from "react";
import { Plan } from "@/types";
import { Loader2, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState("ج.م");

    const fetchData = async () => {
        try {
            // Fetch Settings
            fetch("/api/settings").then(res => res.json()).then(data => {
                if (data.currency) setCurrency(data.currency);
            }).catch(console.error);

            // Fetch Plans
            const res = await fetch("/api/admin/plans");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setPlans(data);
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذه الخطة؟")) return;

        try {
            const res = await fetch(`/api/admin/plans/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPlans(prev => prev.filter(p => p.id !== id));
            } else {
                alert("فشل الحذف");
            }
        } catch (error) {
            console.error("Error deleting plan:", error);
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
                    <h1 className="text-3xl font-bold text-white mb-2">إدارة الخطط</h1>
                    <p className="text-slate-400">تحكم في خطط الاشتراك والأسعار والمميزات</p>
                </div>
                <Link
                    href="/admin/plans/new"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                >
                    <Plus size={20} /> إضافة خطة جديدة
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className={`bg-slate-900 border rounded-xl p-6 relative transition-all hover:-translate-y-1 ${plan.isPopular ? 'border-yellow-500 shadow-yellow-900/10 shadow-lg' : 'border-slate-800'}`}>
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 rounded-bl-xl rounded-tr-xl font-bold text-xs">
                                الأكثر طلباً
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                <div className="text-sm text-slate-400 mt-1">
                                    {plan.duration} يوم
                                </div>
                            </div>
                            <div className="bg-slate-800 px-3 py-1 rounded-lg">
                                <span className={`font-bold ${plan.active ? 'text-green-500' : 'text-red-500'}`}>
                                    {plan.price} {currency}
                                </span>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6 min-h-[100px]">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="text-slate-300 text-sm flex items-center gap-2">
                                    <CheckCircle size={14} className="text-green-500" /> {feature}
                                </li>
                            ))}
                            {plan.features.length > 3 && (
                                <li className="text-slate-500 text-xs italic">
                                    + {plan.features.length - 3} مميزات إضافية...
                                </li>
                            )}
                        </ul>

                        <div className="flex gap-3 pt-4 border-t border-slate-800">
                            <Link
                                href={`/admin/plans/${plan.id}`}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                <Edit size={16} /> تعديل
                            </Link>
                            <button
                                onClick={() => handleDelete(plan.id)}
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
