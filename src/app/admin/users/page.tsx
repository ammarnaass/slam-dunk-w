"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { Search, Loader2, MoreVertical, Shield, Star, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== id));
            } else {
                alert("فشل الحذف");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">إدارة المشتركين</h1>
                    <p className="text-slate-400">عرض وإدارة جميع المستخدمين والاشتراكات</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="بحث باسم المستخدم أو البريد الإلكتروني..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pr-10 pl-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                />
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-950 text-slate-400 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 text-start">المستخدم</th>
                                <th className="px-6 py-4 text-start hidden md:table-cell">البريد الإلكتروني</th>
                                <th className="px-6 py-4 text-start">الدور</th>
                                <th className="px-6 py-4 text-start">الاشتراك</th>
                                <th className="px-6 py-4 text-start hidden sm:table-cell">تاريخ الانضمام</th>
                                <th className="px-6 py-4 text-start">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="text-slate-300 hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm hidden md:table-cell">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1 ${user.role === 'ADMIN'
                                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                            }`}>
                                            {user.role === 'ADMIN' && <Shield size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1 ${user.subscription?.status === 'ACTIVE'
                                                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                : 'bg-slate-700/50 text-slate-400'
                                            }`}>
                                            {user.subscription?.status === 'ACTIVE' && <Star size={12} />}
                                            {user.subscription?.status === 'ACTIVE' ? 'Premium' : 'Free'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="p-2 hover:bg-slate-700 rounded-full transition-colors text-blue-400 hover:text-blue-300"
                                                title="تعديل المستخدم / الاشتراك"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 hover:bg-slate-700 rounded-full transition-colors text-red-400 hover:text-red-300"
                                                title="حذف المستخدم"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        لا يوجد مستخدمين مطابقين للبحث
                    </div>
                )}
            </div>
        </div>
    );
}
