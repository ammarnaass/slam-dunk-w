import { Anime } from "@/types";
import AnimeCard from "@/components/AnimeCard";

interface AnimesCatalogGridProps {
    loading: boolean;
    animes: Anime[];
    onReset: () => void;
}

export function AnimesCatalogGrid({
    loading,
    animes,
    onReset,
}: AnimesCatalogGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] rounded-xl bg-surface-container animate-pulse border border-white/5" />
                ))}
            </div>
        );
    }

    if (animes.length === 0) {
        return (
            <div className="text-center py-16 sm:py-20 px-4 bg-surface-container-low rounded-2xl border border-dashed border-white/10 flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">search_off</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">لم نجد أي نتائج مطابقة</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                    جرب البحث بكلمات أخرى أو اختر كوكب مختلف من قائمة التصفية أعلاه.
                </p>
                <button
                    onClick={onReset}
                    className="mt-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-cairo font-bold text-xs sm:text-sm active:scale-95 shadow-md cursor-pointer transition-all"
                >
                    إلغاء جميع الفلاتر
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {animes.map((anime, index) => (
                <AnimeCard
                    key={anime.id}
                    anime={anime}
                    priority={index < 5}
                />
            ))}
        </div>
    );
}
