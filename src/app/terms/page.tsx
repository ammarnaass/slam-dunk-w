import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "شروط الاستخدام - سلام دانك",
    description: "شروط وأحكام استخدام موقع سلام دانك",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-8 border-r-4 border-red-600 pr-4">
                    شروط الاستخدام
                </h1>

                <div className="max-w-4xl space-y-8">
                    <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-4">إخلاء المسؤولية</h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            هذا الموقع هو موقع مروحة غير رسمي تم إنشاؤه بغرض المشاركة والتعليم فقط.
                            جميع حقوق المحتوى (سلام دانك) تعود لأصحابها الأصليين.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            نحن لا نستضيف أي ملفات فيديو على خوادمنا. جميع الروابط مقدمة من مصادر خارجية.
                        </p>
                    </section>

                    <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-4">حقوق الملكية الفكرية</h2>
                        <p className="text-slate-300 leading-relaxed">
                            "سلام دانك" (SLAM DUNK) هي علامة تجارية مسجلة لشركة Toei Animation و Takehiko Inoue.
                            نحن نحترم حقوق الملكية الفكرية ونشجع المستخدمين على دعم الإصدارات الرسمية.
                        </p>
                    </section>

                    <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-4">الاستخدام المسموح</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mr-4">
                            <li>المشاهدة الشخصية وغير التجارية</li>
                            <li>المشاركة مع الأصدقاء والعائلة</li>
                            <li>الاستخدام التعليمي</li>
                        </ul>
                    </section>

                    <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-4">الاستخدام الممنوع</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mr-4">
                            <li>إعادة توزيع المحتوى لأغراض تجارية</li>
                            <li>الادعاء بملكية المحتوى</li>
                            <li>استخدام المحتوى بطرق تنتهك حقوق النشر</li>
                        </ul>
                    </section>

                    <section className="bg-amber-900/20 p-6 rounded-xl border border-amber-700">
                        <h2 className="text-2xl font-bold text-amber-400 mb-4">تنويه مهم</h2>
                        <p className="text-slate-300 leading-relaxed">
                            إذا كنت تمثل أصحاب الحقوق وتعتقد أن هذا الموقع ينتهك حقوق الملكية الفكرية،
                            يرجى التواصل معنا وسنقوم بإزالة المحتوى فوراً.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
