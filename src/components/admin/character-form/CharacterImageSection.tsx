import React from "react";
import { Image as ImageIcon } from "lucide-react";

interface CharacterImageSectionProps {
    image?: string | null;
    name_ar?: string | null;
    role?: string | null;
    animeTitle?: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CharacterImageSection: React.FC<CharacterImageSectionProps> = ({
    image,
    name_ar,
    role,
    animeTitle,
    onChange,
}) => {
    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                <ImageIcon className="text-purple-400" size={18} />
                <span>صورة الشخصية والمعاينة الحية</span>
            </div>

            <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1.5">رابط الصورة (URL)</label>
                <input
                    type="text"
                    name="image"
                    placeholder="https://..."
                    value={image || ""}
                    onChange={onChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                />
            </div>

            {/* Live Preview Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-6 justify-center">
                <div className="text-center sm:text-right">
                    <span className="text-[11px] text-slate-500 block mb-2 font-bold">معاينة بطاقة الشخصية في الموقع:</span>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-red-500/50 shadow-lg relative bg-slate-900 shrink-0">
                            <img
                                src={image || "/hero-bg.jpg"}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">{name_ar || "اسم الشخصية"}</h4>
                            <p className="text-xs text-red-400 font-semibold">{role || "بطل رئيسي"}</p>
                            <p className="text-[11px] text-slate-400">{animeTitle || "الأنمي المحدد"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
