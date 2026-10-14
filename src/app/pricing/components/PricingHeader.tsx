"use client";

import React from "react";

interface PricingHeaderProps {
    billingCycle: "monthly" | "yearly";
    onBillingCycleChange: (cycle: "monthly" | "yearly") => void;
}

export default function PricingHeader({
    billingCycle,
    onBillingCycleChange
}: PricingHeaderProps) {
    return (
        <section className="flex flex-col items-center text-center pt-space-md pb-space-lg">
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-space-xs px-3 sm:px-space-md py-1 rounded-full bg-surface-container-high shadow-lg mb-space-md">
                <span className="material-symbols-outlined text-secondary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    workspace_premium
                </span>
                <span className="font-label-md text-xs sm:text-label-md text-secondary-fixed">
                    ترقية الحساب إلى VIP • تجربة الأنمي الفاخرة
                </span>
            </div>

            <h1 className="font-cairo font-black text-2xl sm:text-4xl lg:text-5xl text-on-surface max-w-4xl tracking-tight leading-tight">
                اختر خطتك وانطلق في عوالم الأنمي <span className="text-primary-container drop-shadow-[0_0_24px_rgba(220,38,38,0.5)]">بلا حدود</span> أو إعلانات
            </h1>

            <p className="font-body-md sm:font-body-lg text-xs sm:text-body-lg text-on-surface-variant max-w-2xl mt-3 sm:mt-space-md leading-relaxed">
                يمكن للجميع الاستمتاع بـ <span className="text-on-surface font-bold">أول حلقتين مجاناً</span> من أي عمل كلاسيكي أو حديث، بينما يفتح اشتراك VIP كافة الحلقات الحصرية ومسلسلات الموسم المباشرة بدقة 4K Ultra HD مع تنزيل بلا قيود.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="mt-6 sm:mt-space-xl p-1 sm:p-space-xs rounded-2xl bg-surface-container-low shadow-xl flex items-center border border-white/[0.06] max-w-full">
                <button
                    type="button"
                    onClick={() => onBillingCycleChange("monthly")}
                    className={`px-3 sm:px-space-lg py-2 sm:py-space-sm rounded-xl font-cairo font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                        billingCycle === "monthly"
                            ? "text-on-surface bg-surface-container-high shadow-md"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                    اشتراك شهري
                </button>
                <button
                    type="button"
                    onClick={() => onBillingCycleChange("yearly")}
                    className={`px-3 sm:px-space-lg py-2 sm:py-space-sm rounded-xl font-cairo font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 sm:gap-space-xs cursor-pointer ${
                        billingCycle === "yearly"
                            ? "bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(220,38,38,0.5)]"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                    <span>اشتراك سنوي</span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-label-sm text-[9px] sm:text-[10px] font-black shadow-[0_0_8px_rgba(238,152,0,0.5)]">
                        وفر 25%
                    </span>
                </button>
            </div>
        </section>
    );
}
