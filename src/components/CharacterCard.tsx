"use client";

import Link from "next/link";
import { Character } from "@/types";

interface CharacterCardProps {
    character: Character & {
        voiceActorJa?: string;
        voiceActorAr?: string;
    };
    variant?: "circle" | "card";
}

export default function CharacterCard({ character, variant = "circle" }: CharacterCardProps) {
    const displayName = character.name_ar || character.name;
    const charAny = character as any;
    const roleText = character.role || (charAny.position ? charAny.position : "شخصية رئيسية");
    const voiceJa = character.voiceActorJa || (character.number ? `رقم #${character.number}` : "أداء ياباني أصلي");
    const voiceAr = character.voiceActorAr || (character.team ? character.team : "دبلجة عربية مميزة");

    if (variant === "circle") {
        return (
            <Link
                href={`/characters/${character.id}`}
                className="bg-surface-container-low rounded-2xl p-space-md flex flex-col items-center text-center group hover:bg-surface-container hover:-translate-y-1 transition-all duration-300 shadow-md border border-white/[0.04] hover:border-primary-container/40"
            >
                <div className="relative w-20 h-20 rounded-full overflow-hidden mb-space-sm ring-2 ring-primary-container/30 group-hover:ring-primary-container transition-all">
                    <img
                        src={character.image || "/hero-bg.jpg"}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm group-hover:text-primary transition-colors truncate max-w-full">
                    {displayName}
                </h4>
                <span className="font-label-sm text-label-sm text-primary mb-2 line-clamp-1">
                    {roleText}
                </span>
                <div className="w-full pt-2 border-t border-white/5 flex flex-col gap-0.5 text-right font-label-sm text-label-sm text-on-surface-variant">
                    <span className="truncate">🇯🇵 {voiceJa}</span>
                    <span className="truncate">🎙️ {voiceAr}</span>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/characters/${character.id}`}
            className="group relative flex flex-col aspect-[3/4] overflow-hidden rounded-2xl bg-surface-container-low border border-white/[0.06] hover:border-primary-container/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-8px_rgba(220,38,38,0.35)]"
        >
            <div className="relative w-full h-full overflow-hidden bg-surface-container-lowest">
                <img
                    src={character.image || "/hero-bg.jpg"}
                    alt={displayName}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

                {character.number && (
                    <div className="absolute top-3 right-3 bg-primary-container text-on-primary-container text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                        #{character.number}
                    </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-4 z-10 flex flex-col gap-1">
                    <h3 className="font-cairo font-bold text-base sm:text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                        {displayName}
                    </h3>
                    <p className="font-tajawal text-xs text-primary/90 font-semibold line-clamp-1">
                        {roleText}
                    </p>
                </div>
            </div>
        </Link>
    );
}
