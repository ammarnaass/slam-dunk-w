import Link from "next/link";

export default function WatchHistoryTab() {
    return (
        <div className="bg-surface-container-low rounded-2xl border border-white/[0.06] p-space-xl text-center space-y-3">
            <span className="material-symbols-outlined text-5xl text-primary-container">smart_display</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">سجل المشاهدات الأخير</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto">
                يتم تسجيل الحلقات التي شاهدتها وتقدمك في المشاهدة بدقة لمتابعة العرض من حيث توقفت.
            </p>
            <div className="pt-3">
                <Link
                    href="/animes"
                    className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-bold transition-all text-on-surface"
                >
                    متابعة المشاهدة الآن
                </Link>
            </div>
        </div>
    );
}
