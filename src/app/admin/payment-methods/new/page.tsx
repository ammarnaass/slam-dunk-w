import PaymentMethodForm from "@/components/admin/PaymentMethodForm";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NewPaymentMethodPage() {
    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/payment-methods"
                    className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white"
                >
                    <ArrowRight size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-white">إضافة وسيلة دفع جديدة</h1>
            </div>

            <PaymentMethodForm />
        </div>
    );
}
