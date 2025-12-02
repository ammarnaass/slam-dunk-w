import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CharacterCard from "@/components/CharacterCard";
import charactersData from "@/data/characters.json";

export default function CharactersPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-4 border-r-4 border-red-600 pr-4">
                    شخصيات سلام دانك
                </h1>
                <p className="text-slate-400 mb-12 max-w-2xl">
                    تعرف على أبطال فريق شوهوكو ومنافسيهم الأقوياء في رحلتهم نحو البطولة الوطنية.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {charactersData.map((character) => (
                        <CharacterCard key={character.id} character={character} />
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
