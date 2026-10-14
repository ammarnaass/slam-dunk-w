"use client";

import React, { useState } from "react";

export const PRICING_FAQ_ITEMS = [
    {
        q: "ما هي سياسة الحلقتين المجانيتين على المنصة؟",
        a: "تتيح منصة أنمي دايز لجميع الزوار مشاهدة أول حلقتين من أي مسلسل أو فيلم أنمي مجاناً بدقة HD وبدون الحاجة لبطاقة ائتمانية. لمتابعة الحلقة الثالثة وما بعدها يتم الترقية لحساب VIP."
    },
    {
        q: "هل يمكنني إلغاء اشتراك VIP في أي وقت؟",
        a: "نعم، يمكنك إلغاء التجديد التلقائي بضغطة زر واحدة من صفحة ملفك الشخصي في أي وقت، وسيظل اشتراكك سارياً حتى نهاية الفترة المدفوعة."
    },
    {
        q: "هل يتوفر تطبيق أنمي دايز على الهواتف والشاشات الذكية؟",
        a: "نعم! منصتنا تعمل كـ PWA متطور وخفيف يمكنك تثبيته مباشرة على هواتف Android و iPhone، وكذلك شاشات التلفاز الذكية Smart TV بنقرة واحدة."
    },
    {
        q: "ما هي طرق الدفع المدعومة؟",
        a: "ندعم الدفع الآمن عبر مدى (Mada)، بطاقات Visa و MasterCard، Apple Pay، والتحويل البنكي المباشر."
    }
];

export default function PricingFaqSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section className="py-space-xl max-w-4xl mx-auto">
            <div className="text-center mb-space-lg">
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
                    الأسئلة الشائعة حول اشتراك VIP
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    كل ما تحتاج معرفته عن سياسة المشاهدة والاشتراكات
                </p>
            </div>

            <div className="space-y-3">
                {PRICING_FAQ_ITEMS.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                        <div 
                            key={idx}
                            className="rounded-2xl bg-surface-container-low border border-white/[0.06] overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setOpenFaq(isOpen ? null : idx)}
                                className="w-full p-space-md flex items-center justify-between text-right font-headline-sm text-sm sm:text-base font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                            >
                                <span>{faq.q}</span>
                                <span className={`material-symbols-outlined text-xl transition-transform duration-200 ${isOpen ? "rotate-180 text-primary-container" : ""}`}>
                                    expand_more
                                </span>
                            </button>
                            {isOpen && (
                                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant leading-relaxed border-t border-white/[0.04] pt-space-xs">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
