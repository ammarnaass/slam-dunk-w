"use client";

import { Check, Star, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Plan } from "@/types";

export default function PricingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [currency, setCurrency] = useState("ج.م");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Currency
                fetch("/api/settings").then(res => res.json()).then(data => {
                    if (data.currency) setCurrency(data.currency);
                }).catch(console.error);

                const res = await fetch("/api/admin/plans");
                if (res.ok) {
                    const data = await res.json();
                    setPlans(data.filter((p: Plan) => p.isActive));
                }
            } catch (error) {
                console.error("Failed to fetch plans");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubscribe = async (planId: string) => {
        setSubscribing(true);
        try {
            const res = await fetch("/api/subscription/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId }),
            });

            const data = await res.json();

            if (data.url) {
                router.push(data.url);
            } else {
                alert("حدث خطأ، يرجى المحاولة لاحقاً");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("حدث خطأ في الاتصال");
        } finally {
            setSubscribing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    اختر خطتك المثالية <span className="text-red-600">للمشاهدة</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    استمتع بتجربة مشاهدة لا مثيل لها مع خططنا المرنة.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-slate-900 border rounded-2xl p-8 relative transition-all hover:-translate-y-2 ${plan.isPopular
                            ? 'border-2 border-red-600 shadow-2xl shadow-red-900/20'
                            : 'border-slate-800 hover:border-slate-700'
                            }`}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl font-bold text-sm">
                                الأكثر طلباً
                            </div>
                        )}

                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            {plan.isPopular && <Star className="fill-yellow-500 text-yellow-500" size={24} />}
                            {plan.name}
                        </h3>

                        <div className="text-4xl font-bold text-slate-200 mb-6">
                            {plan.price} <span className="text-lg text-slate-500 font-normal">{currency} / {plan.duration} يوم</span>
                        </div>

                        <ul className="space-y-4 mb-8 min-h-[160px]">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-300">
                                    <div className={`p-1 rounded-full ${plan.isPopular ? 'bg-red-600/20' : 'bg-slate-800'}`}>
                                        <Check className={plan.isPopular ? "text-red-500" : "text-green-500"} size={16} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {plan.price === 0 ? (
                            <Link
                                href="/login"
                                className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-colors"
                            >
                                ابدأ المشاهدة مجاناً
                            </Link>
                        ) : (
                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={subscribing}
                                className={`block w-full text-center font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${plan.isPopular
                                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-600/20'
                                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                                    }`}
                            >
                                {subscribing ? "جاري التحويل..." : "اشترك الآن"}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
