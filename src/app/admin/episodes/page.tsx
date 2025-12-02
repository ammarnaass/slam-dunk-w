"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Episode } from "@/types";

export default function EpisodesAdmin() {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEpisodes();
    }, []);

    const fetchEpisodes = async () => {
        try {
            const res = await fetch("/api/episodes");
            const data = await res.json();
            setEpisodes(data.sort((a: Episode, b: Episode) => a.episode_number - b.episode_number));
        } catch (error) {
            console.error("Failed to fetch episodes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذه الحلقة؟")) return;

        try {
            const res = await fetch(`/api/episodes/${id}`, { method: "DELETE" });
            if (res.ok) {
                setEpisodes(episodes.filter((ep) => ep.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete episode", error);
        }
    };

    const filteredEpisodes = episodes.filter((ep) =>
        ep.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white text-center p-8">جاري التحميل...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">إدارة الحلقات</h1>
                <Link
                    href="/admin/episodes/new"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    إضافة حلقة جديدة
                </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="بحث عن حلقة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-10 pl-4 py-2 text-white focus:outline-none focus:border-red-600 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-950 text-slate-400">
                            <tr>
                                <th className="p-4 font-medium">#</th>
                                <th className="p-4 font-medium">الصورة</th>
                                <th className="p-4 font-medium">العنوان</th>
                                <th className="p-4 font-medium">الموسم</th>
                                <th className="p-4 font-medium">المدة</th>
                                <th className="p-4 font-medium text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300 divide-y divide-slate-800">
                            {filteredEpisodes.map((ep) => (
                                <tr key={ep.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">{ep.episode_number}</td>
                                    <td className="p-4">
                                        <img src={ep.thumbnail} alt={ep.title} className="w-16 h-9 object-cover rounded" />
                                    </td>
                                    <td className="p-4 font-medium text-white">{ep.title}</td>
                                    <td className="p-4">{ep.season}</td>
                                    <td className="p-4 text-slate-500">{ep.duration}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={`/admin/episodes/${ep.id}`}
                                                className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                                                title="تعديل"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(ep.id)}
                                                className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                                                title="حذف"
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

                {filteredEpisodes.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        لا توجد حلقات مطابقة للبحث.
                    </div>
                )}
            </div>
        </div>
    );
}
