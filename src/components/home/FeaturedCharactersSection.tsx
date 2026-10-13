import Link from "next/link";
import CharacterCard from "@/components/CharacterCard";
import { HomeSectionItem } from "@/lib/home-presets";

interface FeaturedCharactersSectionProps {
    section: HomeSectionItem;
    featuredCharacters: any[];
}

export function FeaturedCharactersSection({ section, featuredCharacters }: FeaturedCharactersSectionProps) {
    if (featuredCharacters.length === 0) return null;
    const charsLimit = section.itemLimit || 6;

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative border-b border-white/[0.04]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-space-lg">
                    <div className="flex items-center gap-space-sm">
                        <div className="w-1.5 h-7 rounded-full bg-primary-container shadow-[0_0_10px_rgba(220,38,38,0.7)]" />
                        <div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                                {section.title || "أبطال وشخصيات الأنمي"}
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {section.subtitle || "تعرف على أبطال الأنمي ونخبة فناني الدبلجة"}
                            </p>
                        </div>
                    </div>
                    <Link 
                        href={section.viewAllLink || "/characters"} 
                        className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
                    >
                        <span>جميع الشخصيات</span>
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-space-md">
                    {featuredCharacters.slice(0, charsLimit).map((character) => (
                        <CharacterCard 
                            key={character.id} 
                            character={character} 
                            variant="circle" 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
