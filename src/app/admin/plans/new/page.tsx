import PlanForm from "@/components/admin/PlanForm";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NewPlanPage() {
    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/plans"
                    className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white"
                >
                    <ArrowRight size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-white">إضافة خطة جديدة</h1>
            </div>

            <PlanForm />
        </div>
    );
}
