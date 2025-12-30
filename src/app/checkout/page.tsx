"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { Loader2, CreditCard, Lock, CheckCircle, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { Plan, PaymentMethod } from "@/types";

function CheckoutForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planId = searchParams.get("plan");
    const transactionId = searchParams.get("tid");

    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string>("");
    const [currency, setCurrency] = useState("ج.م");

    // Card State
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");

    // Manual State
    const [manualDetails, setManualDetails] = useState("");

    const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS" | "ERROR">("IDLE");

    useEffect(() => {
        if (!planId) return;
        const fetchData = async () => {
            try {
                // Fetch Settings for Currency
                const settingsRes = await fetch("/api/settings");
                if (settingsRes.ok) {
                    const settings = await settingsRes.json();
                    if (settings.currency) setCurrency(settings.currency);
                }

                // Fetch Plan
                const planRes = await fetch(`/api/admin/plans/${planId}`);
                if (planRes.ok) {
                    const fetchedPlan = await planRes.json();
                    if (fetchedPlan && fetchedPlan.isActive) {
                        setPlan(fetchedPlan);
                    } else {
                        setPlan(null); // Plan not found or not active
                    }
                } else {
                    setPlan(null); // Plan not found
                }

                // Fetch Payment Methods
                const methodsRes = await fetch("/api/admin/payment-methods");
                if (methodsRes.ok) {
                    const methodsData = await methodsRes.json();
                    const activeMethods = methodsData.filter((m: PaymentMethod) => m.isActive);
                    setPaymentMethods(activeMethods);
                    if (activeMethods.length > 0) {
                        setSelectedMethod(activeMethods[0].id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setPlan(null); // Ensure plan is null if any fetch fails
            } finally {
                setFetchingData(false);
            }
        };
        fetchData();
    }, [planId]);

    const activeMethod = paymentMethods.find(m => m.id === selectedMethod);

    if (!planId || !transactionId) {
        return (
            <div className="text-center py-20 text-white">
                <h2 className="text-2xl font-bold mb-4">رابط غير صالح</h2>
                <Link href="/pricing" className="text-red-500 hover:underline">العودة لصفحة الأسعار</Link>
            </div>
        );
    }

    if (fetchingData) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" /></div>;
    }

    if (!plan) {
        return (
            <div className="text-center py-20 text-white">
                <h2 className="text-2xl font-bold mb-4">الخطة غير موجودة</h2>
                <Link href="/pricing" className="text-red-500 hover:underline">العودة لصفحة الأسعار</Link>
            </div>
        );
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("PROCESSING");

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const res = await fetch("/api/subscription/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transactionId,
                    planId,
                    paymentMethodId: selectedMethod,
                    paymentDetails: activeMethod?.type === 'card' ? { cardName, cardNumber, expiry, cvc } : { manualDetails }
                }),
            });

            if (res.ok) {
                setStatus("SUCCESS");
                setTimeout(() => {
                    router.push("/profile");
                }, 2000);
            } else {
                setStatus("ERROR");
            }
        } catch (error) {
            setStatus("ERROR");
        } finally {
            setLoading(false);
        }
    };

    if (status === "SUCCESS") {
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

    return (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
            {/* Order Summary */}
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

            {/* Payment Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="text-red-500" /> تفاصيل الدفع
                </h2>

                {/* Method Selection */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                    {paymentMethods.map(method => (
                        <button
                            key={method.id}
                            type="button" // Important to prevent form submission
                            onClick={() => setSelectedMethod(method.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${selectedMethod === method.id
                                ? 'bg-red-600 border-red-600 text-white'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                }`}
                        >
                            {method.name}
                        </button>
                    ))}
                </div>

                <form onSubmit={handlePayment} className="space-y-4">

                    {activeMethod?.type === 'card' && (
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
                    )}

                    {activeMethod?.type === 'manual' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 whitespace-pre-line text-sm leading-relaxed">
                                {activeMethod.instructions}
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
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !selectedMethod}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>دفع {plan.price} {currency}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen">
            <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 className="animate-spin text-red-600 w-10 h-10" /></div>}>
                <CheckoutForm />
            </Suspense>
        </div>
    );
}
