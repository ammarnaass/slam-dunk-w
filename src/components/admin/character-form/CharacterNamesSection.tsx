import React from "react";
import { User } from "lucide-react";

interface CharacterNamesSectionProps {
    name_ar?: string | null;
    name_en?: string | null;
    name_jp?: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CharacterNamesSection: React.FC<CharacterNamesSectionProps> = ({
    name_ar,
    name_en,
    name_jp,
    onChange,
}) => {
    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                <User className="text-blue-400" size={18} />
                <span>أسماء الشخصية واللغات</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">
                        الاسم بالعربية <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name_ar"
                        placeholder="مثال: كونان إيدوغاوا / حسان"
                        value={name_ar || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">الاسم بالإنجليزية</label>
                    <input
                        type="text"
                        name="name_en"
                        placeholder="مثال: Conan Edogawa"
                        value={name_en || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">الاسم باليابانية (كانجي)</label>
                    <input
                        type="text"
                        name="name_jp"
                        placeholder="مثال: 江戸川 コナン"
                        value={name_jp || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};
