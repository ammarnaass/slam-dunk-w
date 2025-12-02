import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EpisodeCard from "@/components/EpisodeCard";
import CharacterCard from "@/components/CharacterCard";
import episodesData from "@/data/episodes.json";
import charactersData from "@/data/characters.json";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  // Get latest 6 episodes
  const latestEpisodes = episodesData.slice(-6).reverse();
  // Get featured characters (first 4)
  const featuredCharacters = charactersData.slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Navbar />
      <Hero />

      {/* Latest Episodes Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white border-r-4 border-red-600 pr-4">
            أحدث الحلقات
          </h2>
          <Link href="/episodes" className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
            عرض الكل <ArrowLeft size={20} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestEpisodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </section>

      {/* Characters Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white border-r-4 border-red-600 pr-4">
              شخصيات شوهوكو
            </h2>
            <Link href="/characters" className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
              جميع الشخصيات <ArrowLeft size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
