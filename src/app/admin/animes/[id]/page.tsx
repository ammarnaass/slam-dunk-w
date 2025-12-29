"use client";

import { useEffect, useState, use } from "react";
import { Anime, Episode } from "@/types";
import { Loader2, Plus, Film, Save, Trash2, Video, ArrowRight, PlayCircle, Edit } from "lucide-react";
import Link from "next/link";
import AnimeForm from "@/components/admin/AnimeForm";

export default function AnimeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [anime, setAnime] = useState<Anime | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"details" | "episodes">("details");

    // Episode Form State
    const [showEpisodeForm, setShowEpisodeForm] = useState(false);
    const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
    const [epFormData, setEpFormData] = useState({
        title: "",
        episode_number: "",
        mega_link: "",
        video_url: "",
    });
    const [epSaving, setEpSaving] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch Anime
                const animeRes = await fetch(`/api/admin/animes/${id}`);
                if (animeRes.ok) {
                    const data = await animeRes.json();
                    setAnime(data);
                }

                // Fetch Episodes
                const epsRes = await fetch(`/api/admin/animes/${id}/episodes`);
                if (epsRes.ok) {
                    const data = await epsRes.json();
                    setEpisodes(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    const handleEpisodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEpSaving(true);

        const url = editingEpisode
            ? `/api/admin/episodes/${editingEpisode.id}`
            : `/api/admin/animes/${id}/episodes`;

        const method = editingEpisode ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(epFormData),
            });

            if (res.ok) {
                const newEp = await res.json();
                if (editingEpisode) {
                    setEpisodes(prev => prev.map(ep => ep.id === newEp.id ? newEp : ep));
                } else {
                    setEpisodes(prev => [...prev, newEp].sort((a, b) => a.episode_number - b.episode_number));
                }
                setShowEpisodeForm(false);
                setEditingEpisode(null);
                setEpFormData({ title: "", episode_number: "", mega_link: "", video_url: "" });
            } else {
                alert("حدث خطأ");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setEpSaving(false);
        }
    };

    const handleDeleteEpisode = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف الحلقة؟")) return;
        try {
            const res = await fetch(`/api/admin/episodes/${id}`, { method: "DELETE" });
            if (res.ok) {
                setEpisodes(prev => prev.filter(ep => ep.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const startEditEpisode = (ep: Episode) => {
        setEditingEpisode(ep);
        setEpFormData({
            title: ep.title,
            episode_number: ep.episode_number.toString(),
            mega_link: ep.mega_link,
            video_url: ep.video_url || "",
        });
        setShowEpisodeForm(true);
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-red-600" /></div>;
    if (!anime) return <div className="text-white">العمل غير موجود</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit">
                <Link href="/admin/animes" className="flex items-center gap-2">
                    <ArrowRight size={20} /> العودة للقائمة
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="rounded-xl overflow-hidden border border-slate-800 shadow-lg">
                        <img src={anime.coverImage} alt={anime.title} className="w-full h-auto" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{anime.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">{anime.type}</span>
                        <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-sm">{anime.totalEpisodes} حلقة</span>
                        <span className="bg-green-600/20 text-green-500 px-2 py-1 rounded text-sm border border-green-600/30">{anime.status}</span>
                    </div>
                    <p className="text-slate-400 max-w-2xl">{anime.description}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 mb-6">
                <button
                    onClick={() => setActiveTab("details")}
                    className={`px-6 py-3 font-bold transition-colors ${activeTab === 'details' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'}`}
                >
                    تفاصيل العمل
                </button>
                <button
                    onClick={() => setActiveTab("episodes")}
                    className={`px-6 py-3 font-bold transition-colors ${activeTab === 'episodes' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'}`}
                >
                    الحلقات ({episodes.length})
                </button>
            </div>

            {activeTab === "details" ? (
                <AnimeForm initialData={anime} isEdit={true} />
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">قائمة الحلقات</h2>
                        <button
                            onClick={() => {
                                setEditingEpisode(null);
                                setEpFormData({ title: "", episode_number: (episodes.length + 1).toString(), mega_link: "", video_url: "" });
                                setShowEpisodeForm(true);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                        >
                            <Plus size={20} /> إضافة حلقة
                        </button>
                    </div>

                    {showEpisodeForm && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 animate-in slide-in-from-top-2">
                            <h3 className="text-lg font-bold text-white mb-4">{editingEpisode ? "تعديل حلقة" : "إضافة حلقة جديدة"}</h3>
                            <form onSubmit={handleEpisodeSubmit} className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">عنوان الحلقة</label>
                                    <input
                                        type="text"
                                        value={epFormData.title}
                                        onChange={e => setEpFormData({ ...epFormData, title: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">رقم الحلقة</label>
                                    <input
                                        type="number"
                                        value={epFormData.episode_number}
                                        onChange={e => setEpFormData({ ...epFormData, episode_number: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-slate-400 mb-2 text-sm">رابط Mega</label>
                                    <input
                                        type="text"
                                        value={epFormData.mega_link}
                                        onChange={e => setEpFormData({ ...epFormData, mega_link: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2 md:col-span-2 mt-4">
                                    <button
                                        type="submit"
                                        disabled={epSaving}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                                    >
                                        {epSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} حفظ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEpisodeForm(false)}
                                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-bold"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-right">
                            <thead className="bg-slate-800 text-slate-400">
                                <tr>
                                    <th className="p-4">#</th>
                                    <th className="p-4">العنوان</th>
                                    <th className="p-4">رابط Mega</th>
                                    <th className="p-4">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                {episodes.map((ep) => (
                                    <tr key={ep.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 font-bold">{ep.episode_number}</td>
                                        <td className="p-4 flex items-center gap-2">
                                            <PlayCircle size={16} className="text-red-500" />
                                            {ep.title}
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-500 truncate max-w-[200px]">{ep.mega_link}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEditEpisode(ep)}
                                                    className="p-2 hover:bg-slate-700 rounded-lg text-blue-400"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEpisode(ep.id)}
                                                    className="p-2 hover:bg-slate-700 rounded-lg text-red-400"
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
                </div>
            )}
        </div>
    );
}
