"use client";

import { Sparkles } from "lucide-react";
import { useAdminUsers } from "./hooks/useAdminUsers";
import { UsersHeader } from "./components/UsersHeader";
import { UsersToast } from "./components/UsersToast";
import { UsersStatsCards } from "./components/UsersStatsCards";
import { UsersFilterBar } from "./components/UsersFilterBar";
import { UsersTable } from "./components/UsersTable";

export default function UsersPage() {
    const {
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
    } = useAdminUsers();

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
            <UsersToast toast={toast} />

            <UsersHeader />

            <UsersStatsCards stats={stats} />

            <UsersFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                stats={stats}
            />

            <UsersTable
                filteredUsers={filteredUsers}
                actionLoadingId={actionLoadingId}
                deletingId={deletingId}
                copiedEmail={copiedEmail}
                copyToClipboard={copyToClipboard}
                handleToggleRole={handleToggleRole}
                handleQuickUpgrade={handleQuickUpgrade}
                handleDelete={handleDelete}
                getRemainingDays={getRemainingDays}
            />
        </div>
    );
}
