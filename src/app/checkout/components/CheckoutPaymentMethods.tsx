import { CreditCard } from "lucide-react";
import { PaymentMethod } from "@/types";

interface CheckoutPaymentMethodsProps {
    paymentMethods: PaymentMethod[];
    selectedMethod: string;
    onSelectMethod: (id: string) => void;
}

export function CheckoutPaymentMethods({
    paymentMethods,
    selectedMethod,
    onSelectMethod,
}: CheckoutPaymentMethodsProps) {
    return (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {paymentMethods.map(method => (
                <button
                    key={method.id}
                    type="button"
                    onClick={() => onSelectMethod(method.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                        selectedMethod === method.id
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                >
                    {method.icon ? (
                        <img src={method.icon} alt="" className="w-5 h-5 object-contain" />
                    ) : method.type === 'card' ? (
                        <CreditCard size={18} />
                    ) : (
                        <div className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-[10px]">$</div>
                    )}
                    {method.name}
                </button>
            ))}
        </div>
    );
}
