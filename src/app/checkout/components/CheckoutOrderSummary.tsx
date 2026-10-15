import { ShieldCheck } from "lucide-react";
import { Plan } from "@/types";

interface CheckoutOrderSummaryProps {
    plan: Plan;
    currency: string;
}

export function CheckoutOrderSummary({ plan, currency }: CheckoutOrderSummaryProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-4">ملخص الطلب</h3>
            <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400">الخطة</span>
                <span className="font-bold text-white">{plan.name}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400">المدة</span>
                <span className="font-bold text-white">{plan.duration} يوم</span>
            </div>
            <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-800">
                <span className="text-lg font-bold text-white">الإجمالي</span>
                <span className="text-2xl font-bold text-red-500">{plan.price} {currency}</span>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                <ShieldCheck className="text-blue-500 shrink-0" />
                <p className="text-sm text-blue-200">
                    معلوماتك مشفرة وآمنة تماماً. عملية دفع وهمية (Mock Payment).
                </p>
            </div>
        </div>
    );
}
