"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Character } from "@/types";

export default function CharactersAdmin() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const res = await fetch("/api/characters");
            const data = await res.json();
            setCharacters(data);
        } catch (error) {
            console.error("Failed to fetch characters", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذه الشخصية؟")) return;

        try {
            const res = await fetch(`/api/characters/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCharacters(characters.filter((char) => char.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete character", error);
        }
    };

    const filteredCharacters = characters.filter((char) =>
        char.name_ar.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white text-center p-8">جاري التحميل...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">إدارة الشخصيات</h1>
                <Link
                    href="/admin/characters/new"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    إضافة شخصية جديدة
                </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="بحث عن شخصية..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-10 pl-4 py-2 text-white focus:outline-none focus:border-green-600 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-950 text-slate-400">
                            <tr>
                                <th className="p-4 font-medium">الصورة</th>
                                <th className="p-4 font-medium">الاسم</th>
                                <th className="p-4 font-medium">الرقم</th>
                                <th className="p-4 font-medium">المركز</th>
                                <th className="p-4 font-medium text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300 divide-y divide-slate-800">
                            {filteredCharacters.map((char) => (
                                <tr key={char.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <img src={char.image} alt={char.name_ar} className="w-12 h-12 object-cover rounded-full" />
                                    </td>
                                    <td className="p-4 font-medium text-white">{char.name_ar}</td>
                                    <td className="p-4">{char.number}</td>
                                    <td className="p-4 text-slate-500">{char.role}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={`/admin/characters/${char.id}`}
                                                className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                                                title="تعديل"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(char.id)}
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

                {filteredCharacters.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        لا توجد شخصيات مطابقة للبحث.
                    </div>
                )}
            </div>
        </div>
    );
}
