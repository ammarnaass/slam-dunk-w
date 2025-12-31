"use client";

import { useState, useEffect } from "react";
export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EpisodeCard from "@/components/EpisodeCard";
import { Search, Loader2 } from "lucide-react";

export default function EpisodesPage() {
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAnime, setSelectedAnime] = useState<string>("all");

    useEffect(() => {
        fetch("/api/episodes")
            .then(res => res.json())
            .then(data => {
                setEpisodes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredEpisodes = episodes.filter((episode) => {
        const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            episode.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (episode.animeTitle && episode.animeTitle.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesAnime = selectedAnime === "all" || episode.animeId === selectedAnime;
        return matchesSearch && matchesAnime;
    });

    const uniqueAnimes = Array.from(new Set(episodes.map(e => JSON.stringify({ id: e.animeId, title: e.animeTitle })))).map(s => JSON.parse(s));

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-red-600 w-10 h-10" />
            </div>
            <Footer />
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-8 border-r-4 border-red-600 pr-4">
                    اكتشف الحلقات
                </h1>

                {/* Filters */}
                <div className="bg-slate-900/50 p-6 rounded-2xl mb-10 border border-slate-800 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="ابحث عن حلقة أو أنمي..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pr-12 pl-4 text-white focus:outline-none focus:border-red-600/50 transition-all shadow-inner"
                            />
                        </div>
                        <select
                            value={selectedAnime}
                            onChange={(e) => setSelectedAnime(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-white focus:outline-none focus:border-red-600/50 transition-all font-bold"
                        >
                            <option value="all">جميع الأعمال</option>
                            {uniqueAnimes.map(anime => (
                                <option key={anime.id} value={anime.id}>{anime.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {filteredEpisodes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEpisodes.map((episode) => (
                            <EpisodeCard key={episode.id} episode={episode} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                        <p className="text-xl text-slate-500">لا توجد حلقات تطابق بحثك حالياً.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
