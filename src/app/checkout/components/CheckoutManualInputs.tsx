import { PaymentMethod } from "@/types";

interface CheckoutManualInputsProps {
    activeMethod?: PaymentMethod;
    manualDetails: string;
    setManualDetails: (val: string) => void;
}

export function CheckoutManualInputs({
    activeMethod,
    manualDetails,
    setManualDetails,
}: CheckoutManualInputsProps) {
    if (!activeMethod) return null;

    return (
        <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 whitespace-pre-line text-sm leading-relaxed">
                {activeMethod.details || activeMethod.instructions}
            </div>

            <div>
                <label className="block text-slate-400 mb-2 text-sm">بيانات التحويل (رقم المحفظة / صورة الإيصال)</label>
                <textarea
                    required
                    value={manualDetails}
                    onChange={(e) => setManualDetails(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 min-h-[100px]"
                    placeholder="أدخل رقم المحفظة التي قمت بالتحويل منها أو أي تفاصيل أخرى..."
                />
            </div>
        </div>
    );
}
