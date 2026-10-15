import React from "react";
import { CheckCircle, Check, Plus, Trash2 } from "lucide-react";
import { FEATURE_PRESETS } from "./usePlanForm";

interface PlanFeaturesCardProps {
    features?: string[];
    onFeatureChange: (index: number, val: string) => void;
    onAddFeature: (text?: string) => void;
    onRemoveFeature: (index: number) => void;
    onAddPreset: (preset: string) => void;
}

export const PlanFeaturesCard: React.FC<PlanFeaturesCardProps> = ({
    features = [],
    onFeatureChange,
    onAddFeature,
    onRemoveFeature,
    onAddPreset,
}) => {
    return (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-400" /> مميزات الباقة
                </h2>
                <span className="text-[11px] font-bold text-slate-500">
                    {features.length} مميزات
                </span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">
                    أضف مميزات سريعة بنقرة واحدة:
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {FEATURE_PRESETS.map((preset, idx) => {
                        const isIncluded = features.includes(preset);
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => onAddPreset(preset)}
                                disabled={isIncluded}
                                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                    isIncluded
                                        ? "bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed"
                                        : "bg-slate-950/80 text-slate-300 hover:text-white border-slate-800 hover:border-amber-500/40 hover:bg-slate-900"
                                }`}
                            >
                                {isIncluded ? <Check size={11} className="text-emerald-500" /> : <Plus size={11} />}
                                <span>{preset}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Feature Inputs */}
            <div className="space-y-2.5 pt-2">
                {features.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <span className="text-xs text-slate-500 font-mono w-5 text-center">
                            {index + 1}
                        </span>
                        <input
                            type="text"
                            value={feature}
                            onChange={(e) => onFeatureChange(index, e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                            placeholder={`ميزة رقم ${index + 1}`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => onRemoveFeature(index)}
                            className="p-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-900/40 transition-colors"
                            title="حذف الميزة"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => onAddFeature("")}
                    className="w-full py-3 border border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-950/50 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                >
                    <Plus size={15} />
                    <span>إضافة ميزة مخصصة أخرى</span>
                </button>
            </div>
        </div>
    );
};
