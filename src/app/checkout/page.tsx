"use client";

import { Suspense } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { useCheckout } from "./hooks/useCheckout";
import {
    CheckoutOrderSummary,
    CheckoutPaymentMethods,
    CheckoutCardInputs,
    CheckoutManualInputs,
    CheckoutSuccessState,
    CheckoutNotice,
} from "./components";

function CheckoutForm() {
    const {
        planId,
        transactionId,
        loading,
        fetchingData,
        plan,
        paymentMethods,
        selectedMethod,
        setSelectedMethod,
        currency,
        cardName,
        setCardName,
        cardNumber,
        setCardNumber,
        expiry,
        setExpiry,
        cvc,
        setCvc,
        manualDetails,
        setManualDetails,
        status,
        activeMethod,
        handlePayment,
    } = useCheckout();

    if (!planId || !transactionId) {
        return <CheckoutNotice title="رابط غير صالح" />;
    }

    if (fetchingData) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-red-600" />
            </div>
        );
    }

    if (!plan) {
        return <CheckoutNotice title="الخطة غير موجودة" />;
    }

    if (status === "SUCCESS") {
        return <CheckoutSuccessState />;
    }

    return (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
            {/* Order Summary */}
            <CheckoutOrderSummary plan={plan} currency={currency} />

            {/* Payment Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400"></div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="text-red-500" /> تفاصيل الدفع
                </h2>

                {/* Method Selection */}
                <CheckoutPaymentMethods
                    paymentMethods={paymentMethods}
                    selectedMethod={selectedMethod}
                    onSelectMethod={setSelectedMethod}
                />

                <form onSubmit={handlePayment} className="space-y-4">
                    {activeMethod?.type === "card" && (
                        <CheckoutCardInputs
                            cardName={cardName}
                            setCardName={setCardName}
                            cardNumber={cardNumber}
                            setCardNumber={setCardNumber}
                            expiry={expiry}
                            setExpiry={setExpiry}
                            cvc={cvc}
                            setCvc={setCvc}
                        />
                    )}

                    {activeMethod?.type === "manual" && (
                        <CheckoutManualInputs
                            activeMethod={activeMethod}
                            manualDetails={manualDetails}
                            setManualDetails={setManualDetails}
                        />
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
