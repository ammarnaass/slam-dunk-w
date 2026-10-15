"use client";

interface SearchModalNoResultsProps {
    query: string;
}

export function SearchModalNoResults({ query }: SearchModalNoResultsProps) {
    return (
        <div className="text-center py-12 text-[#94a3b8] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-white/20">search_off</span>
            <p className="font-tajawal text-sm text-[#e4e1e7]">
                لم يتم العثور على نتائج مطابقة لـ &quot;{query}&quot;
            </p>
            <p className="font-tajawal text-xs text-[#94a3b8]">
                جرب البحث باسم آخر مثل: سلام دانك، كونان، أو رقم الحلقة...
            </p>
        </div>
    );
}
