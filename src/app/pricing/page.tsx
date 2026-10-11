"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plan } from "@/types";

const FAQ_ITEMS = [
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

export default function PricingPage() {
    const router = useRouter();
    const [subscribing, setSubscribing] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

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
                            onClick={() => setBillingCycle("monthly")}
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
                            onClick={() => setBillingCycle("yearly")}
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

                {/* 2. Three Pricing Cards */}
                <section className="py-space-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-gutter-lg items-stretch">
                        
                        {/* Card A: Free / Basic */}
                        <div className="rounded-2xl bg-surface-container-low p-space-xl flex flex-col justify-between shadow-xl border border-white/[0.05] hover:bg-surface-container transition-all">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="px-space-md py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-bold">
                                        الخطة المجانية للأبد
                                    </span>
                                    <span className="material-symbols-outlined text-on-surface-variant text-2xl">tv_off</span>
                                </div>
                                <h2 className="font-headline-md text-headline-md text-on-surface mt-space-md font-bold">
                                    الأساسية (تجريبية)
                                </h2>
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                                    مثالية للمتابعين الجدد لاستكشاف كتالوج المنصة وتجربة مشغل الفيديو.
                                </p>

                                <div className="mt-space-lg flex items-baseline gap-space-xs">
                                    <span className="font-headline-hero text-headline-hero text-on-surface font-black">0</span>
                                    <span className="font-body-md text-body-md text-on-surface-variant">ر.س / دائم</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant/70 mt-1">
                                    مجاني دائم وبدون إدخال بطاقة بنكية
                                </p>

                                <div className="h-px bg-white/[0.06] my-space-lg" />

                                <div className="space-y-space-sm text-on-surface">
                                    <p className="font-label-sm text-label-sm text-secondary font-bold tracking-wider">الميزات المتاحة:</p>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">أول حلقتين مجاناً من كل أنمي وفيلم</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">جودة العرض القياسية (720p HD)</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">شاشة مشاهدة واحدة في نفس الوقت</span>
                                    </div>
                                </div>

                                <div className="space-y-space-sm mt-space-md pt-space-sm">
                                    <p className="font-label-sm text-label-sm text-error font-bold tracking-wider">القيود في هذه الباقة:</p>
                                    <div className="flex items-start gap-space-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-error text-lg shrink-0 mt-0.5">lock</span>
                                        <span className="font-body-sm text-body-sm">الحلقات 3 وما بعدها مقفلة برمز VIP</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-error text-lg shrink-0 mt-0.5">cancel</span>
                                        <span className="font-body-sm text-body-sm">فواصل إعلانية ترويجية</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-space-xl">
                                <Link
                                    href="/animes"
                                    className="w-full py-space-sm rounded-xl bg-surface-container-high text-on-surface-variant font-cairo font-bold text-xs text-center block hover:bg-surface-container-highest hover:text-on-surface transition-all"
                                >
                                    تصفح الحلقات المجانية
                                </Link>
                            </div>
                        </div>

                        {/* Card B: Pro Otaku Plus */}
                        <div className="rounded-2xl bg-surface-container-low p-space-xl flex flex-col justify-between shadow-xl border border-white/[0.08] hover:border-primary-container/40 transition-all">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="px-space-md py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold border border-primary/20">
                                        الباقة الأكثر طلباً للشباب
                                    </span>
                                    <span className="material-symbols-outlined text-primary text-2xl">bolt</span>
                                </div>
                                <h2 className="font-headline-md text-headline-md text-on-surface mt-space-md font-bold">
                                    أوتاكو بلس (Full HD)
                                </h2>
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                                    لعشاق المتابعة الأسبوعية المستمرة مع تجربة مشاهدة خالية تماماً من الإعلانات.
                                </p>

                                <div className="mt-space-lg flex items-baseline gap-space-xs">
                                    <span className="font-headline-hero text-headline-hero text-on-surface font-black">
                                        {billingCycle === "yearly" ? "18" : "24"}
                                    </span>
                                    <span className="font-body-md text-body-md text-on-surface-variant">ر.س / شهرياً</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant/70 mt-1">
                                    {billingCycle === "yearly" ? "فاتورة سنوية 216 ر.س" : "تجديد شهري مرن"}
                                </p>

                                <div className="h-px bg-white/[0.06] my-space-lg" />

                                <div className="space-y-space-sm text-on-surface">
                                    <p className="font-label-sm text-label-sm text-primary font-bold tracking-wider">ميزات باقة أوتاكو:</p>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm font-bold">مشاهدة غير محدودة لجميع الحلقات كاملة</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">دقة عالية 1080p Full HD نقية</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">صفر إعلانات نهائياً وبدون انقطاع</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">تحميل 15 حلقة أوفلاين شهرياً</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">شاشتان متزامنتان في نفس الوقت</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-space-xl">
                                <button
                                    onClick={() => handleSubscribe("otaku-plus")}
                                    disabled={subscribing !== null}
                                    className="w-full py-space-md rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-cairo font-bold text-sm border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>اشترك في أوتاكو بلس</span>
                                </button>
                            </div>
                        </div>

                        {/* Card C: Emperor VIP (4K Ultra HD) - Highlighted Crimson */}
                        <div className="relative rounded-2xl bg-gradient-to-b from-surface-container to-surface-container-low p-space-xl flex flex-col justify-between shadow-[0_20px_50px_rgba(220,38,38,0.3)] border-2 border-primary-container">
                            {/* Top Ribbon */}
                            <div className="absolute -top-3.5 right-6 bg-primary-container text-on-primary-container text-[11px] font-cairo font-black px-3.5 py-1 rounded-full shadow-[0_0_16px_rgba(220,38,38,0.8)]">
                                خيار النخبة • الأكثر قيمة
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="px-space-md py-1 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-bold border border-secondary/30">
                                        إمبراطور الدايزر الأسطوري
                                    </span>
                                    <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        workspace_premium
                                    </span>
                                </div>
                                <h2 className="font-headline-md text-headline-md text-on-surface mt-space-md font-extrabold">
                                    إمبراطور VIP (4K الأسطورية)
                                </h2>
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs min-h-[36px]">
                                    التجربة السينمائية الفاخرة المطلقة، سرعة خوادم مخصصة، وشارات VIP الحصرية.
                                </p>

                                <div className="mt-space-lg flex items-baseline gap-space-xs">
                                    <span className="font-headline-hero text-headline-hero text-on-surface font-black">
                                        {billingCycle === "yearly" ? "32" : "44"}
                                    </span>
                                    <span className="font-body-md text-body-md text-on-surface-variant">ر.س / شهرياً</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-secondary font-bold mt-1">
                                    {billingCycle === "yearly" ? "384 ر.س سنوياً (وفرت 144 ر.س!)" : "تجديد شهري VIP"}
                                </p>

                                <div className="h-px bg-white/[0.06] my-space-lg" />

                                <div className="space-y-space-sm text-on-surface">
                                    <p className="font-label-sm text-label-sm text-secondary font-bold tracking-wider">كافة ميزات VIP المطلقة:</p>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm font-bold text-white">دقة سينمائية فائقة 4K Ultra HD + HDR</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">صوت محيطي نقي 5.1 Dolby Atmos</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">تحميل بلا حدود للمشاهدة بدون إنترنت</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">4 شاشات متزامنة لجميع أفراد العائلة</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">سيرفرات فائقة السرعة مخصصة لـ VIP فقط</span>
                                    </div>
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">check_circle</span>
                                        <span className="font-body-sm text-body-sm">شارة ذهبية فاخرة في بروفايلك</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-space-xl">
                                <button
                                    onClick={() => handleSubscribe("emperor-vip")}
                                    disabled={subscribing !== null}
                                    className="w-full py-space-md rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold shadow-[0_0_24px_rgba(220,38,38,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-xl">diamond</span>
                                    <span>ترقية حسابي إلى إمبراطور VIP</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 3. FAQ Section */}
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
                        {FAQ_ITEMS.map((faq, idx) => {
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

            </div>
        </div>
    );
}
