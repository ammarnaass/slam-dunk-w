import Link from "next/link";
import { HomeSectionItem } from "@/lib/home-presets";

interface HomePlanetsSectionProps {
    section: HomeSectionItem;
    planetsList: any[];
}

export function HomePlanetsSection({ section, planetsList }: HomePlanetsSectionProps) {
    const planetsLimit = section.itemLimit || 6;

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-surface-container-lowest relative border-b border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-space-lg">
                    <div className="flex items-center gap-space-sm">
                        <div className="w-1.5 h-7 rounded-full bg-secondary-container shadow-[0_0_10px_rgba(238,152,0,0.7)]" />
                        <div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                {section.title || "كواكب الأنمي"}
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {section.subtitle || "سافر بين عوالم التصنيفات المستوحاة من كواكب الطفولة والخيال"}
                            </p>
                        </div>
                    </div>
                    <Link 
                        href={(!section.viewAllLink || section.viewAllLink === "/animes") ? "/planets" : section.viewAllLink} 
                        className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
                    >
                        <span>كل الكواكب (+12)</span>
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-md">
                    {planetsList.slice(0, planetsLimit).map((planet: any) => {
                        const planetId = planet.id || planet.planetId || "all";
                        const badgeText = planet.slogan || planet.badge || "";
                        return (
                            <Link
                                key={planet.name || planet.id}
                                href={`/planets?planet=${encodeURIComponent(planetId)}`}
                                className="group flex flex-col items-center justify-center p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center"
                            >
                                <div 
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-space-sm group-hover:scale-110 transition-transform duration-300 shadow-md text-2xl"
                                    style={{ 
                                        backgroundColor: planet.color ? `${planet.color}20` : "rgba(255,255,255,0.05)",
                                        border: planet.color ? `1px solid ${planet.color}40` : "1px solid rgba(255,255,255,0.1)"
                                    }}
                                >
                                    <span>{planet.badge && planet.badge.length <= 4 ? planet.badge : "🪐"}</span>
                                </div>
                                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm group-hover:text-primary transition-colors">
                                    {planet.name}
                                </h3>
                                {badgeText && (
                                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 line-clamp-1 text-[11px]">
                                        {badgeText}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
