import Link from "next/link";
import { Tv, Plus } from "lucide-react";

interface AnimeAdminEmptyStateProps {
    searchQuery: string;
    onResetFilters: () => void;
}

export default function AnimeAdminEmptyState({
    searchQuery,
    onResetFilters,
}: AnimeAdminEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
                <Tv size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
                لم يتم العثور على أي عمل
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6">
                {searchQuery
                    ? `لا توجد نتائج مطابقة لبحثك عن "${searchQuery}". جرب كلمات أخرى أو قم بإلغاء الفلاتر.`
                    : "لا توجد أعمال مضافة في هذه الفئة حالياً. يمكنك إضافة عمل جديد بسهولة."}
            </p>
            {searchQuery ? (
                <button
                    type="button"
                    onClick={onResetFilters}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                    إعادة ضبط البحث
                </button>
            ) : (
                <Link
                    href="/admin/animes/new"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-colors"
                >
                    <Plus size={16} />
                    <span>إضافة عمل جديد</span>
                </Link>
            )}
        </div>
    );
}
