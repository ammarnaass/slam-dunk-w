import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import { HomeSectionItem } from "@/lib/home-presets";

interface ClassicsSectionProps {
    section: HomeSectionItem;
    spacetoonClassics: any[];
}

export function ClassicsSection({ section, spacetoonClassics }: ClassicsSectionProps) {
    if (spacetoonClassics.length === 0) return null;
    const classicsLimit = section.itemLimit || 5;

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface-container-low/50 to-surface-container-lowest border-b border-white/[0.04]">
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Banner Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg p-space-lg rounded-2xl bg-surface-container-low/80 backdrop-blur-md shadow-xl border border-white/[0.06]">
                    <div className="space-y-space-xs">
                        {section.badgeText && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary font-label-md text-label-md font-bold">
                                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                                {section.badgeText}
                            </div>
                        )}
                        <h2 className="font-headline-lg text-headline-lg text-on-surface font-black">
                            {section.title || "سبيستون كلاسيك دايز"}
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                            {section.subtitle || "أعد إحياء لحظات الطفولة الخالدة، جميع المواسم كاملة بجودة محسّنة بالذكاء الاصطناعي 1080p ومعالجة صوتية نقية للأغاني والشارات الأصلية."}
                        </p>
                    </div>
                    <Link 
                        href={section.viewAllLink || "/animes?planet=spacetoon"} 
                        className="shrink-0 flex items-center gap-space-xs px-space-lg py-space-sm rounded-xl bg-secondary-container text-on-secondary font-headline-sm text-headline-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(238,152,0,0.4)]"
                    >
                        <span className="material-symbols-outlined text-xl">play_circle</span>
                        <span>تصفح كوكب الكلاسيكيات</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-space-md lg:gap-gutter">
                    {spacetoonClassics.slice(0, classicsLimit).map((anime) => (
                        <AnimeCard
                            key={`classic-${anime.id}`}
                            anime={anime}
                            priority={false}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
