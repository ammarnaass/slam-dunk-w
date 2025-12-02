import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">سلام دانك</h3>
                        <p className="text-sm leading-relaxed">
                            الموقع العربي الأول لمشاهدة جميع حلقات الأنمي الأسطوري سلام دانك بجودة عالية.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">روابط سريعة</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/episodes" className="hover:text-red-500 transition-colors">
                                    قائمة الحلقات
                                </Link>
                            </li>
                            <li>
                                <Link href="/characters" className="hover:text-red-500 transition-colors">
                                    الشخصيات
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-red-500 transition-colors">
                                    شروط الاستخدام
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">تواصل معنا</h4>
                        <p className="text-sm">
                            للاقتراحات أو الإبلاغ عن روابط معطلة، يرجى التواصل عبر البريد الإلكتروني.
                        </p>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-900 text-center text-sm">
                    <p>© {new Date().getFullYear()} جميع الحقوق محفوظة..</p>
                </div>
            </div>
        </footer>
    );
}
