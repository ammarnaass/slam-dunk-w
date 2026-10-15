import { Loader2, Plus, Save, Trash2, Video } from "lucide-react";
import { Episode } from "@/types";
import { EpisodeFormData } from "../hooks/useAdminEditAnime";

interface EpisodeFormCardProps {
    editingEpisode: Episode | null;
    epFormData: EpisodeFormData;
    setEpFormData: React.Dispatch<React.SetStateAction<EpisodeFormData>>;
    epSaving: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onAddServer: () => void;
    onRemoveServer: (index: number) => void;
    onUpdateServer: (index: number, field: string, value: string) => void;
}

export function EpisodeFormCard({
    editingEpisode,
    epFormData,
    setEpFormData,
    epSaving,
    onSubmit,
    onCancel,
    onAddServer,
    onRemoveServer,
    onUpdateServer,
}: EpisodeFormCardProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 animate-in slide-in-from-top-2">
            <h3 className="text-lg font-bold text-white mb-4">
                {editingEpisode ? "تعديل حلقة" : "إضافة حلقة جديدة"}
            </h3>
            <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-400 mb-2 text-sm">عنوان الحلقة</label>
                    <input
                        type="text"
                        value={epFormData.title}
                        onChange={e => setEpFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                        required
                    />
                </div>
                <div>
                    <label className="block text-slate-400 mb-2 text-sm">رقم الحلقة</label>
                    <input
                        type="number"
                        value={epFormData.episodeNumber}
                        onChange={e => setEpFormData(prev => ({ ...prev, episodeNumber: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                        required
                    />
                </div>

                <div className="md:col-span-2 border-t border-slate-800 pt-4 mt-2">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-white font-bold text-sm flex items-center gap-2">
                            <Video size={16} className="text-red-500" /> سيرفرات المشاهدة
                        </label>
                        <button
                            type="button"
                            onClick={onAddServer}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            <Plus size={14} /> إضافة سيرفر
                        </button>
                    </div>

                    <div className="space-y-4">
                        {epFormData.servers.map((server, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-800/30 p-4 rounded-xl border border-slate-800 relative group">
                                <div className="md:col-span-1">
                                    <label className="block text-slate-500 mb-1 text-[10px] uppercase">اسم السيرفر (مثل Mega)</label>
                                    <input
                                        type="text"
                                        placeholder="Mega, 4shared..."
                                        value={server.name}
                                        onChange={e => onUpdateServer(index, "name", e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-red-600"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-slate-500 mb-1 text-[10px] uppercase">رابط الفيديو / Embed</label>
                                    <input
                                        type="text"
                                        placeholder="رابط السيرفر..."
                                        value={server.url}
                                        onChange={e => onUpdateServer(index, "url", e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white font-mono focus:outline-none focus:border-red-600"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-1 flex items-end gap-2">
                                    <div className="flex-1">
                                        <label className="block text-slate-500 mb-1 text-[10px] uppercase">الجودة</label>
                                        <select
                                            value={server.quality || "HD"}
                                            onChange={e => onUpdateServer(index, "quality", e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white cursor-pointer focus:outline-none focus:border-red-600"
                                        >
                                            <option value="FHD">FHD</option>
                                            <option value="HD">HD</option>
                                            <option value="SD">SD</option>
                                        </select>
                                    </div>
                                    {epFormData.servers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => onRemoveServer(index)}
                                            className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all cursor-pointer"
                                            title="حذف السيرفر"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:col-span-2 mt-6 border-t border-slate-800 pt-6">
                    <button
                        type="submit"
                        disabled={epSaving}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer disabled:opacity-50"
                    >
                        {epSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} {editingEpisode ? "حفظ التعديلات" : "إضافة الحلقة"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-3 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    );
}
