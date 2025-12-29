import PaymentMethodForm from "@/components/admin/PaymentMethodForm";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { getPaymentMethods } from "@/lib/db";

export default async function EditPaymentMethodPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const methods = getPaymentMethods();
    const method = methods.find(p => p.id === id);

    if (!method) {
        return (
            <div className="text-center py-20 text-white">
                <h2 className="text-2xl font-bold mb-4">الوسيلة غير موجودة</h2>
                <Link href="/admin/payment-methods" className="text-red-500 hover:underline">العودة للقائمة</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/payment-methods"
                    className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white"
                >
                    <ArrowRight size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-white">تعديل: {method.name}</h1>
            </div>

            <PaymentMethodForm initialData={method} isEdit={true} />
        </div>
    );
}
