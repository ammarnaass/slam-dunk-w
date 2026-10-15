"use client";

import { Users, Crown, Star, Shield, ShieldAlert, UserCheck } from "lucide-react";
import { UsersStats } from "../hooks/useAdminUsers";

interface UsersStatsCardsProps {
    stats: UsersStats;
}

export function UsersStatsCards({ stats }: UsersStatsCardsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {/* 1. Total Members */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-5 border border-white/[0.06] shadow-xl group hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400">إجمالي الأعضاء</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Users size={18} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-white">{stats.total}</span>
                    <span className="text-[11px] font-semibold text-slate-500">حساب مسجل</span>
                </div>
            </div>

            {/* 2. Active VIP Members */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 p-5 border border-amber-500/20 shadow-xl group hover:border-amber-500/40 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Crown size={14} className="text-amber-400" /> مشتركو VIP المميزون
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/20">
                        <Star size={18} className="fill-amber-400" />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">{stats.premium}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {stats.premiumRate}% من الأعضاء
                    </span>
                </div>
            </div>

            {/* 3. Admins */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-950 p-5 border border-rose-500/20 shadow-xl group hover:border-rose-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <Shield size={14} className="text-rose-400" /> مدراء النظام
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <ShieldAlert size={18} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-rose-400">{stats.admins}</span>
                    <span className="text-[11px] font-semibold text-slate-500">كامل الصلاحيات</span>
                </div>
            </div>

            {/* 4. Regular / Free */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-5 border border-white/[0.06] shadow-xl group hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400">عضوية عادية / مجانية</span>
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                        <UserCheck size={18} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-200">{stats.regular}</span>
                    <span className="text-[11px] font-semibold text-slate-500">جاهز للترقية</span>
                </div>
            </div>
        </div>
    );
}
