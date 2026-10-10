"use client";

import { useEffect, useState, useMemo } from "react";
import { User } from "@/types";
import { Search, Loader2, Shield, Star, Trash2, Edit, Users, X, UserCheck } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user" | "premium">("all");
    const [deletingId, setDeletingId] = useState<string | null>(null);

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف حساب "${name}"؟`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== id));
            } else {
                alert("فشل حذف المستخدم");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const counts = useMemo(() => {
        const total = users.length;
        const admins = users.filter(u => u.role?.toUpperCase() === "ADMIN").length;
        const premium = users.filter(u => u.subscription?.isActive).length;
        return { total, admins, premium };
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const q = searchTerm.toLowerCase().trim();
            const matchesQuery = !q ||
                (user.name || user.username || "").toLowerCase().includes(q) ||
                user.email.toLowerCase().includes(q);

            if (!matchesQuery) return false;

            if (roleFilter === "admin") return user.role?.toUpperCase() === "ADMIN";
            if (roleFilter === "user") return user.role?.toUpperCase() !== "ADMIN";
            if (roleFilter === "premium") return !!user.subscription?.isActive;

            return true;
        });
    }, [users, searchTerm, roleFilter]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <p className="text-xs text-slate-400 font-medium">جاري تحميل المشتركين...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            إدارة المشتركين والمستخدمين
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                        عرض حسابات الأعضاء، إدارة الصلاحيات وترقية الاشتراكات المميزة.
                    </p>
                </div>

                {/* Counters */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                        الأعضاء: <strong className="text-white">{counts.total}</strong>
                    </span>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                        المدراء: <strong className="text-rose-400">{counts.admins}</strong>
                    </span>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                    <button
                        onClick={() => setRoleFilter("all")}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            roleFilter === "all"
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                    >
                        الكل ({counts.total})
                    </button>
                    <button
                        onClick={() => setRoleFilter("admin")}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            roleFilter === "admin"
                                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                    >
                        المدراء ({counts.admins})
                    </button>
                    <button
                        onClick={() => setRoleFilter("premium")}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            roleFilter === "premium"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                    >
                        VIP ({counts.premium})
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                        <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800/80">
                            <tr>
                                <th className="p-4 pr-6 font-semibold">المستخدم</th>
                                <th className="p-4 font-semibold hidden md:table-cell">البريد الإلكتروني</th>
                                <th className="p-4 font-semibold">الدور</th>
                                <th className="p-4 font-semibold">الاشتراك</th>
                                <th className="p-4 font-semibold hidden sm:table-cell">تاريخ الانضمام</th>
                                <th className="p-4 pl-6 text-left font-semibold">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredUsers.map((user) => {
                                const isAdmin = user.role?.toUpperCase() === "ADMIN";
                                const isPremium = !!user.subscription?.isActive;

                                return (
                                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors group">
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 border border-white/10 shadow-sm">
                                                    {(user.name || user.username || user.email || "U")[0]}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-white text-xs group-hover:text-emerald-400 transition-colors">
                                                        {user.name || user.username || "عضو"}
                                                    </span>
                                                    <span className="block md:hidden text-[10px] text-slate-500 font-mono">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 font-mono text-[11px] text-slate-400 hidden md:table-cell">
                                            {user.email}
                                        </td>

                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                                isAdmin
                                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                            }`}>
                                                {isAdmin && <Shield size={12} />}
                                                {isAdmin ? "مدير نظام" : "مستخدم"}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                                isPremium
                                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                    : "bg-slate-800 text-slate-400"
                                            }`}>
                                                {isPremium && <Star size={11} className="fill-amber-400" />}
                                                {isPremium ? "VIP مفعّل" : "مجاني"}
                                            </span>
                                        </td>

                                        <td className="p-4 text-slate-400 text-[11px] hidden sm:table-cell">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-EG") : "—"}
                                        </td>

                                        <td className="p-4 pl-6 text-left">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-colors text-xs"
                                                    title="تعديل المستخدم"
                                                >
                                                    <Edit size={13} />
                                                    <span>تعديل</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(user.id, user.name || user.email)}
                                                    disabled={deletingId === user.id}
                                                    className="p-1.5 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/30 disabled:opacity-50"
                                                    title="حذف المستخدم"
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

                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-slate-400 space-y-2">
                        <Users size={32} className="mx-auto text-slate-600 mb-2" />
                        <p className="text-sm font-bold text-white">لا يوجد مستخدمون مطابقون للبحث</p>
                        <p className="text-xs text-slate-500">جرب البحث بكلمات أخرى أو البريد الإلكتروني.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
