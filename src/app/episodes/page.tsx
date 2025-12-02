"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EpisodeCard from "@/components/EpisodeCard";
import episodesData from "@/data/episodes.json";
import { Search } from "lucide-react";

export default function EpisodesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSeason, setSelectedSeason] = useState<number | "all">("all");

    const filteredEpisodes = episodesData.filter((episode) => {
        const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            episode.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeason = selectedSeason === "all" || episode.season === selectedSeason;
        return matchesSearch && matchesSeason;
    });

    const seasons = Array.from(new Set(episodesData.map(e => e.season))).sort();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-8 border-r-4 border-red-600 pr-4">
                    جميع الحلقات
                </h1>

                {/* Filters */}
                <div className="bg-slate-900 p-6 rounded-xl mb-10 border border-slate-800">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="ابحث عن حلقة..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pr-10 pl-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                            />
                        </div>
                        <select
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(e.target.value === "all" ? "all" : Number(e.target.value))}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        >
                            <option value="all">جميع المواسم</option>
                            {seasons.map(season => (
                                <option key={season} value={season}>الموسم {season}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {filteredEpisodes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEpisodes.map((episode) => (
                            <EpisodeCard key={episode.id} episode={episode} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-slate-500">لا توجد حلقات تطابق بحثك.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
