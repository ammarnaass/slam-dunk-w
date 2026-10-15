"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { User } from "@/types";

export type RoleFilter = "all" | "admin" | "user" | "premium";
export type SortOption = "newest" | "oldest" | "name" | "vip";
export type QuickUpgradeAction = "UPGRADE_30" | "UPGRADE_90" | "UPGRADE_365" | "CANCEL_VIP";

export interface UsersStats {
    total: number;
    admins: number;
    premium: number;
    regular: number;
    premiumRate: number;
}

export function useAdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const showToast = useCallback((type: "success" | "error", text: string) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 3500);
    }, []);

    const fetchUsers = useCallback(async () => {
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
    }, [showToast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const copyToClipboard = useCallback((email: string) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    }, []);

    // Quick Upgrade Handler
    const handleQuickUpgrade = useCallback(async (userId: string, action: QuickUpgradeAction) => {
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
    }, [showToast]);

    // Quick Role Toggle Handler
    const handleToggleRole = useCallback(async (userId: string, currentRole?: string) => {
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
    }, [showToast]);

    // Delete User Handler
    const handleDelete = useCallback(async (id: string, name: string) => {
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
    }, [showToast]);

    // Calculate Summary Stats
    const stats: UsersStats = useMemo(() => {
        const total = users.length;
        const admins = users.filter(u => u.role?.toUpperCase() === "ADMIN").length;
        const premium = users.filter(u => u.subscription?.isActive).length;
        const regular = total - premium;
        const premiumRate = total > 0 ? Math.round((premium / total) * 100) : 0;
        return { total, admins, premium, regular, premiumRate };
    }, [users]);

    // Calculate Remaining Days for a User
    const getRemainingDays = useCallback((endDate?: string | Date | null) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }, []);

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

    return {
        users,
        loading,
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        sortBy,
        setSortBy,
        deletingId,
        actionLoadingId,
        toast,
        copiedEmail,
        copyToClipboard,
        handleQuickUpgrade,
        handleToggleRole,
        handleDelete,
        getRemainingDays,
        stats,
        filteredUsers,
    };
}
