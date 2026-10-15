import Link from "next/link";
import { Edit, ExternalLink, Trash2, Loader2, Star, Film } from "lucide-react";
import { Anime } from "@/types";

interface AnimeAdminCardProps {
    anime: Anime;
    isDeleting: boolean;
    onDelete: (id: string, title: string) => void;
}

export default function AnimeAdminCard({ anime, isDeleting, onDelete }: AnimeAdminCardProps) {
    const isOngoing = anime.status?.toLowerCase() === "ongoing" || anime.status === "مستمر";

    return (
        <div className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60">
            {/* Media Banner Header */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                    src={anime.coverImage || anime.bannerImage || "/hero-bg.jpg"}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Badges on Top */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10">
                            {anime.type || "TV Series"}
                        </span>

                        {anime.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/90 text-black backdrop-blur-md shadow-md">
                                <Star size={10} className="fill-black" />
                                مميز
                            </span>
                        )}
                    </div>

                    <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold backdrop-blur-md ${
                            isOngoing
                                ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? "bg-sky-400 animate-pulse" : "bg-emerald-400"}`} />
                        {isOngoing ? "مستمر" : "مكتمل"}
                    </span>
                </div>

                {/* Bottom Info on Poster */}
                <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-slate-300 font-bold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                        <Film size={12} className="text-red-400" />
                        <span>{anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "فيلم كامل"}</span>
                    </div>

                    {anime.releaseYear && (
                        <span className="text-[10px] font-semibold text-slate-400 bg-black/50 px-2 py-0.5 rounded-md">
                            {anime.releaseYear}
                        </span>
                    )}
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-red-400 transition-colors line-clamp-1">
                        {anime.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {anime.description || "لا يوجد وصف مدخل لهذا العمل."}
                    </p>

                    {/* Genres pills */}
                    {Array.isArray(anime.genres) && anime.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                            {anime.genres.slice(0, 3).map((g, gIdx) => (
                                <span
                                    key={gIdx}
                                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50"
                                >
                                    {g}
                                </span>
                            ))}
                            {anime.genres.length > 3 && (
                                <span className="text-[10px] text-slate-500 self-center">
                                    +{anime.genres.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <Link
                        href={`/admin/animes/${anime.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors group/btn"
                    >
                        <Edit size={14} className="text-slate-400 group-hover/btn:text-white transition-colors" />
                        <span>إدارة وتعديل</span>
                    </Link>

                    <Link
                        href={`/animes/${anime.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/50"
                        title="معاينة في الموقع"
                    >
                        <ExternalLink size={15} />
                    </Link>

                    <button
                        type="button"
                        onClick={() => onDelete(anime.id, anime.title)}
                        disabled={isDeleting}
                        className="p-2 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/30 disabled:opacity-50 cursor-pointer"
                        title="حذف العمل"
                    >
                        {isDeleting ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <Trash2 size={15} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
