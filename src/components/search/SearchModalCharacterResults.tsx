"use client";

import Link from "next/link";
import { SearchCharacterItem } from "./useSearchModal";

interface SearchModalCharacterResultsProps {
    characters: SearchCharacterItem[];
    onItemClick: () => void;
}

export function SearchModalCharacterResults({
    characters,
    onItemClick,
}: SearchModalCharacterResultsProps) {
    if (!characters || characters.length === 0) return null;

    return (
        <div>
            <h3 className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-2.5 px-2 flex items-center gap-1.5 font-cairo">
                <span className="material-symbols-outlined text-sm">group</span>
                أبطال وشخصيات الأنمي ({characters.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {characters.map((char) => (
                    <Link
                        key={char.id}
                        href={`/characters/${char.id}`}
                        onClick={onItemClick}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors group border border-white/[0.04] hover:border-white/[0.1]"
                    >
                        <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-white/10 bg-black/40">
                            <img
                                src={char.image}
                                alt={char.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-cairo text-sm font-bold group-hover:text-purple-300 transition-colors truncate">
                                {char.name}
                            </h4>
                            <span className="text-[11px] text-[#94a3b8] font-tajawal truncate block">
                                {char.team || char.role}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
