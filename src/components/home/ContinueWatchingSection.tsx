import Link from "next/link";
import { HomeSectionItem } from "@/lib/home-presets";

interface ContinueWatchingSectionProps {
    section: HomeSectionItem;
    episodes: Array<{
        id: string;
        title: string;
        thumbnail?: string;
        duration?: string;
        episodeNumber?: string | number;
        animeTitle?: string;
    }>;
}

export function ContinueWatchingSection({ section, episodes }: ContinueWatchingSectionProps) {
    if (episodes.length === 0) return null;
    const watchLimit = section.itemLimit || 3;

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-20 border-b border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-space-lg">
                    <div className="flex items-center gap-space-sm">
                        <div className="w-1.5 h-7 rounded-full bg-primary-container shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
                        <div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                {section.title || "استكمل المشاهدة"}
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {section.subtitle || "تابع من النقطة التي توقفت عندها بالضبط"}
                            </p>
                        </div>
                    </div>
                    <Link 
                        href={section.viewAllLink || "/profile?tab=history"} 
                        className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
                    >
                        <span>سجل المشاهدة الكامل</span>
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                </div>

                {/* Horizontal Episode Rail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    {episodes.slice(0, watchLimit).map((ep, idx) => {
                        const randomProgress = (idx * 25 + 40) % 85;
                        return (
                            <div 
                                key={ep.id}
                                className="group relative flex items-center gap-space-md p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all border border-white/[0.05] hover:border-primary-container/40 shadow-lg"
                            >
                                <div className="w-40 aspect-video rounded-xl overflow-hidden shrink-0 relative bg-surface-container-highest">
                                    <img
                                        src={ep.thumbnail || "/hero-bg.jpg"}
                                        alt={ep.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg">
                                            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 h-1 bg-surface-container-highest">
                                        <div 
                                            className="h-full bg-primary-container shadow-[0_0_8px_rgba(220,38,38,0.8)]" 
                                            style={{ width: `${randomProgress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 pr-1">
                                    <span className="font-label-sm text-label-sm text-secondary font-bold block truncate">
                                        {ep.animeTitle}
                                    </span>
                                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm truncate group-hover:text-primary transition-colors mt-0.5">
                                        {ep.title}
                                    </h4>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-2">
                                        <span>الحلقة {ep.episodeNumber}</span>
                                        <span>•</span>
                                        <span>متبقي 8 دقائق</span>
                                    </p>
                                    <Link 
                                        href={`/watch/${ep.id}`}
                                        className="mt-2 inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:text-on-primary-container"
                                    >
                                        <span>استئناف الآن</span>
                                        <span className="material-symbols-outlined text-xs">play_circle</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
