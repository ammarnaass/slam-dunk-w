import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";

interface AnimeAdminHeaderProps {
    counts: {
        total: number;
        tv: number;
        movies: number;
        featured: number;
        ongoing: number;
    };
}

export default function AnimeAdminHeader({ counts }: AnimeAdminHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-6 bg-red-600 rounded-full" />
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        إدارة المحتوى (الأنمي والأفلام)
                    </h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                    إضافة وتعديل المسلسلات، الأجزاء، إدارة الحلقات وسيرفرات المشاهدة المباشرة.
                </p>

                {/* Quick Counters */}
                <div className="flex flex-wrap items-center gap-2 pt-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        الإجمالي: <strong className="text-white">{counts.total}</strong>
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        مسلسلات: <strong className="text-red-400">{counts.tv}</strong>
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        أفلام: <strong className="text-amber-400">{counts.movies}</strong>
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        مميز بالسلايدر: <strong className="text-yellow-400">{counts.featured}</strong>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href="/admin/slider"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all"
                >
                    <Sparkles size={16} className="text-amber-400" />
                    <span>ترتيب السلايدر</span>
                </Link>

                <Link
                    href="/admin/animes/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                >
                    <Plus size={18} />
                    <span>إضافة عمل جديد</span>
                </Link>
            </div>
        </div>
    );
}
