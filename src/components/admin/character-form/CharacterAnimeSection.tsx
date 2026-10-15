import React from "react";
import { Sparkles } from "lucide-react";
import { Anime } from "@/types";

interface CharacterAnimeSectionProps {
    animeId?: string | null;
    animes: Anime[];
    selectedAnimeObj?: Anime;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CharacterAnimeSection: React.FC<CharacterAnimeSectionProps> = ({
    animeId,
    animes,
    selectedAnimeObj,
    onChange,
}) => {
    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                <Sparkles className="text-amber-400" size={18} />
                <span>العمل الفني المرتبط (الأنمي)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">اختر الأنمي التابع له</label>
                    <select
                        name="animeId"
                        value={animeId || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                        required
                    >
                        <option value="">اختر العمل</option>
                        {animes.map(anime => (
                            <option key={anime.id} value={anime.id}>{anime.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">الكوكب والتصنيف</label>
                    <div className="flex items-center h-[46px] px-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                        {selectedAnimeObj?.planet ? (
                            <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold">
                                <Sparkles size={14} />
                                <span>كوكب {selectedAnimeObj.planet}</span>
                            </span>
                        ) : (
                            <span className="text-slate-500">سيتم تحديد الكوكب تلقائياً حسب العمل</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
