"use client";

import { useEffect, useState, useMemo } from "react";
import { User } from "@/types";
import { 
    Search, Loader2, Shield, Star, Trash2, Edit, Users, X, 
    Crown, Sparkles, Check, Copy, UserCheck, ShieldAlert,
    Clock, ArrowUpDown, ChevronDown, CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user" | "premium">("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "vip">("newest");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const showToast = (type: "success" | "error", text: string) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            showToast("error", "تعذر تحميل قائمة المشتركين والمستخدمين");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const copyToClipboard = (email: string) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    // Quick Upgrade Handler
    const handleQuickUpgrade = async (userId: string, action: "UPGRADE_30" | "UPGRADE_90" | "UPGRADE_365" | "CANCEL_VIP") => {
        setActionLoadingId(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quickAction: action }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "فشل تحديث الاشتراك");
            }

            const updatedUser = await res.json();
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedUser } : u));
            showToast("success", action === "CANCEL_VIP" ? "تم إلغاء اشتراك VIP بنجاح" : "تمت ترقية الاشتراك وتمديد المدة بنجاح");
        } catch (error: any) {
            console.error("Upgrade error:", error);
            showToast("error", error.message || "فشلت عملية الترقية");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Quick Role Toggle Handler
    const handleToggleRole = async (userId: string, currentRole?: string) => {
        const isCurrentlyAdmin = currentRole?.toUpperCase() === "ADMIN";
        const newRoleText = isCurrentlyAdmin ? "مستخدم عادي" : "مدير نظام";
        
        if (!confirm(`هل أنت متأكد من تغيير صلاحية هذا الحساب إلى "${newRoleText}"؟`)) return;

        setActionLoadingId(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quickAction: "TOGGLE_ROLE" }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "فشل تغيير الصلاحية");
            }

            const updatedUser = await res.json();
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedUser } : u));
            showToast("success", `تم تغيير الصلاحية إلى ${newRoleText} بنجاح`);
        } catch (error: any) {
            console.error("Role toggle error:", error);
            showToast("error", error.message || "فشل تغيير الصلاحية");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Delete User Handler
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`تحذير: هل أنت متأكد تماماً من حذف حساب "${name}"؟ سيتم حذف جميع بياناته واشتراكاته بشكل نهائي.`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== id));
                showToast("success", "تم حذف الحساب بنجاح");
            } else {
                showToast("error", data.error || "فشل حذف المستخدم");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            showToast("error", "حدث خطأ أثناء محاولة الحذف");
        } finally {
            setDeletingId(null);
        }
    };

    // Calculate Summary Stats
    const stats = useMemo(() => {
        const total = users.length;
        const admins = users.filter(u => u.role?.toUpperCase() === "ADMIN").length;
        const premium = users.filter(u => u.subscription?.isActive).length;
        const regular = total - premium;
        const premiumRate = total > 0 ? Math.round((premium / total) * 100) : 0;
        return { total, admins, premium, regular, premiumRate };
    }, [users]);

    // Calculate Remaining Days for a User
    const getRemainingDays = (endDate?: string | Date | null) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Filter & Sort
    const filteredUsers = useMemo(() => {
        return users
            .filter(user => {
                const q = searchTerm.toLowerCase().trim();
                const matchesQuery = !q ||
                    (user.name || user.username || "").toLowerCase().includes(q) ||
                    user.email.toLowerCase().includes(q);

                if (!matchesQuery) return false;

                if (roleFilter === "admin") return user.role?.toUpperCase() === "ADMIN";
                if (roleFilter === "user") return user.role?.toUpperCase() !== "ADMIN";
                if (roleFilter === "premium") return !!user.subscription?.isActive;

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "vip") {
                    const aVip = a.subscription?.isActive ? 1 : 0;
                    const bVip = b.subscription?.isActive ? 1 : 0;
                    return bVip - aVip;
                }
                if (sortBy === "name") {
                    const aName = a.name || a.username || "";
                    const bName = b.name || b.username || "";
                    return aName.localeCompare(bName, "ar");
                }
                if (sortBy === "oldest") {
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                }
                // default newest
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            });
    }, [users, searchTerm, roleFilter, sortBy]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-rose-600/20 border-t-rose-600 animate-spin" />
                    <Sparkles className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-slate-400 font-bold tracking-wide">جاري تحميل بيانات المشتركين والمستخدمين...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Toast Alert */}
            {toast && (
                <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-in slide-in-from-bottom-5 duration-300 ${
                    toast.type === "success" 
                        ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50" 
                        : "bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50"
                }`}>
                    {toast.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-bold">{toast.text}</span>
                </div>
            )}

            {/* Header Section */}
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

            {/* Metric KPI Cards */}
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

            {/* Filter & Controls Bar */}
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
                            onChange={(e) => setSortBy(e.target.value as any)}
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

            {/* Users Table Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
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
                                                    className="text-[10px] text-slate-500 hover:text-white px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors disabled:opacity-50"
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
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Quick Upgrade Menu */}
                                                <div className="relative group/upgrade">
                                                    <button
                                                        disabled={isRowLoading}
                                                        className={`inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[40px] rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 ${
                                                            isPremium
                                                                ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                                                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-amber-600/20"
                                                        }`}
                                                        title="ترقية سريعة لاشتراك VIP"
                                                    >
                                                        {actionLoadingId === user.id ? (
                                                            <Loader2 size={13} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Crown size={13} />
                                                                <span>{isPremium ? "تمديد" : "ترقية VIP"}</span>
                                                                <ChevronDown size={11} />
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* Dropdown Options */}
                                                    <div className="absolute left-0 top-full mt-1.5 hidden group-hover/upgrade:block z-30 w-44 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-1.5 backdrop-blur-2xl">
                                                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 border-b border-slate-800/80 mb-1">
                                                            اختر مدة الترقية:
                                                        </div>
                                                        <button
                                                            onClick={() => handleQuickUpgrade(user.id, "UPGRADE_30")}
                                                            className="w-full text-right px-2.5 py-2 min-h-[38px] text-[11px] font-bold text-slate-200 hover:text-amber-300 hover:bg-slate-900 rounded-lg flex items-center justify-between transition-colors"
                                                        >
                                                            <span>+ شهر (30 يوم)</span>
                                                            <span className="text-[10px] text-amber-400/80">شهري</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleQuickUpgrade(user.id, "UPGRADE_90")}
                                                            className="w-full text-right px-2.5 py-2 min-h-[38px] text-[11px] font-bold text-slate-200 hover:text-amber-300 hover:bg-slate-900 rounded-lg flex items-center justify-between transition-colors"
                                                        >
                                                            <span>+ 3 أشهر (90 يوم)</span>
                                                            <span className="text-[10px] text-amber-400/80">موسمي</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleQuickUpgrade(user.id, "UPGRADE_365")}
                                                            className="w-full text-right px-2.5 py-2 min-h-[38px] text-[11px] font-bold text-slate-200 hover:text-amber-300 hover:bg-slate-900 rounded-lg flex items-center justify-between transition-colors"
                                                        >
                                                            <span>+ سنة كاملة (365 يوم)</span>
                                                            <span className="text-[10px] text-amber-400/80">سنوي ذهبي</span>
                                                        </button>
                                                        {isPremium && (
                                                            <button
                                                                onClick={() => handleQuickUpgrade(user.id, "CANCEL_VIP")}
                                                                className="w-full text-right px-2.5 py-2 min-h-[38px] text-[11px] font-bold text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border-t border-slate-800/80 mt-1"
                                                            >
                                                                إلغاء اشتراك VIP
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Edit User Button */}
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-colors text-xs border border-slate-700/50 active:scale-95"
                                                    title="تفاصيل وتعديل العضو"
                                                >
                                                    <Edit size={14} />
                                                    <span className="hidden sm:inline">تفاصيل</span>
                                                </Link>

                                                {/* Delete User Button */}
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name || user.email)}
                                                    disabled={isRowLoading}
                                                    className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/30 disabled:opacity-50 active:scale-95"
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
        </div>
    );
}
