import React from "react";
import { FileText } from "lucide-react";
import { Plan } from "@/types";

interface PlanDetailsCardProps {
    formData: Partial<Plan>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Plan>>>;
    currency: string;
}

export const PlanDetailsCard: React.FC<PlanDetailsCardProps> = ({
    formData,
    setFormData,
    currency,
}) => {
    return (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText size={18} className="text-amber-400" /> معلومات الخطة الأساسية
            </h2>

            <div>
                <label className="block text-slate-300 text-xs font-bold mb-2">اسم الخطة / الباقة</label>
                <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="مثال: الاشتراك الشهري VIP أو باقة الأوتاكو الذهبية"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
                    required
                />
            </div>

            <div>
                <label className="block text-slate-300 text-xs font-bold mb-2">
                    وصف مختصر تسويقي <span className="text-slate-500 font-normal">(يظهر في بطاقة الاشتراك)</span>
                </label>
                <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="مثال: تجربة مشاهدة سينمائية بدون إعلانات مع سيرفرات فائقة السرعة لمدة شهر"
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all resize-none"
                />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-300 text-xs font-bold mb-2">
                        السعر المقدر ({currency})
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price !== undefined ? formData.price : ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono font-bold"
                        required
                    />
                </div>

                <div>
                    <label className="block text-slate-300 text-xs font-bold mb-2">المدة (بالأيام)</label>
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={formData.duration || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                            placeholder="30"
                            required
                        />
                        {/* Presets */}
                        <div className="flex gap-1.5 overflow-x-auto text-[10px] font-bold">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, duration: "30" }))}
                                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                                30 يوم
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, duration: "90" }))}
                                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                                90 يوم
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, duration: "365" }))}
                                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                                365 يوم
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                        type="checkbox"
                        checked={formData.isPopular || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                    />
                    <div>
                        <span className="text-xs font-bold text-white block">وسم &quot;الأكثر طلباً&quot;</span>
                        <span className="text-[10px] text-slate-500">يعرض شارة ذهبية متوهجة على الخطة</span>
                    </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                        type="checkbox"
                        checked={formData.isActive ?? true}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <div>
                        <span className="text-xs font-bold text-white block">خطة نشطة ومتاحة</span>
                        <span className="text-[10px] text-slate-500">تظهر في صفحة الأسعار وتطبيق الهاتف</span>
                    </div>
                </label>
            </div>
        </div>
    );
};
