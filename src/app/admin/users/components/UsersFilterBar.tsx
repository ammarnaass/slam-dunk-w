"use client";

import { Search, X, ArrowUpDown, Crown, Shield } from "lucide-react";
import { RoleFilter, SortOption, UsersStats } from "../hooks/useAdminUsers";

interface UsersFilterBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortBy: SortOption;
    setSortBy: (value: SortOption) => void;
    roleFilter: RoleFilter;
    setRoleFilter: (value: RoleFilter) => void;
    stats: UsersStats;
}

export function UsersFilterBar({
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    roleFilter,
    setRoleFilter,
    stats,
}: UsersFilterBarProps) {
    return (
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                    <input
                        type="text"
                        placeholder="ابحث باسم العضو، اسم المستخدم، أو البريد الإلكتروني..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 shrink-0">
                    <ArrowUpDown size={15} className="text-slate-400" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:border-amber-500 transition-all"
                    >
                        <option value="newest">الأحدث انضماماً</option>
                        <option value="vip">مشتركو VIP أولاً</option>
                        <option value="name">الاسم أبجدياً</option>
                        <option value="oldest">الأقدم انضماماً</option>
                    </select>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-800/60 pt-3">
                <button
                    onClick={() => setRoleFilter("all")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        roleFilter === "all"
                            ? "bg-white text-slate-950 shadow-md shadow-white/10"
                            : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                >
                    <span>كافة الأعضاء</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${roleFilter === "all" ? "bg-slate-200 text-slate-900" : "bg-slate-800 text-slate-400"}`}>
                        {stats.total}
                    </span>
                </button>

                <button
                    onClick={() => setRoleFilter("premium")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        roleFilter === "premium"
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                            : "bg-slate-950/60 text-amber-400/80 hover:text-amber-300 border border-amber-500/20"
                    }`}
                >
                    <Crown size={13} className={roleFilter === "premium" ? "text-slate-950" : "text-amber-400"} />
                    <span>مشتركو VIP</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${roleFilter === "premium" ? "bg-amber-300 text-slate-900" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                        {stats.premium}
                    </span>
                </button>

                <button
                    onClick={() => setRoleFilter("admin")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        roleFilter === "admin"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                            : "bg-slate-950/60 text-rose-400/80 hover:text-rose-300 border border-rose-500/20"
                    }`}
                >
                    <Shield size={13} />
                    <span>المدراء</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${roleFilter === "admin" ? "bg-rose-700 text-white" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                        {stats.admins}
                    </span>
                </button>

                <button
                    onClick={() => setRoleFilter("user")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        roleFilter === "user"
                            ? "bg-slate-700 text-white shadow-md"
                            : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                >
                    <span>المستخدمون العاديون</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${roleFilter === "user" ? "bg-slate-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                        {stats.regular}
                    </span>
                </button>
            </div>
        </div>
    );
}
