"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PricingHeader from "./components/PricingHeader";
import PricingPlansGrid from "./components/PricingPlansGrid";
import PricingFaqSection from "./components/PricingFaqSection";

export default function PricingPage() {
    const router = useRouter();
    const [subscribing, setSubscribing] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

    const handleSubscribe = async (planKey: string) => {
        setSubscribing(planKey);
        try {
            const res = await fetch("/api/subscription/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planKey, cycle: billingCycle }),
            });

            const data = await res.json();
            if (data.url) {
                router.push(data.url);
            } else {
                router.push(`/checkout?plan=${planKey}&cycle=${billingCycle}`);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            router.push(`/checkout?plan=${planKey}&cycle=${billingCycle}`);
        } finally {
            setSubscribing(null);
        }
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pt-20 sm:pt-24 pb-12 sm:pb-20 relative overflow-hidden">
            {/* Ambient Radial Blooms */}
            <div className="absolute -top-40 right-1/4 w-[650px] h-[650px] rounded-full bg-primary-container/15 blur-[140px] pointer-events-none -z-10" />
            <div className="absolute top-96 left-10 w-[500px] h-[500px] rounded-full bg-secondary-container/10 blur-[130px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 1. Header Hero Section */}
                <PricingHeader
                    billingCycle={billingCycle}
                    onBillingCycleChange={setBillingCycle}
                />

                {/* 2. Three Pricing Cards */}
                <PricingPlansGrid
                    billingCycle={billingCycle}
                    subscribing={subscribing}
                    onSubscribe={handleSubscribe}
                />

                {/* 3. FAQ Section */}
                <PricingFaqSection />
            </div>
        </div>
    );
}
