import PlanForm from "@/components/admin/PlanForm";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { use } from "react";
import { getPlans } from "@/lib/db";

// Since this is a server component, we can fetch data directly
export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const plans = getPlans();
    const plan = plans.find(p => p.id === id);

    if (!plan) {
        return (
            <div className="text-center py-20 text-white">
                <h2 className="text-2xl font-bold mb-4">الخطة غير موجودة</h2>
                <Link href="/admin/plans" className="text-red-500 hover:underline">العودة للخطط</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/plans"
                    className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white"
                >
                    <ArrowRight size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-white">تعديل الخطة: {plan.name}</h1>
            </div>

            <PlanForm initialData={plan} isEdit={true} />
        </div>
    );
}
