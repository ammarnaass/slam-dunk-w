import Link from "next/link";
import EpisodeCard from "@/components/EpisodeCard";
import { HomeSectionItem } from "@/lib/home-presets";

interface LatestEpisodesSectionProps {
    section: HomeSectionItem;
    latestEpisodes: any[];
}

export function LatestEpisodesSection({ section, latestEpisodes }: LatestEpisodesSectionProps) {
    const episodesLimit = section.itemLimit || 6;

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative border-b border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm mb-space-lg">
                    <div className="flex items-center gap-space-sm">
                        <div className="w-1.5 h-7 rounded-full bg-primary-container shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                    {section.title || "أحدث الحلقات المضافة"}
                                </h2>
                                {section.badgeText && (
                                    <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-sm text-xs font-bold border border-primary-container/30 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                                        {section.badgeText}
                                    </span>
                                )}
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {section.subtitle || "تحديث فوري فور البث الياباني بدون فواصل إعلانية"}
                            </p>
                        </div>
                    </div>
                    <Link 
                        href={section.viewAllLink || "/animes"} 
                        className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1 self-start sm:self-auto"
                    >
                        <span>عرض كافة الأعمال</span>
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-gutter">
                    {latestEpisodes.slice(0, episodesLimit).map((episode) => (
                        <EpisodeCard 
                            key={episode.id} 
                            episode={{
                                ...episode,
                                isVip: false
                            } as any} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
