import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import { HomeSectionItem } from "@/lib/home-presets";

interface TopTrendingSectionProps {
    section: HomeSectionItem;
    allAnimes: any[];
}

export function TopTrendingSection({ section, allAnimes }: TopTrendingSectionProps) {
    const trendingLimit = section.itemLimit || 10;

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-surface-container-lowest relative border-b border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-space-lg">
                    <div className="flex items-center gap-space-sm">
                        <div className="w-1.5 h-7 rounded-full bg-primary-container shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
                        <div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                {section.title || "الأكثر مشاهدة هذا الأسبوع"}
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {section.subtitle || "أفضل الأعمال التي تتصدر تصويت ومتابعات الجماهير العربية"}
                            </p>
                        </div>
                    </div>
                    <Link 
                        href={section.viewAllLink || "/animes"} 
                        className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
                    >
                        <span>عرض كل الأعمال</span>
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-space-md lg:gap-gutter">
                    {allAnimes.slice(0, trendingLimit).map((anime, index) => (
                        <div key={anime.id} className="relative">
                            {/* Large Rank Number (01, 02...) */}
                            {index < 5 && (
                                <span className="absolute -top-3 -right-2 z-20 font-cairo font-black text-3xl sm:text-4xl text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] bg-surface-container-high/90 px-2 py-0.5 rounded-xl border border-white/10 pointer-events-none">
                                    0{index + 1}
                                </span>
                            )}
                            <AnimeCard
                                anime={anime}
                                priority={index < 4}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
