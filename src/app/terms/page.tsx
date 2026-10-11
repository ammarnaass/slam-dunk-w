import Link from "next/link";

export const metadata = {
    title: "شروط الاستخدام وإخلاء المسؤولية - ANIME DAZE",
    description: "شروط وأحكام الاستخدام وحماية حقوق الملكية الفكرية لمنصة ANIME DAZE",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pt-24 pb-24">
            <div className="max-w-4xl mx-auto px-gutter-lg">
                <div className="flex flex-col gap-1 mb-space-xl border-b border-white/[0.06] pb-space-lg">
                    <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md font-bold">
                        <span className="material-symbols-outlined text-[18px]">gavel</span>
                        <span>السياسات القانونية والتراخيص</span>
                    </div>
                    <h1 className="font-headline-hero text-headline-hero font-extrabold text-on-surface tracking-tight">
                        شروط الاستخدام وسياسة الخصوصية
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                        يرجى قراءة هذه الشروط بعناية قبل استخدام منصة وتطبيق ANIME DAZE.
                    </p>
                </div>

                <div className="space-y-space-lg">
                    <section className="bg-surface-container-low p-space-lg rounded-3xl border border-white/[0.06]">
                        <div className="flex items-center gap-space-sm mb-space-sm">
                            <div className="w-1.5 h-6 rounded-full bg-primary-container" />
                            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">إخلاء المسؤولية</h2>
                        </div>
                        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-space-sm">
                            منصة ANIME DAZE هي منصة رقمية ثقافية موجهة لعشاق الأنمي في العالم العربي بهدف التوثيق والمشاهدة الشخصية.
                            جميع حقوق الأعمال والمسلسلات الدبلجة تعود لشركات الإنتاج وأصحاب الحقوق الأصليين.
                        </p>
                        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                            نحن نوفر واجهة حديثة وسريعة لبث الوسائط دون استضافة ملفات تنتهك الملكية الفكرية على خوادمنا المحلية المباشرة.
                        </p>
                    </section>

                    <section className="bg-surface-container-low p-space-lg rounded-3xl border border-white/[0.06]">
                        <div className="flex items-center gap-space-sm mb-space-sm">
                            <div className="w-1.5 h-6 rounded-full bg-secondary-container" />
                            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">حقوق الملكية الفكرية</h2>
                        </div>
                        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                            العلامات التجارية والمسلسلات الكلاسيكية المعروضة هي ملك لشركات الإنتاج المرخصة. نحن ندعم بقوة الإنتاج الفني العربي ونشجع المستخدمين على الاشتراك في المنصات الرسمية وامتلاك النسخ الأصلية.
                        </p>
                    </section>

                    <section className="bg-surface-container-low p-space-lg rounded-3xl border border-white/[0.06]">
                        <div className="flex items-center gap-space-sm mb-space-sm">
                            <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
                            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">الاستخدام المسموح</h2>
                        </div>
                        <ul className="space-y-2 text-on-surface-variant list-disc list-inside mr-2">
                            <li>المشاهدة الترفيهية الفردية والعائلية عبر منصة الويب أو تطبيق PWA المثبت.</li>
                            <li>الاستفادة من ميزات التفضيل وقوائم المشاهدة والتقييمات.</li>
                            <li>مشاركة روابط الحلقات والأعمال مع الأصدقاء.</li>
                        </ul>
                    </section>

                    <section className="bg-surface-container-low p-space-lg rounded-3xl border border-white/[0.06]">
                        <div className="flex items-center gap-space-sm mb-space-sm">
                            <div className="w-1.5 h-6 rounded-full bg-primary" />
                            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">الاستخدام المحظور</h2>
                        </div>
                        <ul className="space-y-2 text-on-surface-variant list-disc list-inside mr-2">
                            <li>إعادة بيع اشتراكات المنصة أو استغلالها تجارياً دون ترخيص مسبق.</li>
                            <li>محاولات الاختراق، الهندسة العكسية، أو تعطيل خوادم البث.</li>
                            <li>التعدي على تجربة باقي المستخدمين أو نشر برمجيات ضارة.</li>
                        </ul>
                    </section>

                    <section className="bg-secondary-container/10 p-space-lg rounded-3xl border border-secondary/30">
                        <div className="flex items-center gap-space-sm mb-space-sm">
                            <span className="material-symbols-outlined text-secondary text-2xl">verified_user</span>
                            <h2 className="font-headline-md text-headline-md font-bold text-secondary">إشعار حماية الحقوق والتواصل</h2>
                        </div>
                        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                            إذا كنت تمثل جهة إنتاجية أو مالكاً لحقوق أي عمل وتعتقد بوجود أي إشكال، يرجى مراسلتنا فوراً عبر البريد الإلكتروني وسنقوم بالتجاوب واتخاذ الإجراء اللازم في غضون 24 ساعة.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
