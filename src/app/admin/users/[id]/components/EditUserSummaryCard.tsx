"use client";

import { Crown } from "lucide-react";
import { EditUserFormData } from "../hooks/useEditUser";

interface EditUserSummaryCardProps {
    formData: EditUserFormData;
    rawUser: any;
}

export function EditUserSummaryCard({ formData, rawUser }: EditUserSummaryCardProps) {
    const isVip = formData.subscription.status === "ACTIVE";
    const isAdmin = formData.role === "ADMIN";

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 border border-white/[0.08] shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black uppercase shrink-0 border-2 shadow-xl ${
                        isVip
                            ? "bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 border-amber-300/60 shadow-amber-500/20"
                            : isAdmin
                                ? "bg-gradient-to-tr from-rose-600 to-rose-400 text-white border-rose-300/40 shadow-rose-600/20"
                                : "bg-slate-800 text-slate-300 border-white/10"
                    }`}>
                        {rawUser?.avatar ? (
                            <img 
                                src={rawUser.avatar} 
                                alt={formData.username} 
                                className="w-full h-full object-cover rounded-2xl" 
                            />
                        ) : (
                            (formData.username || "U")[0]
                        )}
                    </div>
                    {isVip && (
                        <span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 shadow-md">
                            <Crown size={15} />
                        </span>
                    )}
                </div>

                <div className="text-center sm:text-right flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                        <h2 className="text-xl sm:text-2xl font-black text-white">
                            {formData.username || "عضو"}
                        </h2>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                            isAdmin
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}>
                            {isAdmin ? "مدير نظام" : "مستخدم عادي"}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                            isVip
                                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}>
                            {isVip ? "VIP نشط" : "عضوية مجانية"}
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono mb-3">
                        {formData.email}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
                        <span>تاريخ الانضمام: {rawUser?.createdAt ? new Date(rawUser.createdAt).toLocaleDateString("ar-EG") : "—"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
