import PlanForm from "@/components/admin/PlanForm";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

export default function NewPlanPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
                <Link
                    href="/admin/plans"
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                    title="العودة لقائمة الخطط"
                >
                    <ArrowRight size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        إنشاء خطة اشتراك جديدة
                    </h1>
                    <p className="text-xs text-slate-400">
                        تحديد التسعير، المدة الزمنية، والمميزات الترويجية للباقة
                    </p>
                </div>
            </div>

            <PlanForm />
        </div>
    );
}
