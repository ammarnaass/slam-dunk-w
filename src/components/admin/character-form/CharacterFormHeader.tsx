import React from "react";
import Link from "next/link";
import { ArrowRight, Save } from "lucide-react";

interface CharacterFormHeaderProps {
    isEdit?: boolean;
    characterName?: string;
    loading: boolean;
}

export const CharacterFormHeader: React.FC<CharacterFormHeaderProps> = ({
    isEdit = false,
    characterName,
    loading,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/characters"
                    className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white p-2.5 rounded-xl transition-colors"
                >
                    <ArrowRight size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                        {isEdit ? `تعديل شخصية: ${characterName || "شخصية أنمي"}` : "إضافة شخصية أنمي جديدة"}
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        أدخل التفاصيل الموسوعية للشخصية واربطها بالعمل الفني في ANIME DAZE.
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-105 disabled:opacity-50"
            >
                <Save size={18} />
                <span>{loading ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
            </button>
        </div>
    );
};
