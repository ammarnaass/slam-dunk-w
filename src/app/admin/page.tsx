import Link from "next/link";
import fs from "fs";
import path from "path";
import { Film, Users, Plus } from "lucide-react";
import { Episode, Character } from "@/types";

function getData() {
    const episodesPath = path.join(process.cwd(), "src/data/episodes.json");
    const charactersPath = path.join(process.cwd(), "src/data/characters.json");

    const episodes: Episode[] = JSON.parse(fs.readFileSync(episodesPath, "utf8"));
    const characters: Character[] = JSON.parse(fs.readFileSync(charactersPath, "utf8"));

    return { episodes, characters };
}

export default function AdminDashboard() {
    const { episodes, characters } = getData();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">لوحة التحكم</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Episodes Stats */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-600/10 p-3 rounded-lg">
                            <Film className="text-blue-500" size={24} />
                        </div>
                        <span className="text-slate-400 text-sm">إجمالي الحلقات</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{episodes.length}</div>
                    <div className="text-slate-500 text-sm mb-6">حلقة مسجلة في النظام</div>

                    <div className="flex gap-3">
                        <Link
                            href="/admin/episodes"
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-center py-2 rounded-lg text-sm transition-colors"
                        >
                            عرض الكل
                        </Link>
                        <Link
                            href="/admin/episodes/new"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                        >
                            <Plus size={16} />
                            إضافة حلقة
                        </Link>
                    </div>
                </div>

                {/* Characters Stats */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-600/10 p-3 rounded-lg">
                            <Users className="text-green-500" size={24} />
                        </div>
                        <span className="text-slate-400 text-sm">إجمالي الشخصيات</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{characters.length}</div>
                    <div className="text-slate-500 text-sm mb-6">شخصية مسجلة في النظام</div>

                    <div className="flex gap-3">
                        <Link
                            href="/admin/characters"
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-center py-2 rounded-lg text-sm transition-colors"
                        >
                            عرض الكل
                        </Link>
                        <Link
                            href="/admin/characters/new"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                        >
                            <Plus size={16} />
                            إضافة شخصية
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">آخر الحلقات المضافة</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-800">
                                <th className="pb-3 font-medium">#</th>
                                <th className="pb-3 font-medium">العنوان</th>
                                <th className="pb-3 font-medium">الموسم</th>
                                <th className="pb-3 font-medium">المدة</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            {episodes.slice(-5).reverse().map((ep) => (
                                <tr key={ep.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/50">
                                    <td className="py-3">{ep.episode_number}</td>
                                    <td className="py-3 font-medium text-white">{ep.title}</td>
                                    <td className="py-3">{ep.season}</td>
                                    <td className="py-3 text-slate-500">{ep.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
