import React from "react";
import { Info } from "lucide-react";

interface CharacterBioSectionProps {
    description?: string | null;
    height?: string | null;
    weight?: string | null;
    number?: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const CharacterBioSection: React.FC<CharacterBioSectionProps> = ({
    description,
    height,
    weight,
    number,
    onChange,
}) => {
    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                <Info className="text-cyan-400" size={18} />
                <span>نبذة عن الشخصية والمقاييس الاختيارية</span>
            </div>

            <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1.5">النبذة والقصة</label>
                <textarea
                    name="description"
                    rows={4}
                    placeholder="اكتب وصفاً جذاباً للشخصية، تاريخها، ودورها في تطور أحداث الأنمي..."
                    value={description || ""}
                    onChange={onChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors leading-relaxed"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">الطول (اختياري)</label>
                    <input
                        type="text"
                        name="height"
                        placeholder="مثال: 174 cm"
                        value={height || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">الوزن (اختياري)</label>
                    <input
                        type="text"
                        name="weight"
                        placeholder="مثال: 68 kg"
                        value={weight || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">رقم مميز (إن وُجد)</label>
                    <input
                        type="text"
                        name="number"
                        placeholder="مثال: 10 أو 007"
                        value={number || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                    />
                </div>
            </div>
        </div>
    );
};
