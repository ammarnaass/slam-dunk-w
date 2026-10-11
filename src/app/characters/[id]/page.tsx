import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prismadb";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const character = await prisma.character.findUnique({ where: { id } });
    if (!character) return { title: "الشخصية غير موجودة" };

    return {
        title: `${character.name_ar} - شخصيات ANIME DAZE`,
        description: character.description || "",
    };
}

export default async function CharacterDetailPage({ params }: PageProps) {
    const { id } = await params;
    const character: any = await prisma.character.findUnique({ where: { id } });

    if (!character) {
        notFound();
    }

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
                <div className="flex items-center gap-2 text-label-md text-on-surface-variant mb-space-lg">
                    <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
                    <span>/</span>
                    <Link href="/characters" className="hover:text-primary transition-colors">الشخصيات</Link>
                    <span>/</span>
                    <span className="text-on-surface font-bold">{character.name_ar}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-space-xl items-start">
                    {/* Character Poster Card */}
                    <div className="w-full sm:w-72 md:w-80 flex-shrink-0">
                        <div className="bg-surface-container-low rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] p-3">
                            <div className="aspect-[3/4] overflow-hidden rounded-2xl relative">
                                <img
                                    src={character.image || '/hero-bg.jpg'}
                                    alt={character.name_ar}
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
                        </div>
                    </div>

                    {/* Character Bio & Info */}
                    <div className="flex-1 flex flex-col gap-space-lg pt-4">
                        <div>
                            <div className="flex flex-wrap items-baseline gap-space-md mb-1">
                                <h1 className="font-headline-hero text-headline-hero font-extrabold text-on-surface tracking-tight">
                                    {character.name_ar}
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
                            <div className="bg-surface-container-low p-space-md rounded-2xl border border-white/[0.04]">
                                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-primary">shield</span>
                                    الفريق / الانتماء
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                    {character.team || "غير محدد"}
                                </span>
                            </div>

                            <div className="bg-surface-container-low p-space-md rounded-2xl border border-white/[0.04]">
                                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-secondary">tag</span>
                                    رقم القميص
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold font-mono">
                                    {character.number ? `#${character.number}` : "-"}
                                </span>
                            </div>

                            <div className="bg-surface-container-low p-space-md rounded-2xl border border-white/[0.04]">
                                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-primary-container">sports_basketball</span>
                                    المركز / الدور
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                    {character.role || "بطل القصة"}
                                </span>
                            </div>

                            <div className="bg-surface-container-low p-space-md rounded-2xl border border-white/[0.04]">
                                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">straighten</span>
                                    الطول والوزن
                                </span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                    {character.height || "-"} / {character.weight || "-"}
                                </span>
                            </div>
                        </div>

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
