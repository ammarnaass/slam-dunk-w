"use client";

import Link from "next/link";
import { 
    Users, Shield, UserCheck, Crown, Clock, 
    Copy, Check, Edit, Trash2, Loader2 
} from "lucide-react";
import { User } from "@/types";
import { QuickUpgradeAction } from "../hooks/useAdminUsers";
import { UserVipDropdown } from "./UserVipDropdown";

interface UsersTableProps {
    filteredUsers: User[];
    actionLoadingId: string | null;
    deletingId: string | null;
    copiedEmail: string | null;
    copyToClipboard: (email: string) => void;
    handleToggleRole: (userId: string, currentRole?: string) => void;
    handleQuickUpgrade: (userId: string, action: QuickUpgradeAction) => void;
    handleDelete: (id: string, name: string) => void;
    getRemainingDays: (endDate?: string | Date | null) => number | null;
}

export function UsersTable({
    filteredUsers,
    actionLoadingId,
    deletingId,
    copiedEmail,
    copyToClipboard,
    handleToggleRole,
    handleQuickUpgrade,
    handleDelete,
    getRemainingDays,
}: UsersTableProps) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
            {/* Horizontal Scroll Hint on Mobile */}
            <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 text-[11px] text-slate-400 font-bold">
                <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="material-symbols-outlined text-[15px] animate-pulse">swipe</span>
                    <span>اسحب أفقياً لتصفح بيانات المشتركين والإجراءات</span>
                </span>
                <span className="font-mono text-slate-500">← تمرير →</span>
            </div>

            <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-right text-xs">
                    <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                            <th className="p-4 pr-6">العضو والحساب</th>
                            <th className="p-4 hidden md:table-cell">البريد الإلكتروني</th>
                            <th className="p-4">الصلاحية والمسؤولية</th>
                            <th className="p-4">حالة اشتراك VIP</th>
                            <th className="p-4 hidden lg:table-cell">تاريخ الانضمام</th>
                            <th className="p-4 pl-6 text-left">إجراءات سريعة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {filteredUsers.map((user) => {
                            const isAdmin = user.role?.toUpperCase() === "ADMIN";
                            const isPremium = !!user.subscription?.isActive;
                            const remainingDays = getRemainingDays(user.subscription?.endDate);
                            const isRowLoading = actionLoadingId === user.id || deletingId === user.id;

                            return (
                                <tr 
                                    key={user.id} 
                                    className={`hover:bg-slate-800/35 transition-colors group ${
                                        isPremium ? "bg-amber-950/[0.04]" : ""
                                    }`}
                                >
                                    {/* Member identity */}
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black uppercase shrink-0 border shadow-md transition-transform group-hover:scale-105 ${
                                                    isPremium 
                                                        ? "bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 border-amber-300/40 shadow-amber-500/20"
                                                        : isAdmin
                                                            ? "bg-gradient-to-tr from-rose-600 to-rose-400 text-white border-rose-300/30 shadow-rose-600/20"
                                                            : "bg-slate-800 text-slate-300 border-white/10"
                                                }`}>
                                                    {user.avatar ? (
                                                        <img 
                                                            src={user.avatar} 
                                                            alt={user.name} 
                                                            className="w-full h-full object-cover rounded-xl"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLElement).style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        (user.name || user.username || user.email || "U")[0]
                                                    )}
                                                </div>
                                                {isPremium && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[10px] text-slate-950 shadow-sm">
                                                        ★
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-xs sm:text-sm group-hover:text-amber-400 transition-colors">
                                                        {user.name || user.username || "عضو"}
                                                    </span>
                                                    {isPremium && (
                                                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                            VIP
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] text-slate-500 font-mono block">
                                                    {user.username ? `@${user.username}` : user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="p-4 font-mono text-[11px] text-slate-400 hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <span>{user.email}</span>
                                            <button
                                                onClick={() => copyToClipboard(user.email)}
                                                className="text-slate-600 hover:text-slate-300 p-1 rounded transition-colors"
                                                title="نسخ البريد الإلكتروني"
                                            >
                                                {copiedEmail === user.email ? (
                                                    <Check size={12} className="text-emerald-400" />
                                                ) : (
                                                    <Copy size={12} />
                                                )}
                                            </button>
                                        </div>
                                    </td>

                                    {/* Role with quick toggle button */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                                isAdmin
                                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                            }`}>
                                                {isAdmin ? <Shield size={12} /> : <UserCheck size={12} />}
                                                {isAdmin ? "مدير نظام" : "مستخدم"}
                                            </span>

                                            <button
                                                onClick={() => handleToggleRole(user.id, user.role)}
                                                disabled={isRowLoading}
                                                className="text-[10px] text-slate-500 hover:text-white px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors disabled:opacity-50 cursor-pointer"
                                                title="تبديل الصلاحية"
                                            >
                                                تبديل
                                            </button>
                                        </div>
                                    </td>

                                    {/* VIP Subscription Status */}
                                    <td className="p-4">
                                        {isPremium ? (
                                            <div className="space-y-1">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25 shadow-sm">
                                                    <Crown size={12} className="text-amber-400" />
                                                    <span>VIP مفعّل</span>
                                                </span>
                                                {remainingDays !== null && (
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                                                        <Clock size={10} className="text-amber-400" />
                                                        <span>متبقي {remainingDays} يوم</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800/80 text-slate-400 border border-slate-700/50">
                                                عضوية مجانية
                                            </span>
                                        )}
                                    </td>

                                    {/* Joined Date */}
                                    <td className="p-4 text-slate-400 text-[11px] hidden lg:table-cell font-mono">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-EG", {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : "—"}
                                    </td>

                                    {/* Quick Actions */}
                                    <td className="p-4 pl-6 text-left">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Quick Upgrade Menu */}
                                            <UserVipDropdown
                                                user={user}
                                                isPremium={isPremium}
                                                isRowLoading={isRowLoading}
                                                actionLoadingId={actionLoadingId}
                                                onQuickUpgrade={handleQuickUpgrade}
                                            />

                                            {/* Edit User Button */}
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-colors text-xs border border-slate-700/50 active:scale-95"
                                                title="تفاصيل وتعديل العضو"
                                            >
                                                <Edit size={14} />
                                                <span className="hidden sm:inline">تفاصيل</span>
                                            </Link>

                                            {/* Delete User Button */}
                                            <button
                                                onClick={() => handleDelete(user.id, user.name || user.email)}
                                                disabled={isRowLoading}
                                                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/30 disabled:opacity-50 active:scale-95 cursor-pointer"
                                                title="حذف الحساب نهائياً"
                                            >
                                                {deletingId === user.id ? (
                                                    <Loader2 size={15} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={15} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="p-16 text-center text-slate-400 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto text-slate-500 mb-2 border border-slate-700/50">
                        <Users size={28} />
                    </div>
                    <p className="text-base font-bold text-white">لا توجد حسابات مطابقة لمعايير البحث</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        جرب البحث بكلمات أخرى أو اختر تبويباً مختلفاً من خيارات التصفية أعلاه.
                    </p>
                </div>
            )}
        </div>
    );
}
