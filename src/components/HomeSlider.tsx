"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Play, Info } from "lucide-react";
import Link from "next/link";
import { Anime } from "@/types";

interface HomeSliderProps {
    animes: Anime[];
}

export default function HomeSlider({ animes }: HomeSliderProps) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (animes.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % animes.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [animes.length]);

    if (!animes || animes.length === 0) return null;

    const next = () => setCurrent((prev) => (prev + 1) % animes.length);
    const prev = () => setCurrent((prev) => (prev - 1 + animes.length) % animes.length);

    return (
        <section className="relative h-[80vh] w-full overflow-hidden bg-slate-950">
            {animes.map((anime, index) => (
                <div
                    key={anime.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={anime.bannerImage || anime.coverImage}
                            alt={anime.title}
                            className="h-full w-full object-cover object-center scale-105 animate-slow-zoom"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="container relative mx-auto h-full px-4 flex flex-col justify-center">
                        <div className="max-w-2xl space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    {anime.type}
                                </span>
                                <span className="text-slate-300 text-sm font-medium">
                                    {anime.releaseYear} • {anime.status}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
                                {anime.title}
                            </h1>

                            <p className="text-lg text-slate-300 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-xl">
                                {anime.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <Link
                                    href={`/animes/${anime.id}`}
                                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/20"
                                >
                                    <Play size={20} fill="currentColor" />
                                    شاهد الآن
                                </Link>
                                <div className="flex gap-2">
                                    {anime.genres.slice(0, 3).map(genre => (
                                        <span key={genre} className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Dots */}
            {animes.length > 1 && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {animes.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-red-600" : "w-1.5 bg-slate-600 hover:bg-slate-400"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Arrows */}
            {animes.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/20 backdrop-blur-sm border border-white/5 text-white hover:bg-red-600 transition-all group"
                    >
                        <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/20 backdrop-blur-sm border border-white/5 text-white hover:bg-red-600 transition-all group"
                    >
                        <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                </>
            )}
        </section>
    );
}
