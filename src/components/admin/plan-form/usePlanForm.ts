import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plan } from "@/types";

export const FEATURE_PRESETS = [
    "مشاهدة بدقة 1080p FHD و 4K بدون إعلانات",
    "سيرفرات فائقة السرعة مخصصة للأعضاء",
    "تحميل الحلقات للمشاهدة بدون إنترنت",
    "أولوية الوصول إلى أحدث الحلقات قبل الجميع",
    "شارة تميز VIP متوهجة في الملف الشخصي",
    "مشاهدة متزامنة على أجهزة متعددة",
    "إلغاء الاشتراك في أي وقت بسهولة"
];

interface UsePlanFormProps {
    initialData?: Plan;
    isEdit?: boolean;
}

export function usePlanForm({ initialData, isEdit = false }: UsePlanFormProps = {}) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formData, setFormData] = useState<Partial<Plan>>({
        id: initialData?.id || (isEdit ? undefined : `plan-${Date.now()}`),
        name: initialData?.name || "",
        price: initialData?.price !== undefined ? initialData.price : 4.99,
        duration: initialData?.duration || "30",
        description: initialData?.description || "",
        features: initialData?.features && initialData.features.length > 0 
            ? initialData.features 
            : [
                "مشاهدة بدقة 1080p FHD و 4K بدون إعلانات",
                "سيرفرات فائقة السرعة مخصصة للأعضاء",
                "تحميل الحلقات للمشاهدة بدون إنترنت"
            ],
        isPopular: initialData?.isPopular || false,
        isActive: initialData?.isActive ?? true,
    });

    const [currency, setCurrency] = useState("ج.م");

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.currency) setCurrency(data.currency);
            })
            .catch(err => console.error(err));
    }, []);

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeature = (text: string = "") => {
        setFormData({ ...formData, features: [...(formData.features || []), text] });
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures.splice(index, 1);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleAddPreset = (preset: string) => {
        if (formData.features?.includes(preset)) return;
        setFormData(prev => ({
            ...prev,
            features: [...(prev.features || []).filter(Boolean), preset]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);

        const url = isEdit ? `/api/admin/plans/${initialData?.id}` : "/api/admin/plans";
        const method = isEdit ? "PUT" : "POST";

        try {
            const cleanFeatures = (formData.features || []).map(f => f.trim()).filter(Boolean);
            const payload = {
                ...formData,
                price: Number(formData.price),
                features: cleanFeatures
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "فشلت عملية حفظ الخطة");
            }

            setMsg({ type: "success", text: isEdit ? "تم تحديث الخطة بنجاح!" : "تم إنشاء الخطة وإتاحتها بنجاح!" });
            
            setTimeout(() => {
                router.push("/admin/plans");
                router.refresh();
            }, 800);
        } catch (error: any) {
            setMsg({ type: "error", text: error.message || "حدث خطأ أثناء الحفظ" });
            setSaving(false);
        }
    };

    return {
        saving,
        msg,
        formData,
        setFormData,
        currency,
        handleFeatureChange,
        addFeature,
        removeFeature,
        handleAddPreset,
        handleSubmit,
    };
}
