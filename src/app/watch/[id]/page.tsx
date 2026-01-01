import { notFound } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import { prisma } from "@/lib/prismadb";
import { ArrowRight, ArrowLeft, Calendar, Clock, Film } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const episode = await prisma.episode.findUnique({
        where: { id },
        include: { anime: { select: { title: true } } }
    });

    if (!episode) return { title: "الحلقة غير موجودة" };

    return {
        title: `${episode.title} - ${episode.anime?.title || "مشاهدة"}`,
        description: `شاهد ${episode.title} من أنمي ${episode.anime?.title}`,
    };
}

export default async function WatchPage({ params }: PageProps) {
    const { id } = await params;

    const episode = await prisma.episode.findUnique({
        where: { id },
        include: {
            servers: true,
            anime: true
        }
    });

    if (!episode) {
        notFound();
    }

    const anime = episode.anime;
    const animeEpisodes = await prisma.episode.findMany({
        where: { animeId: episode.animeId },
        orderBy: { createdAt: 'asc' } // Assuming this correlates to episode order if numbers aren't strictly stored
    });

    const currentIndex = animeEpisodes.findIndex(e => e.id === id);
    const prevEpisode = currentIndex > 0 ? animeEpisodes[currentIndex - 1] : null;
    const nextEpisode = currentIndex < animeEpisodes.length - 1 ? animeEpisodes[currentIndex + 1] : null;

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">


            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
                    <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
                    <span>/</span>
                    <Link href="/animes" className="hover:text-white transition-colors">الأنمي</Link>
                    <span>/</span>
                    <Link href={`/animes/${anime?.id}`} className="hover:text-white transition-colors">{anime?.title}</Link>
                    <span>/</span>
                    <span className="text-white">{episode.title}</span>
                </div>

                {/* Player Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <VideoPlayer episode={episode as any} />
                        </div>

                        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {episode.title}
                            </h1>
                            <div className="flex gap-4">
                                {prevEpisode && (
                                    <Link
                                        href={`/watch/${prevEpisode.id}`}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-sm font-bold"
                                    >
                                        <ArrowRight size={18} />
                                        السابقة
                                    </Link>
                                )}
                                {nextEpisode && (
                                    <Link
                                        href={`/watch/${nextEpisode.id}`}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm font-bold shadow-lg shadow-red-900/20"
                                    >
                                        التالية
                                        <ArrowLeft size={18} />
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-6 text-slate-400 text-sm border-b border-slate-900 pb-6">
                            <span className="flex items-center gap-2">
                                <Clock size={16} className="text-red-500" /> {episode.duration || "24:00"}
                            </span>
                            <span className="flex items-center gap-2">
                                <Film size={16} className="text-red-500" /> {anime?.title}
                            </span>
                        </div>

                        <div className="mt-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-900">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                قصة الحلقة
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                {anime?.description || "لا يوجد وصف متاح لهذه الحلقة."}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar (Anime Episodes) */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">قائمة الحلقات</h3>
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {animeEpisodes
                                    .map((e, idx) => (
                                        <Link
                                            key={e.id}
                                            href={`/watch/${e.id}`}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${e.id === episode.id
                                                ? 'bg-red-600/10 border-red-600/50 text-red-500 shadow-inner'
                                                : 'bg-slate-800/30 border-transparent hover:bg-slate-800/80 hover:border-slate-700'}`}
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <h4 className={`text-sm font-medium line-clamp-1 ${e.id === episode.id ? 'text-red-500' : 'text-slate-200'}`}>
                                                {e.title}
                                            </h4>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
