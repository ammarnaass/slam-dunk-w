interface AdminDashboardMetricsProps {
    animeCount: number;
    featuredCount: number;
    episodeCount: number;
    characterCount: number;
    userCount: number;
}

export function AdminDashboardMetrics({
    animeCount,
    featuredCount,
    episodeCount,
    characterCount,
    userCount,
}: AdminDashboardMetricsProps) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg">
            {/* Metric 1 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.05] shadow-sm flex flex-col justify-between gap-space-md group hover:bg-surface-container transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col text-right">
                        <span className="font-label-md text-label-md text-on-surface-variant font-bold">المكتبة الرقمية والأعمال</span>
                        <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">{animeCount}</span>
                        <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">star</span>
                            {featuredCount} عمل مميز بالسلايدر
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-inner">
                        <span className="material-symbols-outlined text-[26px]">video_library</span>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-space-sm bg-surface-container/60 p-2 rounded-xl text-xs">
                    <span className="text-on-surface-variant font-tajawal">الحلقات المرفوعة:</span>
                    <span className="font-mono font-bold text-on-surface">{episodeCount} حلقة</span>
                </div>
            </div>

            {/* Metric 2 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.05] shadow-sm flex flex-col justify-between gap-space-md group hover:bg-surface-container transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col text-right">
                        <div className="flex items-center gap-2">
                            <span className="font-label-md text-label-md text-on-surface-variant font-bold">أبطال وشخصيات الأنمي</span>
                        </div>
                        <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">{characterCount}</span>
                        <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">groups</span>
                            أبطال مسجلون بالدبلجة
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container shadow-inner">
                        <span className="material-symbols-outlined text-[26px]">person</span>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-space-sm bg-surface-container/60 p-2 rounded-xl text-xs">
                    <span className="text-on-surface-variant font-tajawal">طاقم الدبلجة:</span>
                    <span className="font-mono font-bold text-secondary">مركز الزهرة + أصلي</span>
                </div>
            </div>

            {/* Metric 3 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.05] shadow-sm flex flex-col justify-between gap-space-md group hover:bg-surface-container transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col text-right">
                        <span className="font-label-md text-label-md text-on-surface-variant font-bold">المشتركون المسجلون</span>
                        <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">{userCount}</span>
                        <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">verified_user</span>
                            أعضاء نشطون في المنصة
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary shadow-inner">
                        <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-space-sm bg-surface-container/60 p-2 rounded-xl text-xs">
                    <span className="text-on-surface-variant font-tajawal">حالة الحسابات:</span>
                    <span className="font-mono font-bold text-emerald-400">100% نشطة</span>
                </div>
            </div>

            {/* Metric 4 */}
            <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.05] shadow-sm flex flex-col justify-between gap-space-md group hover:bg-surface-container transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col text-right">
                        <span className="font-label-md text-label-md text-on-surface-variant font-bold">حالة الخوادم و CDN</span>
                        <span className="font-headline-lg text-headline-lg text-emerald-400 font-bold tracking-tight mt-1">99.9%</span>
                        <span className="font-label-sm text-label-sm text-emerald-400 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            جميع العقد مستقرة
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-emerald-400 shadow-inner">
                        <span className="material-symbols-outlined text-[26px]">dns</span>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-space-sm bg-surface-container/60 p-2 rounded-xl text-xs">
                    <span className="text-on-surface-variant font-tajawal">الاستجابة:</span>
                    <span className="font-mono font-bold text-on-surface">24ms فائق السرعة</span>
                </div>
            </div>
        </section>
    );
}
