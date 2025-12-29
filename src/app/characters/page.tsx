import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CharacterCard from "@/components/CharacterCard";
import charactersData from "@/data/characters.json";
import { getAnimes } from "@/lib/db";

export default function CharactersPage() {
    const animes = getAnimes();
    const characters = charactersData as any[];

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
                    {animes.map(anime => {
                        const animeCharacters = characters.filter(c => c.animeId === anime.id);
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
