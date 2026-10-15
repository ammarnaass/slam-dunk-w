import { AnimeSortBy } from "../hooks/useAnimesCatalog";

interface AnimesFilterControlsProps {
    selectedStatus: string;
    onSelectStatus: (status: string) => void;
    sortBy: AnimeSortBy;
    onSelectSortBy: (sort: AnimeSortBy) => void;
    onReset: () => void;
    hasActiveFilters: boolean;
}

export function AnimesFilterControls({
    selectedStatus,
    onSelectStatus,
    sortBy,
    onSelectSortBy,
    onReset,
    hasActiveFilters,
}: AnimesFilterControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-surface-container-low border border-white/[0.05]">
            {/* Status Segmented Control */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant flex items-center gap-1 font-bold shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-primary-container">filter_list</span>
                    <span>الحالة:</span>
                </span>
                <div className="flex-1 sm:flex-initial grid grid-cols-3 sm:flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-white/5">
                    {[
                        { label: "الكل", value: "all" },
                        { label: "مكتمل", value: "completed" },
                        { label: "مستمر", value: "ongoing" },
                    ].map((s) => (
                        <button
                            key={s.value}
                            onClick={() => onSelectStatus(s.value)}
                            className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-tajawal transition-all cursor-pointer text-center active:scale-95 ${
                                selectedStatus === s.value
                                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_2px_8px_rgba(220,38,38,0.3)]"
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort and Reset controls */}
            <div className="flex items-center gap-2 justify-between sm:justify-end">
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                    <span className="text-xs text-on-surface-variant shrink-0 font-tajawal">الترتيب:</span>
                    <div className="relative flex-1 sm:flex-initial">
                        <select
                            value={sortBy}
                            onChange={(e) => onSelectSortBy(e.target.value as AnimeSortBy)}
                            className="w-full sm:w-auto bg-surface-container text-on-surface text-xs sm:text-sm font-cairo py-2.5 px-3 pl-8 min-h-[44px] rounded-xl border border-white/10 focus:outline-none focus:border-primary-container cursor-pointer appearance-none"
                        >
                            <option value="latest">الأحدث إضافة</option>
                            <option value="rating">الأعلى تقييماً</option>
                            <option value="episodes">الأكثر حلقات</option>
                            <option value="year">سنة الإنتاج</option>
                        </select>
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            expand_more
                        </span>
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary active:scale-95 transition-all border border-white/5 cursor-pointer shrink-0"
                        title="إعادة ضبط الفلاتر"
                        aria-label="إعادة ضبط الفلاتر"
                    >
                        <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    </button>
                )}
            </div>
        </div>
    );
}
