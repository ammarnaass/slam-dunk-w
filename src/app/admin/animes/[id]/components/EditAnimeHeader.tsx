import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Anime } from "@/types";

interface EditAnimeHeaderProps {
    anime: Anime;
}

export function EditAnimeHeader({ anime }: EditAnimeHeaderProps) {
    return (
        <div>
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
        </div>
    );
}
