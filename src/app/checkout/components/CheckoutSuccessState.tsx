import { CheckCircle, Loader2 } from "lucide-react";

export function CheckoutSuccessState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in zoom-in duration-500">
            <div className="bg-green-500/20 p-6 rounded-full mb-6">
                <CheckCircle className="text-green-500 w-20 h-20" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">تم الدفع بنجاح!</h2>
            <p className="text-slate-400 mb-6">جاري ترقية حسابك وتحويلك للملف الشخصي...</p>
            <Loader2 className="animate-spin text-green-500 w-8 h-8" />
        </div>
    );
}
