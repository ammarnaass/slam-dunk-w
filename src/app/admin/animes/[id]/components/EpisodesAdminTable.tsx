import { PlayCircle, Edit, Trash2 } from "lucide-react";
import { Episode } from "@/types";

interface EpisodesAdminTableProps {
    episodes: Episode[];
    onStartEdit: (ep: Episode) => void;
    onDelete: (id: string) => void;
}

export function EpisodesAdminTable({
    episodes,
    onStartEdit,
    onDelete,
}: EpisodesAdminTableProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-right">
                <thead className="bg-slate-800 text-slate-400">
                    <tr>
                        <th className="p-4">#</th>
                        <th className="p-4">العنوان</th>
                        <th className="p-4">السيرفرات</th>
                        <th className="p-4">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                    {episodes.map((ep) => (
                        <tr key={ep.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 font-bold">{ep.episodeNumber}</td>
                            <td className="p-4 flex items-center gap-2">
                                <PlayCircle size={16} className="text-red-500" />
                                {ep.title}
                            </td>
                            <td className="p-4 text-xs">
                                <span className="bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
                                    {ep.servers?.length || 0} سيرفرات
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onStartEdit(ep)}
                                        className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 cursor-pointer"
                                        title="تعديل الحلقة"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(ep.id)}
                                        className="p-2 hover:bg-slate-700 rounded-lg text-red-400 cursor-pointer"
                                        title="حذف الحلقة"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {episodes.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                    لا توجد حلقات مضافة بعد.
                </div>
            )}
        </div>
    );
}
