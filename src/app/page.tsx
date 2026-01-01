import CharacterCard from "@/components/CharacterCard";
import { prisma } from "@/lib/prismadb";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Star, Calendar, Film } from "lucide-react";
import HomeSlider from "@/components/HomeSlider";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch data from Prisma
  const [allAnimes, settings, latestEpisodesData, featuredCharacters] = await Promise.all([
    prisma.anime.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.settings.findUnique({ where: { id: "global" } }),
    prisma.episode.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { anime: { select: { title: true } } }
    }),
    prisma.character.findMany({ take: 4 })
  ]);

  const siteSettings = settings || {
    siteName: "سلام دانك",
    maintenanceMode: false,
    sliderAnimeIds: []
  };

  // Get animes for slider
  // Prisma schema has siteName etc, but I might need to cast or handle the ID array if stored in DB.
  // My schema didn't have sliderAnimeIds. I should add it or use featured status.
  const sliderAnimes = allAnimes.filter(a => a.isFeatured).slice(0, 3);
  const displaySliderAnimes = sliderAnimes.length > 0 ? sliderAnimes : allAnimes.slice(0, 3);

  const animes = allAnimes.slice(0, 10);

  // Map latest episodes for UI
  const latestEpisodes = latestEpisodesData.map((ep: any) => ({
    id: ep.id,
    title: ep.title,
    thumbnail: ep.thumbnail,
    episodeNumber: ep.episodeNumber || (ep.title.match(/\d+/) ? ep.title.match(/\d+/)![0] : "?"),
    animeTitle: ep.anime?.title || "أنمي"
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden">
      <HomeSlider animes={displaySliderAnimes} />

      {/* Latest Episodes Bar */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-red-600 rounded-full"></span>
              أحدث الحلقات
            </h2>
            <Link href="/episodes" className="text-sm text-slate-400 hover:text-red-500 transition-colors">مشاهدة المزيد</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {latestEpisodes.map(ep => (
              <Link
                key={ep.id}
                href={`/watch/${ep.id}`}
                className="group bg-slate-950 rounded-xl overflow-hidden border border-slate-800 hover:border-red-600/50 transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={ep.thumbnail || "/logoep.jpg"} alt={ep.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={32} className="text-white fill-red-600" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    الحلقة {ep.episodeNumber}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">{ep.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{ep.animeTitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Anime Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-red-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              أحدث الأنميات
            </h2>
          </div>
          <Link href="/animes" className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold transition-all group">
            عرض الكل <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {animes.map(anime => (
            <Link
              key={anime.id}
              href={`/animes/${anime.id}`}
              className="group relative block rounded-2xl overflow-hidden bg-slate-900 shadow-xl transition-all hover:-translate-y-2 hover:shadow-red-900/10"
            >
              <div className="aspect-[2/3] relative">
                <img
                  src={anime.coverImage}
                  alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-4 right-4">
                  <span className="bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-md">
                    {anime.type}
                  </span>
                </div>

                <div className="absolute bottom-0 p-5 w-full">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">
                    {anime.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-red-500" /> {anime.releaseYear}</span>
                    <span className="flex items-center gap-1"><Film size={12} className="text-red-500" /> {anime.totalEpisodes} حلقة</span>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-red-600/10 backdrop-blur-[2px]">
                  <div className="bg-red-600 text-white p-4 rounded-full transform scale-50 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                    <PlayCircle size={32} className="fill-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Characters Section */}
      <section className="py-24 bg-slate-900/30 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                شخصيات مميزة
              </h2>
            </div>
            <Link href="/characters" className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold transition-all group">
              جميع الشخصيات <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
