import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import { Anime } from "@/types";

interface WatchlistTabProps {
    watchlistAnimes: Anime[];
}

export default function WatchlistTab({ watchlistAnimes }: WatchlistTabProps) {
    if (watchlistAnimes.length > 0) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-space-md">
                {watchlistAnimes.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} />
                ))}
            </div>
        );
    }

    return (
        <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-white/10 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant">favorite_border</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">قائمتك المفضلة فارغة حالياً</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                تصفح المكتبة وأضف الأعمال المفضلة إليك بالضغط على زر المفضلة لتظهر هنا دائماً.
            </p>
            <Link
                href="/animes"
                className="mt-2 px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-cairo font-bold text-xs shadow-lg hover:brightness-110 transition-all"
            >
                استكشف مكتبة الأنمي
            </Link>
        </div>
    );
}
