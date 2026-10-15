"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plan, PaymentMethod } from "@/types";

export function useCheckout() {
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
            console.error("Payment error:", error);
            setStatus("ERROR");
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
}
