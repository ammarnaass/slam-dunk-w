"use client";

import { useAdminPlans } from "./hooks/useAdminPlans";
import {
    PlansToast,
    PlansHeader,
    PlansStatsOverview,
    PlanAdminCard,
    PlansEmptyState,
} from "./components";

export default function PlansPage() {
    const {
        plans,
        loading,
        currency,
        togglingId,
        deletingId,
        toast,
        stats,
        handleToggleActive,
        handleTogglePopular,
        handleDelete,
    } = useAdminPlans();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <p className="text-sm text-slate-400 font-bold">جاري تحميل خطط الاشتراكات...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Toast Message */}
            <PlansToast toast={toast} />

            {/* Header Area */}
            <PlansHeader />

            {/* Stats Overview */}
            <PlansStatsOverview stats={stats} />

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <PlanAdminCard
                        key={plan.id}
                        plan={plan}
                        currency={currency}
                        isToggling={togglingId === plan.id}
                        isDeleting={deletingId === plan.id}
                        onToggleActive={handleToggleActive}
                        onTogglePopular={handleTogglePopular}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Empty State */}
            {plans.length === 0 && <PlansEmptyState />}
        </div>
    );
}
