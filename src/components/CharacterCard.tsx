import Link from "next/link";
import { Character } from "@/types";

interface CharacterCardProps {
    character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
    return (
        <Link
            href={`/characters/${character.id}`}
            className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-slate-900"
        >
            <img
                src={character.image}
                alt={character.name_ar}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-red-500 font-bold text-lg">#{character.number}</span>
                    <span className="text-slate-300 text-xs uppercase tracking-wider">{character.team}</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-1">{character.name_ar}</h3>
                <p className="text-slate-400 text-sm">{character.role}</p>
            </div>
        </Link>
    );
}
