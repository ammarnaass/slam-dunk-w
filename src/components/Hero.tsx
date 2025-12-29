import { Anime } from "@/types";
import Link from "next/link";
import { Play } from "lucide-react";

export default function Hero({ anime }: { anime?: Anime }) {
    if (!anime) return null;

    return (
        <div className="relative h-[600px] w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url("${anime.bannerImage || anime.coverImage}")`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-20 font-cairo">
                <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {anime.type}
                        </span>
                        <span className="inline-block bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                            {anime.totalEpisodes} حلقة
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        {anime.title}
                    </h1>
                    <p className="text-lg text-slate-200 mb-8 leading-relaxed line-clamp-2">
                        {anime.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={`/animes/${anime.id}`}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2 transition-colors"
                        >
                            <Play fill="currentColor" size={20} />
                            ابدأ المشاهدة
                        </Link>
                        <Link
                            href="/animes"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border border-white/20"
                        >
                            اكتشف المزيد
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
