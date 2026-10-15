"use client";

import React from "react";
import Link from "next/link";

interface PricingPlansGridProps {
    billingCycle: "monthly" | "yearly";
    subscribing: string | null;
    onSubscribe: (planKey: string) => void;
}

export default function PricingPlansGrid({
    billingCycle,
    subscribing,
    onSubscribe
}: PricingPlansGridProps) {
    return (
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
                            className="w-full py-space-sm min-h-[48px] rounded-xl bg-surface-container-high text-on-surface-variant font-cairo font-bold text-xs text-center flex items-center justify-center hover:bg-surface-container-highest hover:text-on-surface transition-all active:scale-98"
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
                            onClick={() => onSubscribe("otaku-plus")}
                            disabled={subscribing !== null}
                            className="w-full py-space-md min-h-[48px] rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-cairo font-bold text-sm border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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
                            onClick={() => onSubscribe("emperor-vip")}
                            disabled={subscribing !== null}
                            className="w-full py-space-md min-h-[52px] rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold shadow-[0_0_24px_rgba(220,38,38,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-xl">diamond</span>
                            <span>ترقية حسابي إلى إمبراطور VIP</span>
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
