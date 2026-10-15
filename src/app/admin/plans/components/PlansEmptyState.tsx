import Link from "next/link";
import { Crown, Plus } from "lucide-react";

export function PlansEmptyState() {
    return (
        <div className="p-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-4">
            <Crown size={36} className="mx-auto text-amber-400 mb-2" />
            <h3 className="text-lg font-bold text-white">لا توجد خطط اشتراك مسجلة</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                قم بإضافة أول خطة اشتراك ليتمكن الزوار من الترقية إلى VIP عبر الموقع وتطبيق الهاتف.
            </p>
            <Link
                href="/admin/plans/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20"
            >
                <Plus size={16} />
                <span>إنشاء أول خطة الآن</span>
            </Link>
        </div>
    );
}
