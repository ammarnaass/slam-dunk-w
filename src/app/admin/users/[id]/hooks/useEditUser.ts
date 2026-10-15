"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

export interface EditUserFormData {
    username: string;
    email: string;
    role: "USER" | "ADMIN";
    password: string;
    subscription: {
        type: "FREE" | "PREMIUM";
        planType: string;
        status: "ACTIVE" | "EXPIRED";
        isActive: boolean;
        endDate: string;
    };
}

export function useEditUser(id: string) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [rawUser, setRawUser] = useState<any>(null);

    const [formData, setFormData] = useState<EditUserFormData>({
        username: "",
        email: "",
        role: "USER",
        password: "",
        subscription: {
            type: "PREMIUM",
            planType: "monthly",
            status: "EXPIRED",
            isActive: false,
            endDate: "",
        }
    });

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/users/${id}`);
            if (!res.ok) {
                throw new Error("لم يتم العثور على المستخدم");
            }
            const data = await res.json();
            setRawUser(data);

            const isVip = Boolean(data.subscription?.isActive);
            const endDateStr = data.subscription?.endDate 
                ? new Date(data.subscription.endDate).toISOString().split('T')[0] 
                : "";

            setFormData({
                username: data.name || data.username || "",
                email: data.email || "",
                role: (data.role || "USER").toUpperCase() as "USER" | "ADMIN",
                password: "",
                subscription: {
                    type: isVip ? "PREMIUM" : "FREE",
                    planType: data.subscription?.planType || "monthly",
                    status: isVip ? "ACTIVE" : "EXPIRED",
                    isActive: isVip,
                    endDate: endDateStr,
                }
            });
        } catch (error: any) {
            setMsg({ type: "error", text: error.message || "فشل تحميل بيانات المستخدم" });
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password || undefined,
                    subscription: {
                        type: formData.subscription.type,
                        planType: formData.subscription.planType,
                        status: formData.subscription.status,
                        isActive: formData.subscription.status === "ACTIVE",
                        endDate: formData.subscription.endDate || null,
                    }
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "فشل حفظ التعديلات");
            }

            setMsg({ type: "success", text: "تم تحديث بيانات المستخدم وصلاحياته بنجاح!" });
            setFormData(prev => ({ ...prev, password: "" }));
            setRawUser((prev: any) => ({ ...prev, ...data }));
            router.refresh();
        } catch (error: any) {
            setMsg({ type: "error", text: error.message || "حدث خطأ أثناء الحفظ" });
        } finally {
            setSaving(false);
        }
    };

    const handleSubscriptionExtend = useCallback((days: number, planName: string = "monthly") => {
        const baseDate = formData.subscription.endDate && new Date(formData.subscription.endDate) > new Date()
            ? new Date(formData.subscription.endDate)
            : new Date();

        baseDate.setDate(baseDate.getDate() + days);
        const formattedDate = baseDate.toISOString().split('T')[0];

        setFormData(prev => ({
            ...prev,
            subscription: {
                ...prev.subscription,
                type: "PREMIUM",
                planType: planName,
                status: "ACTIVE",
                isActive: true,
                endDate: formattedDate
            }
        }));
    }, [formData.subscription.endDate]);

    const cancelSubscription = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            subscription: {
                ...prev.subscription,
                type: "FREE",
                planType: "free",
                status: "EXPIRED",
                isActive: false,
                endDate: ""
            }
        }));
    }, []);

    const remainingDays = useMemo(() => {
        if (formData.subscription.status !== "ACTIVE" || !formData.subscription.endDate) return null;
        const end = new Date(formData.subscription.endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }, [formData.subscription.status, formData.subscription.endDate]);

    return {
        loading,
        saving,
        showPassword,
        setShowPassword,
        msg,
        rawUser,
        formData,
        setFormData,
        handleSubmit,
        handleSubscriptionExtend,
        cancelSubscription,
        remainingDays,
    };
}
