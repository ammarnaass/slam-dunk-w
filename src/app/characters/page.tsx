import CharacterCard from "@/components/CharacterCard";
import { AnimeService } from "@/server/services/anime.service";
import { CharacterService } from "@/server/services/character.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CharactersPage() {
    const [animesData, charactersData] = await Promise.all([
        AnimeService.getAnimes({ limit: 50, sort: "title" }),
        CharacterService.getCharacters({ limit: 150 })
    ]);

    const animes = animesData.items;
    const allCharacters = charactersData.items;

    return (
        <main className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-gutter-lg">
                <div className="flex flex-col gap-1 mb-space-xl border-b border-white/[0.06] pb-space-lg">
                    <div className="flex items-center gap-space-xs text-secondary font-label-md text-label-md font-bold">
                        <span className="material-symbols-outlined text-[18px]">group</span>
                        <span>موسوعة شخصيات ومؤدي أصوات ANIME DAZE</span>
                    </div>
                    <h1 className="font-headline-hero text-headline-hero font-extrabold text-on-surface tracking-tight">
                        أبطال ومساعدو وخصوم الأعمال
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                        تعرف على أبطال الأنمي المفضلين لديك، انتماءاتهم، أسرار عزيمتهم، وأبرز مؤدي الأصوات بالدبلجة العربية والأداء الياباني الأصلي.
                    </p>
                </div>

                <div className="space-y-space-xl">
                    {animes.map(anime => {
                        const animeCharacters = allCharacters.filter((c: any) => 
                            c.animeId === anime.id || (!c.animeId && anime.id === "slam-dunk")
                        );
                        if (animeCharacters.length === 0) return null;

                        return (
                            <section key={anime.id} className="bg-surface-container-lowest/60 rounded-3xl p-space-lg border border-white/[0.04]">
                                <div className="flex flex-wrap items-center justify-between gap-space-md mb-space-lg">
                                    <div className="flex items-center gap-space-md">
                                        <div className="w-1.5 h-6 rounded-full bg-primary-container" />
                                        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                                            {anime.title}
                                        </h2>
                                        {anime.planet && (
                                            <span className="px-2.5 py-0.5 rounded-lg bg-primary-container/20 border border-primary-container/40 text-primary-container font-label-sm text-xs font-bold">
                                                كوكب {anime.planet}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Link 
                                            href={`/animes/${anime.id}`}
                                            className="text-xs text-primary hover:underline font-bold"
                                        >
                                            مشاهدة العمل والحلقات ←
                                        </Link>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant px-space-sm py-1 rounded-lg bg-surface-container-high border border-white/[0.04]">
                                            {animeCharacters.length} شخصية
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
                                    {animeCharacters.map((character) => (
                                        <CharacterCard key={character.id} character={character} variant="circle" />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
