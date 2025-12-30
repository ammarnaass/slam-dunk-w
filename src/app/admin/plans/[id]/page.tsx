import PlanForm from "@/components/admin/PlanForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prismadb";

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const plan = await prisma.plan.findUnique({
        where: { id }
    });

    if (!plan) {
        return (
            <div className="text-center py-20 text-white">
                <h2 className="text-2xl font-bold mb-4">الخطة غير موجودة</h2>
                <Link href="/admin/plans" className="text-red-500 hover:underline">العودة للخطط</Link>
            </div>
        );
    }

    // Map to legacy structure for PlanForm if needed
    const legacyPlan = {
        ...plan,
        isPopular: false, // Default if not in DB
    };

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

            <PlanForm initialData={legacyPlan} isEdit={true} />
        </div>
    );
}
