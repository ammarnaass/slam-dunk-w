"use client";

import React from "react";
import { Plan } from "@/types";
import { Loader2, Save } from "lucide-react";
import {
    usePlanForm,
    PlanAlert,
    PlanDetailsCard,
    PlanFeaturesCard,
    PlanLiveCardPreview,
} from "./plan-form";

interface PlanFormProps {
    initialData?: Plan;
    isEdit?: boolean;
}

export default function PlanForm({ initialData, isEdit = false }: PlanFormProps) {
    const {
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
    } = usePlanForm({ initialData, isEdit });

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500 pb-16">
            <PlanAlert msg={msg} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Controls Column (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <PlanDetailsCard
                        formData={formData}
                        setFormData={setFormData}
                        currency={currency}
                    />

                    <PlanFeaturesCard
                        features={formData.features}
                        onFeatureChange={handleFeatureChange}
                        onAddFeature={addFeature}
                        onRemoveFeature={removeFeature}
                        onAddPreset={handleAddPreset}
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 hover:from-amber-400 hover:via-rose-500 hover:to-rose-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-rose-900/30 transition-all hover:scale-[1.008] disabled:opacity-50 text-sm sm:text-base cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>جاري حفظ الخطة وتحديث المنصة...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>{isEdit ? "حفظ التعديلات على الخطة" : "نشر الخطة وإتاحتها للجمهور"}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Live Card Preview Column (5 cols) */}
                <PlanLiveCardPreview
                    formData={formData}
                    currency={currency}
                />
            </div>
        </form>
    );
}
