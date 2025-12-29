"use client";

import { useEffect, useState } from "react";
import { Anime } from "@/types";
import { Loader2, PlayCircle, Star } from "lucide-react";
import Link from "next/link";

export default function AnimesListPage() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Since this is public page, we need a public API or reuse the admin one if unsecured? 
        // Admin API checks checks role. We need public API.
        // Wait, current db helpers read from JSON. I can make a public API or just use Server Actions / Server Component.
        // I will make it a Client Component fetching from a new public route /api/animes.
        fetch("/api/animes")
            .then(res => res.json())
            .then(data => {
                setAnimes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-red-600 w-8 h-8" /></div>;

    return (
        <div className="container mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-white mb-8 border-r-4 border-red-600 pr-4">أحدث الأنميات</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {animes.map(anime => (
                    <Link key={anime.id} href={`/animes/${anime.id}`} className="group relative block overflow-hidden rounded-xl bg-slate-900 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/20">
                        <div className="aspect-[2/3] w-full overflow-hidden">
                            <img
                                src={anime.coverImage}
                                alt={anime.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />

                            <div className="absolute top-2 right-2 flex flex-col gap-2">
                                <span className="bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                                    {anime.type}
                                </span>
                                {anime.status === "Completed" && (
                                    <span className="bg-green-600/90 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                                        مكتمل
                                    </span>
                                )}
                            </div>

                            <div className="absolute bottom-0 p-4 w-full">
                                <h3 className="line-clamp-1 text-lg font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
                                    {anime.title}
                                </h3>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>{anime.releaseYear}</span>
                                    <span>{anime.totalEpisodes} حلقة</span>
                                </div>
                            </div>

                            {/* Hover Overlay Icon */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-red-600/90 rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                    <PlayCircle size={32} className="text-white fill-white" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {animes.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    لا توجد أعمال مضافة حالياً.
                </div>
            )}
        </div>
    );
}
