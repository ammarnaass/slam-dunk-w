"use client";

import Link from "next/link";
import { Crown } from "lucide-react";

export function UsersHeader() {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-7 bg-gradient-to-b from-amber-500 to-rose-600 rounded-full shadow-lg shadow-rose-600/30" />
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                        إدارة المشتركين والمستخدمين
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            نظام VIP
                        </span>
                    </h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    لوحة التحكم المركزية لعرض حسابات الأعضاء، إدارة الصلاحيات وتعيين المدراء، والترقية السريعة لاشتراكات VIP المميزة.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href="/admin/plans"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
                >
                    <Crown size={15} className="text-amber-400" />
                    <span>إدارة خطط الاشتراكات</span>
                </Link>
            </div>
        </div>
    );
}
