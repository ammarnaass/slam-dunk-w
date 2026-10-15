import Link from "next/link";
import { Plus } from "lucide-react";

interface CharactersAdminHeaderProps {
    totalCharacters: number;
    uniqueAnimeCount: number;
}

export default function CharactersAdminHeader({
    totalCharacters,
    uniqueAnimeCount,
}: CharactersAdminHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-7 bg-gradient-to-b from-red-600 to-amber-500 rounded-full" />
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        إدارة شخصيات الأعمال والأنمي
                    </h1>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                        ANIME DAZE
                    </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                    إدارة وتعديل أبطال ومساعدي وخصوم أعمال المنصة، وربطهم بالأعمال الفنية والكواكب ومؤدي الأصوات.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                    <span>إجمالي الشخصيات:</span>
                    <strong className="text-white text-sm">{totalCharacters}</strong>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                    <span>الأعمال المغطاة:</span>
                    <strong className="text-amber-400 text-sm">{uniqueAnimeCount}</strong>
                </div>

                <Link
                    href="/admin/characters/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                >
                    <Plus size={16} />
                    <span>إضافة شخصية جديدة</span>
                </Link>
            </div>
        </div>
    );
}
