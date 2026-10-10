import Link from "next/link";
import { Character } from "@/types";
import { Shield } from "lucide-react";

interface CharacterCardProps {
    character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
    const displayName = character.name_ar || character.name;
    const teamName = character.team || "فريق الصقور";

    return (
        <Link
            href={`/characters/${character.id}`}
            className="group relative flex flex-col aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_-8px_rgba(220,38,38,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label={`عرض تفاصيل الشخصية ${displayName}`}
        >
            {/* Top subtle hairline */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

            {/* Character Image */}
            <div className="relative w-full h-full overflow-hidden bg-slate-950">
                <img
                    src={character.image || "/hero-bg.jpg"}
                    alt={displayName}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Multi-tier gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent opacity-70" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                    {/* Jersey Number Badge */}
                    <div className="flex items-center gap-1 bg-red-600/90 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md backdrop-blur-sm">
                        <span>#{character.number || "10"}</span>
                    </div>

                    {/* Team Badge */}
                    <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-lg">
                        <Shield size={10} className="text-red-500" />
                        <span>{teamName}</span>
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 z-10">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-red-400 transition-colors line-clamp-1">
                            {displayName}
                        </h3>

                        {character.role && (
                            <p className="text-xs text-red-400/90 font-semibold line-clamp-1">
                                {character.role}
                            </p>
                        )}

                        {character.height && (
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                                <span>الطول: {character.height}</span>
                                {character.weight && <span>• الوزن: {character.weight}</span>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
