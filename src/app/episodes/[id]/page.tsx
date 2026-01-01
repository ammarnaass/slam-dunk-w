import { notFound } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import { prisma } from "@/lib/prismadb";
import { ArrowRight, ArrowLeft, Calendar, Clock } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const episode = await prisma.episode.findUnique({ where: { id } });
    if (!episode) return { title: "الحلقة غير موجودة" };

    return {
        title: `${episode.title} - سلام دانك الحلقة ${episode.episodeNumber}`,
        description: episode.description,
    };
}

export default async function EpisodePage({ params }: PageProps) {
    const { id } = await params;
    const episode: any = await prisma.episode.findUnique({
        where: { id },
        include: { anime: true }
    });

    if (!episode) {
        notFound();
    }

    const [prevEpisode, nextEpisode, otherEpisodes]: any = await Promise.all([
        prisma.episode.findFirst({
            where: {
                animeId: episode.animeId,
                episodeNumber: { lt: episode.episodeNumber }
            },
            orderBy: { episodeNumber: 'desc' }
        }),
        prisma.episode.findFirst({
            where: {
                animeId: episode.animeId,
                episodeNumber: { gt: episode.episodeNumber }
            },
            orderBy: { episodeNumber: 'asc' }
        }),
        prisma.episode.findMany({
            where: {
                animeId: episode.animeId,
                id: { not: episode.id }
            },
            take: 5,
            orderBy: { episodeNumber: 'asc' }
        })
    ]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-white">الرئيسية</Link>
                    <span>/</span>
                    <Link href="/episodes" className="hover:text-white">الحلقات</Link>
                    <span>/</span>
                    <span className="text-white">الحلقة {episode.episodeNumber}</span>
                </div>

                {/* Player Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <VideoPlayer episode={episode} />

                        <div className="mt-6 flex items-center justify-between">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {episode.title}
                            </h1>
                            <div className="flex gap-4">
                                {prevEpisode && (
                                    <Link
                                        href={`/episodes/${prevEpisode.id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors text-sm"
                                    >
                                        <ArrowRight size={16} />
                                        السابقة
                                    </Link>
                                )}
                                {nextEpisode && (
                                    <Link
                                        href={`/episodes/${nextEpisode.id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                    >
                                        التالية
                                        <ArrowLeft size={16} />
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-6 text-slate-400 text-sm border-b border-slate-900 pb-6">
                            <span className="flex items-center gap-2">
                                <Clock size={16} /> {episode.duration}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={16} /> الموسم {episode.seasonNumber || 1}
                            </span>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-xl font-bold text-white mb-3">قصة الحلقة</h3>
                            <p className="text-slate-300 leading-relaxed">
                                {episode.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar (Next Episodes) */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                            <h3 className="text-lg font-bold text-white mb-4">حلقات أخرى</h3>
                            <div className="space-y-4">
                                {otherEpisodes.map((e: any) => (
                                    <Link
                                        key={e.id}
                                        href={`/episodes/${e.id}`}
                                        className="flex gap-3 group hover:bg-slate-800 p-2 rounded-lg transition-colors"
                                    >
                                        <div className="relative w-24 aspect-video rounded overflow-hidden flex-shrink-0">
                                            <img src={e.thumbnail} alt={e.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <span className="text-xs text-red-500 block mb-1">الحلقة {e.episodeNumber}</span>
                                            <h4 className="text-sm text-white font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
                                                {e.title}
                                            </h4>
                                        </div>
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
