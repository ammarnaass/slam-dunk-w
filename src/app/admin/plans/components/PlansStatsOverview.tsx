import { PlansStats } from "../hooks/useAdminPlans";

interface PlansStatsOverviewProps {
    stats: PlansStats;
}

export function PlansStatsOverview({ stats }: PlansStatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-xl">
                <span className="text-xs font-bold text-slate-400 block mb-1">إجمالي الخطط المعرفة</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-white">{stats.total}</span>
                    <span className="text-xs text-slate-500 font-semibold">باقة</span>
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
                <span className="text-xs font-bold text-emerald-400 block mb-1">الخطط المعروضة للجمهور</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-300">{stats.active}</span>
                    <span className="text-xs text-slate-500 font-semibold">مفعلة وتستقبل المشتركين</span>
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 shadow-xl">
                <span className="text-xs font-bold text-amber-400 block mb-1">الخطة الأكثر طلباً</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-black text-amber-300 truncate">{stats.popular}</span>
                </div>
            </div>
        </div>
    );
}
