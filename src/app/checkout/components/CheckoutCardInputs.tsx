import { CreditCard, Lock } from "lucide-react";

interface CheckoutCardInputsProps {
    cardName: string;
    setCardName: (val: string) => void;
    cardNumber: string;
    setCardNumber: (val: string) => void;
    expiry: string;
    setExpiry: (val: string) => void;
    cvc: string;
    setCvc: (val: string) => void;
}

export function CheckoutCardInputs({
    cardName,
    setCardName,
    cardNumber,
    setCardNumber,
    expiry,
    setExpiry,
    cvc,
    setCvc,
}: CheckoutCardInputsProps) {
    return (
        <div className="space-y-4 animate-in fade-in">
            <div>
                <label className="block text-slate-400 mb-2 text-sm">اسم حامل البطاقة</label>
                <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 appearance-none"
                    placeholder="الاسم كما يظهر على البطاقة"
                />
            </div>

            <div>
                <label className="block text-slate-400 mb-2 text-sm">رقم البطاقة</label>
                <div className="relative">
                    <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-3 pr-10 py-3 text-white focus:outline-none focus:border-red-600 font-mono tracking-widest"
                        placeholder="0000 0000 0000 0000"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-400 mb-2 text-sm">تاريخ الانتهاء</label>
                    <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 font-mono center text-center"
                        placeholder="MM/YY"
                    />
                </div>
                <div>
                    <label className="block text-slate-400 mb-2 text-sm">رمز CVC</label>
                    <div className="relative">
                        <input
                            type="text"
                            required
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 font-mono text-center"
                            placeholder="123"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}
