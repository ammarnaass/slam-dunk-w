"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EditUserHeaderProps {
    id: string;
}

export function EditUserHeader({ id }: EditUserHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/users"
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                    title="العودة لقائمة المستخدمين"
                >
                    <ArrowRight size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        تعديل وترقية حساب العضو
                    </h1>
                    <p className="text-xs text-slate-400">
                        إدارة الصلاحيات والاشتراكات والبيانات الشخصية
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                    ID: {id.slice(0, 8)}...
                </span>
            </div>
        </div>
    );
}
