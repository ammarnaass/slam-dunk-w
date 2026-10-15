"use client";

import { useEffect, useState, useMemo } from "react";
import { Plan } from "@/types";

export interface PlansStats {
    total: number;
    active: number;
    popular: string;
}

export function useAdminPlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState("ج.م");
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const showToast = (type: "success" | "error", text: string) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchData = async () => {
        try {
            // Fetch Settings
            fetch("/api/settings")
                .then(res => res.json())
                .then(data => {
                    if (data.currency) setCurrency(data.currency);
                })
                .catch(console.error);

            // Fetch Plans
            const res = await fetch("/api/admin/plans");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            if (Array.isArray(data)) {
                setPlans(data);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
            showToast("error", "فشل تحميل خطط الاشتراكات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Toggle Plan Active State
    const handleToggleActive = async (plan: Plan) => {
        const newStatus = !plan.isActive;
        setTogglingId(plan.id);

        try {
            const res = await fetch(`/api/admin/plans/${plan.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (!res.ok) throw new Error("فشل تبديل حالة الخطة");

            setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, isActive: newStatus } : p));
            showToast("success", newStatus ? `تم تفعيل خطة "${plan.name}" بنجاح` : `تم تعطيل خطة "${plan.name}"`);
        } catch (error: any) {
            console.error("Toggle error:", error);
            showToast("error", error.message || "حدث خطأ أثناء التبديل");
        } finally {
            setTogglingId(null);
        }
    };

    // Toggle Popular
    const handleTogglePopular = async (plan: Plan) => {
        const newPopular = !plan.isPopular;
        setTogglingId(plan.id);

        try {
            const res = await fetch(`/api/admin/plans/${plan.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPopular: newPopular }),
            });

            if (!res.ok) throw new Error("فشل تعيين شارة الأكثر طلباً");

            setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, isPopular: newPopular } : p));
            showToast("success", newPopular ? `تم وسم الخطة كـ "الأكثر طلباً"` : `تم إزالة وسم الأكثر طلباً`);
        } catch (error: any) {
            console.error("Popular toggle error:", error);
            showToast("error", "فشل تعيين الوسم");
        } finally {
            setTogglingId(null);
        }
    };

    // Delete Plan
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد تماماً من حذف خطة "${name}"؟ لن يتمكن الزوار من الاشتراك بها.`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/plans/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPlans(prev => prev.filter(p => p.id !== id));
                showToast("success", "تم حذف الخطة بنجاح");
            } else {
                showToast("error", "فشل حذف الخطة");
            }
        } catch (error) {
            console.error("Error deleting plan:", error);
            showToast("error", "حدث خطأ أثناء محاولة الحذف");
        } finally {
            setDeletingId(null);
        }
    };

    // Calculate Summary Stats
    const stats: PlansStats = useMemo(() => {
        const total = plans.length;
        const active = plans.filter(p => p.isActive).length;
        const popular = plans.find(p => p.isPopular)?.name || "غير محدد";
        return { total, active, popular };
    }, [plans]);

    return {
        plans,
        loading,
        currency,
        togglingId,
        deletingId,
        toast,
        stats,
        handleToggleActive,
        handleTogglePopular,
        handleDelete,
    };
}
