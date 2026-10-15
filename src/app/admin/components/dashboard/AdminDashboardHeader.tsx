import Link from "next/link";

export function AdminDashboardHeader() {
    return (
        <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.06] shadow-md">
            <div className="flex flex-col gap-1 text-right">
                <div className="flex items-center gap-space-sm flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-label-sm font-bold border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                        GET /api/v1/admin/overview
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-secondary">sync</span>
                        متزامن • مباشر
                    </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-extrabold">
                    لوحة القيادة والعمليات المركزية
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                    مراقبة تدفق البث السحابي، إدارة أرشيف الأنمي، واستقرار خوادم المنصة
                </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-space-sm flex-wrap">
                <Link
                    href="/admin/animes/new"
                    className="flex items-center gap-2 px-space-lg py-space-sm rounded-xl bg-primary-container hover:brightness-110 text-on-primary-container font-headline-sm text-sm font-bold transition-all shadow-[0_8px_20px_-4px_rgba(220,38,38,0.45)]"
                >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    <span>+ إضافة أنمي جديد</span>
                </Link>
                <Link
                    href="/admin/animes"
                    className="flex items-center gap-2 px-space-md py-space-sm rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm font-bold transition-all"
                >
                    <span className="material-symbols-outlined text-[18px] text-secondary">movie</span>
                    <span>إدارة الأعمال</span>
                </Link>
            </div>
        </section>
    );
}
