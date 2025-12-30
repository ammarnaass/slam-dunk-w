import PaymentMethodForm from "@/components/admin/PaymentMethodForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prismadb";

export default async function EditPaymentMethodPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const method = await prisma.paymentMethod.findUnique({
        where: { id }
    });

    if (!method) {
        return (
            <div className="text-center py-20 text-white">
                <h2 className="text-2xl font-bold mb-4">الوسيلة غير موجودة</h2>
                <Link href="/admin/payment-methods" className="text-red-500 hover:underline">العودة للقائمة</Link>
            </div>
        );
    }

    // Map to legacy structure if needed
    const legacyMethod = {
        ...method,
        active: method.isActive,
        logoUrl: method.icon,
        instructions: method.details
    };

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

            <PaymentMethodForm initialData={legacyMethod} isEdit={true} />
        </div>
    );
}
