"use client";

import React from "react";

interface AnimeReviewsSectionProps {
    ratingVal: string;
    onAddReviewClick: () => void;
}

export function AnimeReviewsSection({
    ratingVal,
    onAddReviewClick,
}: AnimeReviewsSectionProps) {
    return (
        <section className="w-full max-w-7xl mx-auto px-gutter-lg py-space-xl border-t border-white/[0.05]">
            <div className="p-space-xl rounded-3xl bg-surface-container-low border border-white/[0.05] shadow-xl">
                <div className="flex flex-col lg:flex-row gap-space-xl items-start">
                    {/* Rating Metrics Left Card (RTL right) */}
                    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col items-center text-center p-space-lg rounded-2xl bg-surface-container border border-white/[0.04] shadow-inner">
                        <span className="font-label-md text-label-md text-on-surface-variant mb-1">
                            تقييم مجتمع ANIME DAZE
                        </span>
                        <div className="flex items-center gap-2 my-2">
                            <span className="font-headline-hero text-headline-hero text-on-surface font-extrabold leading-none">
                                {ratingVal}
                            </span>
                            <div className="flex flex-col text-right">
                                <div className="flex text-secondary">
                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                </div>
                                <span className="font-label-sm text-label-sm text-on-surface-variant">من 10 نقاط</span>
                            </div>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                            مبني على 28,420 مراجعة معتمدة
                        </span>

                        {/* Stars Distribution Bars */}
                        <div className="w-full flex flex-col gap-2 mt-space-lg">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-8 text-on-surface-variant font-mono">5 ★</span>
                                <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary rounded-full w-[78%]"></div>
                                </div>
                                <span className="w-8 text-on-surface-variant font-mono text-left">78%</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-8 text-on-surface-variant font-mono">4 ★</span>
                                <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary/80 rounded-full w-[14%]"></div>
                                </div>
                                <span className="w-8 text-on-surface-variant font-mono text-left">14%</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-8 text-on-surface-variant font-mono">3 ★</span>
                                <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary/50 rounded-full w-[5%]"></div>
                                </div>
                                <span className="w-8 text-on-surface-variant font-mono text-left">5%</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-8 text-on-surface-variant font-mono">2 ★</span>
                                <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary/30 rounded-full w-[2%]"></div>
                                </div>
                                <span className="w-8 text-on-surface-variant font-mono text-left">2%</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-8 text-on-surface-variant font-mono">1 ★</span>
                                <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary/20 rounded-full w-[1%]"></div>
                                </div>
                                <span className="w-8 text-on-surface-variant font-mono text-left">1%</span>
                            </div>
                        </div>

                        <button 
                            onClick={onAddReviewClick}
                            className="mt-space-lg w-full py-3 min-h-[48px] rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">rate_review</span>
                            <span>أضف تقييمك للعمل</span>
                        </button>
                    </div>

                    {/* Featured User Reviews */}
                    <div className="flex-1 flex flex-col gap-space-md w-full text-right">
                        <div className="flex items-center justify-between">
                            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">أبرز مراجعات المشاهدين</h3>
                            <span className="font-label-md text-label-md text-primary hover:underline cursor-pointer">
                                عرض جميع المراجعات (142)
                            </span>
                        </div>

                        {/* Review 1 */}
                        <div className="p-space-lg rounded-2xl bg-surface-container border border-white/[0.04] shadow-md flex flex-col gap-space-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold">
                                        ط
                                    </div>
                                    <div>
                                        <h5 className="font-headline-sm text-headline-sm text-sm text-on-surface font-bold">طارق السبيعي (أوتاكو كلاسيك)</h5>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">قبل يومين • شاهد 7 حلقات</span>
                                    </div>
                                </div>
                                <div className="flex text-secondary">
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </div>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                "تحفة بصرية استثنائية أعادت لي بريق أعمال سبيستون الذهبية مع أحدث تقنيات الإنتاج الحديث! أداء صوتي عربي فصيح متقن يبعث على الفخر، وأتمنى استمرار هذا الألق طوال حلقات الموسم."
                            </p>
                            <div className="flex items-center gap-space-md pt-space-xs text-on-surface-variant font-label-sm text-label-sm">
                                <button className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                                    <span>مفيد (412)</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                                    <span>ردود (18)</span>
                                </button>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="p-space-lg rounded-2xl bg-surface-container border border-white/[0.04] shadow-md flex flex-col gap-space-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <div className="w-10 h-10 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center font-bold">
                                        ن
                                    </div>
                                    <div>
                                        <h5 className="font-headline-sm text-headline-sm text-sm text-on-surface font-bold">نورة الخالدي</h5>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">قبل 5 أيام • شاهدت كل الحلقات المتوفرة</span>
                                    </div>
                                </div>
                                <div className="flex text-secondary">
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-[16px]">star</span>
                                </div>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                "الموسيقى التصويرية تأخذك لعالم آخر، وبناء العالم الأثيري دقيق جداً ومليء بالتفاصيل الغامضة. شخصية البطل وحبكة القصة متقنة للغاية وجودة 4K على الشاشة خرافية."
                            </p>
                            <div className="flex items-center gap-space-md pt-space-xs text-on-surface-variant font-label-sm text-label-sm">
                                <button className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                                    <span>مفيد (289)</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                                    <span>ردود (7)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
