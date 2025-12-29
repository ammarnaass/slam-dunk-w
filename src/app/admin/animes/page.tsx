"use client";

import { useEffect, useState } from "react";
import { Anime } from "@/types";
import { Loader2, Plus, Edit, Trash2, Film, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function AnimesPage() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/animes")
            .then(res => res.json())
            .then(data => {
                setAnimes(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا العمل؟ سيتم حذف جميع الحلقات المرتبطة به!")) return; // Warning text

        try {
            const res = await fetch(`/api/admin/animes/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setAnimes(prev => prev.filter(a => a.id !== id));
            } else {
                alert("فشل الحذف");
            }
        } catch (error) {
            console.error("Error deleting anime:", error);
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
                    <h1 className="text-3xl font-bold text-white mb-2">إدارة المحتوى (الأنمي)</h1>
                    <p className="text-slate-400">إضافة وتعديل الأنميات والمسلسلات</p>
                </div>
                <Link
                    href="/admin/animes/new"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                >
                    <Plus size={20} /> إضافة عمل جديد
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {animes.map((anime) => (
                    <div key={anime.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-700 transition-all">
                        <div className="relative h-48 overflow-hidden">
                            {anime.coverImage ? (
                                <img
                                    src={anime.coverImage}
                                    alt={anime.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                    <ImageIcon className="text-slate-600" size={40} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
                            <div className="absolute bottom-4 right-4">
                                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                                    {anime.type}
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-bold text-white mb-1 truncate">{anime.title}</h3>
                            <p className="text-sm text-slate-400 mb-4">{anime.totalEpisodes} حلقة • {anime.status}</p>

                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/animes/${anime.id}`}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <Edit size={16} /> تعديل
                                </Link>
                                <button
                                    onClick={() => handleDelete(anime.id)}
                                    className="bg-red-900/20 hover:bg-red-900/40 text-red-400 p-2 rounded-lg transition-colors border border-red-900/30"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
