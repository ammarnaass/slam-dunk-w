import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prismadb";
import { AnimeService } from "@/server/services/anime.service";
import { Metadata } from "next";
import fs from "fs";
import path from "path";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

function loadLocalCharacter(id: string): any | null {
    try {
        const filePath = path.join(process.cwd(), "src/data/characters.json");
        if (fs.existsSync(filePath)) {
            const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const list = Array.isArray(raw) ? raw : (raw.characters || []);
            return list.find((c: any) => c.id === id) || null;
        }
    } catch (_) {}
    return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    let character: any = null;
    try {
        character = await prisma.character.findUnique({ where: { id } });
    } catch (_) {}
    if (!character) character = loadLocalCharacter(id);

    if (!character) return { title: "الشخصية غير موجودة" };

    const name = character.name_ar || character.name;
    return {
        title: `${name} - شخصيات ANIME DAZE`,
        description: character.description || `تعرف على تفاصيل ومؤدي صوت شخصية ${name} في ANIME DAZE`,
    };
}

export default async function CharacterDetailPage({ params }: PageProps) {
    const { id } = await params;
    let character: any = null;

    try {
        character = await prisma.character.findUnique({ where: { id } });
    } catch (err) {
        console.warn("DB query failed in CharacterDetailPage:", err);
    }

    if (!character) {
        character = loadLocalCharacter(id);
    }

    if (!character) {
        notFound();
    }

    // Attempt to load linked anime
    let linkedAnime: any = null;
    if (character.animeId) {
        try {
            linkedAnime = await AnimeService.getAnimeBySlug(character.animeId);
        } catch (_) {}
    }

    const displayName = character.name_ar || character.name;

    return (
        <main className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pb-24">
            {/* Backdrop Hero */}
            <div className="relative h-80 md:h-96 w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-md scale-105 opacity-40"
                    style={{ backgroundImage: `url(${character.image || '/hero-bg.jpg'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/90 via-transparent to-surface-container-lowest/90" />
            </div>

            <div className="max-w-7xl mx-auto px-gutter-lg -mt-44 relative z-10">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant mb-space-lg">
                    <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
                    <span>/</span>
                    <Link href="/characters" className="hover:text-primary transition-colors">الشخصيات</Link>
                    {linkedAnime && (
                        <>
                            <span>/</span>
                            <Link href={`/animes/${linkedAnime.id}`} className="hover:text-primary transition-colors">
                                {linkedAnime.title}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-on-surface font-bold">{displayName}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-space-xl items-start">
                    {/* Character Poster Card */}
                    <div className="w-full sm:w-72 md:w-80 flex-shrink-0">
                        <div className="bg-surface-container-low rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] p-3">
                            <div className="aspect-[3/4] overflow-hidden rounded-2xl relative">
                                <img
                                    src={character.image || '/hero-bg.jpg'}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-3 right-3 left-3 flex justify-between items-center text-xs font-mono font-bold">
                                    <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest/90 backdrop-blur-md text-primary">
                                        ID #{character.id}
                                    </span>
                                    {character.number && (
                                        <span className="px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary font-black">
                                            #{character.number}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Quick Link to Anime */}
                            {linkedAnime && (
                                <Link
                                    href={`/animes/${linkedAnime.id}`}
                                    className="mt-3 block text-center py-2.5 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-white/5 text-xs font-bold text-primary transition-colors"
                                >
                                    مشاهدة مسلسل {linkedAnime.title} ←
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Character Bio & Info */}
                    <div className="flex-1 flex flex-col gap-space-lg pt-4">
                        <div>
                            <div className="flex flex-wrap items-baseline gap-space-md mb-1">
                                <h1 className="font-headline-hero text-headline-hero font-extrabold text-on-surface tracking-tight">
                                    {displayName}
                                </h1>
                                {character.name_jp && (
                                    <span className="font-mono text-xl text-on-surface-variant font-light">
                                        {character.name_jp}
                                    </span>
                                )}
                            </div>
                            {character.name_en && (
                                <h2 className="font-label-lg text-label-lg text-primary-container font-mono font-bold">
                                    {character.name_en}
                                </h2>
                            )}
                        </div>

                        {/* Bento Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                            {/* Anime / Planet Box */}
                            <div className="bg-surface-container-low p-space-md rounded-2xl border border-white/[0.04]">
                                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-primary">movie</span>
                                    العمل الفني
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate block">
                                    {linkedAnime?.title || "ANIME DAZE"}
                                </span>
                                {linkedAnime?.planet && (
                                    <span className="text-[10px] text-primary-container font-semibold block mt-0.5">
                                        كوكب {linkedAnime.planet}
                                    </span>
                                )}
                            </div>

                            {/* Role Box */}
                            <div className="bg-surface-container-low p-space-md rounded-2xl border border-white/[0.04]">
                                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-secondary">theater_comedy</span>
                                    الدور في القصة
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                    {character.role || "بطل رئيسي"}
                                </span>
                            </div>

                            {/* Japanese Voice Actor */}
                            <div className="bg-surface-container-low p-space-md rounded-2xl border border-white/[0.04]">
                                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-primary-container">record_voice_over</span>
                                    🇯🇵 مؤدي الصوت
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate block">
                                    {character.voiceActorJa || "الأداء الياباني"}
                                </span>
                            </div>

                            {/* Arabic Voice Actor / Affiliation */}
                            <div className="bg-surface-container-low p-space-md rounded-2xl border border-white/[0.04]">
                                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">mic</span>
                                    🎙️ الدبلجة العربية
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate block">
                                    {character.voiceActorAr || character.team || "مركز الزهرة"}
                                </span>
                            </div>
                        </div>

                        {/* Additional Attributes if available */}
                        {(character.team || character.height || character.weight) && (
                            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low/40 p-3 rounded-2xl border border-white/[0.03]">
                                {character.team && (
                                    <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-white/5">
                                        الفصيل / الانتماء: <strong className="text-white">{character.team}</strong>
                                    </span>
                                )}
                                {character.position && (
                                    <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-white/5">
                                        التخصص / اللقب: <strong className="text-white">{character.position}</strong>
                                    </span>
                                )}
                                {character.height && (
                                    <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-white/5">
                                        الطول: <strong className="text-white">{character.height}</strong>
                                    </span>
                                )}
                                {character.weight && (
                                    <span className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-white/5">
                                        الوزن: <strong className="text-white">{character.weight}</strong>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Biography / Description */}
                        <div className="bg-surface-container-low p-space-lg rounded-3xl border border-white/[0.06]">
                            <div className="flex items-center gap-space-sm mb-space-md">
                                <div className="w-1.5 h-6 rounded-full bg-primary-container" />
                                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                                    نبذة عن الشخصية
                                </h3>
                            </div>
                            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                                {character.description || "لا يوجد وصف متوفر حالياً لهذه الشخصية."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
