import Link from "next/link";
import { Eye, ArrowUpRight, Plus } from "lucide-react";

export function PlansHeader() {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/[0.08]">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-7 bg-gradient-to-b from-amber-500 to-rose-600 rounded-full shadow-lg shadow-amber-500/30" />
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                        إدارة خطط الاشتراكات المميزة
                    </h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    تحكم شامل في باقات VIP والأسعار والمميزات المعروضة للجمهور في الموقع وتطبيق الهاتف.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href="/pricing"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-all shadow-sm"
                >
                    <Eye size={15} />
                    <span>معاينة صفحة الأسعار</span>
                    <ArrowUpRight size={13} />
                </Link>

                <Link
                    href="/admin/plans/new"
                    className="bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 hover:from-amber-400 hover:via-rose-500 hover:to-rose-600 text-white px-5 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-xl shadow-rose-900/30 hover:scale-[1.02] text-xs sm:text-sm"
                >
                    <Plus size={18} />
                    <span>إنشاء خطة جديدة</span>
                </Link>
            </div>
        </div>
    );
}
