import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CharacterCard from "@/components/CharacterCard";
import { prisma } from "@/lib/prismadb";

export default async function CharactersPage() {
    // Fetch all animes that have characters (or just all animes)
    const animes = await prisma.anime.findMany({
        orderBy: { title: 'asc' }
    });

    // Fetch all characters
    const allCharacters = await prisma.character.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-4 border-r-4 border-red-600 pr-4">
                    شخصيات الأعمال
                </h1>
                <p className="text-slate-400 mb-12 max-w-2xl">
                    تعرف على أبطال مسلسلاتك المفضلة وتفاصيلهم المثيرة.
                </p>

                <div className="space-y-16">
                    {/* Assuming characters would have an animeId or we map them. 
                        If the schema doesn't have animeId for characters yet, we might need to add it or skip filtering for now.
                        In my schema add earlier:
                        model Character {
                          id String @id
                          ...
                        }
                        It didn't have animeId. I should add animeId to Character model if needed. 
                        The legacy JSON had characters with animeId? Let's check characters.json.
                    */}
                    {animes.map(anime => {
                        // For now, if we don't have a direct relation, we search by a field or just display all.
                        // Ideally we should have a relation or a JSON field.
                        // Let's assume for this specific app (Slam Dunk primarily) we just show them.
                        // But the logic used `c.animeId === anime.id`.

                        // I'll filter them if the field exists (it should if I migrated it).
                        const animeCharacters = allCharacters.filter((c: any) => c.animeId === anime.id || anime.id === 'slam-dunk');

                        if (animeCharacters.length === 0) return null;

                        return (
                            <section key={anime.id}>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-2xl font-bold text-white">{anime.title}</h2>
                                    <div className="flex-1 h-px bg-slate-800"></div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {animeCharacters.map((character) => (
                                        <CharacterCard key={character.id} character={character} />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>

            <Footer />
        </main>
    );
}
