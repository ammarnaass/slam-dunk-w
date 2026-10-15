interface AnimesCatalogHeaderProps {
    loading: boolean;
    totalCount: number;
}

export function AnimesCatalogHeader({ loading, totalCount }: AnimesCatalogHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/[0.06]">
            <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-surface-container-low border border-white/5 text-xs text-secondary">
                    <span className="material-symbols-outlined text-[16px] text-primary-container">video_library</span>
                    <span className="font-bold">الأرشيف الرقمي الشامل</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_8px_rgba(220,38,38,0.9)]" />
                    <span className="text-on-surface-variant">تحديث مباشر 2025</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                    دليل الأنميات والمكتبة الشاملة
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                    استكشف آلاف الأعمال والمسلسلات والأفلام مع إمكانية التصفية المتقدمة وفق الكواكب والتصنيفات ودقة العرض.
                </p>
            </div>

            {/* Summary Badge */}
            <div className="bg-surface-container-low p-4 rounded-2xl border border-white/[0.06] flex items-center gap-4 shadow-md self-start md:self-auto">
                <div className="flex flex-col text-right">
                    <span className="text-xs text-on-surface-variant font-label-sm">إجمالي الأعمال المتوفرة</span>
                    <span className="font-headline-md text-headline-md text-on-surface font-bold">
                        {loading ? "..." : totalCount} <span className="text-xs text-secondary font-tajawal">عمل</span>
                    </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-white/5">
                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                </div>
            </div>
        </div>
    );
}
