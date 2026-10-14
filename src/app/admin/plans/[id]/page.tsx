import PlanForm from "@/components/admin/PlanForm";
import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let plan: any = null;

    try {
        plan = await prisma.plan.findUnique({
            where: { id }
        });
    } catch (e) {
        console.warn("Prisma findUnique error in EditPlanPage:", e);
    }

    // Fallback to local plans.json
    if (!plan) {
        try {
            const filePath = path.join(process.cwd(), "src/data/plans.json");
            if (fs.existsSync(filePath)) {
                const list = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                plan = list.find((p: any) => p.id === id);
            }
        } catch (fallbackErr) {
            console.warn("Fallback to plans.json failed:", fallbackErr);
        }
    }

    if (!plan) {
        return (
            <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <h2 className="text-xl font-bold text-white">الخطة غير موجودة</h2>
                <p className="text-xs text-slate-400">
                    لم يتم العثور على خطة الاشتراك المطلوبة أو ربما تم حذفها مسبقاً.
                </p>
                <Link 
                    href="/admin/plans" 
                    className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                >
                    العودة لخطط الاشتراكات
                </Link>
            </div>
        );
    }

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
                        تعديل الخطة: {plan.name}
                    </h1>
                    <p className="text-xs text-slate-400">
                        تعديل السعر، المدة الزمنية، والمميزات الترويجية للباقة
                    </p>
                </div>
            </div>

            <PlanForm initialData={plan} isEdit={true} />
        </div>
    );
}
