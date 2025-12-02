import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import charactersData from "@/data/characters.json";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return charactersData.map((character) => ({
        id: character.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const character = charactersData.find((c) => c.id === id);
    if (!character) return { title: "الشخصية غير موجودة" };

    return {
        title: `${character.name_ar} - شخصيات سلام دانك`,
        description: character.bio,
    };
}

export default async function CharacterPage({ params }: PageProps) {
    const { id } = await params;
    const character = charactersData.find((c) => c.id === id);

    if (!character) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar />

            <div className="relative h-[400px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
                    style={{ backgroundImage: `url(${character.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            </div>

            <div className="container mx-auto px-4 -mt-64 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Image Card */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 p-2">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg">
                                <img
                                    src={character.image}
                                    alt={character.name_ar}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-10 md:pt-32">
                        <div className="flex flex-wrap items-end gap-4 mb-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-white">{character.name_ar}</h1>
                            <span className="text-2xl text-slate-500 font-light">{character.name_jp}</span>
                        </div>
                        <h2 className="text-xl text-red-500 font-medium mb-8">{character.name_en}</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                <span className="text-slate-500 text-xs block mb-1">الفريق</span>
                                <span className="text-white font-bold">{character.team}</span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                <span className="text-slate-500 text-xs block mb-1">رقم اللاعب</span>
                                <span className="text-white font-bold">#{character.number}</span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                <span className="text-slate-500 text-xs block mb-1">المركز</span>
                                <span className="text-white font-bold">{character.role}</span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                <span className="text-slate-500 text-xs block mb-1">الطول / الوزن</span>
                                <span className="text-white font-bold">{character.height} / {character.weight}</span>
                            </div>
                        </div>

                        <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-800/50">
                            <h3 className="text-xl font-bold text-white mb-4 border-r-4 border-red-600 pr-4">نبذة عن الشخصية</h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {character.bio}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
