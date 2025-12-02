import Link from "next/link";
import { PlayCircle, Clock } from "lucide-react";
import { Episode } from "@/types";

interface EpisodeCardProps {
    episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
    return (
        <Link
            href={`/episodes/${episode.id}`}
            className="group block bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-red-600/50 transition-all hover:shadow-lg hover:shadow-red-900/10"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* رقم الحلقة الكبير */}
                <div className="absolute top-3 left-3 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-xl">
                    {episode.episode_number}
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Clock size={12} />
                    {episode.duration}
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-red-500 text-sm font-medium">الحلقة {episode.episode_number}</span>
                    <span className="text-slate-500 text-xs">الموسم {episode.season}</span>
                </div>
                <h3 className="text-white font-semibold line-clamp-1 mb-2 group-hover:text-red-500 transition-colors">
                    {episode.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2">
                    {episode.description}
                </p>
            </div>
        </Link>
    );
}
