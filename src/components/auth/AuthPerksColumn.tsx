import React from "react";

export const AuthPerksColumn: React.FC = () => {
    return (
        <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="h-full bg-surface-container-low rounded-2xl p-space-lg sm:p-space-xl flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.45)] border border-white/[0.06] relative overflow-hidden">
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-container/10 rounded-full blur-2xl" />

                <div>
                    <div className="inline-flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded-full text-secondary mb-space-md">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-label-sm text-label-sm font-bold">امتيازات حساب ANIME DAZE</span>
                    </div>
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm font-extrabold">
                        عالمك المفضل متزامن في كل لحظة
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                        احصل على تجربة سينمائية متكاملة مصممة خصيصاً لعشاق الأنمي في العالم العربي.
                    </p>

                    <div className="space-y-space-md">
                        <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container/70 border border-white/[0.04]">
                            <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary-container flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-xl">devices</span>
                            </div>
                            <div>
                                <h3 className="font-label-md text-label-md text-on-surface font-bold">مزامنة سحابية فورية</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">تابع من الدقيقة والثانية ذاتها سواء كنت على هاتفك أو حاسوبك أو شاشتك الذكية.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container/70 border border-white/[0.04]">
                            <div className="w-10 h-10 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-xl">high_quality</span>
                            </div>
                            <div>
                                <h3 className="font-label-md text-label-md text-on-surface font-bold">دقة 4K HDR ومسارات صوتية ثنائية</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">استمتع بترجمة احترافية منقحة وخيارات الدبلجة العربية الكلاسيكية بأعلى نقاء صوتي.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container/70 border border-white/[0.04]">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-xl">notifications_active</span>
                            </div>
                            <div>
                                <h3 className="font-label-md text-label-md text-on-surface font-bold">تنبيهات فورية لجدول الحلقات</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">كن أول من يعلم فور صدور الحلقات الأسبوعية لمسلسلات الموسم الحالي فور بثها.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fast Resume Preview Pill */}
                <div className="mt-space-xl p-space-md rounded-xl bg-surface-container border border-white/[0.06] relative overflow-hidden">
                    <div className="flex items-center gap-space-md">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-md">
                            <img 
                                src="/hero-bg.jpg" 
                                alt="Recent Anime"
                                className="w-full h-full object-cover" 
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-primary-container text-on-primary-container text-[9px] text-center font-bold">
                                جديد
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="font-label-sm text-label-sm text-secondary block truncate">استكمال المشاهدة الأخير</span>
                            <span className="font-headline-sm text-headline-sm text-on-surface block truncate font-bold text-xs">
                                سلام دانك: البطولة الوطنية
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant block text-[11px]">
                                الحلقة 14 • المتبقي 8 دقائق
                            </span>
                        </div>
                        <span className="material-symbols-outlined text-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_circle
                        </span>
                    </div>
                    <div className="mt-space-sm w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary-container h-full w-2/3 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                    </div>
                </div>
            </div>
        </div>
    );
};
